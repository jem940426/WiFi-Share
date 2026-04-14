'use client';

import React, { useState } from 'react';
import { signUpUser } from '@/application/auth/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, MailCheck } from 'lucide-react';

export default function SignUpPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

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
