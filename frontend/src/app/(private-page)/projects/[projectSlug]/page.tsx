"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FolderOpen,
  BarChart3,
  Users,
  CheckCircle2,
  Clock,
  ListTodo,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchProjectDetails } from "@/store/project/projectThunk";

// Mock data - replace with your actual Redux store/API
interface Project {
  id: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const projectSlug = params.projectSlug as string;
  const { loading, currentProject } = useAppSelector((state) => state.project);

  // Mock state - replace with your Redux store
  const [taskStats, setTaskStats] = useState<TaskStats>({
    todo: 0,
    inProgress: 0,
    done: 0,
  });
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    getProjectDetailDashboardHandler();
  }, [projectSlug]);

  const getProjectDetailDashboardHandler = async () => {
    try {
      const respone = await dispatch(fetchProjectDetails(projectSlug)).unwrap();
      calculateTaskStat(respone);
    } catch (error) {}
  };

  const calculateTaskStat = useCallback(
    (key: string) => {
      const taskStatus: any = currentProject?.taskStatus ?? {};
      const totalTask = Object.values(
        taskStatus as Record<string, number>,
      ).reduce((acc: number, curr: number) => acc + curr, 0);

      console.log(taskStatus[key], totalTask);
      const percentageOfTaskInEachStatus = Math.round(
        (taskStatus[key] / totalTask) * 100,
      );
      return percentageOfTaskInEachStatus;
    },
    [currentProject],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-lg font-medium text-muted-foreground">
            Loading project details...
          </h2>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              Project Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {
                "The project you're looking for doesn't exist or has been deleted."
              }
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/projects">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalTasks = taskStats.todo + taskStats.inProgress + taskStats.done;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold text-foreground">
              {currentProject?.project?.name}
            </h1>
          </div>
          <p className="text-muted-foreground ml-10">
            {currentProject?.project?.description || "No description available"}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(
          currentProject?.taskStatus as Record<string, number>,
        ).map(([key, value]) => (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {key}
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {value}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                    <ListTodo className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {calculateTaskStat(key)} % of total tasks
                </p>
              </CardContent>
            </Card>
          </>
        ))}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Members
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {currentProject?.memberCount}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Active team members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Info & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Project Name
              </label>
              <p className="text-lg font-semibold">{currentProject?.project?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Project Slug
              </label>
              <Badge variant="outline" className="ml-2">
                {currentProject?.project?.slug}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Created
              </label>
              <p className="text-sm">
                {currentProject?.project?.createdAt
                  ? new Date(currentProject?.project?.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Last Updated
              </label>
              <p className="text-sm">
                {currentProject?.project?.updatedAt
                  ? new Date(currentProject?.project?.updatedAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link href={`/projects/${projectSlug}/board`}>
                <FolderOpen className="w-4 h-4 mr-2" />
                View Board
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={`/projects/${projectSlug}/members`}>
                <Users className="w-4 h-4 mr-2" />
                View Members
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={`/projects/${projectSlug}/analytics`}>
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
