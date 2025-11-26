"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchema } from "@/lib/validations/registerSchema";
import { signIn } from "next-auth/react"; // ✅ Add this import
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage
} from "@/components/ui/form";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem
} from "@/components/ui/select";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";

export default function RegisterPage() {
  const [serverMsg, setServerMsg] = useState<{type: "success" | "error" | ""; message: string}>({
    type: "",
    message: "",
  });

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      role: "user",
    },
  });


const onSubmit = async (data: RegisterSchema) => {
  try {
    setServerMsg({ type: "", message: "" });

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!result.success) {
      setServerMsg({ type: "error", message: result.message });
      return;
    }

    // ✅ If registration successful → auto login through NextAuth
    const loginRes = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (loginRes?.error) {
      setServerMsg({
        type: "error",
        message: "Account created but login failed. Please login manually.",
      });
      setTimeout(() => window.location.href = "/auth/login", 1500);
      return;
    }

    setServerMsg({
      type: "success",
      message: "Account created! Logging you in...",
    });

    // ✅ Redirect to dashboard or homepage
    setTimeout(() => window.location.href = "/", 1500);

  } catch (error) {
    console.log("error on registering user: ",error);
    setServerMsg({
      type: "error",
      message: "Something went wrong. Try again.",
    });
  }
};

  

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-sm md:max-w-md shadow-lg rounded-xl">
        <CardContent className="py-8 px-6">

          <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Register to shop premium sarees
          </p>

          {serverMsg.message && (
            <Alert className={`mb-4 ${serverMsg.type === "success" ? "border-green-600" : "border-red-500"}`}>
              {serverMsg.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{serverMsg.type === "success" ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{serverMsg.message}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Riya Sharma" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Strong password..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full text-base" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating Account..." : "Register"}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm mt-4 text-muted-foreground">
            Already have an account?{" "}
            <Link href={WEBSITE_LOGIN} className="text-primary font-semibold">Login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
