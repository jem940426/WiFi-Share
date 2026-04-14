'use client';

import React, { useState } from 'react';
import { Download, AlertCircle, Clock, Loader2, Image as ImageIcon, X, Trash2, AlertTriangle } from 'lucide-react';
import { deleteDownloadRecord } from '@/application/user/actions';

interface HistoryCardProps {
  id: string;
  templateName: string;
  ssid: string;
  downloadedAt: string;
  imageUrl?: string;
  isExpired: boolean;
  diffDays: number;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
  id,
  templateName,
  ssid,
  downloadedAt,
  imageUrl,
  isExpired,
  diffDays
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDownload = async () => {
    if (!imageUrl || isDownloading) return;
    setIsDownloading(true);
    try {
      // CORS 우회를 위해 blob으로 받아옵니다 (다운로드 창 띄우기)
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const filename = `wifi-qr-${ssid || 'network'}-re.png`;
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (e) {
      console.error('재다운로드 실패:', e);
      alert('이미지를 다운로드할 수 없습니다. 원본이 삭제되었을 수 있습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    const result = await deleteDownloadRecord(id, imageUrl);
    if (result.isSuccess) {
      setIsDeleted(true); // 카드 fadeout 처리
    } else {
      alert('삭제 중 오류가 발생했습니다: ' + result.error.message);
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // 삭제 완료 시 카드를 렌더링에서 제거
  if (isDeleted) return null;

  return (
    <>
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex flex-col h-full hover:bg-white/10 transition-colors group overflow-hidden relative">
        {/* X 삭제 버튼 */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="absolute top-4 right-4 z-20 w-7 h-7 rounded-full bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-white/30 hover:text-rose-400 flex items-center justify-center transition-all"
          aria-label="기록 삭제"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex justify-between items-start mb-4 relative z-10 pr-8">
          <div>
            <h4 className="text-xl font-bold text-white mb-1">{templateName}</h4>
            <p className="text-xs font-semibold text-white/50 tracking-wider">SSID: {ssid}</p>
          </div>
          {isExpired ? (
            <span className="px-2 py-1 bg-rose-500/10 text-rose-400 text-[11px] font-bold rounded-md flex items-center gap-1 shrink-0">
              <AlertCircle className="w-3 h-3" /> 만료됨
            </span>
          ) : (
            <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[11px] font-bold rounded-md flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3" /> {diffDays}일 남음
            </span>
          )}
        </div>

        {/* 썸네일 표시 */}
        <div className="w-full flex-1 min-h-[200px] mb-4 rounded-2xl overflow-hidden bg-black/20 border border-white/5 relative group-hover:border-white/10 transition-colors flex items-center justify-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={`QR 썸네일 - ${ssid}`} 
              className="w-full h-full object-contain p-2" 
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-white/20">
              <ImageIcon className="w-10 h-10 mb-2" />
              <p className="text-xs font-medium">이전 저장된 이미지가 없습니다.</p>
            </div>
          )}
        </div>
        
        <div className="mt-auto space-y-3 relative z-10">
          <p className="text-[11px] text-white/40">
            다운로드 일자: {new Date(downloadedAt).toLocaleDateString()}
          </p>
          
          {isExpired ? (
            <button disabled className="w-full py-3 rounded-xl bg-white/5 text-white/40 text-sm font-bold border border-white/5 cursor-not-allowed">
              기간 만료. 새로 생성해주세요
            </button>
          ) : (
            <button 
              onClick={handleDownload}
              disabled={!imageUrl || isDownloading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 disabled:shadow-none"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {imageUrl ? '재다운로드' : '사용 불가'}
            </button>
          )}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          />
          <div className="relative z-10 bg-[#111827] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">기록을 삭제하시겠습니까?</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  이 다운로드 기록을 삭제하시겠습니까?<br />
                  <span className="text-rose-400/80 font-medium">삭제된 기록은 복구할 수 없습니다.</span>
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm font-bold transition-colors disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isDeleting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> 삭제 중...</>
                  ) : (
                    '삭제'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
