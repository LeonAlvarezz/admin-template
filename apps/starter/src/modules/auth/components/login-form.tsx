import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { SignInEmailSchema } from "@admin/types";
import {
  Button,
  Checkbox,
  Field,
  FieldError,
  FieldLabel,
  Input,
  toast,
  useAuth,
} from "@admin/core";
import * as v from "valibot";

export function LoginForm() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  const form = useForm({
    defaultValues: {
      email: "admin@gmail.com",
      password: "secret123",
      rememberMe: false,
    },
    validators: {
      onSubmit: SignInEmailSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await login(value);
      if (!res.success) {
        toast.error(res.error.message);
        return;
      }
      toast.success("Login Successfully");
      navigate({ to: "/" });
    },
  });

  return (
    <form
      className="mt-8 space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
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
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="admin@gmail.com"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onBlur: v.pipe(
              v.string(),
              v.minLength(6, "Password must be at least 6 characters"),
            ),
          }}
        >
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input.Password
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="••••••••"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="rememberMe">
          {(field) => (
            <div className="flex items-center justify-between pt-1">
              <Checkbox
                id={field.name}
                name={field.name}
                checked={field.state.value}
                onChange={(checked) => field.handleChange(checked)}
                label="Remember me"
              />
            </div>
          )}
        </form.Field>
      </div>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
