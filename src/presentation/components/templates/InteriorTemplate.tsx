import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  wifiString: string;
  ssid: string;
  isLocked?: boolean;
}

export const InteriorTemplate: React.FC<Props> = ({ wifiString, ssid, isLocked }) => {
  return (
    <div
      className="bg-[#fdfbf7] p-6 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center w-80 shrink-0 mx-auto"
      style={{ aspectRatio: '3/4', fontFamily: 'Georgia, serif' }}
    >
      <div className="w-full h-full border border-[#d6cfc5] rounded-xl flex flex-col items-center p-6 relative">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#d6cfc5]"></div>
        
        <div className="mt-8 text-center flex flex-col items-center flex-1">
          <p className="text-sm font-medium text-[#8b8378] italic mb-1">Welcome to our space</p>
          <h3 className="text-2xl font-bold mb-2 pb-1 text-[#4a453e] break-words line-clamp-2 w-full px-2 leading-relaxed" style={{ fontFamily: 'var(--font-cursive, cursive)' }}>
            {ssid || 'NO NETWORK'}
          </h3>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#e8e4db] inline-block mb-8 shadow-sm relative">
          {isLocked && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[8px] z-10 m-2 flex items-center justify-center rounded-sm">
              <div className="w-12 h-1 bg-[#d6cfc5] rotate-45 rounded-full absolute" />
              <div className="w-12 h-1 bg-[#d6cfc5] -rotate-45 rounded-full absolute" />
            </div>
          )}
          <QRCodeSVG
            value={wifiString || 'WIFI:T:nopass;S:;P:;;'}
            size={160}
            level="M"
            fgColor="#4a453e"
            includeMargin={false}
            className="rounded-sm"
          />
        </div>
        
        <div className="mt-auto">
          <p className="text-[11px] text-[#a9a297] italic">
            Enjoy your stay
          </p>
        </div>
      </div>
    </div>
  );
};
