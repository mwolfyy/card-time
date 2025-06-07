import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Card Time',
  description: 'AI скенер за карти, който добавя часовете в телефона ти!',
  author: 'Stanchev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
