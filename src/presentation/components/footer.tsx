import React from 'react';
import Link from 'next/link';
import { Wifi } from 'lucide-react';

/**
 * 푸터 컴포넌트
 * - 개인정보 처리방침 링크 포함
 * - 서비스 기본 정보 표시
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 bg-black/20 backdrop-blur-lg mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* 로고 및 서비스명 */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/20 rounded-lg">
              <Wifi className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-black text-white/70 text-sm tracking-wide">WiFi-Share</span>
          </div>

          {/* 네비게이션 링크 */}
          <nav className="flex items-center gap-6 text-xs text-white/40">
            <Link
              href="/privacy"
              className="hover:text-white/70 transition-colors"
            >
              개인정보 처리방침
            </Link>
          </nav>

          {/* 저작권 */}
          <p className="text-xs text-white/30">
            © {currentYear} WiFi-Share. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
