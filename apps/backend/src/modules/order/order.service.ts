import type { CreateOrder, ListOrdersQuery, UpdateOrder } from "@z3/types";
import { OrderRepository } from "./order.repository";
import { NotFoundException } from "@/lib";
import {
  dateToISOString,
  processCursorResult,
} from "@/utils/cursor-pagination";

function formatOrder(raw: any) {
  if (!raw) return null;
  return {
    ...raw,
    subtotal: Number(raw.subtotal),
    tax: Number(raw.tax),
    shippingFee: Number(raw.shippingFee),
    totalAmount: Number(raw.totalAmount),
    items: (raw.items || []).map((item: any) => ({
      ...item,
      price: Number(item.price),
      subtotal: Number(item.subtotal),
    })),
  };
}

export class OrderService {
  private readonly orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async cPaginate(filter: ListOrdersQuery) {
    const [data, total] = await Promise.all([
      this.orderRepository.cPaginate(filter),
      this.orderRepository.count(filter),
    ]);

    const orders = data.map((item) => ({
      ...formatOrder(item),
      created_at: dateToISOString(item.createdAt),
    }));

    const cursorResult = processCursorResult(orders, filter.limit ?? 20);

    return {
      orders,
      total,
      meta: cursorResult.meta,
    };
  }

  async findById(id: number) {
    const item = await this.orderRepository.findById(id);
    if (!item) {
      throw new NotFoundException({ message: "Order not found" });
    }
    return formatOrder(item);
  }

  async create(data: CreateOrder) {
    const created = await this.orderRepository.create(data);
    return formatOrder(created);
  }

  async update(id: number, data: UpdateOrder) {
    const existing = await this.orderRepository.findById(id);
    if (!existing) {
      throw new NotFoundException({ message: "Order not found" });
    }
    const updated = await this.orderRepository.update(id, data);
    return formatOrder(updated);
  }
}
