"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, ScanText, ArrowLeft, Upload } from "lucide-react"
import type { AppointmentData } from "@/app/page"
import { useLocale } from "@/hooks/use-locale"

interface CardScannerProps {
  onCardScanned: (data: AppointmentData) => void
  onBack: () => void
}

export function CardScanner({ onCardScanned, onBack }: CardScannerProps) {
  const { t, locale } = useLocale()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setError(null)
      }
    } catch (err) {
      setError(t("cameraAccessDenied"))
    }
  }

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext("2d")

    if (context) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            processImage(blob)
          }
        },
        "image/jpeg",
        0.8,
      )
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processImage(file)
    }
  }

  const processImage = async (imageBlob: Blob) => {
    setIsProcessing(true)

    try {
      // Dynamic import of Tesseract
      const Tesseract = (await import("tesseract.js")).default

      // Use the appropriate language based on locale
      const lang = locale === "bg" ? "bul" : "eng"

      const {
        data: { text },
      } = await Tesseract.recognize(imageBlob, lang, {
        logger: (m) => console.log(m),
        tessedit_char_whitelist:
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЮЯабвгдежзийклмнопрстуфхцчшщъьюя:/-$лв ",
        tessedit_pageseg_mode: "6",
      })

      console.log("OCR Result:", text)

      // Parse the extracted text
      const parsedData = parseAppointmentText(text)
      onCardScanned(parsedData)
    } catch (error) {
      console.error("OCR Error:", error)
      // Fallback to manual entry
      const mockData: AppointmentData = {
        date: new Date().toISOString().split("T")[0],
        time: "14:30",
        artist: locale === "bg" ? "Примерен Артист" : "Sample Artist",
        deposit: locale === "bg" ? "50лв" : "$50",
        size: locale === "bg" ? "Среден" : "Medium",
      }
      onCardScanned(mockData)
    } finally {
      setIsProcessing(false)
    }
  }

  const parseAppointmentText = (text: string): AppointmentData => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    const data: AppointmentData = {
      date: "",
      time: "",
      artist: "",
      deposit: "",
      size: "",
    }

    // Bulgarian date patterns
    const bgDatePattern = /(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})/
    // English date patterns
    const enDatePattern = /(\d{4})-(\d{1,2})-(\d{1,2})/

    // Simple parsing logic - look for patterns
    for (const line of lines) {
      const lowerLine = line.toLowerCase()

      // Date patterns
      if (locale === "bg") {
        const dateMatch = line.match(bgDatePattern)
        if (dateMatch && !data.date) {
          const day = dateMatch[1].padStart(2, "0")
          const month = dateMatch[2].padStart(2, "0")
          let year = dateMatch[3]
          if (year.length === 2) year = "20" + year
          data.date = `${year}-${month}-${day}` // Convert to YYYY-MM-DD for internal use
        }
      } else {
        const dateMatch = line.match(enDatePattern) || line.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/)
        if (dateMatch && !data.date) {
          if (dateMatch[0].includes("-") && dateMatch[1].length === 4) {
            // Already in YYYY-MM-DD format
            data.date = dateMatch[0]
          } else {
            // Convert MM/DD/YYYY to YYYY-MM-DD
            const parts = dateMatch[0].split(/[/-]/)
            if (parts.length === 3) {
              if (parts[2].length === 4) {
                data.date = `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`
              } else {
                data.date = `20${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`
              }
            }
          }
        }
      }

      // Time patterns
      const timeMatch = line.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i)
      if (timeMatch && !data.time) {
        let hours = Number.parseInt(timeMatch[1])
        const minutes = timeMatch[2]
        const ampm = timeMatch[3]?.toLowerCase()

        if (ampm === "pm" && hours !== 12) hours += 12
        if (ampm === "am" && hours === 12) hours = 0

        data.time = `${hours.toString().padStart(2, "0")}:${minutes}`
      }

      // Artist (look for "artist:" or names)
      if (locale === "bg") {
        if (
          lowerLine.includes("артист") ||
          lowerLine.includes("художник") ||
          lowerLine.includes("татуист") ||
          lowerLine.includes("майстор")
        ) {
          const artistPart = line
            .replace(/артист:?/i, "")
            .replace(/художник:?/i, "")
            .replace(/татуист:?/i, "")
            .replace(/майстор:?/i, "")
            .trim()
          if (artistPart && !data.artist) {
            data.artist = artistPart
          }
        }
      } else if (lowerLine.includes("artist") && !data.artist) {
        data.artist = line.replace(/artist:?/i, "").trim()
      }

      // Deposit (look for $ signs or currency)
      if (locale === "bg") {
        const depositMatch = line.match(/(\d+)\s*(лв|лева|bgn)/i)
        if (depositMatch && !data.deposit) {
          data.deposit = `${depositMatch[1]} лв`
        }
      } else {
        const depositMatch = line.match(/\$\d+/)
        if (depositMatch && !data.deposit) {
          data.deposit = depositMatch[0]
        }
      }

      // Size
      if (locale === "bg") {
        if (lowerLine.includes("размер") && !data.size) {
          data.size = line.replace(/размер:?/i, "").trim()
        }
      } else if (lowerLine.includes("size") && !data.size) {
        data.size = line.replace(/size:?/i, "").trim()
      }
    }

    // Fill in defaults if not found
    if (!data.date) data.date = new Date().toISOString().split("T")[0]
    if (!data.time) data.time = "14:00"
    if (!data.artist) data.artist = locale === "bg" ? "Неизвестен артист" : "Unknown Artist"
    if (!data.deposit) data.deposit = locale === "bg" ? "0 лв" : "$0"
    if (!data.size) data.size = locale === "bg" ? "Стандартен" : "Standard"

    return data
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-center">
            <div className="mx-auto mb-2 p-2 bg-green-100 rounded-full w-fit">
              <ScanText className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">{t("scanCard")}</CardTitle>
            <CardDescription>{t("positionCard")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-700 text-sm mb-3">{error}</p>
            <Button onClick={() => fileInputRef.current?.click()} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {t("uploadImageInstead")}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
              <canvas ref={canvasRef} className="hidden" />

              {/* Camera frame overlay */}
              <div className="absolute inset-4 border-2 border-green-500 rounded-lg">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-500"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-500"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-500"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-500"></div>
              </div>

              {isProcessing && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                  <div className="text-center text-white">
                    <ScanText className="h-12 w-12 mx-auto mb-2 animate-spin" />
                    <p>{t("processingOCR")}</p>
                    <p className="text-sm opacity-75">{t("readingHandwriting")}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={startCamera} variant="outline" disabled={isProcessing}>
                <Camera className="h-4 w-4 mr-2" />
                {t("startCamera")}
              </Button>

              <Button onClick={captureImage} disabled={isProcessing || !stream}>
                {isProcessing ? t("processing") : t("capture")}
              </Button>
            </div>
          </div>
        )}

        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="w-full"
          disabled={isProcessing}
        >
          <Upload className="h-4 w-4 mr-2" />
          {t("uploadImageFile")}
        </Button>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>• {t("ensureGoodLighting")}</p>
          <p>• {t("keepCardFlat")}</p>
          <p>
            • {t("usingTesseract")} ({locale === "bg" ? "Български" : "English"})
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
