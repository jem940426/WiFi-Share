'use server';

import { createClient } from '@/infrastructure/supabase/server';
import { Result, success, failure } from '@/domain/result';

/**
 * 비밀번호 업데이트
 * 사용자의 비밀번호를 새 비밀번호로 변경합니다.
 */
export const updatePassword = async (
  formData: FormData
): Promise<Result<null, { message: string }>> => {
  const password = formData.get('password') as string;
  const passwordConfirm = formData.get('passwordConfirm') as string;

  if (!password || !passwordConfirm) {
    return failure({ message: '비밀번호를 모두 입력해주세요.' });
  }

  if (password !== passwordConfirm) {
    return failure({ message: '비밀번호가 일치하지 않습니다.' });
  }

  if (password.length < 6) {
    return failure({ message: '비밀번호는 6자 이상이어야 합니다.' });
  }

  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return failure({ message: error.message });
  }

  return success(null);
};
