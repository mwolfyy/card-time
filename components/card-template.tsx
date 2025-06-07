"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Printer, Download, ArrowLeft, Upload } from "lucide-react"
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
  const [logoUrl, setLogoUrl] = useState("")
  const logoInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogoUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + "?scan=true")}`

  const downloadTemplate = () => {
    // Create a printable version with UTF-8 encoding that matches the preview exactly
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>CardTime Appointment Card Template</title>
        <style>
          @page {
            size: 3.5in 2in;
            margin: 0;
          }
          
          body { 
            font-family: ${font}; 
            margin: 0; 
            padding: 0;
            background: white;
          }
          
          .card { 
            width: 3.5in; 
            height: 2in; 
            border: 2px solid ${textColor}; 
            margin: 0;
            page-break-after: always; 
            background-color: ${cardColor}; 
            color: ${textColor}; 
            box-sizing: border-box;
            position: relative;
            overflow: hidden;
          }
          
          .front, .back { 
            padding: 10px; 
            height: calc(2in - 20px);
            box-sizing: border-box;
            position: relative;
          }
          
          .logo {
            position: absolute;
            top: 10px;
            right: 10px;
            max-width: 60px;
            max-height: 30px;
            z-index: 10;
          }
          
          .content {
            position: relative;
            z-index: 1;
          }
          
          .front h3 {
            font-size: 16px;
            font-weight: bold;
            margin: 0 0 8px 0;
            line-height: 1.2;
            padding-right: ${logoUrl ? "70px" : "0"};
          }
          
          .field { 
            margin: 4px 0; 
            border-bottom: 1px solid ${textColor}; 
            padding-bottom: 2px; 
            font-size: 12px;
            line-height: 1.3;
            min-height: 16px;
          }
          
          .back {
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          
          .back h3 {
            font-size: 14px;
            font-weight: bold;
            margin: 0 0 8px 0;
          }
          
          .qr { 
            margin: 8px 0;
          }
          
          .qr img {
            width: 100px;
            height: 100px;
            display: block;
          }
          
          .back p {
            font-size: 8px;
            margin: 4px 0 0 0;
            opacity: 0.8;
          }
          
          @media print { 
            body { margin: 0; }
            .card { margin: 0; }
          }
        </style>
      </head>
      <body>
        <!-- Front of card -->
        <div class="card">
          <div class="front">
            ${logoUrl ? `<img src="${logoUrl}" class="logo" alt="Logo">` : ""}
            <div class="content">
              <h3>${businessName}</h3>
              <div class="field">${t("date")}: ________________</div>
              <div class="field">${t("time")}: ________________</div>
              <div class="field">${t("artist")}: ______________</div>
              <div class="field">${t("size")}: ________________</div>
              <div class="field">${t("deposit")}: _____________</div>
            </div>
          </div>
        </div>
        
        <!-- Back of card -->
        <div class="card">
          <div class="back">
            <h3>${t("scanQRCode")}</h3>
            <div class="qr">
              <img src="${qrCodeUrl}" alt="QR Code">
            </div>
            <p>CardTime App</p>
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

        <div className="space-y-2">
          <Label>{t("uploadLogo")}</Label>
          <Button
            onClick={() => logoInputRef.current?.click()}
            variant="outline"
            className="w-full h-16 flex items-center justify-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {logoUrl ? "Change Logo" : t("uploadLogo")}
          </Button>
          <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
          {logoUrl && (
            <div className="flex items-center gap-2">
              <img src={logoUrl || "/placeholder.svg"} alt="Logo" className="w-12 h-6 object-contain border rounded" />
              <Button variant="outline" size="sm" onClick={() => setLogoUrl("")}>
                Remove
              </Button>
            </div>
          )}
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
              className="border-2 rounded-lg p-4 relative overflow-hidden"
              style={{
                aspectRatio: "3.5/2",
                backgroundColor: cardColor,
                color: textColor,
                fontFamily: font,
                borderColor: textColor,
                borderWidth: "2px",
              }}
            >
              {/* Logo positioned absolutely in top-right */}
              {logoUrl && (
                <img
                  src={logoUrl || "/placeholder.svg"}
                  alt="Logo"
                  className="absolute top-2 right-2 max-w-[60px] max-h-[30px] object-contain z-10"
                />
              )}

              {/* Content with proper spacing */}
              <div className="relative z-1">
                <h3 className="font-bold text-base mb-2 leading-tight" style={{ paddingRight: logoUrl ? "70px" : "0" }}>
                  {businessName}
                </h3>
                <div className="space-y-1 text-xs">
                  <div className="border-b pb-0.5 min-h-[16px]" style={{ borderColor: textColor }}>
                    {t("date")}: ________________
                  </div>
                  <div className="border-b pb-0.5 min-h-[16px]" style={{ borderColor: textColor }}>
                    {t("time")}: ________________
                  </div>
                  <div className="border-b pb-0.5 min-h-[16px]" style={{ borderColor: textColor }}>
                    {t("artist")}: ______________
                  </div>
                  <div className="border-b pb-0.5 min-h-[16px]" style={{ borderColor: textColor }}>
                    {t("size")}: ________________
                  </div>
                  <div className="border-b pb-0.5 min-h-[16px]" style={{ borderColor: textColor }}>
                    {t("deposit")}: _____________
                  </div>
                </div>
              </div>
            </div>

            {/* Back of card */}
            <div
              className="border-2 rounded-lg p-4 text-center flex flex-col justify-center items-center"
              style={{
                aspectRatio: "3.5/2",
                backgroundColor: cardColor,
                color: textColor,
                fontFamily: font,
                borderColor: textColor,
                borderWidth: "2px",
              }}
            >
              <h3 className="font-bold text-sm mb-2">{t("scanQRCode")}</h3>
              <div className="mb-2">
                <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-20 h-20 mx-auto" />
              </div>
              <p className="text-xs opacity-80">CardTime App</p>
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
