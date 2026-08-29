import { Router } from "express";
import { UserController } from "./user.controller";
import protectedRoute from "@/core/middleware/guard";

export const userRoute = (app: Router) => {
  const router = Router();
  const controller = new UserController();

  app.use("/users", router);

  /**
   * @openapi
   * /users:
   *   get:
   *     summary: List users
   *     description: Retrieve all registered users with optional search and role filtering. Requires Admin or Super Admin privileges.
   *     tags:
   *       - Users
   *     security:
   *       - cookieAuth: []
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: search
   *         required: false
   *         schema:
   *           type: string
   *         description: Filter users by matching name or email substring.
   *       - in: query
   *         name: role
   *         required: false
   *         schema:
   *           type: string
   *           enum: [all, user, admin, super_admin]
   *         description: Filter users by specific role.
   *     responses:
   *       200:
   *         description: List of user accounts and total count.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UsersListResponse'
   *       401:
   *         description: Unauthorized. Valid active session required.
   *       403:
   *         description: Forbidden. Requires Admin or Super Admin privileges.
   */
  router.get("/", protectedRoute(controller.listUsers));

  /**
   * @openapi
   * /users/set-role:
   *   post:
   *     summary: Update user role
   *     description: Change the role of a user. An Admin can promote a User to Admin or demote an Admin to User. Only a Super Admin can grant or revoke the Super Admin role.
   *     tags:
   *       - Users
   *     security:
   *       - cookieAuth: []
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateUserRolePayload'
   *     responses:
   *       200:
   *         description: User role successfully updated.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       400:
   *         description: Invalid role, payload error, or attempt to self-demote.
   *       401:
   *         description: Unauthorized. Valid active session required.
   *       403:
   *         description: Forbidden. Insufficient privilege to grant or modify this role.
   *       404:
   *         description: Target user not found.
   */
  router.post("/set-role", protectedRoute(controller.setRole));
};
