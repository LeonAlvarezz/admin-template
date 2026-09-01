import { db } from "@/db";
import { user } from "@/db/schema";
import type { ListUsersQuery, USER_ROLE } from "@z3/types";
import { and, desc, eq, ilike, or, sql, SQL } from "drizzle-orm";

export class UserRepository {
  private buildFilter(filter: ListUsersQuery) {
    const where: SQL[] = [];
    if (filter.search && filter.search.trim() !== "") {
      const searchPattern = `%${filter.search.trim()}%`;
      const searchCondition = or(
        ilike(user.name, searchPattern),
        ilike(user.email, searchPattern),
      );
      if (searchCondition) where.push(searchCondition);
    }

    if (filter.role) where.push(eq(user.role, filter.role));
    return where;
  }

  async findMany() {
    return db.query.user.findMany();
  }

  async findById(id: string) {
    const [foundUser] = await db.select().from(user).where(eq(user.id, id));
    return foundUser ?? null;
  }

  async updateRole(id: string, role: USER_ROLE) {
    const [updatedUser] = await db
      .update(user)
      .set({
        role,
        updatedAt: new Date(),
      })
      .where(eq(user.id, id))
      .returning();

    return updatedUser ?? null;
  }

  async cPaginate(filter: ListUsersQuery) {
    const where = this.buildFilter(filter);
    return await db
      .select()
      .from(user)
      .where(and(...where))
      .limit(filter.limit ?? 20)
      .orderBy(desc(user.createdAt));
  }

  async count(filter: ListUsersQuery) {
    const where = this.buildFilter(filter);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(user)
      .where(and(...where));

    return count;
  }
}
