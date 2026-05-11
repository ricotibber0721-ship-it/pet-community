import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'

export const metadata: Metadata = {
  title: 'Mpetcare — 우리집 댕댕이·냥냥이의 작은 커뮤니티',
  description: '강아지·고양이 보호자들이 모이는 따뜻하고 귀여운 커뮤니티',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Header />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  )
}
