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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { signIn, SignInResponse } from "next-auth/react";
import { loginFormSchema } from "@/lib/validation-schemas";
import { Spinner } from "../ui/spinner";
import { IconBrandGithub, IconBrandGoogleFilled } from "@tabler/icons-react";
import { initiateOTP, verifyOTPAndGetUser } from "@/app/actions/auth-otp";

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [oauthLoading, setOauthLoading] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<'login' | 'otp'>('login');
  const [userId, setUserId] = React.useState<string | null>(null);
  const [otpCode, setOtpCode] = React.useState('');

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
      if (step === 'login') {
        // Step 1: Verify credentials and send OTP using server action
        const result = await initiateOTP(values.email, values.password);

        if (!result.success) {
          toast.error(result.error || 'Failed to send OTP');
          return;
        }

        // OTP sent successfully, move to OTP step
        setUserId(result.userId || null);
        setStep('otp');
        toast.success('OTP sent to your email');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleOTPVerify(otpValue: string) {
    if (!userId) {
      toast.error('Session expired. Please try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 2: Verify OTP using server action
      const result = await verifyOTPAndGetUser(userId, otpValue);

      if (!result.success) {
        toast.error(result.error || 'Invalid OTP');
        return;
      }

      // OTP verified, now sign in with NextAuth
      const signInResult = (await signIn("credentials", {
        email: result.email,
        userId: userId,
        otpCode: otpValue,
        redirectTo: "/profile",
      })) as SignInResponse | undefined;

      if (signInResult?.error) {
        toast.error("Login failed. Please try again.");
      } else {
        toast.success("Welcome back!");
        // Redirect will happen automatically
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("An error occurred. Please try again.");
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
            {step === 'otp' ? 'Enter Verification Code' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {step === 'otp' 
              ? 'We sent a 6-digit code to your email' 
              : 'Enter your credentials to sign in to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* OAuth Providers - Only show on login step */}
          {step === 'login' && (
            <>
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
            </>
          )}

          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {step === 'login' ? (
                <>
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
                </>
              ) : (
                <>
                  <Field>
                    <FieldLabel htmlFor="login-form-otp">
                      Verification Code
                    </FieldLabel>
                    <InputOTP
                      maxLength={6}
                      value={otpCode}
                      onChange={(value) => setOtpCode(value)}
                      onComplete={(value) => {
                        if (value.length === 6) {
                          handleOTPVerify(value);
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <p className="text-sm text-muted-foreground mt-2">
                      Enter the 6-digit code sent to your email
                    </p>
                  </Field>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setStep('login');
                      setOtpCode('');
                      setUserId(null);
                    }}
                    disabled={isSubmitting}
                  >
                    ← Back to login
                  </Button>

                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => {
                      if (otpCode.length === 6) {
                        handleOTPVerify(otpCode);
                      } else {
                        toast.error('Please enter a valid 6-digit code');
                      }
                    }}
                    disabled={isSubmitting || otpCode.length !== 6}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Sign In'
                    )}
                  </Button>
                </>
              )}

              {step === 'login' && (
                <Button
                  type="submit"
                  form="login-form"
                  className="w-full"
                  disabled={isSubmitting || oauthLoading !== null}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner />
                      Sending OTP...
                    </>
                  ) : (
                    'Continue'
                  )}
                </Button>
              )}
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
