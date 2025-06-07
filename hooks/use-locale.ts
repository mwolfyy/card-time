"use client"

import { useState, useMemo } from "react"

const translations = {
  en: {
    appTagline: "Handwriting to Calendar",
    startScanning: "Start Scanning",
    createCards: "Create Cards",
    designCards: "Design Cards",
    invalidQRCode: "Invalid QR Code. Please scan a valid CardTime QR code.",
    scanCard: "Scan Handwritten Card",
    positionCard: "Position your handwritten card within the frame",
    confirmDetails: "Confirm Details",
    reviewDetails: "Review the extracted handwriting",
    addToCalendar: "Add to Calendar",
    appointmentWith: "Appointment with",
    date: "Date",
    time: "Time",
    size: "Size",
    deposit: "Deposit",
    artist: "Artist",
    duration: "Duration",
    minutes: "minutes",
    minute: "minute",
    hour: "hour",
    hours: "hours",
    scanQRCode: "Scan to Add to Calendar",
    downloadTemplate: "Download Template",
    businessName: "Business Name",
    backgroundColor: "Background Color",
    textColor: "Text Color",
    font: "Font",
    showPreview: "Show Preview",
    hidePreview: "Hide Preview",
    customizeCard: "Customize your card design",
    uploadDesign: "Upload Design",
    frontSide: "Front Side",
    backSide: "Back Side",
    uploadLogo: "Upload Logo",
    previewCard: "Preview Card",
    saveDesign: "Save Design",
    cameraAccessDenied: "Camera access denied. Please allow camera permissions or upload an image.",
    uploadImageInstead: "Upload Image Instead",
    processingOCR: "Reading Handwriting...",
    readingHandwriting: "Processing handwritten text",
    startCamera: "Start Camera",
    capture: "Capture",
    processing: "Processing...",
    uploadImageFile: "Upload Image File",
    ensureGoodLighting: "Ensure good lighting and clear handwriting",
    keepCardFlat: "Keep the card flat and within the frame",
    usingTesseract: "Using advanced handwriting recognition",
    handwritingRecognition: "Handwriting Recognition",
    handwritingDescription:
      "Fill out your appointment card by hand, scan the QR code, and let AI read your handwriting to create calendar events automatically.",
    howItWorks: "How it works",
    step1: "Print appointment cards with QR codes",
    step2: "Fill out cards by hand with appointment details",
    step3: "Scan QR code to read handwriting and add to calendar",
    scanQRToStart: "Scan QR code to start handwriting recognition",
    positionQRCode: "Position the QR code within the frame",
    afterScanHandwriting: "After scanning, you'll photograph your handwritten card",
    testWithSample: "Test with Sample QR Code",
  },
  bg: {
    appTagline: "Ръкопис към календар",
    startScanning: "Започни сканиране",
    createCards: "Създай карти",
    designCards: "Дизайн на карти",
    invalidQRCode: "Невалиден QR код. Моля, сканирайте валиден CardTime QR код.",
    scanCard: "Сканирай ръкописна карта",
    positionCard: "Позиционирайте вашата ръкописна карта в рамката",
    confirmDetails: "Потвърди детайли",
    reviewDetails: "Прегледайте извлечения ръкопис",
    addToCalendar: "Добави в календара",
    appointmentWith: "Час с",
    date: "Дата",
    time: "Час",
    size: "Размер",
    deposit: "Депозит",
    artist: "Артист",
    duration: "Продължителност",
    minutes: "минути",
    minute: "минута",
    hour: "час",
    hours: "часа",
    scanQRCode: "Сканирай за добавяне в календара",
    downloadTemplate: "Свали шаблон",
    businessName: "Име на бизнеса",
    backgroundColor: "Цвят на фона",
    textColor: "Цвят на текста",
    font: "Шрифт",
    showPreview: "Покажи преглед",
    hidePreview: "Скрий преглед",
    customizeCard: "Персонализирайте дизайна на вашата карта",
    uploadDesign: "Качи дизайн",
    frontSide: "Предна страна",
    backSide: "Задна страна",
    uploadLogo: "Качи лого",
    previewCard: "Преглед на картата",
    saveDesign: "Запази дизайн",
    cameraAccessDenied: "Достъпът до камерата е отказан. Моля, разрешете достъп до камерата или качете изображение.",
    uploadImageInstead: "Качи изображение вместо това",
    processingOCR: "Четене на ръкопис...",
    readingHandwriting: "Обработка на ръкописен текст",
    startCamera: "Стартирай камера",
    capture: "Заснеми",
    processing: "Обработва...",
    uploadImageFile: "Качи файл с изображение",
    ensureGoodLighting: "Осигурете добро осветление и ясен почерк",
    keepCardFlat: "Дръжте картата равна и в рамката",
    usingTesseract: "Използване на усъвършенствано разпознаване на ръкопис",
    handwritingRecognition: "Разпознаване на ръкопис",
    handwritingDescription:
      "Попълнете вашата карта за час на ръка, сканирайте QR кода и оставете AI да прочете вашия ръкопис, за да създаде автоматично събития в календара.",
    howItWorks: "Как работи",
    step1: "Отпечатайте карти за часове с QR кодове",
    step2: "Попълнете картите на ръка с детайли за часа",
    step3: "Сканирайте QR кода, за да прочетете ръкописа и добавите в календара",
    scanQRToStart: "Сканирайте QR код, за да започнете разпознаването на ръкопис",
    positionQRCode: "Позиционирайте QR кода в рамката",
    afterScanHandwriting: "След сканирането ще снимате вашата ръкописна карта",
    testWithSample: "Тест с примерен QR код",
  },
}

export function useLocale() {
  const [locale, setLocaleState] = useState<"en" | "bg">("en")

  const currentTranslations = useMemo(() => {
    return translations[locale]
  }, [locale])

  const t = (key: string): string => {
    return currentTranslations[key] || key
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    if (locale === "bg") {
      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const year = date.getFullYear().toString().slice(-2)
      return `${day}/${month}/${year}`
    } else {
      return date.toLocaleDateString("en-US")
    }
  }

  const parseDate = (dateString: string): Date => {
    if (locale === "bg") {
      const parts = dateString.split("/")
      if (parts.length === 3) {
        const day = Number.parseInt(parts[0], 10)
        const month = Number.parseInt(parts[1], 10) - 1
        let year = Number.parseInt(parts[2], 10)
        if (year < 100) year += 2000
        return new Date(year, month, day)
      }
    }
    return new Date(dateString)
  }

  const setLocale = (newLocale: "en" | "bg") => {
    setLocaleState(newLocale)
  }

  return { t, locale, formatDate, parseDate, setLocale }
}
