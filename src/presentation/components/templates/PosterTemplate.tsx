import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  wifiString: string;
  ssid: string;
  isLocked?: boolean;
}

export const PosterTemplate: React.FC<Props> = ({ wifiString, ssid, isLocked }) => {
  return (
    <div
      className="bg-[#E63946] text-[#F1FAEE] p-8 rounded-[2rem] shadow-2xl flex flex-col items-start justify-between w-80 shrink-0 mx-auto border-4 border-[#1D3557] overflow-hidden"
      style={{ height: '540px', fontFamily: 'Arial, Helvetica, sans-serif' }}
    >
      <div className="w-full flex-1">
        <h2 className="text-4xl font-black leading-[1.1] text-[#1D3557] tracking-tight mb-3">
          비밀번호는<br />QR에게<br />물어보세요 <span className="inline-block transform translate-y-1 scale-90">🤫</span>
        </h2>
        
        <div className="w-12 h-2 bg-[#F1FAEE] mb-6"></div>
        
        <div className="w-full">
          <p className="text-[12px] font-bold text-white/90 uppercase mb-1 tracking-widest">NETWORK ID</p>
            <h3 className="text-xl font-black pb-1 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
              {ssid || 'MY HOME WIFI'}
            </h3>
        </div>
      </div>

      <div className="w-full flex flex-col items-center mt-6">
        <div className="bg-[#F1FAEE] p-3 rounded-xl border-4 border-[#1D3557] inline-block mb-4 shadow-[4px_4px_0px_0px_rgba(29,53,87,1)] relative">
          {isLocked && (
            <div className="absolute inset-0 bg-[#F1FAEE]/80 backdrop-blur-[8px] z-10 m-2 flex items-center justify-center rounded-md">
              <div className="w-12 h-1 bg-[#1D3557]/40 rotate-45 rounded-full absolute" />
              <div className="w-12 h-1 bg-[#1D3557]/40 -rotate-45 rounded-full absolute" />
            </div>
          )}
          <QRCodeSVG
            value={wifiString || 'WIFI:T:nopass;S:;P:;;'}
            size={130}
            level="M"
            fgColor="#1D3557"
            includeMargin={false}
            className="rounded-sm"
          />
        </div>
        <p className="text-[13px] font-black tracking-[0.2em] text-[#1D3557] uppercase bg-[#F1FAEE] px-3 py-1 border-2 border-[#1D3557]">
          SCAN TO CONNECT
        </p>
      </div>
    </div>
  );
};
