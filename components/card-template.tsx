"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Printer, Download, ArrowLeft } from "lucide-react"
import { useLocale } from "@/hooks/use-locale"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CardTemplateProps {
  onBack: () => void
}

export function CardTemplate({ onBack }: CardTemplateProps) {
  const { t } = useLocale()
  const [businessName, setBusinessName] = useState("Your Business Name")
  const [showTemplate, setShowTemplate] = useState(false)
  const [cardColor, setCardColor] = useState("#ffffff")
  const [textColor, setTextColor] = useState("#000000")
  const [font, setFont] = useState("Arial, sans-serif")

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + "?scan=true")}`

  const downloadTemplate = () => {
    // Create a printable version with UTF-8 encoding
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>CardTime Appointment Card Template</title>
          <style>
            body { font-family: ${font}; margin: 20px; }
            .card { width: 3.5in; height: 2in; border: 2px solid #000; margin: 20px auto; page-break-after: always; background-color: ${cardColor}; color: ${textColor}; }
            .front { padding: 10px; }
            .back { padding: 10px; text-align: center; }
            .field { margin: 5px 0; border-bottom: 1px solid #ccc; padding-bottom: 2px; }
            .qr { text-align: center; margin-top: 10px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="front">
              <h3>${businessName}</h3>
              <div class="field">${t("date")}: ________________</div>
              <div class="field">${t("time")}: ________________</div>
              <div class="field">${t("artist")}: ______________</div>
              <div class="field">${t("size")}: ________________</div>
              <div class="field">${t("deposit")}: _____________</div>
            </div>
          </div>
          <div class="card">
            <div class="back">
              <h3>${t("scanQRCode")}</h3>
              <div class="qr">
                <img src="${qrCodeUrl}" alt="QR Code" style="width: 120px; height: 120px;">
              </div>
              <p style="font-size: 10px; margin-top: 10px;">CardTime App</p>
            </div>
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
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
            <div className="mx-auto mb-2 p-2 bg-purple-100 rounded-full w-fit">
              <Printer className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">{t("createCards")}</CardTitle>
            <CardDescription>{t("appTagline")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="business">{t("businessName")}</Label>
          <Input
            id="business"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder={t("businessName")}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="cardColor">{t("backgroundColor")}</Label>
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded border" style={{ backgroundColor: cardColor }}></div>
              <Input
                id="cardColor"
                type="color"
                value={cardColor}
                onChange={(e) => setCardColor(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="textColor">{t("textColor")}</Label>
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded border" style={{ backgroundColor: textColor }}></div>
              <Input
                id="textColor"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font">{t("font")}</Label>
          <Select value={font} onValueChange={setFont}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arial, sans-serif">Arial</SelectItem>
              <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
              <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
              <SelectItem value="Georgia, serif">Georgia</SelectItem>
              <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setShowTemplate(!showTemplate)} variant="outline" className="w-full">
          {showTemplate ? t("hidePreview") : t("showPreview")}
        </Button>

        {showTemplate && (
          <div className="space-y-4">
            {/* Front of card */}
            <div
              className="border-2 border-gray-300 rounded-lg p-4"
              style={{ aspectRatio: "3.5/2", backgroundColor: cardColor, color: textColor, fontFamily: font }}
            >
              <h3 className="font-bold text-lg mb-3">{businessName}</h3>
              <div className="space-y-2 text-sm">
                <div className="border-b border-gray-300 pb-1">{t("date")}: ________________</div>
                <div className="border-b border-gray-300 pb-1">{t("time")}: ________________</div>
                <div className="border-b border-gray-300 pb-1">{t("artist")}: ______________</div>
                <div className="border-b border-gray-300 pb-1">{t("size")}: ________________</div>
                <div className="border-b border-gray-300 pb-1">{t("deposit")}: _____________</div>
              </div>
            </div>

            {/* Back of card */}
            <div
              className="border-2 border-gray-300 rounded-lg p-4 text-center"
              style={{ aspectRatio: "3.5/2", backgroundColor: cardColor, color: textColor, fontFamily: font }}
            >
              <h3 className="font-bold text-lg mb-2">{t("scanQRCode")}</h3>
              <div className="flex justify-center mb-2">
                <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-24 h-24" />
              </div>
              <p className="text-xs" style={{ color: textColor }}>
                CardTime App
              </p>
            </div>
          </div>
        )}

        <Button onClick={downloadTemplate} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          {t("downloadTemplate")}
        </Button>
      </CardContent>
    </Card>
  )
}
