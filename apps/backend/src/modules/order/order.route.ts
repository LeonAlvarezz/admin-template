import { Router } from "express";
import { OrderController } from "./order.controller";
import protectedRoute from "@/core/middleware/guard";

export const orderRoute = (app: Router) => {
  const router = Router();
  const controller = new OrderController();

  app.use("/orders", router);

  /**
   * @openapi
   * /orders:
   *   get:
   *     summary: List orders with cursor pagination
   *     description: Retrieve customer orders with filtering, sorting, and cursor pagination.
   *     tags:
   *       - Orders
   *     parameters:
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search query for order number, customer name, or email
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [pending, processing, shipped, delivered, cancelled]
   *       - in: query
   *         name: paymentStatus
   *         schema:
   *           type: string
   *           enum: [pending, paid, failed, refunded]
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 20
   *       - in: query
   *         name: order
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: desc
   *     responses:
   *       200:
   *         description: Paginated orders list
   */
  router.get("/", controller.cPaginate);

  /**
   * @openapi
   * /orders/{id}:
   *   get:
   *     summary: Get order by ID
   *     description: Retrieve a single order with its items by numeric ID.
   *     tags:
   *       - Orders
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Order details with items
   *       404:
   *         description: Order not found
   */
  router.get("/:id", controller.findById);

  /**
   * @openapi
   * /orders:
   *   post:
   *     summary: Create new order
   *     description: Create a new customer order with line items.
   *     tags:
   *       - Orders
   *     responses:
   *       201:
   *         description: Order created successfully
   */
  router.post("/", protectedRoute(controller.create));

  /**
   * @openapi
   * /orders/{id}:
   *   put:
   *     summary: Update order
   *     description: Update order status, payment status, or details.
   *     tags:
   *       - Orders
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Order updated successfully
   */
  router.put("/:id", protectedRoute(controller.update));
};
