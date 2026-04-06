"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Plus,
  MoreHorizontal,
  UserMinus,
  Shield,
  Search,
  Users,
} from "lucide-react";
import {
  addProjectMember,
  changeProjectMemberRole,
  fetchProjectMembers,
  removeProjectMember,
} from "@/store/project/projectThunk";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { addMemberSchema, changeRoleSchema } from "@/validation/projectSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

type AddMemberFormValues = z.infer<typeof addMemberSchema>;
type ChangeRoleFormValues = z.infer<typeof changeRoleSchema>;

type Role = "PROJECT_ADMIN" | "PROJECT_MANAGER" | "MEMBER" | "VIEWER";

interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  joinedAt: string;
}

const roleColors: any = {
  PROJECT_ADMIN: "bg-primary text-primary-foreground",
  PROJECT_MANAGER: "bg-blue-100 text-blue-700",
  PROJECT_MEMBER: "bg-green-100 text-green-700",
  VIEWER: "bg-secondary text-secondary-foreground",
};

export default function MembersPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { projectMembers, loading } = useAppSelector((state) => state.project);
  const projectSlug = params.projectSlug as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog states
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [changeRoleOpen, setChangeRoleOpen] = useState(false);
  const [removeMemberOpen, setRemoveMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState("member");

  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      email: "",
      role: undefined,
    },
  });

  const roleChangeForm = useForm<ChangeRoleFormValues>({
    resolver: zodResolver(changeRoleSchema),
    defaultValues: {
      role: undefined,
    },
  });

  useEffect(() => {
    // Mock data fetch
    fetchMembersHandler();
  }, [projectSlug]);

  useEffect(() => {
    if (selectedMember && changeRoleOpen) {
      form.reset({
        role: selectedMember.role,
      });
    }
  }, [selectedMember]);

  const fetchMembersHandler = useCallback(async () => {
    try {
      await dispatch(fetchProjectMembers(projectSlug)).unwrap();
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  }, [projectSlug]);

  const handleAddMember = async (data: AddMemberFormValues) => {
    try {
      const response = await dispatch(
        addProjectMember({ projectSlug, ...data }),
      ).unwrap();
      setAddMemberOpen(false);
      fetchMembersHandler();
      form.reset();
    } catch (error) {
      console.error("Failed to add member:", error);
    }
  };

  const handleChangeRole = async (formData: ChangeRoleFormValues) => {
    try {
      let data = {
        role: formData.role,
      };
      const response = await dispatch(
        changeProjectMemberRole({
          projectSlug,
          userId: selectedMember?.user?._id,
          data,
        }),
      ).unwrap();
      setChangeRoleOpen(false);
      fetchMembersHandler();
      roleChangeForm.reset();
      form.reset();
    } catch (error) {
      console.error("Failed to add member:", error);
    }
  };

  const handleRemoveMember = async () => {
    try {
      const response = await dispatch(
        removeProjectMember({ projectSlug, userId: selectedMember?.user?._id }),
      ).unwrap();
      setRemoveMemberOpen(false);
      fetchMembersHandler();
    } catch (error) {}
  };

  const openChangeRoleDialog = (member: Member) => {
    setSelectedMember(member);
    setChangeRoleOpen(true);
  };

  const openRemoveMemberDialog = (member: Member) => {
    setSelectedMember(member);
    setRemoveMemberOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate pagination items
  const getPaginationItems = () => {
    const items: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1);

      if (currentPage > 3) {
        items.push("ellipsis");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(i);
      }

      if (currentPage < totalPages - 2) {
        items.push("ellipsis");
      }

      items.push(totalPages);
    }

    return items;
  };

  if (loading && !addMemberOpen && !removeMemberOpen && !changeRoleOpen) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-lg font-medium text-muted-foreground">
            Loading members...
          </h2>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Team Members</h1>
          </div>
          <p className="text-muted-foreground ml-10">
            Manage your project team members and their roles
          </p>
        </div>

        <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>

          {/* Add Member */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
              <DialogDescription>
                Invite a new member to join this project.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={form.handleSubmit(handleAddMember)}
              className="space-y-4 py-4"
            >
              {/* Email */}
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="member@example.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label>Role</Label>

                <Controller
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="PROJECT_ADMIN">Admin</SelectItem>
                        <SelectItem value="PROJECT_MANAGER">Manager</SelectItem>
                        <SelectItem value="PROJECT_MEMBER">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

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
                  onClick={() => setAddMemberOpen(false)}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Adding..." : "Add Member"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{projectMembers.length}</p>
              <p className="text-sm text-muted-foreground">Total Members</p>
            </div>
            <div className="ml-auto flex gap-2">
              <Badge variant="secondary">
                {
                  projectMembers.filter((m) => m.role === "PROJECT_ADMIN")
                    .length
                }{" "}
                Owner
              </Badge>
              <Badge variant="secondary">
                {projectMembers.filter((m) => m.role === "admin").length} Admins
              </Badge>
              <Badge variant="secondary">
                {projectMembers.filter((m) => m.role === "member").length}{" "}
                Members
              </Badge>
              <Badge variant="secondary">
                {projectMembers.filter((m) => m.role === "viewer").length}{" "}
                Viewers
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search members by name or email..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-10"
        />
      </div>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            {projectMembers.length} member
            {projectMembers.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectMembers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No members found matching your search.
              </div>
            ) : (
              projectMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {getInitials(
                          `${member?.user?.firstName} ${member?.user?.lastName}`,
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{`${member?.user?.firstName} ${member?.user?.lastName}`}</p>
                      <p className="text-sm text-muted-foreground">
                        {member?.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={roleColors[member.role]}>
                      {member.role.split("_").join(" ")}{" "}
                      {/* Display role without "PROJECT_" prefix */}
                    </Badge>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </span>
                    {/* {member.role !== "PROJECT_ADMIN" && ( */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openChangeRoleDialog(member)}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openRemoveMemberDialog(member)}
                          className="text-destructive focus:text-destructive"
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {/* )} */}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {getPaginationItems().map((item, index) => (
                    <PaginationItem key={index}>
                      {item === "ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(item);
                          }}
                          isActive={currentPage === item}
                          className="cursor-pointer"
                        >
                          {item}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          setCurrentPage(currentPage + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Role Dialog */}
      <Dialog open={changeRoleOpen} onOpenChange={setChangeRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Member Role</DialogTitle>
            <DialogDescription>
              Update the role for{" "}
              {`${selectedMember?.user?.firstName} ${selectedMember?.user?.lastName}`}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={roleChangeForm.handleSubmit(handleChangeRole)}
            className="py-4 space-y-4"
          >
            {/* Role */}
            <div className="space-y-2">
              <Label>New Role</Label>

              <Controller
                control={roleChangeForm.control}
                name="role"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="PROJECT_ADMIN">Admin</SelectItem>
                      <SelectItem value="PROJECT_MANAGER">Manager</SelectItem>
                      <SelectItem value="PROJECT_MEMBER">Member</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {roleChangeForm.formState.errors.role && (
                <p className="text-sm text-destructive">
                  {roleChangeForm.formState.errors.role.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setChangeRoleOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation */}
      <AlertDialog open={removeMemberOpen} onOpenChange={setRemoveMemberOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedMember?.name} from this
              project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Removing" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
