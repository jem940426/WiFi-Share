import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Coffee } from 'lucide-react';

interface Props {
  wifiString: string;
  ssid: string;
  isLocked?: boolean;
}

export const CafeTemplate: React.FC<Props> = ({ wifiString, ssid, isLocked }) => {
  return (
    <div
      className="bg-[#2c1d11] text-[#f4e8d3] p-8 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center w-80 shrink-0 mx-auto border-[6px] border-[#3e2c1e]"
      style={{ aspectRatio: '3/4', fontFamily: 'Georgia, serif' }}
    >
      <div className="flex flex-col items-center mb-6">
        <Coffee size={28} className="text-[#d4af37] mb-2" />
        <h2 className="text-xl font-bold tracking-[0.2em] text-[#d4af37] uppercase">CAFE WI-FI</h2>
        <div className="w-16 h-[1px] bg-[#d4af37]/50 mt-3"></div>
      </div>

      <div className="text-center flex flex-col items-center flex-1 w-full">
        <p className="text-xs text-[#f4e8d3]/70 mb-1">Network Name</p>
        <h3 className="text-2xl font-black mb-4 pb-1 break-words line-clamp-2 w-full px-2 leading-relaxed text-white">
          {ssid || 'NO NETWORK'}
        </h3>
      </div>

      <div className="bg-[#f4e8d3] p-3 rounded-xl inline-block mb-6 shadow-inner relative">
        {isLocked && (
          <div className="absolute inset-0 bg-[#f4e8d3]/80 backdrop-blur-[8px] z-10 m-2 flex items-center justify-center rounded-md">
            <div className="w-12 h-1 bg-[#2c1d11]/40 rotate-45 rounded-full absolute" />
            <div className="w-12 h-1 bg-[#2c1d11]/40 -rotate-45 rounded-full absolute" />
          </div>
        )}
        <QRCodeSVG
          value={wifiString || 'WIFI:T:nopass;S:;P:;;'}
          size={160}
          level="M"
          fgColor="#2c1d11"
          includeMargin={false}
          className="rounded-sm"
        />
      </div>
      
      <div className="mt-auto">
        <p className="text-[10px] text-[#f4e8d3]/40 tracking-widest uppercase">
          Please enjoy your coffee
        </p>
      </div>
    </div>
  );
};
