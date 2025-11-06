"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "../ui/password-input";
import { signIn, SignInResponse } from "next-auth/react";
import { loginFormSchema } from "@/lib/validation-schemas";
import { Spinner } from "../ui/spinner";
import { IconBrandGithub, IconBrandGoogleFilled } from "@tabler/icons-react";

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [oauthLoading, setOauthLoading] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setIsSubmitting(true);

    try {
      const result = (await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirectTo: "/profile",
      })) as SignInResponse | undefined;

      if (result?.error) {
        toast.error("Invalid credentials. Please try again.");
      } else {
        toast.success("Welcome back!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleOAuthSignIn = async (provider: string) => {
    setOauthLoading(provider);
    try {
      await signIn(provider, { redirectTo: "/profile" });
      // Note: The redirect will happen, so we don't need to clear loading state
      // If there's an error, the page won't redirect and we can handle it
    } catch (error) {
      console.error(`OAuth sign in failed for ${provider}:`, error);
      setOauthLoading(null);
      toast.error(`Failed to sign in with ${provider}. Please try again.`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-col gap-1 justify-center items-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* OAuth Providers */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthSignIn("github")}
              disabled={oauthLoading !== null || isSubmitting}
            >
              {oauthLoading === "github" ? <Spinner /> : <IconBrandGithub />}
              <span className="ml-2">
                {oauthLoading === "github" ? "Connecting..." : "GitHub"}
              </span>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthSignIn("google")}
              disabled={oauthLoading !== null || isSubmitting}
            >
              {oauthLoading === "google" ? <Spinner /> : <IconBrandGoogleFilled />}
              <span className="ml-2">
                {oauthLoading === "google" ? "Connecting..." : "Google"}
              </span>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-form-email">
                      Email Address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="login-form-email"
                      type="email"
                      placeholder="Enter your email address"
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting || oauthLoading !== null}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-form-password">
                      Password
                    </FieldLabel>
                    <PasswordInput
                      {...field}
                      id="login-form-password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting || oauthLoading !== null}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                form="login-form"
                className="w-full"
                disabled={isSubmitting || oauthLoading !== null}
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </FieldGroup>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
