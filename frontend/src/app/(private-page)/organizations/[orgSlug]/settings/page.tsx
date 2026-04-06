"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Trash2, Save } from "lucide-react";
import {
  deleteOrganization,
  getOrganizationDetails,
  getOrgSlug,
  updateOrganization,
} from "@/store/organization/organizationThunk";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { organizationSchema } from "@/validation/organizationSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@/hooks/useDebounce";

export default function OrganizationSettingsPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, currentOrganization } = useAppSelector(
    (state) => state.organization,
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  type OrganizationFormValues = z.infer<typeof organizationSchema>;

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });
  const orgName = form.watch("name");
  const debouncedSearch = useDebounce(orgName, 500);
  useEffect(() => {
    getOrganizationDetailsHandler();
  }, [orgSlug]);

  useEffect(() => {
    if (
      debouncedSearch.toLowerCase() ===
      currentOrganization?.organization?.name.toLowerCase()
    ) {
      form.setValue("slug", currentOrganization?.organization?.slug);
    } else {
      getOrgSlugHander();
    }
  }, [debouncedSearch]);

  const getOrganizationDetailsHandler = async () => {
    try {
      const response = await dispatch(getOrganizationDetails(orgSlug)).unwrap();
      //   setOrganization(response?.organization);
      let data = response.organization;
      form.reset({
        name: data.name || "",
        slug: data.slug || "",
        description: data.description || "",
      });
    } catch (error) {
      console.error("Error fetching organization details:", error);
    }
  };

  const getOrgSlugHander = async () => {
    try {
      const response: any = await dispatch(
        getOrgSlug({ name: orgName }),
      ).unwrap();
      form.setValue("slug", response.slug);
    } catch (error) {}
  };

  const handleSave = async (data: OrganizationFormValues) => {
    try {
      const payload: any = {
        orgSlug,
        data,
      };
      await dispatch(updateOrganization(payload));
      router.push("/organizations")
    } catch {
    } finally {
    }
  };

  const handleCancel = () => {};

  const handleDelete = async () => {
    try {
      await dispatch(deleteOrganization(orgSlug));
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href={`/organizations/${orgSlug}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">
                Manage your organization settings and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Organization Information */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>
                Update your organization's basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form
                onSubmit={form.handleSubmit(handleSave)}
                className="space-y-4"
              >
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Organization Name
                  </label>
                  <Input
                    placeholder="Enter organization name"
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Organization Slug
                  </label>
                  <Input
                    placeholder="organization-slug"
                    {...form.register("slug")}
                    disabled
                  />
                  {form.formState.errors.slug && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.slug.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Used in URLs. Only lowercase letters, numbers, and hyphens.
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    rows={4}
                    placeholder="Enter organization description"
                    {...form.register("description")}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {form.watch("description")?.length || 0}/500 characters
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={!form.formState.isDirty}
                    className="gap-2"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={!form.formState.isDirty || loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    id="public"
                    name="privacy"
                    checked={true}
                    onChange={() => {}}
                    disabled={loading}
                    className="mt-1"
                  />
                  <label htmlFor="public" className="flex flex-col gap-1">
                    <span className="text-sm font-medium">
                      Public Organization
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Anyone can view this organization and its public projects
                    </span>
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    id="private"
                    name="privacy"
                    checked={false}
                    onChange={() => {}}
                    disabled={loading}
                    className="mt-1"
                  />
                  <label htmlFor="private" className="flex flex-col gap-1">
                    <span className="text-sm font-medium">
                      Private Organization
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Only members can view this organization
                    </span>
                  </label>
                </div>
              </div>

              <Button disabled={loading} className="gap-2">
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete an organization, there is no going back.
                    Please be certain.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteOpen(true)}
                    className="gap-2"
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Organization
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Organization</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              organization
              <strong> {form.getValues().name}</strong> and all associated
              projects and data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
