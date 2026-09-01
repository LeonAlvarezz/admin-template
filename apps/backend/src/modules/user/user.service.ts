import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@/lib";
import {
  type ListUsersQuery,
  type SetRole,
  type User,
  USER_ROLE,
} from "@z3/types";
import { UserRepository } from "./user.repository";
import {
  dateToISOString,
  processCursorResult,
} from "@/utils/cursor-pagination";

export class UserService {
  private readonly userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  async listUsers(filter: ListUsersQuery) {
    const [data, total] = await Promise.all([
      this.userRepository.cPaginate(filter),
      this.userRepository.count(filter),
    ]);

    const users = data.map((item) => ({
      ...item,
      created_at: dateToISOString(item.createdAt),
    }));

    const cursorResult = processCursorResult(users, filter.limit ?? 20);

    return {
      users,
      total,
      ...cursorResult,
    };
  }

  async setRole(payload: SetRole, user: User) {
    // 1. Caller must be an admin or super admin
    if (user.role !== USER_ROLE.ADMIN && user.role !== USER_ROLE.SUPER_ADMIN) {
      throw new ForbiddenException({
        message: "You do not have permission to change user roles",
      });
    }

    // 2. Prevent changing own role to avoid administrative lockout
    if (user.id === payload.userId && user.role !== payload.role) {
      throw new BadRequestException({
        message:
          "You cannot change your own role to prevent administrative lockout",
      });
    }

    // 3. Find the target user via repository
    const targetUser = await this.userRepository.findById(payload.userId);

    if (!targetUser) {
      throw new NotFoundException({
        message: "User not found",
      });
    }

    // 4. If caller is not super admin, cannot assign super admin role
    if (
      payload.role === USER_ROLE.SUPER_ADMIN &&
      user.role !== USER_ROLE.SUPER_ADMIN
    ) {
      throw new ForbiddenException({
        message: "Only super administrators can grant the Super Admin role",
      });
    }

    // 5. If caller is not super admin, cannot modify an existing super admin
    if (
      targetUser.role === USER_ROLE.SUPER_ADMIN &&
      user.role !== USER_ROLE.SUPER_ADMIN
    ) {
      throw new ForbiddenException({
        message:
          "Only super administrators can change the role of another Super Admin",
      });
    }

    // 6. Update role via repository
    return await this.userRepository.updateRole(payload.userId, payload.role);
  }
}
