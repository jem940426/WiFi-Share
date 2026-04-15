'use server';

import { createClient } from '@/infrastructure/supabase/server';
import { Result, success, failure } from '@/domain/result';

/**
 * 비밀번호 재설정 이메일 발송
 * Supabase Auth의 resetPasswordForEmail API를 사용합니다.
 */
export const sendPasswordResetEmail = async (
  email: string
): Promise<Result<null, { message: string }>> => {
  if (!email || !email.trim()) {
    return failure({ message: '이메일을 입력해주세요.' });
  }

  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL ? '' : ''}${typeof window !== 'undefined' ? window.location.origin : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/auth/login`,
  });

  if (error) {
    return failure({ message: error.message });
  }

  return success(null);
};
