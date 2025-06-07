"use client"

import { useState, useEffect } from "react"
import { QRScanner } from "@/components/qr-scanner"
import { CardScanner } from "@/components/card-scanner"
import { EventConfirmation } from "@/components/event-confirmation"
import { CalendarSuccess } from "@/components/calendar-success"
import { CardTemplate } from "@/components/card-template"
import { CardDesigner } from "@/components/card-designer"
import { LanguageSelector } from "@/components/language-selector"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLocale } from "@/hooks/use-locale"
import { ThemeProvider } from "@/components/theme-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Palette, FileText, Scan } from "lucide-react"

export type AppointmentData = {
  date: string
  time: string
  artist: string
  deposit: string
  size: string
}

export type CalendarEvent = AppointmentData & {
  title: string
  description: string
  startDateTime: string
  duration: number
}

export type AppStep = "home" | "qr" | "scan" | "confirm" | "success" | "template" | "designer"

function CardTimeContent() {
  const [currentStep, setCurrentStep] = useState<AppStep>("home")
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null)
  const [calendarEvent, setCalendarEvent] = useState<CalendarEvent | null>(null)
  const { locale, t, setLocale } = useLocale()

  // Detect user location and set language accordingly
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Try to get user's position
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords

              // Use reverse geocoding to detect country
              try {
                const response = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
                )
                const data = await response.json()

                // If user is in Bulgaria, set Bulgarian language
                if (data.countryCode === "BG") {
                  setLocale("bg")
                } else {
                  setLocale("en")
                }
              } catch (error) {
                console.log("Geocoding failed, using browser language")
                // Fallback to browser language detection
                const browserLang = navigator.language.toLowerCase()
                if (browserLang.startsWith("bg")) {
                  setLocale("bg")
                } else {
                  setLocale("en")
                }
              }
            },
            (error) => {
              console.log("Geolocation failed, using browser language")
              // Fallback to browser language detection
              const browserLang = navigator.language.toLowerCase()
              if (browserLang.startsWith("bg")) {
                setLocale("bg")
              } else {
                setLocale("en")
              }
            },
          )
        } else {
          // Geolocation not supported, use browser language
          const browserLang = navigator.language.toLowerCase()
          if (browserLang.startsWith("bg")) {
            setLocale("bg")
          } else {
            setLocale("en")
          }
        }
      } catch (error) {
        // Final fallback to English
        setLocale("en")
      }
    }

    detectLocation()
  }, [setLocale])

  const handleStartScan = () => {
    setCurrentStep("qr")
  }

  const handleQRScanned = (data: string) => {
    // Check if it's a CardTime QR code
    if (data.includes("cardtime") || data.includes("scan") || data.includes(window.location.origin)) {
      setCurrentStep("scan")
    } else {
      alert(t("invalidQRCode"))
    }
  }

  const handleCardScanned = (data: AppointmentData) => {
    setAppointmentData(data)
    setCurrentStep("confirm")
  }

  const handleEventConfirmed = (event: CalendarEvent) => {
    setCalendarEvent(event)
    setCurrentStep("success")
  }

  const handleReset = () => {
    setCurrentStep("home")
    setAppointmentData(null)
    setCalendarEvent(null)
  }

  const handleCreateTemplate = () => {
    setCurrentStep("template")
  }

  const handleDesignCard = () => {
    setCurrentStep("designer")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <QrCode className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">CardTime</h1>
              <p className="text-sm text-muted-foreground">{t("appTagline")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector currentLocale={locale} onChangeLocale={setLocale} />
            <ThemeToggle />
          </div>
        </div>

        {/* Main Content */}
        {currentStep === "home" && (
          <div className="space-y-6">
            {/* Hero Section */}
            <Card className="border-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent shadow-lg">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto">
                    <Scan className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">{t("handwritingRecognition")}</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">{t("handwritingDescription")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Action */}
            <Button
              onClick={handleStartScan}
              size="lg"
              className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-primary to-primary/90"
            >
              <QrCode className="h-6 w-6 mr-3" />
              {t("startScanning")}
            </Button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleCreateTemplate}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 border-2 hover:bg-muted/50 transition-all duration-200"
              >
                <FileText className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">{t("createCards")}</span>
              </Button>
              <Button
                onClick={handleDesignCard}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 border-2 hover:bg-muted/50 transition-all duration-200"
              >
                <Palette className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">{t("designCards")}</span>
              </Button>
            </div>

            {/* Features */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">{t("howItWorks")}</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{t("step1")}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{t("step2")}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{t("step3")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === "qr" && <QRScanner onQRScanned={handleQRScanned} onBack={() => setCurrentStep("home")} />}

        {currentStep === "scan" && (
          <CardScanner onCardScanned={handleCardScanned} onBack={() => setCurrentStep("qr")} />
        )}

        {currentStep === "confirm" && appointmentData && (
          <EventConfirmation
            appointmentData={appointmentData}
            onEventConfirmed={handleEventConfirmed}
            onBack={() => setCurrentStep("scan")}
          />
        )}

        {currentStep === "success" && calendarEvent && (
          <CalendarSuccess calendarEvent={calendarEvent} onReset={handleReset} />
        )}

        {currentStep === "template" && <CardTemplate onBack={() => setCurrentStep("home")} />}

        {currentStep === "designer" && <CardDesigner onBack={() => setCurrentStep("home")} />}
      </div>
    </div>
  )
}

export default function CardTimeApp() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CardTimeContent />
    </ThemeProvider>
  )
}
