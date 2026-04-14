'use server';

import { createClient } from '@/infrastructure/supabase/server';
import { Result, success, failure } from '@/domain/result';

export const signUpUser = async (formData: FormData): Promise<Result<null, { message: string }>> => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password) return failure({ message: '이메일과 비밀번호를 모두 입력해주세요.' });

  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    if (error.message.includes('User already registered')) {
      return failure({ message: '이미 가입된 이메일입니다. 로그인해주세요.' });
    }
    return failure({ message: error.message });
  }
  
  return success(null);
};

export const signInUser = async (formData: FormData): Promise<Result<null, { message: string }>> => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) return failure({ message: '이메일과 비밀번호를 모두 입력해주세요.' });

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let msg = error.message;
    if (msg.includes('Email not confirmed')) {
      msg = '이메일 인증이 완료되지 않았습니다.\n메일함을 확인해주세요.';
    } else if (msg.includes('Invalid login credentials')) {
      msg = '입력하신 이메일 또는 비밀번호가 올바르지 않습니다.';
    }
    return failure({ message: msg });
  }

  return success(null);
};

export const signOutUser = async (): Promise<Result<null, { message: string }>> => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  
  if (error) return failure({ message: error.message });
  
  return success(null);
};

export const getCurrentUser = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // 클래스 인스턴스 대신 순수 plain object로 직렬화하여 클라이언트에 내려줍니다.
  return user ? JSON.parse(JSON.stringify(user)) : null;
};
