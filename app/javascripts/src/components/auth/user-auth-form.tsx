// Import React and dependencies
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GoogleSignin from '@/components/GoogleSignin'
import { toast } from "sonner";

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
import { userLogin } from "@/features/auth/authActions";
import { OtpForm } from "./otp-form";

export function UserAuthForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(30);
  const dispatch = useDispatch();

  // Schema validation using Zod
  const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "superadmin@wheel.com" },
  });

  const onSubmitEmail: SubmitHandler<any> = async (values) => {
    setIsLoading(true);
    const result = await dispatch(userLogin(values));
    setIsLoading(false);

    if (userLogin.fulfilled.match(result)) {
      setShowOtpForm(true);
      setIsResendDisabled(true);
      setTimer(30);
      startOtpTimer();
      const {message} = result.payload.data

      toast.success(message);
    } else {
      console.error("Login failed:", result.error.message);
    }
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
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={formVariants}
        transition={{ duration: 0.1 }}
        key={showOtpForm ? "otpForm" : "emailForm"}
      >
        {showOtpForm ? (
         <><OtpForm setShowOtpForm={setShowOtpForm} isResendDisabled={isResendDisabled} timer={timer} handleResendOtp={handleResendOtp}/></>
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
