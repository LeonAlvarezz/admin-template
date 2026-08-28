import { Router } from "express";
import { AuthController } from "./auth.controller";

export const authRoute = (app: Router) => {
  const router = Router();
  const controller = new AuthController();

  app.use("/auth", router);

  /**
   * @openapi
   * /auth/sign-in/email:
   *   post:
   *     summary: Sign in with email & password
   *     description: Authenticates a user with email/password and sets Better Auth session cookies.
   *     tags:
   *       - Authentication
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SignInEmailPayload'
   *     responses:
   *       200:
   *         description: Successfully authenticated. Returns user profile and session token.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       400:
   *         description: Invalid credentials or validation error.
   */
  router.post("/sign-in/email", controller.signInEmail);

  /**
   * @openapi
   * /auth/get-session:
   *   get:
   *     summary: Get current authenticated session
   *     description: Returns the user and session details of the active caller based on session cookie/header.
   *     tags:
   *       - Authentication
   *     security:
   *       - cookieAuth: []
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Session details or null if unauthenticated.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   */
  router.get("/get-session", controller.getSession);

  /**
   * @openapi
   * /auth/sign-out:
   *   post:
   *     summary: Sign out current session
   *     description: Invalidates active session and clears auth cookies.
   *     tags:
   *       - Authentication
   *     security:
   *       - cookieAuth: []
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successfully signed out.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   */
  router.post("/sign-out", controller.logOut);

  /**
   * @openapi
   * /auth/update-user:
   *   post:
   *     summary: Update current user profile
   *     description: Updates the authenticated user's profile information (name and image/avatar) via Better Auth.
   *     tags:
   *       - Authentication
   *     security:
   *       - cookieAuth: []
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateUserPayload'
   *     responses:
   *       200:
   *         description: User profile successfully updated.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       401:
   *         description: Unauthorized. Valid session required.
   */
  router.post("/update-user", controller.updateUserInfo);
};
