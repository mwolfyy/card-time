import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Card Time',
  description: 'AI скенер, който превръща визитките в реалност!',
  author: 'Станчев | Stanchev',
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
