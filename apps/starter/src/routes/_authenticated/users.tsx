import { createFileRoute } from "@tanstack/react-router";
import { UserPage } from "../../modules/user/user.page";

export const Route = createFileRoute("/_authenticated/users")({
  component: UserPage,
});
