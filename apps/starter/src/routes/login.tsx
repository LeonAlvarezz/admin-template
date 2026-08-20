import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/modules/auth/components/login-form";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Sign in to ZeroUI Admin
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to access the admin portal
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
