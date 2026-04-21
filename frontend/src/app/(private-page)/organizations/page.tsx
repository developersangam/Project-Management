"use client";

import * as React from "react";
import Link from "next/link";
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
import {
  Plus,
  Users,
  FolderOpen,
  Settings,
  ArrowRight,
  Check,
  UserPlus,
  Eye,
} from "lucide-react";
import {
  fetchOrganizations,
  switchOrganization,
} from "@/store/organization/organizationThunk";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import AddOrgMemberModal from "@/components/addOrgMemberModal/addOrgMemberModal";
export default function OrganizationsPage() {
  const dispatch = useAppDispatch();
  const { organizations, currentOrganization, loading } = useAppSelector(
    (state) => state.organization,
  );
  const [isAddMemberOpen, setIsAddMemberOpen] = React.useState(false);
  const [selectedOrgForMember, setSelectedOrgForMember] = React.useState<
    string | null
  >(null);
  const [newMemberEmail, setNewMemberEmail] = React.useState("");
  const [newMemberRole, setNewMemberRole] = React.useState("Member");

  React.useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  const handleSwitch = (org: any) => {
    dispatch(switchOrganization(org));
  };

  const handleAddMember = async () => {};

  const openAddMemberDialog = () => {
    setIsAddMemberOpen(true);
  };
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Organizations</h1>
          <p className="text-muted-foreground mt-2">
            Manage your workspaces and collaborate with your team
          </p>
        </div>
        <Button size="lg" asChild className="w-full sm:w-auto">
          <Link href="/organizations/create">
            <Plus className="w-4 h-4 mr-2" />
            New Organization
          </Link>
        </Button>
      </div>

      {/* Current Organization Highlight */}
      {currentOrganization && (
        <Card className="border-primary bg-primary/5 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  {currentOrganization?.organization?.name}
                </CardTitle>
                <CardDescription className="mt-2">
                  Slug - {currentOrganization?.organization?.slug}
                </CardDescription>
                <CardDescription className="mt-2">
                  {currentOrganization?.organization?.description}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">
                  {currentOrganization?.totalProjects || 0} projects
                </Badge>
                <Badge variant="secondary">
                  {currentOrganization?.totalMembers || 0} members
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" asChild>
                <Link
                  href={`/organizations/${currentOrganization?.organization?.slug}`}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Organization
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/projects`}>
                  <FolderOpen className="w-4 h-4 mr-2" />
                  View Projects
                </Link>
              </Button>
              <Button variant="outline" onClick={() => openAddMemberDialog()}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
              <Button variant="outline" asChild>
                <Link
                  href={`/organizations/${currentOrganization?.organization?.slug}/settings`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Organizations List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">All Workspaces</h2>
        {organizations.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No organizations yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first organization.
            </p>
            <Button asChild>
              <Link href="/organizations/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Organization
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizations?.map((org) => {
              const isCurrentOrg =
                currentOrganization?.organization?.id === org?.organization?.id;
              return (
                <Card
                  key={org?.organization?.id}
                  className={`border border-[color:var(--border)] shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer ${isCurrentOrg ? "bg-primary/5 border-primary" : ""}`}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-start justify-between">
                      <span className="line-clamp-1">
                        {org?.organization?.name}
                      </span>
                      {isCurrentOrg && (
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {org.organization?.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{org?.totalMembers} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FolderOpen className="w-4 h-4" />
                        <span>{org?.totalProjects} projects</span>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {isCurrentOrg ? (
                        <>
                          <Button variant="outline" className="w-full" asChild>
                            <Link
                              href={`/organizations/${org?.organization?.slug}`}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Organization
                              <ArrowRight className="w-4 h-4 ml-auto" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => openAddMemberDialog()}
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add Member
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="default"
                            className="w-full"
                            onClick={() => handleSwitch(org)}
                          >
                            Switch to this Organization
                          </Button>
                          {/* <Button variant="ghost" className="w-full" asChild>
                            <Link href={`/organizations/${org?.organization?.slug}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                          </Button> */}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <AddOrgMemberModal
        isAddMemberOpen={isAddMemberOpen}
        setIsAddMemberOpen={setIsAddMemberOpen}
      />
    </div>
  );
}
