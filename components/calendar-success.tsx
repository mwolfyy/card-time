"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Calendar, Clock, User, RotateCcw, Download } from "lucide-react"
import type { CalendarEvent } from "@/app/page"

interface CalendarSuccessProps {
  calendarEvent: CalendarEvent
  onReset: () => void
}

export function CalendarSuccess({ calendarEvent, onReset }: CalendarSuccessProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const downloadICS = () => {
    const startDate = new Date(calendarEvent.startDateTime)
    const endDate = new Date(startDate.getTime() + calendarEvent.duration * 60000)

    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    }

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CardTime//CardTime App//EN
BEGIN:VEVENT
UID:${Date.now()}@cardtime.app
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${calendarEvent.title}
DESCRIPTION:${calendarEvent.description.replace(/\n/g, "\\n")}
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: "text/calendar" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `appointment-${calendarEvent.date}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-green-700">Event Ready!</CardTitle>
        <CardDescription>Your appointment details have been processed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{calendarEvent.title}</h3>
            <Badge variant="secondary">Ready</Badge>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{formatDate(calendarEvent.startDateTime)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>
                {formatTime(calendarEvent.startDateTime)} ({calendarEvent.duration} minutes)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span>{calendarEvent.artist}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-600 whitespace-pre-line">{calendarEvent.description}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={downloadICS} className="w-full" size="lg">
            <Download className="h-4 w-4 mr-2" />
            Download Calendar File (.ics)
          </Button>

          <Button onClick={onReset} variant="outline" className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Scan Another Card
          </Button>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">How to add to your calendar:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Download the .ics file above</li>
            <li>• Open it with your calendar app</li>
            <li>• The event will be added automatically</li>
            <li>• Works with Google Calendar, Apple Calendar, Outlook</li>
          </ul>
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>CardTime Beta - Making appointment scheduling effortless</p>
        </div>
      </CardContent>
    </Card>
  )
}
