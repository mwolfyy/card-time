"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, ArrowLeft, AlertCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

interface QRScannerProps {
  onQRScanned: (data: string) => void
  onBack: () => void
}

export function QRScanner({ onQRScanned, onBack }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    let qrScanner: any = null

    const initializeScanner = async () => {
      try {
        // Dynamic import of qr-scanner
        const QrScanner = (await import("qr-scanner")).default

        if (videoRef.current) {
          qrScanner = new QrScanner(
            videoRef.current,
            (result: any) => {
              console.log("QR Code detected:", result.data)
              onQRScanned(result.data)
              qrScanner?.stop()
            },
            {
              highlightScanRegion: true,
              highlightCodeOutline: true,
            },
          )

          await qrScanner.start()
          setIsScanning(true)
          setError(null)
        }
      } catch (err) {
        console.error("QR Scanner error:", err)
        setError("Camera access denied or not available. Please allow camera permissions.")
      }
    }

    initializeScanner()

    return () => {
      if (qrScanner) {
        qrScanner.stop()
        qrScanner.destroy()
      }
    }
  }, [onQRScanned])

  const handleManualInput = () => {
    const qrData = prompt("Enter QR code data manually (for testing):")
    if (qrData) {
      onQRScanned(qrData)
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
              <QrCode className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Scan QR Code</CardTitle>
            <CardDescription>{t("scanQRToStart")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 text-sm">{error}</p>
            <Button onClick={handleManualInput} variant="outline" className="mt-2">
              Enter QR Code Manually
            </Button>
          </div>
        ) : (
          <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            <canvas ref={canvasRef} className="hidden" />

            {/* Scanning overlay */}
            <div className="absolute inset-0 border-2 border-blue-500 rounded-lg">
              <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-blue-500"></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-blue-500"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-blue-500"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-blue-500"></div>
            </div>

            {isScanning && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                Scanning for QR codes...
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>• {t("positionQRCode")}</p>
          <p>• {t("ensureGoodLighting")}</p>
          <p>• {t("afterScanHandwriting")}</p>
        </div>

        <Button onClick={handleManualInput} variant="outline" className="w-full">
          {t("testWithSample")}
        </Button>
      </CardContent>
    </Card>
  )
}
