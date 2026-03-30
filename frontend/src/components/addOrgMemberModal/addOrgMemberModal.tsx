import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addMemberSchema } from "@/validation/organizationSchema";
import { addMemberToOrganization } from "@/store/organization/organizationThunk";
import { ORG_ROLE } from "@/constant/organization";



export default function AddOrgMemberModal({
  isAddMemberOpen,
  setIsAddMemberOpen,
}: {
  isAddMemberOpen: boolean;
  setIsAddMemberOpen: (open: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  type AddMemberFormValues = z.infer<typeof addMemberSchema>;
  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      email: "",
      role: "",
    },
  });
  const { currentOrganization, loading } = useAppSelector(
    (state) => state.organization,
  );
  const handleAddMember = async (data: AddMemberFormValues) => {
    try {
      let data: any = {
        email: form.getValues("email"),
        role: form.getValues("role"),
        orgSlug: currentOrganization?.organization?.slug,
      };
      dispatch(addMemberToOrganization(data));
    } catch (error) {}
  };

  return (
    <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Invite a new member to join this organization. They will receive an
            email invitation.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleAddMember)}
          className="space-y-4 py-4"
        >
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input
              type="email"
              placeholder="colleague@company.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>

            <Select
              onValueChange={(value) => form.setValue("role", value)}
              value={form.watch("role")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>

              <SelectContent>
                {ORG_ROLE.map((role) => (
                  <SelectItem value={role.value} key={role.value}>
                    <div className="flex flex-col">
                      <span>{role.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {role.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {form.formState.errors.role && (
              <p className="text-sm text-red-500">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddMemberOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
