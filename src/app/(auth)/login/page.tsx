"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import type { RootState } from "@/lib/redux/store";
import { login, clearError } from "@/lib/redux/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plane } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .refine(
      (value) => /[A-Z]/.test(value), // Must have at least one uppercase letter
      { message: "Password must contain at least one uppercase letter." }
    )
    .refine(
      (value) => /[a-z]/.test(value), // Must have at least one lowercase letter
      { message: "Password must contain at least one lowercase letter." }
    )
    .refine(
      (value) => /[0-9]/.test(value), // Must have at least one number
      { message: "Password must contain at least one number." }
    )
    .refine(
      (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), // Must have at least one special character
      { message: "Password must contain at least one special character." }
    ),
});

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    setValidationErrors({});

    // Validate with Zod
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const errors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as "email" | "password"] = err.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    const loginResult = await dispatch(login(formData));

    if (login.fulfilled.match(loginResult)) {
      router.push("/");
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1 flex flex-col items-center'>
          <div className='flex items-center space-x-2 mb-4'>
            <Plane className='h-8 w-8 text-blue-600' />
            <span className='text-2xl font-bold text-gray-900'>
              TravelBuddy
            </span>
          </div>
          <CardTitle className='text-2xl font-bold text-center'>
            Welcome Back
          </CardTitle>
          <CardDescription className='text-center'>
            Login to your account to continue your adventure
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            {error && (
              <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
                <p className='text-sm text-red-600'>{error}</p>
              </div>
            )}

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='john@example.com'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={validationErrors.email ? "border-red-500" : ""}
              />
              {validationErrors.email && (
                <p className='text-sm text-red-600'>{validationErrors.email}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={validationErrors.password ? "border-red-500" : ""}
              />
              {validationErrors.password && (
                <p className='text-sm text-red-600'>
                  {validationErrors.password}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className='flex flex-col space-y-4 pt-4'>
            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <p className='text-sm text-center text-gray-600'>
              Don&apos;t have an account?{" "}
              <Link
                href='/register'
                className='text-blue-600 hover:underline font-medium'
              >
                Sign up
              </Link>
            </p>

            {/* user credentials */}
            <div className='space-y-3 pt-2 w-full border-t border-gray-200'>
              <div>
                <p className='text-xs font-semibold text-gray-700 mb-2'>
                  🔐 Test User Credentials
                </p>
              </div>
              <Button
                variant='default'
                size='sm'
                onClick={() =>
                  setFormData({
                    email: "admin@gmail.com",
                    password: "asd123!A",
                  })
                }
                className='w-full'
              >
                Admin Login
              </Button>
              <Button
                variant='secondary'
                size='sm'
                onClick={() =>
                  setFormData({
                    email: "aliakbor.js@gmail.com",
                    password: "asd123!A",
                  })
                }
                className='w-full'
              >
                User Login
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
