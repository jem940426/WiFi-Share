'use client';

import React, { useState } from 'react';
import { sendPasswordResetEmail } from '@/application/auth/reset-password-action';
import Link from 'next/link';
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

/**
 * 비밀번호 재설정 이메일 발송 페이지
 * /auth/reset-password 경로로 접근
 */
export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await sendPasswordResetEmail(email);

    if (!result.isSuccess) {
      setError(result.error.message);
      setIsLoading(false);
    } else {
      setIsSent(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">

        {/* 성공 상태: 이메일 발송 완료 안내 */}
        {isSent ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-black text-white mb-3">메일을 확인해주세요</h2>
            <p className="text-white/60 text-sm font-medium leading-relaxed mb-8">
              입력하신 이메일로<br />
              비밀번호 재설정 메일을 발송했습니다.<br />
              <span className="text-white/40 text-xs mt-2 inline-block">
                메일이 보이지 않으면 스팸함을 확인해주세요.
              </span>
            </p>
            <Link
              href="/auth/login"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              로그인으로 돌아가기
            </Link>
          </div>
        ) : (
          <>
            {/* 입력 상태: 이메일 입력 폼 */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center mb-5 border border-blue-500/20">
                <Mail className="w-7 h-7 text-blue-400" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2">비밀번호 재설정</h2>
              <p className="text-white/50 text-sm font-medium">
                가입할 때 사용한 이메일을 입력해주세요.
              </p>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-2xl mb-6 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-black/20 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  placeholder="hello@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center disabled:hover:scale-100"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : '재설정 메일 보내기'}
              </button>
            </form>

            <p className="mt-8 text-center text-white/50 text-sm font-medium">
              비밀번호가 기억나셨나요?{' '}
              <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                로그인
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
