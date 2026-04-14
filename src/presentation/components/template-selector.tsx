import React, { useState } from 'react';
import { TEMPLATES, TemplateId, TemplateInfo } from '@/domain/template';
import { Lock } from 'lucide-react';
import { PaymentModal } from './payment-modal';
import { ConfirmModal } from './confirm-modal';
import { WiFiConfig } from '@/domain/types';

import { BasicTemplate } from './templates/BasicTemplate';
import { InteriorTemplate } from './templates/InteriorTemplate';
import { CafeTemplate } from './templates/CafeTemplate';
import { PosterTemplate } from './templates/PosterTemplate';

interface Props {
  activeTemplateId: TemplateId;
  onSelect: (id: TemplateId) => void;
  unlockedIds: Set<TemplateId>;
  unlockTemplate: (id: TemplateId) => void;
  config: WiFiConfig;
  isInputComplete: boolean;
  currentUser: any;
}

export const TemplateSelector: React.FC<Props> = ({ activeTemplateId, onSelect, unlockedIds, unlockTemplate, config, isInputComplete, currentUser }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] = useState<TemplateId | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleTemplateClick = async (id: TemplateId) => {
    const tpl = TEMPLATES[id];
    const { logUserAction } = await import('@/application/history/actions');
    logUserAction('template_selected');

    // 잠겨있는 프리미엄 템플릿이라면
    if (tpl.isPremium && !unlockedIds.has(id)) {
      if (!currentUser) {
        setToastMessage('결제 및 다운로드 기록 저장을 위해 먼저 로그인해주세요.');
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }
      if (!isInputComplete) {
        setToastMessage('먼저 네트워크 정보를 완벽하게 입력해주세요.');
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }
      setPendingTemplateId(id);
      setConfirmModalOpen(true);
      return;
    }

    // 무료거나 이미 풀린 템플릿은 즉시 선택
    onSelect(id);
  };

  const handleConfirmPay = async () => {
    const { logUserAction } = await import('@/application/history/actions');
    logUserAction('payment_modal_opened');
    setConfirmModalOpen(false);
    setModalOpen(true);
  };

  const handleModifyInput = () => {
    setConfirmModalOpen(false);
    setPendingTemplateId(null);
    document.getElementById('ssid-input')?.focus();
  };

  const handleModalClose = () => {
    setModalOpen(false);
    if (pendingTemplateId && !unlockedIds.has(pendingTemplateId)) {
      onSelect(pendingTemplateId);
    }
    setPendingTemplateId(null);
  };

  const handleUnlockDemo = async () => {
    if (pendingTemplateId) {
      const { logUserAction, recordUnlock } = await import('@/application/history/actions');
      unlockTemplate(pendingTemplateId);
      onSelect(pendingTemplateId);
      
      logUserAction('unlocked');
      recordUnlock(pendingTemplateId);
      
      setPendingTemplateId(null);
    }
  };

  const pendingTemplateData = pendingTemplateId ? TEMPLATES[pendingTemplateId] : null;

  const HoverPreviews: Record<TemplateId, React.ReactNode> = {
    basic: <BasicTemplate wifiString="" ssid="PREVIEW" />,
    interior: <InteriorTemplate wifiString="" ssid="PREVIEW" />,
    cafe: <CafeTemplate wifiString="" ssid="PREVIEW" />,
    poster: <PosterTemplate wifiString="" ssid="PREVIEW" />,
  };

  return (
    <>
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-rose-500/90 text-white px-6 py-3 rounded-full shadow-lg font-medium backdrop-blur-md border border-white/20">
            {toastMessage}
          </div>
        </div>
      )}

      <div className="w-full mt-8 flex flex-col gap-3 z-0">
        <h3 className="text-sm font-medium text-white/50 flex justify-between items-center px-1">
          <span>디자인 템플릿 선택</span>
          <span className="text-blue-400 text-xs font-semibold px-2 py-1 bg-blue-500/10 rounded-full">Pro+</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.values(TEMPLATES) as TemplateInfo[]).map((tpl) => {
            const isActive = activeTemplateId === tpl.id;
            const isLocked = tpl.isPremium && !unlockedIds.has(tpl.id);
            
            return (
              <button
                key={tpl.id}
                onClick={() => handleTemplateClick(tpl.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-sm font-medium h-24 relative group 
                  ${
                  isActive
                    ? 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'
                  }`}
              >
                {/* 팝업 프리뷰 (기본적으로 숨김 처리, 호버 시 노출됨) */}
                <div className="absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60] pointer-events-none origin-bottom">
                   <div className="w-[320px] transform scale-[0.65] origin-bottom relative shadow-2xl rounded-[2rem] bg-black/5">
                      {HoverPreviews[tpl.id]}
                      {/* SAMPLE 워터마크 for premium */}
                      {tpl.isPremium && (
                          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center rounded-[2rem]">
                            <span className="text-5xl font-black text-white/60 tracking-widest drop-shadow-md transform -rotate-12">
                              SAMPLE
                            </span>
                          </div>
                      )}
                   </div>
                </div>

                {/* Status Icon */}
                <div className="absolute top-2 right-2 text-white/40 group-hover:text-white/80 transition-colors z-10 w-fit flex justify-end">
                   {isLocked && <Lock size={14} className="text-rose-400/80 group-hover:text-rose-400" />}
                </div>

                <div className="z-10 w-full flex flex-col items-center gap-1.5 mt-1">
                  <span className={`text-[14px] ${isActive ? 'text-white font-bold' : ''}`}>{tpl.name}</span>
                  {tpl.isPremium ? (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isActive ? 'bg-blue-500/20 text-white' : 'bg-rose-500/10 text-rose-300'}`}>
                      ₩{tpl.price.toLocaleString()}
                    </span>
                  ) : (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isActive ? 'bg-blue-500/20 text-white' : 'bg-white/5 text-white/50'}`}>
                      무료
                    </span>
                  )}
                </div>

                {isActive && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <PaymentModal 
        isOpen={modalOpen} 
        onClose={handleModalClose} 
        template={pendingTemplateData}
        onUnlockDemo={handleUnlockDemo}
      />

      <ConfirmModal
        isOpen={confirmModalOpen}
        config={config}
        onConfirm={handleConfirmPay}
        onModify={handleModifyInput}
        onClose={() => { setConfirmModalOpen(false); setPendingTemplateId(null); }}
      />
    </>
  );
};
