import { db } from "@/db";
import { order, orderItem } from "@/db/schema";
import type { CreateOrder, ListOrdersQuery, UpdateOrder } from "@z3/types";
import { and, asc, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";

export class OrderRepository {
  private buildFilter(filter: ListOrdersQuery) {
    const where: SQL[] = [];
    if (filter.search && filter.search.trim() !== "") {
      const searchPattern = `%${filter.search.trim()}%`;
      const searchCondition = or(
        ilike(order.orderNumber, searchPattern),
        ilike(order.customerName, searchPattern),
        ilike(order.customerEmail, searchPattern),
      );
      if (searchCondition) where.push(searchCondition);
    }

    if (filter.status) where.push(eq(order.status, filter.status));
    if (filter.paymentStatus)
      where.push(eq(order.paymentStatus, filter.paymentStatus));

    return where;
  }

  async cPaginate(filter: ListOrdersQuery) {
    const where = this.buildFilter(filter);
    const orderFn = filter.order === "asc" ? asc : desc;
    return await db.query.order.findMany({
      where: and(...where),
      limit: filter.limit ?? 20,
      orderBy: orderFn(order.createdAt),
      with: {
        items: true,
      },
    });
  }

  async count(filter: ListOrdersQuery) {
    const where = this.buildFilter(filter);
    const [{ total }] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(order)
      .where(and(...where));
    return total;
  }

  async findById(id: number) {
    return await db.query.order.findFirst({
      where: eq(order.id, id),
      with: {
        items: true,
      },
    });
  }

  async create(data: CreateOrder) {
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(
      Math.random() * 900 + 100,
    )}`;

    const [newOrder] = await db
      .insert(order)
      .values({
        orderNumber,
        userId: data.userId ?? null,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone ?? null,
        status: data.status ?? "pending",
        paymentStatus: data.paymentStatus ?? "pending",
        paymentMethod: data.paymentMethod ?? "credit_card",
        subtotal: String(data.subtotal),
        tax: String(data.tax ?? 0),
        shippingFee: String(data.shippingFee ?? 0),
        totalAmount: String(data.totalAmount),
        shippingAddress: data.shippingAddress ?? null,
        notes: data.notes ?? null,
      })
      .returning();

    if (data.items && data.items.length > 0) {
      await db.insert(orderItem).values(
        data.items.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId ?? null,
          productName: item.productName,
          productImage: item.productImage ?? null,
          price: String(item.price),
          quantity: item.quantity,
          subtotal: String(item.subtotal),
        })),
      );
    }

    return await this.findById(newOrder.id);
  }

  async update(id: number, data: UpdateOrder) {
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (data.status !== undefined) updateData.status = data.status;
    if (data.paymentStatus !== undefined)
      updateData.paymentStatus = data.paymentStatus;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.customerName !== undefined)
      updateData.customerName = data.customerName;
    if (data.customerEmail !== undefined)
      updateData.customerEmail = data.customerEmail;
    if (data.customerPhone !== undefined)
      updateData.customerPhone = data.customerPhone;
    if (data.shippingAddress !== undefined)
      updateData.shippingAddress = data.shippingAddress;
    if (data.subtotal !== undefined) updateData.subtotal = String(data.subtotal);
    if (data.tax !== undefined) updateData.tax = String(data.tax);
    if (data.shippingFee !== undefined)
      updateData.shippingFee = String(data.shippingFee);
    if (data.totalAmount !== undefined)
      updateData.totalAmount = String(data.totalAmount);

    await db.update(order).set(updateData).where(eq(order.id, id));

    return await this.findById(id);
  }
}
