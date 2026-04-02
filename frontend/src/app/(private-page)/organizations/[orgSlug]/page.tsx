"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Users,
  FolderOpen,
  Settings,
  UserPlus,
  MoreHorizontal,
  Shield,
  UserMinus,
  Mail,
  Calendar,
  Building2,
  ChevronLeft,
  ChevronRight,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import {
  addMemberToOrganization,
  getMemberOfOrganization,
  getOrganizationDetails,
  removeMemberOfOrganization,
} from "@/store/organization/organizationThunk";
import { useAppDispatch } from "@/hooks/redux";
import {
  fetchProjectMembers,
  fetchProjects,
} from "@/store/project/projectThunk";
import AddOrgMemberModal from "@/components/addOrgMemberModal/addOrgMemberModal";
import ChangeOrgMemberModal from "@/components/changeOrgRoleModal/changeOrgRoleModal";

const ITEMS_PER_PAGE = 5;

export default function ViewOrganizationPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const orgSlug = params.orgSlug as string;

  // State
  const [organization, setOrganization] = React.useState<any>({});
  const [organizationMember, setOrganizationMember] = React.useState<any>({
    data: [],
    meta: {},
  });

  const [organizationProjects, setOrganizationProjects] = React.useState<any>({
    data: [],
    meta: {},
  });
  const [totalPage, setTotalPage] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Dialog states
  const [isAddMemberOpen, setIsAddMemberOpen] = React.useState(false);
  const [isChangeRoleOpen, setIsChangeRoleOpen] = React.useState(false);
  const [isRemoveMemberOpen, setIsRemoveMemberOpen] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<
    (typeof organization.members)[0] | null
  >(null);

  // Form states
  const [newMemberEmail, setNewMemberEmail] = React.useState("");
  const [newMemberRole, setNewMemberRole] = React.useState("Member");
  const [newRole, setNewRole] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  React.useEffect(() => {
    getOrganizationDetailsHandler();
    getOrganizationMembersHandler();
    getProjectInOrganization();
  }, [orgSlug]);

  const getOrganizationDetailsHandler = async () => {
    try {
      const response = await dispatch(getOrganizationDetails(orgSlug)).unwrap();
      setOrganization(response);
    } catch (error) {
      console.error("Error fetching organization details:", error);
    }
  };

  const getOrganizationMembersHandler = async () => {
    try {
      const response = await dispatch(
        getMemberOfOrganization(orgSlug),
      ).unwrap();
      setOrganizationMember(response);
    } catch (error) {
      console.error("Error fetching organization details:", error);
    }
  };

  const getProjectInOrganization = async () => {
    try {
      const response = await dispatch(fetchProjects()).unwrap();
      console.log("PERRR", response);
      setOrganizationProjects(response);
    } catch (error) {}
  };

  const handleChangeRole = async () => {};

  const handleRemoveMember = async () => {
    try {
      let data = {
        orgSlug,
        userId: selectedMember?.userId?._id,
      };
      await dispatch(removeMemberOfOrganization(data)).unwrap();
      getOrganizationMembersHandler();
    } catch (error) {}
  };

  const openChangeRoleDialog = (member: any) => {
    setSelectedMember(member);
    setNewRole(member.role);
    setIsChangeRoleOpen(true);
  };

  const openRemoveMemberDialog = (member: (typeof organization.members)[0]) => {
    console.log(member);
    setSelectedMember(member);
    setIsRemoveMemberOpen(true);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "default";
      case "MEMBER":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Completed":
        return "secondary";
      case "Planning":
        return "outline";
      default:
        return "outline";
    }
  };
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          className="w-fit"
          onClick={() => router.push("/organizations")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Organizations
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {organization?.organization?.name}
                </h1>
                <p className="text-muted-foreground text-sm">
                  /{organization?.organization?.slug}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              {organization?.organization?.description}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/organizations/${orgSlug}/settings`}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {organizationMember?.data?.length}
                </p>
                <p className="text-sm text-muted-foreground">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <FolderOpen className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {organizationProjects.data.length}
                </p>
                <p className="text-sm text-muted-foreground">Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Shield className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {
                    organizationMember?.data?.filter(
                      (m: any) => m.role === "ADMIN",
                    ).length
                  }
                </p>
                <p className="text-sm text-muted-foreground">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-orange-500/10">
                <Calendar className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Date(
                    organization?.organization?.createdAt,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-muted-foreground">Created</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">
            <Users className="w-4 h-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="projects">
            <FolderOpen className="w-4 h-4 mr-2" />
            Projects
          </TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage your organization's team members and their roles
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddMemberOpen(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search members by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Joined
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizationMember?.data?.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No members found
                        </TableCell>
                      </TableRow>
                    ) : (
                      organizationMember?.data?.map((member: any) => (
                        <TableRow key={member._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-9 h-9">
                                <AvatarImage
                                  src={member?.avatar}
                                  alt={member?.userId?.name}
                                />
                                <AvatarFallback>
                                  {member?.userId?.userName
                                    .split(" ")
                                    .map((n: any) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {member?.userId?.userName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {member?.userId?.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getRoleBadgeVariant(member.role)}>
                              {member.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {new Date(member.joinedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={member.role === "Owner"}
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => openChangeRoleDialog(member)}
                                >
                                  <Shield className="w-4 h-4 mr-2" />
                                  Change Role
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => openRemoveMemberDialog(member)}
                                >
                                  <UserMinus className="w-4 h-4 mr-2" />
                                  Remove Member
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {/* {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(
                      startIndex + ITEMS_PER_PAGE,
                      filteredMembers.length,
                    )}{" "}
                    of {filteredMembers.length} members
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            className="w-9"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        ),
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )} */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>
                    All projects in this organization
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href="/projects/create">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Create Project
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Created At
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizationProjects?.data?.map((project: any) => (
                      <TableRow key={project._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{project.name}</p>
                            <p className="text-sm text-muted-foreground">
                              /{project.slug}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusBadgeVariant(project.status)}
                          >
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {new Date(project?.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/projects/${project.slug}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Member Dialog */}
      <AddOrgMemberModal
        isAddMemberOpen={isAddMemberOpen}
        setIsAddMemberOpen={setIsAddMemberOpen}
      />

      {/* Change Role Dialog */}
      <ChangeOrgMemberModal
        isChangeRoleOpen={isChangeRoleOpen}
        setIsChangeRoleOpen={setIsChangeRoleOpen}
        selectedMember={selectedMember}
      />

      {/* Remove Member Alert Dialog */}
      <AlertDialog
        open={isRemoveMemberOpen}
        onOpenChange={setIsRemoveMemberOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-medium">
                {selectedMember?.userId?.userName}
              </span>{" "}
              from {organization?.name}? They will lose access to all projects
              in this organization.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Removing..." : "Remove Member"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
