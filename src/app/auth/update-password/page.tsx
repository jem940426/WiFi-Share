'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/infrastructure/supabase/client';

export default function UpdatePasswordPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // URL 해시의 토큰(access_token, refresh_token)을 감지하고 세션으로 교환합니다.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsSessionReady(true);
      }
    });

    // 이미 세션이 수립되었거나 해시 처리가 완료된 경우를 확인합니다.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsSessionReady(true);
      } else {
        // 해시가 존재하지만 아직 처리되지 않은 경우 수동으로 세션 설정을 시도합니다.
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          }).then(({ error }) => {
            if (!error) setIsSessionReady(true);
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSessionReady) {
      setError('인증 세션이 없습니다. 메일의 링크를 다시 클릭해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const passwordConfirm = formData.get('passwordConfirm') as string;

    if (!password || !passwordConfirm) {
      setError('비밀번호를 모두 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      setIsLoading(false);
      return;
    }

    // 클라이언트 사이드에서 바로 비밀번호를 업데이트합니다.
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
    } else {
      router.push('/auth/login?message=비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-black text-white text-center mb-8">비밀번호 재설정</h2>
        
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl mb-6 text-sm font-medium whitespace-pre-wrap">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/80">새 비밀번호</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              placeholder="최소 6자 이상"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/80">새 비밀번호 확인</label>
            <input 
              name="passwordConfirm" 
              type="password" 
              required 
              className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              placeholder="비밀번호 다시 입력"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !isSessionReady}
            className="w-full py-4 mt-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center disabled:hover:scale-100"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : '비밀번호 변경하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
