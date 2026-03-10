'use client'

import * as React from 'react'
import { useAppSelector } from '@/hooks/redux'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '../../../components/ui/progress'
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Target
} from 'lucide-react'

// Mock data - in a real app, this would come from your analytics API
const mockAnalytics = {
  overview: {
    totalTasks: 156,
    completedTasks: 89,
    inProgressTasks: 34,
    overdueTasks: 12,
    totalProjects: 8,
    activeProjects: 5,
    teamMembers: 12,
    avgCompletionTime: 3.2,
  },
  taskStatus: [
    { status: 'Completed', count: 89, percentage: 57, color: 'bg-green-500' },
    { status: 'In Progress', count: 34, percentage: 22, color: 'bg-blue-500' },
    { status: 'To Do', count: 33, percentage: 21, color: 'bg-gray-500' },
  ],
  priorityDistribution: [
    { priority: 'High', count: 23, percentage: 15, color: 'bg-red-500' },
    { priority: 'Medium', count: 67, percentage: 43, color: 'bg-yellow-500' },
    { priority: 'Low', count: 66, percentage: 42, color: 'bg-green-500' },
  ],
  weeklyProgress: [
    { day: 'Mon', completed: 12, created: 8 },
    { day: 'Tue', completed: 15, created: 10 },
    { day: 'Wed', completed: 8, created: 12 },
    { day: 'Thu', completed: 18, created: 6 },
    { day: 'Fri', completed: 22, created: 9 },
    { day: 'Sat', completed: 7, created: 4 },
    { day: 'Sun', completed: 7, created: 3 },
  ],
  teamPerformance: [
    { name: 'Alice Johnson', tasksCompleted: 24, avgTime: 2.1 },
    { name: 'Bob Smith', tasksCompleted: 19, avgTime: 2.8 },
    { name: 'Carol Davis', tasksCompleted: 16, avgTime: 3.2 },
    { name: 'David Wilson', tasksCompleted: 14, avgTime: 2.9 },
    { name: 'Eva Brown', tasksCompleted: 12, avgTime: 3.5 },
  ],
}

export default function AnalyticsPage() {
  const { currentOrganization } = useAppSelector(state => state.organization)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track your team's performance and project progress
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <p className="text-3xl font-bold">{mockAnalytics.overview.totalTasks}</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-600">{mockAnalytics.overview.completedTasks}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{mockAnalytics.overview.inProgressTasks}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-3xl font-bold text-red-600">{mockAnalytics.overview.overdueTasks}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockAnalytics.taskStatus.map((item) => (
              <div key={item.status} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.status}</span>
                  <span className="text-muted-foreground">{item.count} ({item.percentage}%)</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockAnalytics.priorityDistribution.map((item) => (
              <div key={item.priority} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.priority}</span>
                  <span className="text-muted-foreground">{item.count} ({item.percentage}%)</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-2">
            {mockAnalytics.weeklyProgress.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center space-y-2">
                <div className="w-full flex flex-col items-center space-y-1">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${(day.completed / 25) * 100}%` }}
                  ></div>
                  <div
                    className="w-full bg-green-500 rounded-t"
                    style={{ height: `${(day.created / 25) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium">{day.day}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm">Created</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalytics.teamPerformance.map((member, index) => (
              <div key={member.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.tasksCompleted} tasks completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{member.avgTime}d avg</p>
                  <Badge variant={index < 2 ? "default" : "secondary"}>
                    {index === 0 ? "Top Performer" : index === 1 ? "High Performer" : "Good"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}