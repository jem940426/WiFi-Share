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
  // 배포 환경 URL 우선, 없으면 Vercel 배포 주소로 고정 (localhost 방지)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wifi-share-fawn.vercel.app';

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/update-password`,
  });

  if (error) {
    return failure({ message: error.message });
  }

  return success(null);
};
