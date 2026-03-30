import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { changeRoleSchema } from "@/validation/organizationSchema";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ORG_ROLE } from "@/constant/organization";
import { useEffect } from "react";
import { changeMemberRoleOfOrganization } from "@/store/organization/organizationThunk";

export default function ChangeOrgMemberModal({
  isChangeRoleOpen,
  setIsChangeRoleOpen,
  selectedMember,
}: {
  isChangeRoleOpen: boolean;
  setIsChangeRoleOpen: (open: boolean) => void;
  selectedMember: any;
}) {
  type ChangeRoleFormValues = z.infer<typeof changeRoleSchema>;

  const { loading, currentOrganization } = useAppSelector(
    (state) => state.organization,
  );
  const dispatch = useAppDispatch();

  const form = useForm<ChangeRoleFormValues>({
    resolver: zodResolver(changeRoleSchema),
    defaultValues: {
      role: undefined,
    },
  });

  // ✅ Sync default value when modal opens
  useEffect(() => {
    if (selectedMember?.role) {
      form.reset({
        role: selectedMember.role,
      });
    }
  }, [selectedMember]);

  // ✅ FIX: receive data
  const handleChangeRole = async (formData: ChangeRoleFormValues) => {
    try {
      let payload = {
        userId: selectedMember?.userId?._id,
        orgSlug: currentOrganization?.organization?.slug,
        role: formData?.role,
      };
      await dispatch(changeMemberRoleOfOrganization(payload)).unwrap();
      form.reset();
      setIsChangeRoleOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isChangeRoleOpen} onOpenChange={setIsChangeRoleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Member Role</DialogTitle>
          <DialogDescription>
            Update the role for {selectedMember?.userId?.userName}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleChangeRole)}
          className="space-y-4 py-4"
        >
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={selectedMember?.avatar}
                alt={selectedMember?.userId?.userName}
              />
              <AvatarFallback>
                {selectedMember?.userId?.userName
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-medium">{selectedMember?.userId?.userName}</p>
              <p className="text-sm text-muted-foreground">
                {selectedMember?.userId?.email}
              </p>
            </div>
          </div>

          {/* Role Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">New Role</label>

            <Select
              value={form.watch("role")}
              onValueChange={(value) =>
                form.setValue("role", value, {
                  shouldValidate: true, // ✅ FIX
                  shouldDirty: true,
                })
              }
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
              <p className="text-sm text-destructive">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsChangeRoleOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting || loading}
            >
              {form.formState.isSubmitting || loading
                ? "Updating..."
                : "Update Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
