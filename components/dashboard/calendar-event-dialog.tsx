"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Target, Briefcase, CheckCircle2, Clock } from "lucide-react"
import { format } from "date-fns"

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  type: 'goal' | 'interview' | 'important'
  description?: string
  completed?: boolean
}

interface CalendarEventDialogProps {
  event?: CalendarEvent
  open?: boolean
  onClose?: () => void
  children?: React.ReactNode
}

export function CalendarEventDialog({ event, open, onClose, children }: CalendarEventDialogProps) {
  if (!event && !children) return null

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'goal':
        return <Target className="h-5 w-5 text-yellow-400" />
      case 'interview':
        return <Briefcase className="h-5 w-5 text-blue-400" />
      default:
        return <Calendar className="h-5 w-5 text-purple-400" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'goal':
        return 'border-yellow-500 bg-yellow-500/10'
      case 'interview':
        return 'border-blue-500 bg-blue-500/10'
      default:
        return 'border-purple-500 bg-purple-500/10'
    }
  }

  if (children) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="bg-card border-2 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          <DialogHeader>
            <DialogTitle className="text-white">Add Calendar Event</DialogTitle>
          </DialogHeader>
          <div className="text-gray-400 text-center py-8">
            Coming soon: Add custom interviews and important dates
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`bg-card border-2 ${getEventColor(event!.type)} shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            {getEventIcon(event!.type)}
            {event!.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Event Type Badge */}
          <div>
            <Badge className={`${getEventColor(event!.type)} border-2 text-white`}>
              {event!.type.toUpperCase()}
            </Badge>
          </div>

          {/* Date/Time */}
          <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border-2 border-white/20">
            <Clock className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-gray-400">Due Date</p>
              <p className="text-white font-semibold">
                {format(new Date(event!.start), 'MMMM dd, yyyy')}
              </p>
              <p className="text-xs text-gray-500">
                {format(new Date(event!.start), 'EEEE, h:mm a')}
              </p>
            </div>
          </div>

          {/* Description */}
          {event!.description && (
            <div className="p-3 bg-black/30 rounded-lg border-2 border-white/20">
              <p className="text-sm text-gray-400 mb-2">Details</p>
              <p className="text-white">{event!.description}</p>
            </div>
          )}

          {/* Status */}
          {event!.type === 'goal' && (
            <div className="flex items-center gap-2 p-3 bg-black/30 rounded-lg border-2 border-white/20">
              {event!.completed ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Completed</span>
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">In Progress</span>
                </>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white border-2 border-purple-600"
              onClick={onClose}
            >
              View Details
            </Button>
            <Button 
              variant="outline"
              className="flex-1 border-2 border-white/20 bg-black text-white hover:bg-white/5"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}