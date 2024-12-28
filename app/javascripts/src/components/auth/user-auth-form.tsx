// Import React and dependencies
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GoogleSignin from '@/components/GoogleSignin'
import GitHubCallback from '@/components/GitHubCallback'

// Component and utility imports
import { cn } from "@/lib/utils";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { userLogin, verifyOTP } from "@/features/auth/authActions";

// Interface for props
// interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

// UserAuthForm Component
export function UserAuthForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp_code, setOtpCode] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(30);
  const [otpError, setOtpError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email } = useSelector((state: any) => state.auth);

  // Schema validation using Zod
  const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "superadmin@wheel.com" },
  });

  const otpForm = useForm({
    defaultValues: { otp_code: "" },
  });

  const onSubmitEmail: SubmitHandler<any> = async (values) => {
    setIsLoading(true);
    const result = await dispatch(userLogin(values));
    setIsLoading(false);

    if (userLogin.fulfilled.match(result)) {
      setShowOtpForm(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      setIsResendDisabled(true);
      setTimer(30);
      startOtpTimer();
    } else {
      console.error("Login failed:", result.error.message);
    }
  };

  const onSubmitOtp: SubmitHandler<any> = async (values) => {
    const data = {
      ...values,
      email,
    };
    const result = await dispatch(verifyOTP(data));

    if (verifyOTP.fulfilled.match(result)) {
      // OTP verification successful, navigate to the next page
      navigate("/dashboard");
    } else {
      // Show error message when OTP is invalid
      setOtpError("Invalid OTP. Please try again.");
      console.error("OTP verification failed:", result.error.message);
    }
  };

  const handleBack = () => setShowOtpForm(false);

  const handleOtpChange = (value: string) => {
    setOtpCode(value);
    setOtpError(""); // Clear error when OTP is being changed
  };

  const startOtpTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = () => {
    setIsResendDisabled(true);
    setTimer(30);
    startOtpTimer();
  };

  const formVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  };

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      {showNotification && (
        <div className="absolute top-4 right-4 p-2 bg-green-500 text-white rounded-md">
          OTP sent successfully!
        </div>
      )}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={formVariants}
        transition={{ duration: 0.1 }}
        key={showOtpForm ? "otpForm" : "emailForm"}
      >
        {showOtpForm ? (
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Enter OTP
              </CardTitle>
              <CardDescription className="text-center">
                Please enter the OTP sent to your email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...otpForm}>
                <form
                  onSubmit={otpForm.handleSubmit(onSubmitOtp)}
                  className="space-y-4"
                >
                  <div className="flex justify-center space-x-2">
                    <InputOTP
                      maxLength={6}
                      className="justify-center"
                      onChange={(value) => {
                        handleOtpChange(value);
                        otpForm.setValue("otp_code", value);
                      }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {otpError && (
                    <p className="text-center text-red-500 text-sm">{otpError}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={otp_code.length < 6 || isLoading}
                  >
                    {isLoading ? (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Submit OTP"
                    )}
                  </Button>
                </form>
              </Form>
              <div className="flex justify-between items-center mt-4">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendOtp}
                  disabled={isResendDisabled}
                >
                  Resend OTP
                </Button>
                <span className="text-sm">
                  {isResendDisabled
                    ? `Resend in ${timer}s`
                    : "You can now resend OTP"}
                </span>
              </div>
              <Button
                type="button"
                variant="link"
                onClick={handleBack}
                className="mt-2"
              >
                Back
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Let&#39;s get started
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p>
            </div>
            <div className={cn("grid gap-6", className)} {...props}>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitEmail)}
                  className="space-y-4"
                >
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <Label className="sr-only" htmlFor="email">
                        Email
                      </Label>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Enter your email address"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Continue with Email
                    </Button>
                  </div>
                </form>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
              </Form>
              <>
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <GoogleSignin/>
                )}
              </>

            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
