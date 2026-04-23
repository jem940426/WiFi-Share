'use client';

import React, { useRef } from 'react';
import { useWiFiForm } from '@/presentation/hooks/use-wifi-form';
import { useAiTemplate } from '@/presentation/hooks/use-ai-template';
import { WiFiForm } from '@/presentation/components/wifi-form';
import { WiFiPreview } from '@/presentation/components/wifi-preview';
import { DownloadButton } from '@/presentation/components/download-button';
import { TemplateSelector } from '@/presentation/components/template-selector';
import { ScanLine, Lock } from 'lucide-react';
import { TEMPLATES } from '@/domain/template';

export default function Home() {
  const {
    config,
    handleChange,
    wifiStringResult,
    templateId,
    setTemplateId,
    unlockedIds,
    unlockTemplate,
    removeUnlockId,
    clearAllUnlocks,
    currentUser,
  } = useWiFiForm();

  // AI 템플릿 상태 관리
  const {
    aiPrompt,
    setAiPrompt,
    isGenerating,
    aiStyle,
    aiError,
    generateStyle,
    resetStyle: resetAiStyle,
  } = useAiTemplate();

  const previewRef = useRef<HTMLDivElement>(null);

  const isSsidEmpty = !config.ssid.trim();
  const isInputComplete =
    !isSsidEmpty && (config.encryption === 'nopass' || (config.password || '').trim() !== '');

  const displaySsid = isSsidEmpty ? 'MY HOME WIFI' : config.ssid;
  const displayWifiString = isSsidEmpty
    ? 'WIFI:T:WPA;S:MY HOME WIFI;P:dummy;;'
    : wifiStringResult.isSuccess
      ? wifiStringResult.value
      : '';

  const activeTemplateInfo = TEMPLATES[templateId];
  const isTemplateLocked = activeTemplateInfo.isPremium && !unlockedIds.has(templateId);
  
  // AI 생성형: 스타일이 없는 경우에만 오버레이 처리 (결제 여부 무관)
  const isAiNoStyle = templateId === 'ai' && !aiStyle;
  
  // 기존 템플릿용 프리미엄 블록
  const isPremiumBlocked =
    activeTemplateInfo.isPremium && templateId !== 'ai' && (isTemplateLocked || !isInputComplete);
    
  // 프리뷰 상호작용 차단
  const isPreviewBlocked = isSsidEmpty || isPremiumBlocked || isAiNoStyle;
  
  // 다운로드 버튼 비활성화
  const isDownloadBlocked = isPreviewBlocked || (templateId === 'ai' && isTemplateLocked);

  // 유료 템플릿 중 하나라도 언락된 경우 입력 필드 잠금
  const hasUnlockedPremium = Array.from(unlockedIds).some(id => id !== 'basic');
  const isInputDisabled = hasUnlockedPremium;

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-4 border border-blue-500/20">
            <ScanLine className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-4 tracking-tight">
            WiFi-Share
          </h1>
          <p className="text-lg text-white/50 font-medium max-w-xl mx-auto">
            네트워크 정보를 입력하기만 하면 즉시 QR 코드가 생성됩니다.<br />
            어디서든 간편하게 공유할 수 있는 카드로 저장하세요.
          </p>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-20">

          {/* 좌측: 입력 폼 & 템플릿 선택기 */}
          <div className="w-full lg:w-[450px] flex flex-col items-center lg:items-end">
            <WiFiForm config={config} onChange={handleChange} isDisabled={isInputDisabled} />
            <TemplateSelector
              activeTemplateId={templateId}
              onSelect={setTemplateId}
              unlockedIds={unlockedIds}
              unlockTemplate={unlockTemplate}
              removeUnlockId={removeUnlockId}
              clearAllUnlocks={clearAllUnlocks}
              config={config}
              isInputComplete={isInputComplete}
              currentUser={currentUser}
              aiStyle={aiStyle}
              aiPrompt={aiPrompt}
              setAiPrompt={setAiPrompt}
              isGenerating={isGenerating}
              aiError={aiError}
              onGenerate={generateStyle}
              onResetAiStyle={resetAiStyle}
            />
          </div>

          {/* 우측: 프리뷰 & 다운로드 */}
          <div className="w-full lg:w-auto flex flex-col items-center lg:items-start pl-0 lg:pl-4 mt-8 lg:mt-0 relative">
            <div className="relative group perspective-1000">
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${
                  templateId === 'ai'
                    ? 'from-violet-500 to-pink-500'
                    : 'from-blue-500 to-indigo-500'
                } rounded-[2.5rem] blur transition duration-1000 ${
                  isPreviewBlocked
                    ? 'opacity-20'
                    : 'opacity-25 group-hover:opacity-50 group-hover:duration-200'
                }`}
              />
              <div
                className={`relative transform transition-all duration-500 ${
                  isPreviewBlocked ? 'select-none pointer-events-none' : ''
                }`}
              >
                <WiFiPreview
                  ref={previewRef}
                  templateId={templateId}
                  wifiString={displayWifiString}
                  ssid={displaySsid}
                  isLocked={templateId === 'ai' ? isTemplateLocked : isPreviewBlocked}
                  aiStyle={aiStyle}
                />
              </div>

              {/* 빈 상태 오버레이 */}
              {isSsidEmpty && !isTemplateLocked && !activeTemplateInfo.isPremium && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
                  <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 shadow-2xl">
                    <p className="text-white font-bold tracking-wide">
                      네트워크 이름을<br />입력해주세요
                    </p>
                  </div>
                </div>
              )}

              {/* AI 스타일 없는 경우 안내 오버레이 */}
              {isAiNoStyle && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden rounded-3xl pointer-events-none select-none">
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px]" />
                  <div className="relative bg-black/70 backdrop-blur-md px-5 py-4 rounded-2xl border border-violet-500/30 shadow-2xl text-center">
                    <p className="text-white/90 text-[13px] font-bold tracking-wide">
                      왼쪽에서 분위기를<br />입력하고 생성하세요 ✨
                    </p>
                  </div>
                </div>
              )}

              {/* 잠금/결제 필요 오버레이 (기존 템플릿 전용) */}
              {isPremiumBlocked && !isAiNoStyle && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden rounded-3xl pointer-events-none select-none">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[6px]" />
                  <div className="absolute inset-0 flex items-center justify-center transform -rotate-12">
                    <span className="text-6xl font-black text-white/30 tracking-widest drop-shadow-lg">
                      SAMPLE
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-0 right-0 text-center">
                    <div className="inline-block bg-black/70 backdrop-blur-md px-5 py-3 rounded-2xl border border-blue-500/30 shadow-2xl">
                      <Lock className="w-5 h-5 text-rose-400 mb-1 mx-auto" />
                      <p className="text-white/90 text-[13px] font-bold tracking-wide">
                        결제 후 선명한 고화질로<br />다운로드 가능합니다
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full flex justify-center mt-6">
              <div className={isDownloadBlocked ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}>
                <DownloadButton targetRef={previewRef} ssid={config.ssid} templateId={templateId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
