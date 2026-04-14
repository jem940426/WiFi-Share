import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { downloadElementAsPng, downloadPosterElementAsPng } from '@/infrastructure/image-capture';
import { TemplateId } from '@/domain/template';

interface Props {
  targetRef: React.RefObject<HTMLElement>;
  ssid: string;
  templateId: TemplateId;
}

export const DownloadButton: React.FC<Props> = ({ targetRef, ssid, templateId }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!targetRef.current || isDownloading) return;
    
    setIsDownloading(true);
    const filename = `wifi-qr-${ssid || 'network'}.png`;

    const result = templateId === 'poster' 
      ? await downloadPosterElementAsPng(targetRef.current, filename)
      : await downloadElementAsPng(targetRef.current, filename);
    
    if (!result.isSuccess) {
      alert(`다운로드 실패: ${result.error.message}`);
    }
    
    setIsDownloading(false);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="w-full sm:w-auto mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold tracking-wide shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
    >
      {isDownloading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Download className="w-5 h-5" />
      )}
      <span>{isDownloading ? '저장 중...' : 'QR 코드 다운로드'}</span>
    </button>
  );
};
