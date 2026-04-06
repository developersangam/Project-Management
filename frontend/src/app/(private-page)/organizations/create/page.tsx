"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrgSchema } from "@/validation/organizationSchema";
import { z } from "zod";
import { createOrganization } from "@/store/organization/organizationThunk";

type CreateOrgFormValues = z.infer<typeof createOrgSchema>;

export default function CreateOrganizationPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.organization);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrgFormValues>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateOrgFormValues) => {
    try {
      // TODO: Call API to create organization
      const result = await dispatch(createOrganization(data)).unwrap();
      if (result) {
        router.push("/organizations");
      }
    } catch (error) {
      console.error("Error creating organization:", error);
    }
  };

  return (
    <AuthGuard>
      {/* <DashboardLayout> */}
      <div className="p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Organization</h1>
          <p className="text-muted-foreground mt-2">
            Set up a new organization and invite team members
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
            <CardDescription>
              Choose a name and slug for your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Organization Name *
                </label>
                <Input
                  id="name"
                  placeholder="e.g., Acme Corporation"
                  {...register("name")}
                  required
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium">
                  Slug *
                </label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="e.g., acme-corp"
                  value={""}
                  onChange={(e) => {}}
                />
                <p className="text-xs text-muted-foreground">
                  This will be used in URLs: jiraclone.com/dashboard/xyz
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  placeholder="Tell us about your organization..."
                  {...register("description")}
                  rows={4}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.description && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Organization"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* </DashboardLayout> */}
    </AuthGuard>
  );
}
