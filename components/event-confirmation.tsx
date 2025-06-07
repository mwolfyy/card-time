"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, DollarSign, Ruler, CheckCircle, ArrowLeft } from "lucide-react"
import type { AppointmentData, CalendarEvent } from "@/app/page"
import { useLocale } from "@/hooks/use-locale"

interface EventConfirmationProps {
  appointmentData: AppointmentData
  onEventConfirmed: (event: CalendarEvent) => void
  onBack: () => void
}

export function EventConfirmation({ appointmentData, onEventConfirmed, onBack }: EventConfirmationProps) {
  const { t, locale, formatDate, parseDate } = useLocale()
  const [formData, setFormData] = useState({
    date: appointmentData.date,
    time: appointmentData.time,
    artist: appointmentData.artist,
    deposit: appointmentData.deposit,
    size: appointmentData.size,
    duration: "60",
  })

  const [displayDate, setDisplayDate] = useState("")

  useEffect(() => {
    // Format the date for display based on locale
    setDisplayDate(formatDate(formData.date))
  }, [formData.date, locale, formatDate])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    setFormData((prev) => ({ ...prev, date: newDate }))
    setDisplayDate(formatDate(newDate))
  }

  const handleSubmit = () => {
    // Get timezone offset in minutes
    const now = new Date()
    const timezoneOffsetMinutes = now.getTimezoneOffset()

    // Create ISO date string with timezone info
    const dateTimeStr = `${formData.date}T${formData.time}:00`
    const dateObj = new Date(dateTimeStr)

    // Adjust for timezone if needed
    const adjustedDate = new Date(dateObj.getTime() - timezoneOffsetMinutes * 60000)

    const event: CalendarEvent = {
      ...formData,
      title: `${t("appointmentWith")} ${formData.artist}`,
      description: `${t("size")}: ${formData.size}\n${t("deposit")}: ${formData.deposit}\n\nCreated with CardTime`,
      startDateTime: adjustedDate.toISOString(),
      duration: Number.parseInt(formData.duration),
    }

    onEventConfirmed(event)
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getDurationLabel = (minutes: string) => {
    const mins = Number.parseInt(minutes)
    if (locale === "bg") {
      if (mins < 60) return `${mins} ${t("minutes")}`
      if (mins === 60) return `1 ${t("hour")}`
      if (mins % 60 === 0) return `${mins / 60} ${t("hours")}`
      return `${Math.floor(mins / 60)} ${t("hours")} ${mins % 60} ${t("minutes")}`
    } else {
      if (mins < 60) return `${mins} minutes`
      if (mins === 60) return `1 hour`
      if (mins % 60 === 0) return `${mins / 60} hours`
      return `${Math.floor(mins / 60)}h ${mins % 60}m`
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-center">
            <div className="mx-auto mb-2 p-2 bg-blue-100 rounded-full w-fit">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">{t("confirmDetails")}</CardTitle>
            <CardDescription>{t("reviewDetails")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t("date")}
            </Label>
            <Input id="date" type="date" value={formData.date} onChange={handleDateChange} />
            {locale === "bg" && <div className="text-xs text-gray-500">Format: {displayDate} (DD/MM/YY)</div>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t("time")}
            </Label>
            <Input id="time" type="time" value={formData.time} onChange={(e) => updateField("time", e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="artist" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {t("artist")}
          </Label>
          <Input
            id="artist"
            value={formData.artist}
            onChange={(e) => updateField("artist", e.target.value)}
            placeholder={t("artist")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deposit" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {t("deposit")}
            </Label>
            <Input
              id="deposit"
              value={formData.deposit}
              onChange={(e) => updateField("deposit", e.target.value)}
              placeholder="$0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="size" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              {t("size")}
            </Label>
            <Input
              id="size"
              value={formData.size}
              onChange={(e) => updateField("size", e.target.value)}
              placeholder={t("size")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">{t("duration")}</Label>
          <Select value={formData.duration} onValueChange={(value) => updateField("duration", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">{getDurationLabel("30")}</SelectItem>
              <SelectItem value="60">{getDurationLabel("60")}</SelectItem>
              <SelectItem value="90">{getDurationLabel("90")}</SelectItem>
              <SelectItem value="120">{getDurationLabel("120")}</SelectItem>
              <SelectItem value="180">{getDurationLabel("180")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSubmit} className="w-full" size="lg">
          {t("addToCalendar")}
        </Button>
      </CardContent>
    </Card>
  )
}
