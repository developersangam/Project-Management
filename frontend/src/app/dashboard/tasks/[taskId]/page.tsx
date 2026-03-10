'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { fetchTaskById, updateTaskThunk, addComment, deleteComment } from '@/store/task/taskThunk'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, MessageSquare, Paperclip, Edit, Trash2, Send, User } from 'lucide-react'
import { format } from 'date-fns'

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const taskId = params.taskId as string

  const { currentTask, loading } = useAppSelector(state => state.task)
  const { currentOrganization } = useAppSelector(state => state.organization)
  const { user } = useAppSelector(state => state.auth)

  const [isEditing, setIsEditing] = React.useState(false)
  const [editTitle, setEditTitle] = React.useState('')
  const [editDescription, setEditDescription] = React.useState('')
  const [newComment, setNewComment] = React.useState('')

  React.useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskById(taskId))
    }
  }, [taskId, dispatch])

  React.useEffect(() => {
    if (currentTask) {
      setEditTitle(currentTask.title)
      setEditDescription(currentTask.description || '')
    }
  }, [currentTask])

  const handleUpdateTask = async () => {
    if (!currentTask) return

    await dispatch(updateTaskThunk({
      ...currentTask,
      title: editTitle,
      description: editDescription,
    }))
    setIsEditing(false)
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentTask) return

    await dispatch(addComment({
      taskId: currentTask.id,
      content: newComment,
      authorId: user?.id || '1',
    }))
    setNewComment('')
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!currentTask) return
    await dispatch(deleteComment({ taskId: currentTask.id, commentId }))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading || !currentTask) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          ← Back to Board
        </Button>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-2xl font-bold border-none p-0 h-auto focus:ring-0"
                onBlur={handleUpdateTask}
                onKeyPress={(e) => e.key === 'Enter' && handleUpdateTask()}
              />
            ) : (
              <h1 className="text-3xl font-bold text-foreground cursor-pointer hover:text-muted-foreground"
                  onClick={() => setIsEditing(true)}>
                {currentTask.title}
              </h1>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getPriorityColor(currentTask.priority)}>
              {currentTask.priority}
            </Badge>
            <Select
              value={currentTask.status}
              onValueChange={(value: 'todo' | 'in-progress' | 'done') =>
                dispatch(updateTaskThunk({ ...currentTask, status: value }))
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="w-5 h-5" />
                <span>Description</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Add a description..."
                  rows={4}
                  className="border-none p-0 focus:ring-0 resize-none"
                  onBlur={handleUpdateTask}
                />
              ) : (
                <div
                  className="cursor-pointer hover:bg-muted/50 p-2 rounded min-h-20"
                  onClick={() => setIsEditing(true)}
                >
                  {editDescription || (
                    <span className="text-muted-foreground">Add a description...</span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Paperclip className="w-5 h-5" />
                <span>Attachments</span>
                <Badge variant="secondary">{currentTask.attachments || 0}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Paperclip className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No attachments yet</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Add Attachment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Comments</span>
                <Badge variant="secondary">{currentTask.comments?.length || 0}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Comment */}
              <div className="flex space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={2}
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              {currentTask.comments && currentTask.comments.length > 0 ? (
                <div className="space-y-4">
                  {/* Mock comments - in real app, this would come from API */}
                  <div className="flex space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">John Doe</span>
                        <span className="text-xs text-muted-foreground">2 hours ago</span>
                      </div>
                      <p className="text-sm">This task looks good to go!</p>
                    </div>
                    {user?.id === 'mock-user-id' && (
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No comments yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Task Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Assignee</label>
                <div className="flex items-center space-x-2 mt-1">
                  {currentTask.assignee ? (
                    <>
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {currentTask.assignee.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{currentTask.assignee.name}</span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unassigned</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {currentTask.dueDate
                      ? format(new Date(currentTask.dueDate), 'PPP')
                      : 'No due date'
                    }
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Priority</label>
                <div className="mt-1">
                  <Badge className={getPriorityColor(currentTask.priority)}>
                    {currentTask.priority}
                  </Badge>
                </div>
              </div>

              {currentTask.labels && currentTask.labels.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Labels</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentTask.labels.map((label, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}