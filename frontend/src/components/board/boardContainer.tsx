import * as React from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Column } from "./column";
import { TaskCard } from "./taskCard";
import { Task, Column as ColumnType } from "../../types";
import { useAppDispatch } from "../../hooks/redux";
import { moveTask } from "../../store/task/taskThunk";

interface BoardContainerProps {
  tasks: Task[];
  columns: ColumnType[];
  projectSlug: string;
  orgSlug: string;
  showCreateTask?: boolean;
  onCreateTaskClose?: () => void;
  onTaskClick?: (task: Task) => void;
}

export const BoardContainer: React.FC<BoardContainerProps> = ({
  tasks,
  columns,
  projectSlug,
  orgSlug,
  showCreateTask = false,
  onCreateTaskClose,
  onTaskClick,
}) => {
  const dispatch = useAppDispatch();
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const getTaskByColumnId = (tasks: Task[], columnId: string) => {
    return tasks.filter((task) => task.columnId === columnId);
  };

  const handleDragStart = (event: DragStartEvent) => {
    console.log("Drag started:", event.active);
    const { active } = event;
    const task = tasks.find((t) => t._id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    console.log("Drag ended:", { activeId, overId });

    const activeTask = tasks.find((t) => t._id === activeId);
    if (!activeTask) return;

    let newColumnId = activeTask.columnId;

    // Check if dropped on a column
    const overColumn = columns.find((c) => c._id === overId);
    if (overColumn) {
      console.log("Dropped on column:", overColumn.name);
      newColumnId = overId;
    } else {
      // Dropped on another task, find its column
      console.log("Dropped on task:", overId);
      const overTask = tasks.find((t) => t._id === overId);
      if (overTask) {
        newColumnId = overTask.columnId;
      }
    }

    if (newColumnId !== activeTask.columnId) {
      dispatch(
        moveTask({
          payload: {
            ...activeTask,
            columnId: newColumnId,
          },
          projectSlug,
          taskId: activeTask._id,
          columnId: newColumnId,
        }),
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex space-x-6 overflow-x-auto pb-6 px-2">
        {tasks && tasks.length > 0 ? (
          columns.map((column) => (
            <Column
              key={column._id}
              id={column._id}
              title={column.name}
              tasks={getTaskByColumnId(tasks, column._id)}
              onTaskClick={onTaskClick || (() => {})}
              projectSlug={projectSlug}
              orgSlug={orgSlug}
            />
          ))
        ) : (
          <div className="text-muted-foreground">No columns available</div>
        )}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} onClick={() => {}} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
