'use client';

import React, { useState } from 'react';
import { signUpUser } from '@/application/auth/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, MailCheck } from 'lucide-react';
import { createClient } from '@/infrastructure/supabase/client';

export default function SignUpPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    const supabase = createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wifi-share-fawn.vercel.app';
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/`,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await signUpUser(formData);

    if (!result.isSuccess) {
      if (result.error.message === 'ALREADY_REGISTERED') {
        setShowLoginModal(true);
      } else {
        setError(result.error.message);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setShowSuccessPopup(true);
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
          <h2 className="text-3xl font-black text-white text-center mb-8">회원가입</h2>
          
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl mb-6 text-sm font-medium whitespace-pre-wrap">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/80">이메일</label>
              <input 
                name="email" 
                type="email" 
                required 
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                placeholder="hello@example.com"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/80">비밀번호</label>
              <input 
                name="password" 
                type="password" 
                required 
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                placeholder="최소 6자 이상"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center disabled:hover:scale-100"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : '회원가입 하기'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center space-x-2">
            <div className="h-px bg-white/10 w-full"></div>
            <span className="text-white/40 text-xs font-medium whitespace-nowrap">또는</span>
            <div className="h-px bg-white/10 w-full"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3.5 mt-6 rounded-xl bg-white text-black font-bold text-base shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center disabled:hover:scale-100 gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google로 계속하기
          </button>

          <p className="mt-8 text-center text-white/50 text-sm font-medium">
            이미 계정이 있으신가요? {' '}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
              로그인
            </Link>
          </p>
        </div>
      </div>

      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl scale-in-95 animate-in slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MailCheck className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">인증 메일 발송 완료</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-8">
              입력하신 이메일로 인증 메일을 발송했습니다.<br/>
              메일함을 확인 후 인증을 완료하면<br/>
              로그인이 가능합니다. 😊
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full py-3.5 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 이미 가입된 계정 안내 팝업 */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl scale-in-95 animate-in slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MailCheck className="w-8 h-8 text-rose-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">이미 가입된 계정</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-8">
              이미 가입된 이메일입니다.<br/>
              로그인 페이지로 이동하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 py-3.5 bg-white/5 text-white/70 font-bold rounded-xl hover:bg-white/10 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => router.push('/auth/login')}
                className="flex-1 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
