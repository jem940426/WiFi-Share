import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { AiTemplateStyle } from '@/domain/ai-template';

interface Props {
  wifiString: string;
  ssid: string;
  isLocked?: boolean;
  style: AiTemplateStyle;
}

/**
 * AI 생성형 템플릿 컴포넌트
 * 감성형(InteriorTemplate) 구조를 기반으로 AI가 생성한 색상/폰트/문구를 적용합니다.
 */
export const AiTemplate: React.FC<Props> = ({ wifiString, ssid, isLocked, style }) => {
  const {
    backgroundColor,
    pointColor,
    fontStyle,
    topText,
    bottomText,
  } = style;

  // 배경색에 따라 텍스트 색상 자동 결정 (명도 기반)
  const hexToLuminance = (hex: string): number => {
    const cleaned = hex.replace('#', '');
    const r = parseInt(cleaned.substring(0, 2), 16) / 255;
    const g = parseInt(cleaned.substring(2, 4), 16) / 255;
    const b = parseInt(cleaned.substring(4, 6), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const bgLuminance = hexToLuminance(backgroundColor);
  const isDark = bgLuminance < 0.5;

  const subTextColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.40)';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)';
  const qrBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)';
  const qrFg = isDark ? '#ffffff' : '#1a1a1a';

  return (
    <div
      className="p-6 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center w-80 shrink-0 mx-auto"
      style={{
        aspectRatio: '3/4',
        backgroundColor,
        fontFamily:
          fontStyle === 'serif'
            ? 'Georgia, serif'
            : fontStyle === 'monospace'
            ? 'Courier New, monospace'
            : 'system-ui, sans-serif',
      }}
    >
      <div
        className="w-full h-full rounded-xl flex flex-col items-center p-6 relative"
        style={{ border: `1px solid ${borderColor}` }}
      >
        {/* 상단 장식선 */}
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-[2px]"
          style={{ backgroundColor: pointColor }}
        />

        {/* 상단 문구 영역 */}
        <div className="mt-8 text-center flex flex-col items-center flex-1">
          <p className="text-sm font-medium italic mb-1" style={{ color: subTextColor }}>
            {topText}
          </p>
          <h3
            className="text-2xl font-bold mb-2 pb-1 whitespace-nowrap overflow-hidden text-ellipsis w-full px-2 leading-relaxed"
            style={{ color: pointColor }}
          >
            {ssid || 'MY HOME WIFI'}
          </h3>
        </div>

        {/* QR 코드 영역 */}
        <div
          className="p-3 rounded-lg inline-block mb-8 shadow-sm relative"
          style={{ background: qrBg, border: `1px solid ${borderColor}` }}
        >
          {isLocked && (
            <div className="absolute inset-0 backdrop-blur-[8px] z-10 m-2 flex items-center justify-center rounded-sm"
              style={{ backgroundColor: `${backgroundColor}88` }}>
              <div className="w-12 h-1 rotate-45 rounded-full absolute" style={{ backgroundColor: borderColor }} />
              <div className="w-12 h-1 -rotate-45 rounded-full absolute" style={{ backgroundColor: borderColor }} />
            </div>
          )}
          <QRCodeSVG
            value={wifiString || 'WIFI:T:nopass;S:;P:;;'}
            size={160}
            level="M"
            fgColor={qrFg}
            bgColor="transparent"
            includeMargin={false}
            className="rounded-sm"
          />
        </div>

        {/* 하단 문구 */}
        <div className="mt-auto">
          <p className="text-[11px] italic" style={{ color: subTextColor }}>
            {bottomText}
          </p>
        </div>

        {/* 하단 포인트 라인 */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-[2px]"
          style={{ backgroundColor: pointColor }}
        />

        {/* 좌측 포인트 세로선 */}
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 h-8 w-[2px]"
          style={{ backgroundColor: pointColor, opacity: 0.4 }}
        />
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-[2px]"
          style={{ backgroundColor: pointColor, opacity: 0.4 }}
        />
      </div>
    </div>
  );
};
