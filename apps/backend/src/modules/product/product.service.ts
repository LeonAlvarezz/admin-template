import type {
  CreateProduct,
  ListProductsQuery,
  UpdateProduct,
  User,
  USER_ROLE,
} from "@z3/types";
import { ProductRepository } from "./product.repository";
import { auth, ForbiddenException, NotFoundException } from "@/lib";
import {
  dateToISOString,
  processCursorResult,
} from "@/utils/cursor-pagination";

export class ProductService {
  private readonly productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async cPaginate(filter: ListProductsQuery) {
    const [data, total] = await Promise.all([
      this.productRepository.cPaginate(filter),
      this.productRepository.count(filter),
    ]);

    const products = data.map((item) => ({
      ...item,
      price: Number(item.price),
      created_at: dateToISOString(item.createdAt),
    }));

    const cursorResult = processCursorResult(products, filter.limit ?? 20);

    return {
      products,
      total,
      meta: cursorResult.meta,
    };
  }

  findById(id: number) {
    return this.productRepository.findById(id);
  }

  async findBySlug(slug: string) {
    const item = await this.productRepository.findBySlug(slug);
    if (!item) {
      throw new NotFoundException({ message: "Product not found" });
    }
    return item;
  }

  async create(data: CreateProduct, user: User) {
    const canCreateProject = await auth.api.userHasPermission({
      body: {
        userId: user.id,
        permissions: {
          product: ["create"],
        },
        role: user.role as USER_ROLE,
      },
    });

    if (!canCreateProject.success)
      throw new ForbiddenException({
        message: "You do not have permission to perform this action",
      });

    return await this.productRepository.create(data);
  }

  update(id: number | string, data: UpdateProduct) {
    return this.productRepository.update(Number(id), data);
  }

  delete(id: number | string) {
    return this.productRepository.delete(Number(id));
  }
}
