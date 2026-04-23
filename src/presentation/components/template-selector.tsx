import React, { useState } from 'react';
import { TEMPLATES, TemplateId, TemplateInfo } from '@/domain/template';
import { AiTemplateStyle } from '@/domain/ai-template';
import { User } from '@supabase/supabase-js';
import { Lock, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { PaymentModal } from './payment-modal';
import { ConfirmModal } from './confirm-modal';
import { WiFiConfig } from '@/domain/types';

import { BasicTemplate } from './templates/BasicTemplate';
import { InteriorTemplate } from './templates/InteriorTemplate';
import { CafeTemplate } from './templates/CafeTemplate';
import { PosterTemplate } from './templates/PosterTemplate';
import { AiTemplate } from './templates/AiTemplate';

// AI 템플릿 기본 스타일 (프리뷰 호버용)
const DEFAULT_AI_PREVIEW_STYLE: AiTemplateStyle = {
  backgroundColor: '#1a1a2e',
  pointColor: '#e94560',
  fontStyle: 'sans-serif',
  topText: '편하게 연결하세요',
  bottomText: 'Scan to Connect',
};

interface Props {
  activeTemplateId: TemplateId;
  onSelect: (id: TemplateId) => void;
  unlockedIds: Set<TemplateId>;
  unlockTemplate: (id: TemplateId) => void;
  config: WiFiConfig;
  isInputComplete: boolean;
  currentUser: User | null;
  // AI 관련 props
  aiStyle: AiTemplateStyle | null;
  aiPrompt: string;
  setAiPrompt: (v: string) => void;
  isGenerating: boolean;
  aiError: string;
  onGenerate: () => Promise<void>;
  onResetAiStyle: () => void;
}

export const TemplateSelector: React.FC<Props> = ({
  activeTemplateId,
  onSelect,
  unlockedIds,
  unlockTemplate,
  config,
  isInputComplete,
  currentUser,
  aiStyle,
  aiPrompt,
  setAiPrompt,
  isGenerating,
  aiError,
  onGenerate,
  onResetAiStyle,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] = useState<TemplateId | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTemplateClick = async (id: TemplateId) => {
    const tpl = TEMPLATES[id];
    const { logUserAction } = await import('@/application/history/actions');
    logUserAction('template_selected');

    // 잠겨있는 프리미엄 템플릿이라면
    if (tpl.isPremium && !unlockedIds.has(id)) {
      if (!currentUser) {
        showToast('결제 및 다운로드 기록 저장을 위해 먼저 로그인해주세요.');
        return;
      }
      if (!isInputComplete) {
        showToast('먼저 네트워크 정보를 완벽하게 입력해주세요.');
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
    ai: (
      <AiTemplate
        wifiString=""
        ssid="PREVIEW"
        style={aiStyle ?? DEFAULT_AI_PREVIEW_STYLE}
      />
    ),
  };

  // AI 생성형 버튼 — 잠금 해제 여부와 무관하게 항상 표시
  const isAiActive = activeTemplateId === 'ai';
  const isAiLocked = !unlockedIds.has('ai');
  // AI 템플릿이 언락됐고 아직 스타일이 없을 때 표시할 입력창
  const showAiInput = isAiActive && !isAiLocked;

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

        {/* 기존 4종 + AI 생성형 버튼 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(Object.values(TEMPLATES) as TemplateInfo[]).map((tpl) => {
            const isActive = activeTemplateId === tpl.id;
            const isLocked = tpl.isPremium && !unlockedIds.has(tpl.id);
            const isAi = tpl.isAiGenerated;

            return (
              <button
                key={tpl.id}
                onClick={() => handleTemplateClick(tpl.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-sm font-medium h-24 relative group
                  ${
                    isActive
                      ? isAi
                        ? 'bg-violet-500/10 border-violet-500 text-violet-400 shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)]'
                        : 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]'
                      : isAi
                        ? 'bg-gradient-to-br from-violet-500/10 to-pink-500/10 border-violet-500/30 text-violet-300 hover:border-violet-400/50 hover:from-violet-500/15 hover:to-pink-500/15'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'
                  }`}
              >
                {/* 팝업 프리뷰 (호버 시 노출) */}
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

                {/* 잠금 아이콘 */}
                <div className="absolute top-2 right-2 text-white/40 group-hover:text-white/80 transition-colors z-10 w-fit flex justify-end">
                  {isLocked && <Lock size={14} className="text-rose-400/80 group-hover:text-rose-400" />}
                </div>

                <div className="z-10 w-full flex flex-col items-center gap-1.5 mt-1">
                  {/* AI 생성형 아이콘 */}
                  {isAi && (
                    <Sparkles
                      size={16}
                      className={`mb-0.5 ${isActive ? 'text-violet-400' : 'text-violet-400/70'}`}
                    />
                  )}
                  <span className={`text-[14px] ${isActive ? 'text-white font-bold' : ''}`}>
                    {tpl.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isActive
                        ? isAi
                          ? 'bg-violet-500/20 text-white'
                          : 'bg-blue-500/20 text-white'
                        : isAi
                          ? 'bg-violet-500/10 text-violet-300'
                          : tpl.isPremium
                            ? 'bg-rose-500/10 text-rose-300'
                            : 'bg-white/5 text-white/50'
                    }`}
                  >
                    {tpl.isPremium ? `₩${tpl.price.toLocaleString()}` : '무료'}
                  </span>
                </div>

                {isActive && (
                  <div
                    className={`absolute inset-x-0 bottom-0 h-1 ${isAi ? 'bg-violet-500' : 'bg-blue-500'}`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* AI 생성형 입력 패널 — AI 탭이 선택되고 언락된 경우에만 표시 */}
        {showAiInput && (
          <div className="mt-2 p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-pink-500/5 border border-violet-500/20 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-violet-400 shrink-0" />
              <span className="text-xs font-semibold text-violet-300">AI 디자인 생성</span>
            </div>

            {/* 이미 생성된 스타일이 있으면 결과 미리보기 카드 표시 */}
            {aiStyle ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-black/20 border border-violet-500/20">
                  <div
                    className="w-6 h-6 rounded-full shrink-0 border border-white/20"
                    style={{ backgroundColor: aiStyle.backgroundColor }}
                  />
                  <div
                    className="w-6 h-6 rounded-full shrink-0 border border-white/20"
                    style={{ backgroundColor: aiStyle.pointColor }}
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs text-white/80 font-medium truncate">{aiStyle.topText}</span>
                    <span className="text-[10px] text-white/40 truncate">{aiStyle.bottomText}</span>
                  </div>
                  <button
                    onClick={onResetAiStyle}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors shrink-0"
                    title="다시 생성"
                  >
                    <RefreshCw size={12} />
                  </button>
                </div>
                <p className="text-[10px] text-violet-300/60 text-center">
                  프리뷰에서 결과를 확인하세요 ✨
                </p>
              </div>
            ) : (
              <>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="원하는 분위기를 입력하세요&#10;예: 아늑한 카페, 브라운 톤, 손글씨 느낌"
                  disabled={isGenerating}
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white/90 placeholder:text-white/25 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all resize-none disabled:opacity-50"
                />

                {aiError && (
                  <p className="text-rose-400 text-xs font-medium">{aiError}</p>
                )}

                <button
                  onClick={onGenerate}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-violet-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      AI 생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      생성하기
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}
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
