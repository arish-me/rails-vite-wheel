import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ArrowLeft } from "lucide-react"
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
import { verifyOTP } from "@/features/auth/authActions";

export function OtpForm({ setShowOtpForm, isResendDisabled, timer, handleResendOtp }: React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = useState(false);
  const [otp_code, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email } = useSelector((state: any) => state.auth);

  const otpForm = useForm({
    defaultValues: { otp_code: "" },
  });

  const onSubmitOtp: SubmitHandler<any> = async (values) => {
    const data = {
      ...values,
      email,
    };
    const result = await dispatch(verifyOTP(data));

    if (verifyOTP.fulfilled.match(result)) {
      navigate("/dashboard");
    } else {
      setOtpError("Invalid OTP. Please try again.");
      console.error("OTP verification failed:", result.error.message);
    }
  };

  const handleBack = () => setShowOtpForm(false);

  const handleOtpChange = (value: string) => {
    setOtpCode(value);
    setOtpError("");
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
      >
        <Card>
          <CardHeader className="flex flex-row space-x-2">
            <Button variant="outline" size="icon" onClick={handleBack}>
              <ArrowLeft />
            </Button>
            <div className="flex flex-col flex-grow items-center">
              <CardTitle className="text-xl font-bold">Enter OTP</CardTitle>
              <CardDescription>Please enter the OTP sent to your email</CardDescription>
            </div>
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
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
