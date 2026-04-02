"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { registerUser } from "../../../store/auth/authThunk";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PublicHeader } from "@/components/layout/PublicHeader";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "@/validation/registerSchema";
import { tr } from "zod/v4/locales";

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: RegisterFormValues) => {
    const { firstname, lastname, email, username, dob, password } = data;
    const registrationData = {
      firstName: firstname,
      lastName: lastname,
      email,
      userName: username,
      dob,
      password,
    };

    try {
      await dispatch(registerUser(registrationData));
      router.push("/login")
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your information to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Firstname
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your first name"
                  {...register("firstname")}
                />
                {errors.firstname && (
                  <p className="text-sm text-red-500">
                    {errors.firstname.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="lastname" className="text-sm font-medium">
                  Lastname
                </label>
                <Input
                  id="lastname"
                  type="text"
                  placeholder="Enter your last name"
                  {...register("lastname")}
                />
                {errors.lastname && (
                  <p className="text-sm text-red-500">
                    {errors.lastname.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="dob" className="text-sm font-medium">
                  Date of Birth
                </label>
                <Input id="dob" type="date" {...register("dob")} />
                {errors.dob && (
                  <p className="text-sm text-red-500">{errors.dob.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="passwordConfirm"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </label>
                <Input
                  id="passwordConfirm"
                  type="password"
                  placeholder="Confirm your password"
                  {...register("passwordConfirm")}
                />
                {errors.passwordConfirm && (
                  <p className="text-sm text-red-500">
                    {errors.passwordConfirm.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
