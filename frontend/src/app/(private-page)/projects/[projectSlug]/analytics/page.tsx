"use client";

import { useEffect, useState } from "react";
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
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  ListTodo,
  Users,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";

interface TaskStats {
  todo: number;
  inProgress: number;
  done: number;
}

interface ActivityData {
  date: string;
  tasksCreated: number;
  tasksCompleted: number;
}

interface MemberActivity {
  name: string;
  tasksCompleted: number;
  tasksAssigned: number;
}

// Mock data generators
const generateActivityData = (): ActivityData[] => {
  const data: ActivityData[] = [];
  const now = new Date();
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      tasksCreated: Math.floor(Math.random() * 10) + 1,
      tasksCompleted: Math.floor(Math.random() * 8) + 1,
    });
  }
  
  return data;
};

const generateMemberActivity = (): MemberActivity[] => [
  { name: "John D.", tasksCompleted: 15, tasksAssigned: 18 },
  { name: "Jane S.", tasksCompleted: 12, tasksAssigned: 14 },
  { name: "Bob J.", tasksCompleted: 8, tasksAssigned: 10 },
  { name: "Alice B.", tasksCompleted: 10, tasksAssigned: 12 },
  { name: "Charlie W.", tasksCompleted: 6, tasksAssigned: 8 },
];

const chartConfig: ChartConfig = {
  tasksCreated: {
    label: "Created",
    color: "var(--chart-1)",
  },
  tasksCompleted: {
    label: "Completed",
    color: "var(--chart-2)",
  },
  todo: {
    label: "To Do",
    color: "var(--chart-3)",
  },
  inProgress: {
    label: "In Progress",
    color: "var(--chart-1)",
  },
  done: {
    label: "Done",
    color: "var(--chart-2)",
  },
};

const COLORS = ["var(--chart-3)", "var(--chart-1)", "var(--chart-2)"];

export default function AnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const projectSlug = params.projectSlug as string;

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("14d");
  const [taskStats, setTaskStats] = useState<TaskStats>({ todo: 0, inProgress: 0, done: 0 });
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [memberActivity, setMemberActivity] = useState<MemberActivity[]>([]);
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProjectName("Sample Project");
      setTaskStats({
        todo: 12,
        inProgress: 5,
        done: 23,
      });
      setActivityData(generateActivityData());
      setMemberActivity(generateMemberActivity());
      setLoading(false);
    };

    fetchData();
  }, [projectSlug, timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-lg font-medium text-muted-foreground">Loading analytics...</h2>
        </div>
      </div>
    );
  }

  const totalTasks = taskStats.todo + taskStats.inProgress + taskStats.done;
  const completionRate = totalTasks > 0 ? Math.round((taskStats.done / totalTasks) * 100) : 0;
  
  const pieData = [
    { name: "To Do", value: taskStats.todo, fill: COLORS[0] },
    { name: "In Progress", value: taskStats.inProgress, fill: COLORS[1] },
    { name: "Done", value: taskStats.done, fill: COLORS[2] },
  ];

  const totalCreated = activityData.reduce((acc, d) => acc + d.tasksCreated, 0);
  const totalCompleted = activityData.reduce((acc, d) => acc + d.tasksCompleted, 0);
  const avgDailyCompletion = (totalCompleted / activityData.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Project Analytics</h1>
          </div>
          <p className="text-muted-foreground ml-10">
            Insights and metrics for {projectName}
          </p>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="14d">Last 14 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <p className="text-3xl font-bold text-foreground">{totalTasks}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                <Activity className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600 font-medium">+{totalCreated}</span>
              <span className="text-muted-foreground">created this period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-3xl font-bold text-foreground">{completionRate}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {taskStats.done} of {totalTasks} tasks completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Daily Completion</p>
                <p className="text-3xl font-bold text-foreground">{avgDailyCompletion}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Tasks completed per day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                <p className="text-3xl font-bold text-foreground">{memberActivity.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Contributing to the project
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Task Activity</CardTitle>
            <CardDescription>Tasks created vs completed over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="tasksCreated"
                  stackId="1"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.4}
                  name="Created"
                />
                <Area
                  type="monotone"
                  dataKey="tasksCompleted"
                  stackId="2"
                  stroke="var(--chart-2)"
                  fill="var(--chart-2)"
                  fillOpacity={0.4}
                  name="Completed"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Task Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
            <CardDescription>Current status breakdown of all tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Member Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Member Performance</CardTitle>
          <CardDescription>Tasks assigned vs completed by team members</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={memberActivity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="tasksAssigned"
                fill="var(--chart-3)"
                radius={[0, 4, 4, 0]}
                name="Assigned"
              />
              <Bar
                dataKey="tasksCompleted"
                fill="var(--chart-2)"
                radius={[0, 4, 4, 0]}
                name="Completed"
              />
            </BarChart>
          </ChartContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--chart-3)" }} />
              <span className="text-sm text-muted-foreground">Assigned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--chart-2)" }} />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ListTodo className="h-4 w-4 text-muted-foreground" />
              To Do
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{taskStats.todo}</p>
            <p className="text-xs text-muted-foreground">
              {totalTasks > 0 ? Math.round((taskStats.todo / totalTasks) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{taskStats.inProgress}</p>
            <p className="text-xs text-muted-foreground">
              {totalTasks > 0 ? Math.round((taskStats.inProgress / totalTasks) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{taskStats.done}</p>
            <p className="text-xs text-muted-foreground">
              {totalTasks > 0 ? Math.round((taskStats.done / totalTasks) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
