"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, Download, Palette, ImageIcon, Save } from "lucide-react"
import { useLocale } from "@/hooks/use-locale"
import { Textarea } from "@/components/ui/textarea"

interface CardDesignerProps {
  onBack: () => void
}

export function CardDesigner({ onBack }: CardDesignerProps) {
  const { t } = useLocale()
  const [activeTab, setActiveTab] = useState("front")
  const [businessName, setBusinessName] = useState("Your Business Name")
  const [cardBackground, setCardBackground] = useState("#ffffff")
  const [textColor, setTextColor] = useState("#000000")
  const [font, setFont] = useState("Arial, sans-serif")
  const [fontSize, setFontSize] = useState("16")
  const [borderColor, setBorderColor] = useState("#000000")
  const [borderWidth, setBorderWidth] = useState("2")
  const [borderRadius, setBorderRadius] = useState("4")
  const [customCss, setCustomCss] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("")
  const logoInputRef = useRef<HTMLInputElement>(null)
  const bgImageInputRef = useRef<HTMLInputElement>(null)
  const frontDesignRef = useRef<HTMLInputElement>(null)
  const backDesignRef = useRef<HTMLInputElement>(null)
  const [frontDesignUrl, setFrontDesignUrl] = useState("")
  const [backDesignUrl, setBackDesignUrl] = useState("")

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

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setBackgroundImageUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFrontDesignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFrontDesignUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBackDesignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setBackDesignUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const downloadDesign = () => {
    // Create a printable version with UTF-8 encoding and custom design
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>CardTime Custom Card Design</title>
          <style>
            body { font-family: ${font}; margin: 20px; }
            .card { 
              width: 3.5in; 
              height: 2in; 
              border: ${borderWidth}px solid ${borderColor}; 
              border-radius: ${borderRadius}px;
              margin: 20px auto; 
              page-break-after: always; 
              background-color: ${cardBackground}; 
              color: ${textColor}; 
              font-family: ${font};
              font-size: ${fontSize}px;
              position: relative;
              overflow: hidden;
              ${backgroundImageUrl ? `background-image: url(${backgroundImageUrl}); background-size: cover;` : ""}
              ${customCss}
            }
            .front, .back { padding: 10px; position: relative; height: calc(100% - 20px); }
            .field { margin: 5px 0; border-bottom: 1px solid ${borderColor}; padding-bottom: 2px; }
            .logo { max-height: 40px; max-width: 100px; margin-bottom: 10px; }
            .qr { text-align: center; margin-top: 10px; }
            .custom-design { width: 100%; height: 100%; object-fit: cover; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${
            frontDesignUrl
              ? `
            <div class="card">
              <img src="${frontDesignUrl}" class="custom-design" alt="Front Design">
            </div>
          `
              : `
            <div class="card">
              <div class="front">
                ${logoUrl ? `<img src="${logoUrl}" class="logo" alt="Logo">` : ""}
                <h3>${businessName}</h3>
                <div class="field">${t("date")}: ________________</div>
                <div class="field">${t("time")}: ________________</div>
                <div class="field">${t("artist")}: ______________</div>
                <div class="field">${t("size")}: ________________</div>
                <div class="field">${t("deposit")}: _____________</div>
              </div>
            </div>
          `
          }
          ${
            backDesignUrl
              ? `
            <div class="card">
              <img src="${backDesignUrl}" class="custom-design" alt="Back Design">
            </div>
          `
              : `
            <div class="card">
              <div class="back" style="text-align: center;">
                <h3>${t("scanQRCode")}</h3>
                <div class="qr">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    window.location.origin + "?scan=true",
                  )}" alt="QR Code" style="width: 120px; height: 120px;">
                </div>
                <p style="font-size: 10px; margin-top: 10px;">CardTime App</p>
              </div>
            </div>
          `
          }
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const saveDesign = () => {
    const designData = {
      businessName,
      cardBackground,
      textColor,
      font,
      fontSize,
      borderColor,
      borderWidth,
      borderRadius,
      customCss,
      logoUrl,
      backgroundImageUrl,
      frontDesignUrl,
      backDesignUrl,
    }

    const dataStr = JSON.stringify(designData)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportName = "cardtime-design.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportName)
    linkElement.click()
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
              <Palette className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">{t("designCards")}</CardTitle>
            <CardDescription>{t("customizeCard")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="editor">
              <Palette className="h-4 w-4 mr-2" />
              {t("customizeCard")}
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              {t("uploadDesign")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
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
              <div>
                <Button
                  onClick={() => logoInputRef.current?.click()}
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center"
                >
                  <ImageIcon className="h-6 w-6 mb-1" />
                  {t("uploadLogo")}
                </Button>
                <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
              </div>

              <div>
                <Button
                  onClick={() => bgImageInputRef.current?.click()}
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center"
                >
                  <ImageIcon className="h-6 w-6 mb-1" />
                  Background Image
                </Button>
                <input
                  type="file"
                  ref={bgImageInputRef}
                  onChange={handleBgImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="cardBackground">{t("backgroundColor")}</Label>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded border" style={{ backgroundColor: cardBackground }}></div>
                  <Input
                    id="cardBackground"
                    type="color"
                    value={cardBackground}
                    onChange={(e) => setCardBackground(e.target.value)}
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

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="font">{t("font")}</Label>
                <select
                  id="font"
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                  <option value="'Helvetica Neue', sans-serif">Helvetica Neue</option>
                  <option value="'Segoe UI', sans-serif">Segoe UI</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Input
                  id="fontSize"
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  min="8"
                  max="24"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="borderColor">Border Color</Label>
                <Input
                  id="borderColor"
                  type="color"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="borderWidth">Border Width</Label>
                <Input
                  id="borderWidth"
                  type="number"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(e.target.value)}
                  min="0"
                  max="10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="borderRadius">Border Radius</Label>
                <Input
                  id="borderRadius"
                  type="number"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(e.target.value)}
                  min="0"
                  max="20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customCss">Custom CSS (Advanced)</Label>
              <Textarea
                id="customCss"
                value={customCss}
                onChange={(e) => setCustomCss(e.target.value)}
                placeholder="box-shadow: 0 4px 8px rgba(0,0,0,0.1);"
                className="font-mono text-sm"
              />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <Tabs defaultValue="front" onValueChange={(value) => setActiveTab(value)}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="front">{t("frontSide")}</TabsTrigger>
                <TabsTrigger value="back">{t("backSide")}</TabsTrigger>
              </TabsList>

              <TabsContent value="front" className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {frontDesignUrl ? (
                    <div className="relative aspect-[7/4]">
                      <img
                        src={frontDesignUrl || "/placeholder.svg"}
                        alt="Front Design"
                        className="w-full h-full object-contain rounded"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setFrontDesignUrl("")}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => frontDesignRef.current?.click()}
                      variant="outline"
                      className="w-full h-32 flex flex-col items-center justify-center"
                    >
                      <Upload className="h-8 w-8 mb-2" />
                      Upload Front Design
                    </Button>
                  )}
                  <input
                    type="file"
                    ref={frontDesignRef}
                    onChange={handleFrontDesignUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </TabsContent>

              <TabsContent value="back" className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {backDesignUrl ? (
                    <div className="relative aspect-[7/4]">
                      <img
                        src={backDesignUrl || "/placeholder.svg"}
                        alt="Back Design"
                        className="w-full h-full object-contain rounded"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setBackDesignUrl("")}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => backDesignRef.current?.click()}
                      variant="outline"
                      className="w-full h-32 flex flex-col items-center justify-center"
                    >
                      <Upload className="h-8 w-8 mb-2" />
                      Upload Back Design
                    </Button>
                  )}
                  <input
                    type="file"
                    ref={backDesignRef}
                    onChange={handleBackDesignUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="font-medium text-lg mb-3">{t("previewCard")}</h3>
          <div className="space-y-4">
            {/* Front of card preview */}
            <div
              className="border-2 rounded-lg p-4 relative overflow-hidden"
              style={{
                aspectRatio: "3.5/2",
                backgroundColor: cardBackground,
                color: textColor,
                fontFamily: font,
                fontSize: `${fontSize}px`,
                borderColor: borderColor,
                borderWidth: `${borderWidth}px`,
                borderRadius: `${borderRadius}px`,
                backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : "none",
                backgroundSize: "cover",
              }}
            >
              {frontDesignUrl ? (
                <img
                  src={frontDesignUrl || "/placeholder.svg"}
                  alt="Front Design"
                  className="w-full h-full object-cover absolute inset-0"
                />
              ) : (
                <>
                  {logoUrl && (
                    <img src={logoUrl || "/placeholder.svg"} alt="Logo" className="max-h-10 max-w-[100px] mb-2" />
                  )}
                  <h3 className="font-bold mb-2">{businessName}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="border-b border-gray-300 pb-1">{t("date")}: ________________</div>
                    <div className="border-b border-gray-300 pb-1">{t("time")}: ________________</div>
                    <div className="border-b border-gray-300 pb-1">{t("artist")}: ______________</div>
                    <div className="border-b border-gray-300 pb-1">{t("size")}: ________________</div>
                    <div className="border-b border-gray-300 pb-1">{t("deposit")}: _____________</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={saveDesign} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            {t("saveDesign")}
          </Button>
          <Button onClick={downloadDesign}>
            <Download className="h-4 w-4 mr-2" />
            {t("downloadTemplate")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
