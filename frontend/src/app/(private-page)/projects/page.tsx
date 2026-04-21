"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../../../hooks/redux";
import {
  fetchProjects,
  createProject,
} from "../../../store/project/projectThunk";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../../../components/ui/modal";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, FolderOpen, Calendar, Users, ArrowRight } from "lucide-react";
import { createProjectSchema } from "@/validation/projectSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { projects, loading } = useAppSelector((state) => state.project);
  const { currentOrganization } = useAppSelector((state) => state.organization);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (currentOrganization) {
      fetchProjectsHandler();
    }
  }, [currentOrganization, dispatch]);

  const fetchProjectsHandler = () => {
    try {
      dispatch(fetchProjects()).unwrap();
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const onSubmit = async (data: CreateProjectFormValues) => {
    try {
      await dispatch(createProject(data)).unwrap();
      fetchProjectsHandler();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize your projects across all organizations
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                if (!currentOrganization?.organization?.slug) {
                  setIsModalOpen(false);
                  router.push("/organizations/create");
                  toast.warning("Create organization first");
                }
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div className="space-y-4 py-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Project Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter project name"
                    {...register("name")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-2"
                  >
                    Description
                  </label>
                  <Input
                    id="description"
                    placeholder="Enter project description (optional)"
                    {...register("description")}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Project"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.data?.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects?.data?.reduce((sum, p) => sum + p.totalMembers, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects?.data.reduce((sum, p) => sum + p.totalTasks, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">In progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
        {projects.data?.length === 0 ? (
          <Card className="border border-[color:var(--border)] py-12 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
            <CardContent className="text-center">
              <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">No projects yet</p>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!currentOrganization?.organization?.slug) {
                        setIsModalOpen(false);
                        router.push("/organizations/create");
                        toast.warning("Create organization first");
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Project
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects?.data.map(({ project, totalMembers, totalTasks }) => (
              <Link key={project._id} href={`/projects/${project.slug}`}>
                <Card className="h-full border border-[color:var(--border)] shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {project.organization}
                        </CardDescription>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {totalMembers} members
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(project?.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium text-foreground">
                        {totalTasks} tasks in progress
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
