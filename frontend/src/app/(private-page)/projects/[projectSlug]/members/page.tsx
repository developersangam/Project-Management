"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
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
import { fetchProjectMembers } from "@/store/project/projectThunk";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

type Role = "PROJECT_ADMIN" | "PROJECT_MANAGER" | "MEMBER" | "VIEWER";

interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  joinedAt: string;
}

const ITEMS_PER_PAGE = 8;

const roleColors: any= {
  PROJECT_ADMIN: "bg-primary text-primary-foreground",
  PROJECT_MANAGER: "bg-blue-100 text-blue-700",
  MEMBER: "bg-green-100 text-green-700",
  VIEWER: "bg-secondary text-secondary-foreground",
};

export default function MembersPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {projectMembers,loading} = useAppSelector(state => state.project);
  const projectSlug = params.projectSlug as string;

  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Dialog states
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [changeRoleOpen, setChangeRoleOpen] = useState(false);
  const [removeMemberOpen, setRemoveMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  // Form states
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("member");
  const [selectedRole, setSelectedRole] = useState("member");

  useEffect(() => {
    // Mock data fetch
   fetchMembersHandler();
  }, [projectSlug]);

  const fetchMembersHandler = useCallback(async () => {
   try {
    await dispatch(fetchProjectMembers(projectSlug)).unwrap(); 
   } catch (error) {
     console.error("Failed to fetch members:", error);
   }
  }, [projectSlug]);

  const handleAddMember = useCallback(() => {
    try {
      
    } catch (error) {
      console.error("Failed to add member:", error);
    }
  }, [newMemberEmail, newMemberRole]);

  const handleChangeRole = useCallback(() => {
  
    setChangeRoleOpen(false);
  }, [selectedMember, selectedRole]);

  const handleRemoveMember = useCallback(() => {
    if (!selectedMember) return;
    
    setMembers(prev => prev.filter(m => m.id !== selectedMember.id));
    setRemoveMemberOpen(false);
    setSelectedMember(null);
  }, [selectedMember]);

  const openChangeRoleDialog = (member: Member) => {
    setSelectedMember(member);
    setSelectedRole(member.role);
    setChangeRoleOpen(true);
  };

  const openRemoveMemberDialog = (member: Member) => {
    setSelectedMember(member);
    setRemoveMemberOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-lg font-medium text-muted-foreground">Loading members...</h2>
        </div>
      </div>
    );
  }
console.log("Project Members:", projectMembers); // Debug log
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
              <DialogDescription>
                Invite a new member to join this project.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="member@example.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newMemberRole} onValueChange={(value: Role) => setNewMemberRole(value)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddMemberOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMember} disabled={!newMemberEmail}>
                Add Member
              </Button>
            </DialogFooter>
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
              <Badge variant="secondary">{projectMembers.filter(m => m.role === "PROJECT_ADMIN").length} Owner</Badge>
              <Badge variant="secondary">{projectMembers.filter(m => m.role === "admin").length} Admins</Badge>
              <Badge variant="secondary">{projectMembers.filter(m => m.role === "member").length} Members</Badge>
              <Badge variant="secondary">{projectMembers.filter(m => m.role === "viewer").length} Viewers</Badge>
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
            {projectMembers.length} member{projectMembers.length !== 1 ? "s" : ""} found
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
                      <AvatarFallback>{getInitials(`${member?.user?.firstName} ${member?.user?.lastName}`)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{`${member?.user?.firstName} ${member?.user?.lastName}`}</p>
                      <p className="text-sm text-muted-foreground">{member?.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={roleColors[member.role]}>
                      {member.role.split("_").join(" ")} {/* Display role without "PROJECT_" prefix */}
                    </Badge>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </span>
                    {member.role !== "PROJECT_ADMIN" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openChangeRoleDialog(member)}>
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
                    )}
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
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
              Update the role for {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="change-role">New Role</Label>
            <Select value={selectedRole} onValueChange={(value: Role) => setSelectedRole(value)}>
              <SelectTrigger id="change-role" className="mt-2">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeRoleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangeRole}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation */}
      <AlertDialog open={removeMemberOpen} onOpenChange={setRemoveMemberOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedMember?.name} from this project?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
