import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  wifiString: string;
  ssid: string;
  isLocked?: boolean;
}

export const BasicTemplate: React.FC<Props> = ({ wifiString, ssid, isLocked }) => {
  return (
    <div
      className="bg-white text-black p-8 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center w-80 shrink-0 mx-auto"
      style={{ aspectRatio: '3/4', fontFamily: 'Arial, Helvetica, sans-serif' }}
    >
      <div className="mb-8 text-center flex flex-col items-center">
        <h3 className="text-3xl font-black mb-2 pb-1 uppercase break-words line-clamp-2 w-full px-2 leading-relaxed">
          {ssid || 'NO NETWORK'}
        </h3>
        <div className="w-12 h-1 bg-black rounded-full mb-2"></div>
        <p className="text-xs font-semibold text-black/60 uppercase">
          Scan to Connect
        </p>
      </div>

      <div className="bg-white p-3 rounded-2xl border-4 border-black inline-block mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
        {isLocked && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[8px] z-10 m-3 flex items-center justify-center rounded-sm">
            <div className="w-12 h-1 bg-black/20 rotate-45 rounded-full absolute" />
            <div className="w-12 h-1 bg-black/20 -rotate-45 rounded-full absolute" />
          </div>
        )}
        <QRCodeSVG
          value={wifiString || 'WIFI:T:nopass;S:;P:;;'}
          size={180}
          level="M"
          includeMargin={false}
          className="rounded-sm"
        />
      </div>
      
      <div className="mt-auto">
        <p className="text-[10px] font-bold text-black/40">
          WIFI-SHARE PLATFORM
        </p>
      </div>
    </div>
  );
};
