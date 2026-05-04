import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/presentation/components/header';
import Footer from '@/presentation/components/footer';
// [추가] 띠광고 컴포넌트 — 기존 코드 변경 없이 append
import BannerAd from '@/presentation/components/banner-ad';
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
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
        {/* [추가] 띠광고 — 기존 레이아웃 블록 바깥에 append */}
        <BannerAd />
      </body>
    </html>
  );
}
