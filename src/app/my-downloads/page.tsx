import React from 'react';
import { createClient } from '@/infrastructure/supabase/server';
import { getCurrentUser } from '@/application/auth/actions';
import { TEMPLATES, TemplateId } from '@/domain/template';
import Link from 'next/link';


import { HistoryCard } from './history-card';
import { DeleteAccountButton } from './delete-account-button';

export const dynamic = 'force-dynamic';

export default async function MyDownloadsPage() {
  const user = await getCurrentUser();
  if (!user) return null; // Middleware will redirect

  const supabase = createClient();
  const { data: downloads } = await supabase
    .from('download_history')
    .select('*')
    .eq('user_id', user.id)
    .order('downloaded_at', { ascending: false });

  const now = new Date();

  return (
    <div className="min-h-[calc(100vh-64px)] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">나의 다운로드 내역</h2>
          <p className="text-white/60 font-medium tracking-wide">
            이전에 다운로드한 고화질 QR 코드 템플릿을 확인하고 바로 재다운로드할 수 있습니다.
          </p>
        </div>

        {(!downloads || downloads.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
            <p className="text-white/60 font-medium mb-4">아직 다운로드한 내역이 없습니다.</p>
            <Link href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all shadow-lg shadow-blue-500/20">
              템플릿 만들러 가기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((item) => {
              const expiresAt = new Date(item.expires_at);
              const isExpired = expiresAt <= now;
              const templateInfo = TEMPLATES[item.template_id as TemplateId];
              
              const diffTime = expiresAt.getTime() - now.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              return (
                <HistoryCard 
                  key={item.id}
                  id={item.id}
                  templateName={templateInfo?.name || '알 수 없는 템플릿'}
                  ssid={item.ssid}
                  downloadedAt={item.downloaded_at}
                  imageUrl={item.image_url}
                  isExpired={isExpired}
                  diffDays={diffDays}
                />
              );
            })}
          </div>
        )}

        {/* 계정 탈퇴 영역 */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white/50 mb-1">계정 삭제</h3>
            <p className="text-xs text-white/30">탈퇴 시 모든 다운로드 기록과 계정 정보가 영구 삭제됩니다.</p>
          </div>
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}
