"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "@/lib/validations/loginSchema";
import Image from "next/image";
import Logo from "@/public/assets/images/logo/acossa.jpg";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Info, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { WEBSITE_REGISTER } from "@/routes/WebsiteRoute";

import { useRouter } from "next/navigation";


export default function LoginPage() {
  const [serverMessage, setServerMessage] = useState<{
    type: "success" | "error" | "" ;
    message: string;
  }>({ type: "", message: "" });

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

const onSubmit = async (data: LoginSchema) => {
  setServerMessage({ type: "", message: "" });

  const res = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
const result = await res.json();

  if (result?.error) {
    setServerMessage({
      type: "error",
      message: result.error || "Invalid email or password",
    });
    return;
  }

  setServerMessage({
    type: "success",
    message: "Login successful! Redirecting...",
  });

  setTimeout(() => router.push("/"), 1000);
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-sm md:max-w-md shadow-lg rounded-2xl">
        <CardContent className="py-8 px-6">
          <div className="flex justify-center mb-4">
            <Image
              src={Logo.src}
              width={140}
              height={100}
              alt="Logo"
              className="dark:invert"
            />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-1">Login to your Account</h1>
            <p className="text-sm text-muted-foreground">
              Please enter your login details
            </p>
          </div>

          {/* ALERT MESSAGES */}
          {serverMessage.message && (
            <Alert
              className={`mb-4 ${
                serverMessage.type === "success"
                  ? "border-green-600/50"
                  : "border-red-500/50"
              }`}
            >
              {serverMessage.type === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}

              <AlertTitle>
                {serverMessage.type === "success" ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription>{serverMessage.message}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>

                    {/* Tips */}
                    {!fieldState.error && field.value === "" && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Info className="h-3 w-3" /> Enter a valid email like john@gmail.com
                      </p>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>

                    {/* Tips */}
                    {!fieldState.error && field.value === "" && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Info className="h-3 w-3" /> Minimum 6 characters, letters & numbers
                      </p>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full text-base"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Processing..." : "Login"}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground mt-4">
            Don&apos;t have an account?
            <Link href={WEBSITE_REGISTER} className="text-primary font-semibold ml-1">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
