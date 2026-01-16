"use client"

import { useState, useMemo } from "react"
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import enUS from "date-fns/locale/en-US"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar as CalendarIcon, 
  Target, 
  Briefcase, 
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react"
import type { Goal } from "@/types"
import { CalendarEventDialog } from "./calendar-event-dialog"
import { AddInterviewDialog } from "./add-interview-dialog"
import { AddImportantDateDialog } from "./add-important-date-dialog"

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface CalendarEvent extends Event {
  id: string
  title: string
  start: Date
  end: Date
  type: 'goal' | 'interview' | 'important'
  description?: string
  status?: string
  completed?: boolean
}

interface CalendarViewProps {
  goals: Goal[]
  interviews?: Array<{
    id: string
    company: string
    date: Date
    type: string
    notes?: string
  }>
}

export function CalendarView({ goals, interviews = [] }: CalendarViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddInterviewOpen, setIsAddInterviewOpen] = useState(false)
  const [isAddImportantDateOpen, setIsAddImportantDateOpen] = useState(false)
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')

  const events: CalendarEvent[] = useMemo(() => {
    const goalEvents: CalendarEvent[] = goals.map(goal => ({
      id: goal.id,
      title: goal.title,
      start: new Date(goal.targetDate),
      end: new Date(goal.targetDate),
      type: 'goal' as const,
      description: goal.description || undefined,
      completed: goal.completed,
    }))

    const interviewEvents: CalendarEvent[] = interviews.map(interview => ({
      id: interview.id,
      title: `${interview.company} - ${interview.type}`,
      start: new Date(interview.date),
      end: new Date(interview.date),
      type: 'interview' as const,
      description: interview.notes,
    }))

    return [...goalEvents, ...interviewEvents]
  }, [goals, interviews])

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsDialogOpen(true)
  }

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#8b5cf6'
    let borderColor = '#7c3aed'
    
    if (event.type === 'goal') {
      backgroundColor = event.completed ? '#22c55e' : '#eab308'
      borderColor = event.completed ? '#16a34a' : '#ca8a04'
    } else if (event.type === 'interview') {
      backgroundColor = '#3b82f6'
      borderColor = '#2563eb'
    } else if (event.type === 'important') {
      backgroundColor = '#ef4444'
      borderColor = '#dc2626'
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderRadius: '6px',
        color: 'white',
        fontWeight: '600',
        fontSize: '0.875rem',
        padding: '4px 8px',
        boxShadow: '2px 2px 0px rgba(0,0,0,0.3)',
      }
    }
  }

  const upcomingEvents = events
    .filter(e => new Date(e.start) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5)

  const todayEvents = events.filter(e => {
    const today = new Date()
    const eventDate = new Date(e.start)
    return eventDate.toDateString() === today.toDateString()
  })

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Calendar Main View */}
      <Card className="lg:col-span-2 bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-2 border-white/20 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <CalendarIcon className="h-5 w-5 text-purple-400" />
            Preparation Calendar
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView('month')}
              className={`border-2 ${
                view === 'month' 
                  ? 'bg-purple-500 text-white border-purple-500' 
                  : 'bg-black text-white border-white/20'
              }`}
            >
              Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView('week')}
              className={`border-2 ${
                view === 'week' 
                  ? 'bg-purple-500 text-white border-purple-500' 
                  : 'bg-black text-white border-white/20'
              }`}
            >
              Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView('day')}
              className={`border-2 ${
                view === 'day' 
                  ? 'bg-purple-500 text-white border-purple-500' 
                  : 'bg-black text-white border-white/20'
              }`}
            >
              Day
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] bg-black/30 rounded-lg p-4 border-2 border-white/10">
            <style jsx global>{`
              .rbc-calendar {
                font-family: inherit;
                color: white;
              }
              .rbc-header {
                padding: 10px 3px;
                font-weight: 700;
                font-size: 0.875rem;
                color: #a855f7;
                border-bottom: 2px solid rgba(168, 85, 247, 0.3);
              }
              .rbc-today {
                background-color: rgba(168, 85, 247, 0.1);
              }
              .rbc-off-range-bg {
                background-color: rgba(0, 0, 0, 0.3);
              }
              .rbc-date-cell {
                padding: 8px;
                text-align: right;
                color: #d1d5db;
              }
              .rbc-now .rbc-button-link {
                color: #a855f7;
                font-weight: 700;
              }
              .rbc-month-view {
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                overflow: hidden;
              }
              .rbc-day-bg {
                border-left: 1px solid rgba(255, 255, 255, 0.1);
              }
              .rbc-month-row {
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                min-height: 80px;
              }
              .rbc-event {
                padding: 2px 5px;
                cursor: pointer;
              }
              .rbc-toolbar {
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                border: 2px solid rgba(255, 255, 255, 0.1);
              }
              .rbc-toolbar button {
                color: white;
                background: rgba(168, 85, 247, 0.2);
                border: 2px solid rgba(168, 85, 247, 0.5);
                padding: 6px 12px;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
              }
              .rbc-toolbar button:hover {
                background: rgba(168, 85, 247, 0.4);
                border-color: #a855f7;
              }
              .rbc-toolbar button.rbc-active {
                background: #a855f7;
                border-color: #a855f7;
                box-shadow: 2px 2px 0px rgba(168, 85, 247, 0.5);
              }
              .rbc-toolbar-label {
                font-size: 1.25rem;
                font-weight: 700;
                color: white;
              }
              .rbc-time-view {
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
              }
              .rbc-time-header-content {
                border-left: 2px solid rgba(255, 255, 255, 0.1);
              }
              .rbc-time-content {
                border-top: 2px solid rgba(255, 255, 255, 0.1);
              }
              .rbc-timeslot-group {
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
              }
              .rbc-day-slot .rbc-time-slot {
                border-top: 1px solid rgba(255, 255, 255, 0.05);
              }
            `}</style>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              style={{ height: '100%' }}
            />
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 p-4 bg-black/30 rounded-lg border-2 border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-yellow-500 border-2 border-yellow-600"></div>
              <span className="text-sm text-gray-300">Goals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-green-500 border-2 border-green-600"></div>
              <span className="text-sm text-gray-300">Completed Goals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-blue-500 border-2 border-blue-600"></div>
              <span className="text-sm text-gray-300">Interviews</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-red-500 border-2 border-red-600"></div>
              <span className="text-sm text-gray-300">Important Dates</span>
            </div>
          </div>
          </CardContent>
        </Card>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Today's Events */}
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/5 border-2 border-orange-500/50 shadow-[4px_4px_0px_0px_rgba(249,115,22,0.3)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5 text-orange-400" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayEvents.length > 0 ? (
              todayEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 bg-black/30 border-2 border-orange-500/30 rounded-lg hover:border-orange-500/50 transition-all cursor-pointer"
                  onClick={() => handleSelectEvent(event)}
                >
                  <div className="flex items-start gap-2">
                    {event.type === 'goal' ? (
                      <Target className="h-4 w-4 text-yellow-400 mt-1" />
                    ) : (
                      <Briefcase className="h-4 w-4 text-blue-400 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{event.title}</p>
                      {event.description && (
                        <p className="text-xs text-gray-400 mt-1">{event.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Clock className="h-10 w-10 text-orange-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No events today</p>
                <p className="text-xs text-gray-500 mt-1">Take a break or plan ahead!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/5 border-2 border-blue-500/50 shadow-[4px_4px_0px_0px_rgba(59,130,246,0.3)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CalendarIcon className="h-5 w-5 text-blue-400" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => {
                const daysUntil = Math.ceil(
                  (new Date(event.start).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                )
                
                return (
                  <div
                    key={event.id}
                    className="p-3 bg-black/30 border-2 border-blue-500/30 rounded-lg hover:border-blue-500/50 transition-all cursor-pointer"
                    onClick={() => handleSelectEvent(event)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        {event.type === 'goal' ? (
                          <Target className="h-4 w-4 text-yellow-400 mt-1" />
                        ) : (
                          <Briefcase className="h-4 w-4 text-blue-400 mt-1" />
                        )}
                        <div>
                          <p className="text-white font-medium text-sm">{event.title}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {format(new Date(event.start), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        className={`text-xs ${
                          daysUntil <= 3 
                            ? 'bg-red-500/20 text-red-400 border-red-500' 
                            : daysUntil <= 7 
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
                            : 'bg-blue-500/20 text-blue-400 border-blue-500'
                        } border-2`}
                      >
                        {daysUntil}d
                      </Badge>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-6">
                <CalendarIcon className="h-10 w-10 text-blue-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No upcoming events</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Add */}
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-2 border-green-500/50 shadow-[4px_4px_0px_0px_rgba(34,197,94,0.3)]">
          <CardContent className="p-6 space-y-3">
            <Button 
              onClick={() => setIsAddInterviewOpen(true)}
              className="w-full bg-green-500 hover:bg-green-600 text-white border-2 border-green-600 shadow-[4px_4px_0px_0px_rgba(34,197,94,0.5)]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Interview
            </Button>
            <Button 
              onClick={() => setIsAddImportantDateOpen(true)}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white border-2 border-purple-600 shadow-[4px_4px_0px_0px_rgba(168,85,247,0.5)]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Important Date
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <CalendarEventDialog
          event={selectedEvent}
          open={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false)
            setSelectedEvent(null)
          }}
        />
      )}

      {/* Add Interview Dialog */}
      <AddInterviewDialog
        open={isAddInterviewOpen}
        onClose={() => setIsAddInterviewOpen(false)}
      />

      {/* Add Important Date Dialog */}
      <AddImportantDateDialog
        open={isAddImportantDateOpen}
        onClose={() => setIsAddImportantDateOpen(false)}
      />
    </div>
  )
}