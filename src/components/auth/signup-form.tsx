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
import { useUserStore } from "@/stores/form-store";
import { createAndSendOTP, verifyOTP } from "@/utils/auth/otp";
import { OTPForm } from "./otp-form";

const signupSchema = registerFormSchema.omit({ otp: true });

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  const visible = local.slice(0, Math.min(3, local.length));
  return `${visible}***@${domain}`;
}

export default function SignupForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [oauthLoading, setOauthLoading] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<"form" | "otp">("form");

  const storedEmail = useUserStore((state) => state.email);
  const storedPassword = useUserStore((state) => state.password);
  const storedName = useUserStore((state) => state.name);
  const setData = useUserStore((state) => state.setData);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsSubmitting(true);

    try {
      // Persist values for OTP step
      setData(values);

      const otpResult = await createAndSendOTP(values.email, values.email);
      if (!otpResult.success) {
        toast.error(otpResult.error ?? "Failed to send verification code.");
        return;
      }

      toast.success("Verification code sent to your email.");
      setStep("otp");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to start verification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleOTPSubmit(otpCode: string) {
    if (!storedEmail || !storedPassword || !storedName) {
      toast.error("Session expired. Please fill the form again.");
      setStep("form");
      return;
    }

    try {
      const verification = await verifyOTP(storedEmail, otpCode);
      if (!verification.success) {
        toast.error(verification.error ?? "Invalid or expired code.");
        return;
      }

      // Create user after successful OTP verification
      const newUser = await createUser(storedEmail, storedPassword, storedName);

      if (newUser) {
        toast.success("Account created successfully!");

        // Auto-login after successful registration
        const result = (await signIn("credentials", {
          email: storedEmail,
          password: storedPassword,
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
    }
  }

  async function handleResendOTP() {
    if (!storedEmail) {
      toast.error("Session expired. Please fill the form again.");
      setStep("form");
      return;
    }

    const otpResult = await createAndSendOTP(storedEmail, storedEmail);
    if (otpResult.success) {
      toast.success("New verification code sent to your email.");
    } else {
      toast.error(otpResult.error ?? "Failed to resend verification code.");
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
    <div className="flex min-h-screen items-center justify-center px-4 py-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-col gap-1 justify-center items-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Create Account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {step === "form" ? (
            <>
              {/* OAuth Providers */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleOAuthSignIn("github")}
                  disabled={oauthLoading !== null}
                >
                  {oauthLoading === "github" ? (
                    <Spinner />
                  ) : (
                    <IconBrandGithub />
                  )}
                  <span className="ml-2">
                    {oauthLoading === "github" ? "Connecting..." : "GitHub"}
                  </span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleOAuthSignIn("google")}
                  disabled={oauthLoading !== null}
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
            </>
          ) : (
            <>
              <OTPForm
                onOTPSubmit={handleOTPSubmit}
                onResendCode={handleResendOTP}
              >
                {storedEmail ? maskEmail(storedEmail) : ""}
              </OTPForm>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep("form")}
                disabled={isSubmitting}
              >
                ← Back to details
              </Button>
            </>
          )}

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
