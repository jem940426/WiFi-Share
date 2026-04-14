import React, { useState, useEffect } from 'react';
import { WiFiConfig } from '@/domain/types';
import { ShieldCheck, Wifi, KeyRound } from 'lucide-react';

interface Props {
  isOpen: boolean;
  config: WiFiConfig;
  onConfirm: () => void;
  onModify: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<Props> = ({ isOpen, config, onConfirm, onModify, onClose }) => {
  const [confirmValue, setConfirmValue] = useState('');

  // 모달이 열릴 때마다 입력 필드 초기화
  useEffect(() => {
    if (isOpen) {
      setConfirmValue('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const requiresPassword = config.encryption !== 'nopass';
  const isMatched = !requiresPassword || confirmValue === config.password;
  const showMismatchError = requiresPassword && confirmValue.length > 0 && !isMatched;
  const showMatchSuccess = requiresPassword && confirmValue.length > 0 && isMatched;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-[2rem] w-full max-w-sm shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">입력 정보 확인</h2>
          <p className="text-white/60 text-sm">아래 정보로 고품질 QR 카드를 생성합니다.</p>
        </div>

        <div className="bg-white/5 rounded-2xl p-5 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-sm flex items-center gap-2">
              <Wifi size={14} /> 네트워크 이름
            </span>
            <span className="text-white font-medium break-all text-right max-w-[150px]">
              {config.ssid}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/50 text-sm flex items-center gap-2">
              <ShieldCheck size={14} /> 보안 방식
            </span>
            <span className="text-white font-medium">
              {config.encryption === 'nopass' ? '없음' : config.encryption}
            </span>
          </div>

          <div className="pt-2 border-t border-white/10">
            {requiresPassword ? (
              <div className="space-y-2 mt-2">
                <label className="text-white/80 text-sm flex items-center gap-2 font-medium">
                  <KeyRound size={14} className="text-blue-400" /> 비밀번호 확인
                </label>
                <input
                  type="password"
                  value={confirmValue}
                  onChange={(e) => setConfirmValue(e.target.value)}
                  placeholder="비밀번호를 한 번 더 입력해주세요"
                  className={`w-full px-4 py-3 rounded-xl bg-black/20 border text-white placeholder:text-white/30 focus:outline-none transition-all font-medium ${
                    showMatchSuccess 
                      ? 'border-green-500/50 focus:ring-2 focus:ring-green-500' 
                      : showMismatchError 
                        ? 'border-rose-500/50 focus:ring-2 focus:ring-rose-500'
                        : 'border-white/10 focus:ring-2 focus:ring-blue-500'
                  }`}
                />
                {showMismatchError && (
                  <p className="text-rose-400 text-xs font-bold pl-1 animate-in slide-in-from-top-1">
                    비밀번호가 일치하지 않습니다
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between py-2">
                <span className="text-white/50 text-sm flex items-center gap-2">
                  <KeyRound size={14} /> 비밀번호
                </span>
                <span className="text-white font-medium font-mono text-white/50">
                  -
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            disabled={!isMatched}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
          >
            확인 후 결제하기
          </button>
          
          <button
            onClick={onModify}
            className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
          >
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
};
