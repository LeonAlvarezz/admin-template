import { createFileRoute } from "@tanstack/react-router";
import ProductPage from "@/modules/product/product.page";

export const Route = createFileRoute("/_authenticated/shop/products")({
  component: ProductPage,
});
