import { db } from "@/db";
import { product } from "@/db/schema";
import type { CreateProduct, ListProductsQuery, UpdateProduct } from "@z3/types";
import { and, asc, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";

export class ProductRepository {
  private buildFilter(filter: ListProductsQuery) {
    const where: SQL[] = [];
    if (filter.search && filter.search.trim() !== "") {
      const searchPattern = `%${filter.search.trim()}%`;
      const searchCondition = or(
        ilike(product.name, searchPattern),
        ilike(product.slug, searchPattern),
        ilike(product.description, searchPattern),
      );
      if (searchCondition) where.push(searchCondition);
    }

    if (filter.status) where.push(eq(product.status, filter.status));
    return where;
  }

  async cPaginate(filter: ListProductsQuery) {
    const where = this.buildFilter(filter);
    const orderFn = filter.order === "asc" ? asc : desc;
    return await db
      .select()
      .from(product)
      .where(and(...where))
      .limit(filter.limit ?? 20)
      .orderBy(orderFn(product.createdAt));
  }

  async count(filter: ListProductsQuery) {
    const where = this.buildFilter(filter);
    const [{ total }] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(product)
      .where(and(...where));
    return total;
  }

  /**
   * Find a single product by ID
   */
  async findById(id: number) {
    const [item] = await db.select().from(product).where(eq(product.id, id));
    return item ?? null;
  }

  /**
   * Find a single product by Slug
   */
  async findBySlug(slug: string) {
    const [item] = await db.select().from(product).where(eq(product.slug, slug));
    return item ?? null;
  }

  /**
   * Create a new product
   */
  async create(data: CreateProduct) {
    const [newItem] = await db
      .insert(product)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        price: String(data.price),
        stock: data.stock ?? 0,
        image: data.image ?? null,
      })
      .returning();

    return newItem;
  }

  /**
   * Update an existing product by ID
   */
  async update(id: number, data: UpdateProduct) {
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = String(data.price);
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.image !== undefined) updateData.image = data.image;

    const [updatedItem] = await db
      .update(product)
      .set(updateData)
      .where(eq(product.id, id))
      .returning();

    return updatedItem ?? null;
  }

  /**
   * Delete a product by ID
   */
  async delete(id: number) {
    const [deletedItem] = await db
      .delete(product)
      .where(eq(product.id, id))
      .returning();

    return deletedItem ?? null;
  }
}