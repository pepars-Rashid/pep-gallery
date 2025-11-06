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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "../ui/password-input";

import { registerFormSchema } from "@/lib/validation-schemas";
import { signIn, SignInResponse } from "next-auth/react";
import { createUser } from "@/utils/auth/create-user";
import { Spinner } from "../ui/spinner";
import { IconBrandGithub, IconBrandGoogleFilled } from "@tabler/icons-react";

export default function SignupForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [oauthLoading, setOauthLoading] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    setIsSubmitting(true);

    try {
      const newUser = await createUser(
        values.email,
        values.password,
        values.name
      );

      if (newUser) {
        toast.success("Account created successfully!");

        // Auto-login after successful registration
        const result = (await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirectTo: "/profile",
        })) as SignInResponse | undefined;

        if (result?.error) {
          toast.error(
            "Account created but login failed. Please try logging in manually."
          );
        } else {
          toast.success("Welcome aboard!");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof Error && error.message === "User already exists") {
        toast.error("An account with this email already exists.");
      } else {
        toast.error("Failed to create account. Please try again.");
      }
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
    <div className="flex items-center justify-center px-4 py-7">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-col gap-1 justify-center items-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Create Account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* OAuth Providers */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn("github")}
              disabled={oauthLoading !== null}
            >
              {oauthLoading === "github" ? <Spinner /> : <IconBrandGithub/>}
              <span className="ml-2">
                {oauthLoading === "github" ? "Connecting..." : "GitHub"}
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn("google")}
              disabled={oauthLoading !== null}
            >
              {oauthLoading === "google" ? <Spinner /> : <IconBrandGoogleFilled />}
              <span className="ml-2">
                {oauthLoading === "google" ? "Connecting..." : "Google"}
              </span>
            </Button>
          </div>

          <FieldSeparator>Or continue with</FieldSeparator>

          <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-form-name">
                      Full Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="signup-form-name"
                      placeholder="Enter your full name"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-form-email">
                      Email Address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="signup-form-email"
                      type="email"
                      placeholder="Enter your email address"
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
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
                    <FieldLabel htmlFor="signup-form-password">
                      Password
                    </FieldLabel>
                    <PasswordInput
                      {...field}
                      id="signup-form-password"
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      At least 8 characters
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-form-confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <PasswordInput
                      {...field}
                      id="signup-form-confirm-password"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button
                type="submit"
                form="signup-form"
                className="w-full"
                disabled={isSubmitting || oauthLoading !== null}
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </FieldGroup>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
