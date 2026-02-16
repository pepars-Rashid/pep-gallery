"use client";

import { PaletteIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PasswordInput } from "../ui/password-input";
import { Controller, useForm } from "react-hook-form";
import React from "react";
import { loginFormSchema } from "@/lib/validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { IconBrandGithub, IconBrandGoogleFilled } from "@tabler/icons-react";
import { toast } from "sonner";
import { signIn, SignInResponse } from "next-auth/react";
import { Spinner } from "../ui/spinner";
import { useUserStore } from "@/stores/form-store";
import { verifyOTPAndGetUser } from "@/app/actions/auth-otp";
import { compareUserFromDb } from "@/utils/auth/compare-user";
import { createAndSendOTP } from "@/utils/auth/otp";
import { OTPForm } from "./otp-form";

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  const visible = local.slice(0, Math.min(3, local.length));
  return `${visible}***@${domain}`;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [oauthLoading, setOauthLoading] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<"login" | "otp">("login");

  const storedEmail = useUserStore((state) => state.email);
  const setData = useUserStore((state) => state.setData);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setIsSubmitting(true);
    setData(values);
    try {
      const result = await compareUserFromDb(values.email, values.password);
      if (result && "error" in result) {
        switch (result.error) {
          case "USER_NOT_FOUND":
          case "NO_PASSWORD_SET":
            toast.error("Invalid email or password");
            return;
          case "INVALID_PASSWORD":
            toast.error("Incorrect password");
            return;
          default:
            toast.error("Something went wrong. Please try again.");
            return;
        }
      }
      const otpResult = await createAndSendOTP(values.email, values.email);
      if (!otpResult.success) {
        toast.error(otpResult.error ?? "Failed to send verification code.");
        return;
      }
      toast.success("Verification code sent to your email.");
      setStep("otp");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleOTPSubmit(otpCode: string) {
    if (!storedEmail) {
      toast.error("Session expired. Please sign in again.");
      setStep("login");
      return;
    }
    const result = await verifyOTPAndGetUser(storedEmail, otpCode);
    if (!result.success) {
      toast.error(result.error ?? "Invalid or expired code.");
      return;
    }
    const signInResult = (await signIn("credentials", {
      email: result.email,
      otpCode,
      redirectTo: "/profile",
    })) as SignInResponse | undefined;
    if (signInResult?.error) {
      toast.error("Sign in failed. Please try again.");
    } else {
      toast.success("Welcome back!");
    }
  }

  async function handleResendOTP() {
    if (!storedEmail) {
      toast.error("Session expired. Please sign in again.");
      setStep("login");
      return;
    }
    const otpResult = await createAndSendOTP(storedEmail, storedEmail);
    if (otpResult.success) {
      toast.success("New code sent to your email.");
    } else {
      toast.error(otpResult.error ?? "Failed to resend code.");
    }
  }

  const handleOAuthSignIn = async (provider: string) => {
    setOauthLoading(provider);
    try {
      await signIn(provider, { redirectTo: "/profile" });
    } catch (error) {
      console.error(`OAuth sign in failed for ${provider}:`, error);
      setOauthLoading(null);
      toast.error(`Failed to sign in with ${provider}. Please try again.`);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {step == "login" ? (
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <Link
                href="/"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex size-8 items-center justify-center rounded-md">
                  <PaletteIcon className="size-6" />
                </div>
                <span className="sr-only">Pep-gallery.</span>
              </Link>
              <h1 className="text-xl font-bold">Welcome to Pep-gallery.</h1>
              <FieldDescription>
                Don&apos;t have an account? <Link href="/signup">Sign up</Link>
              </FieldDescription>
            </div>
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
            <FieldSeparator>Or</FieldSeparator>
            <Field className="grid gap-4 sm:grid-cols-2">
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
                {oauthLoading === "google" ? (
                  <Spinner />
                ) : (
                  <IconBrandGoogleFilled />
                )}
                <span className="ml-2">
                  {oauthLoading === "google" ? "Connecting..." : "Google"}
                </span>
              </Button>
            </Field>
          </FieldGroup>
        </form>
      ) : (
        <OTPForm
          onOTPSubmit={handleOTPSubmit}
          onResendCode={handleResendOTP}
        >
          {storedEmail ? maskEmail(storedEmail) : ""}
        </OTPForm>
      )}
      {step === "otp" && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setStep("login");
          }}
          disabled={isSubmitting}
        >
          ← Back to login
        </Button>
      )}
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}
