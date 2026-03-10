import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./button"

export type CalendarProps = {
  mode?: "single" | "multiple" | "range"
  selected?: Date | Date[]
  onSelect?: (date: Date | Date[] | undefined) => void
  disabled?: (date: Date) => boolean
  className?: string
  initialFocus?: boolean
}

const Calendar: React.FC<CalendarProps> = ({
  mode = "single",
  selected,
  onSelect,
  disabled,
  className,
  initialFocus = false,
  ...props
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const handleDateClick = (date: Date) => {
    if (disabled?.(date)) return
    onSelect?.(date)
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const isSelected = (date: Date) => {
    if (!selected) return false
    if (mode === "single") {
      return selected instanceof Date && date.toDateString() === selected.toDateString()
    }
    return false
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isDisabled = (date: Date) => {
    return disabled?.(date) || false
  }

  return (
    <div className={cn("p-3 bg-card border rounded-md w-fit", className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevMonth}
          className="h-7 w-7 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-sm font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextMonth}
          className="h-7 w-7 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the first day of the month */}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="p-1" />
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
          const isSelectedDate = isSelected(date)
          const isTodayDate = isToday(date)
          const isDisabledDate = isDisabled(date)

          return (
            <Button
              key={i}
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 font-normal",
                isSelectedDate && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                isTodayDate && !isSelectedDate && "bg-accent text-accent-foreground",
                isDisabledDate && "text-muted-foreground opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleDateClick(date)}
              disabled={isDisabledDate}
            >
              {i + 1}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export { Calendar }