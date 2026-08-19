import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { SignInEmailSchema } from "@admin/types";
import type { SignInEmail } from "@admin/types";
import {
  Field,
  FieldError,
  FieldLabel,
  Input,
  useAuth,
  Button,
  toast,
} from "@admin/core";
import * as v from "valibot";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validators: {
      onBlur: SignInEmailSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await login(value);
        navigate({ to: "/" });
      } catch (err: any) {
        toast.error(err.message);
      }
    },
  });

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

        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="space-y-4 rounded-md">
            <form.Field
              name="email"
              validators={{
                onBlur: v.pipe(v.string(), v.email("Invalid email address")),
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="admin@gmail.com"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onBlur: v.pipe(
                  v.string(),
                  v.minLength(1, "Password is required"),
                ),
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="••••••••"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="flex w-full justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 focus:outline-none disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </div>
  );
}
