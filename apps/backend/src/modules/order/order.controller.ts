import type { NextFunction, Request, Response } from "express";
import { OrderService } from "./order.service";
import {
  CreateOrderSchema,
  ListOrdersQuerySchema,
  UpdateOrderSchema,
} from "@z3/types";
import * as v from "valibot";
import { BadRequestException } from "@/lib";

export class OrderController {
  private readonly orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  cPaginate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = v.parse(ListOrdersQuerySchema, req.query);
      const result = await this.orderService.cPaginate(query);
      res.success(result);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new BadRequestException({ message: "Invalid order ID" });
      }
      const item = await this.orderService.findById(id);
      res.success(item);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = v.parse(CreateOrderSchema, req.body);
      const item = await this.orderService.create(payload);
      res.success(item, "Order created successfully", 201);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new BadRequestException({ message: "Invalid order ID" });
      }
      const payload = v.parse(UpdateOrderSchema, req.body);
      const updated = await this.orderService.update(id, payload);
      res.success(updated, "Order updated successfully");
    } catch (error) {
      next(error);
    }
  };
}
