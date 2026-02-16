"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { registerFormSchema } from "@/lib/validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Spinner } from "../ui/spinner";

interface OTPFormProps extends React.ComponentProps<"form"> {
  onOTPSubmit?: (otp: string) => void;
  onResendCode?: (email: string) => void;
}

const otpSchema = registerFormSchema.pick({
  otp: true,
});

export function OTPForm({
  className,
  children,
  onOTPSubmit,
  onResendCode,
  ...props
}: OTPFormProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [resendLoading, setResendLoading] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    mode: "onBlur",
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof otpSchema>) {
    if (loading) return;
    setLoading(true);
    try {
      onOTPSubmit?.(values.otp);
    } catch (error) {
      console.error("OTP submission failed:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    if (resendLoading) return;
    setResendLoading(true);
    try {
      onResendCode?.("");
    } catch (error) {
      console.error("Resend code failed:", error);
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <form
      className={className}
      {...props}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-xl font-bold">Enter verification code</h1>
          <FieldDescription className="flex flex-col gap-1">
            <span>We sent a 6-digit code to your email address</span>
            <span>{children}</span>
          </FieldDescription>
        </div>
        <Controller
          name="otp"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="otp" className="sr-only">
                Verification code
              </FieldLabel>
              <InputOTP
                {...field}
                maxLength={6}
                id="otp"
                pattern="[0-9]*"
                inputMode="numeric"
                onChange={(value) => {
                  const numericValue = value.replace(/\D/g, "");
                  field.onChange(numericValue);
                }}
                containerClassName="flex justify-center gap-2"
                required
                aria-invalid={fieldState.invalid}
                onComplete={form.handleSubmit(onSubmit)}
                disabled={loading}
              >
                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {fieldState.invalid && (
                <FieldError
                  className="text-center"
                  errors={[fieldState.error]}
                />
              )}
              <FieldDescription className="flex gap-2 justify-center items-center">
                <span>Didn&apos;t receive the code?</span>
                <Button
                  variant="outline"
                  onClick={handleResendCode}
                  disabled={resendLoading}
                  type="button"
                >
                  {resendLoading ? (
                    <>
                      <Spinner className="mr-2 size-4" />
                      Sending...
                    </>
                  ) : (
                    "Resend"
                  )}
                </Button>
              </FieldDescription>
            </Field>
          )}
        />
        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner className="mr-2 size-4" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
