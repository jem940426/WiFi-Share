import React from 'react';
import { createClient } from '@/infrastructure/supabase/server';
import { Users } from 'lucide-react';
import { TEMPLATES } from '@/domain/template';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = createClient();
  
  // 1. 전체 가입 유저 수
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // 2. 가장 최근 가입한 유저들
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('id, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  // 3. 템플릿 언락 통계
  const { data: unlocks } = await supabase.from('unlock_history').select('template_id');
  const unlockStats: Record<string, number> = {};
  unlocks?.forEach((u) => {
    unlockStats[u.template_id] = (unlockStats[u.template_id] || 0) + 1;
  });

  // 4. 최근 Flow 로그
  const { data: flowLogs } = await supabase
    .from('user_flow_logs')
    .select('id, user_id, action, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <div className="min-h-[calc(100vh-64px)] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-2">
            Admin Dashboard
          </h2>
          <p className="text-white/60 font-medium">관리자 전용 대시보드입니다.</p>
        </div>

        {/* 상단 통합 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-white/50 text-sm font-semibold mb-1">총 가입 유저</p>
            <h3 className="text-3xl font-black text-white">{totalUsers || 0}명</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 최근 가입 유저 목록 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-4">최근 가입 유저</h3>
            <div className="space-y-3">
              {recentUsers?.map((u) => (
                <div key={u.id} className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="text-sm text-white/80 font-medium truncate max-w-[200px]">{u.id}</span>
                  <span className="text-xs text-white/40">{new Date(u.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 템플릿별 언락 횟수 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-4">템플릿별 언락 통계</h3>
            <div className="space-y-3">
              {Object.keys(TEMPLATES).map((tmplId) => {
                const info = TEMPLATES[tmplId as keyof typeof TEMPLATES];
                if (!info.isPremium) return null; // 무료는 제외가능
                return (
                  <div key={tmplId} className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                    <span className="text-sm font-medium text-white/80">{info.name}</span>
                    <span className="text-sm font-bold text-white bg-blue-500/20 px-3 py-1 rounded-md">
                      {unlockStats[tmplId] || 0}회
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 최신 플로우 액션 로그 */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
          <h3 className="text-xl font-bold text-white mb-4">실시간 플로우 로그 (최근 10건)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-sm text-white/50">
                  <th className="pb-3 font-medium">시간</th>
                  <th className="pb-3 font-medium">액션</th>
                  <th className="pb-3 font-medium">유저 ID</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {flowLogs?.map((log) => (
                    <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 text-white/60 w-32">{new Date(log.created_at).toLocaleTimeString()}</td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-white/10 rounded-md font-semibold text-white/80">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 text-white/40 truncate max-w-[150px]" title={log.user_id}>{log.user_id}</td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
