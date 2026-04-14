import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/presentation/components/header';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WiFi-Share | 간편한 QR 생성기',
  description: '서버 저장 없이 안전하게 와이파이 접속 QR 코드를 만들고 공유하세요.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
