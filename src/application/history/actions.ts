'use server';

import { createClient } from '@/infrastructure/supabase/server';
import { Result, success, failure } from '@/domain/result';
import { getCurrentUser } from '@/application/auth/actions';

export const logUserAction = async (action: string): Promise<Result<null, { message: string }>> => {
  const user = await getCurrentUser();
  if (!user) return success(null); // 비로그인 유저는 로그 생략

  const supabase = createClient();
  const { error } = await supabase
    .from('user_flow_logs')
    .insert({ user_id: user.id, action });

  if (error) return failure({ message: error.message });
  return success(null);
};

export const recordUnlock = async (templateId: string, ssid: string): Promise<Result<null, { message: string }>> => {
  const user = await getCurrentUser();
  if (!user) return success(null); // 비로그인 유저는 언락 기록 생략

  const supabase = createClient();
  const { error } = await supabase
    .from('unlock_history')
    .insert({ user_id: user.id, template_id: templateId, ssid });

  if (error) return failure({ message: error.message });
  return success(null);
};

export const deleteUnlock = async (templateId: string, ssid: string): Promise<Result<null, { message: string }>> => {
  const user = await getCurrentUser();
  if (!user) return success(null);

  const supabase = createClient();
  const { error } = await supabase
    .from('unlock_history')
    .delete()
    .eq('user_id', user.id)
    .eq('template_id', templateId)
    .eq('ssid', ssid);

  if (error) return failure({ message: error.message });
  return success(null);
};

import { revalidatePath } from 'next/cache';

export const recordDownload = async (templateId: string, ssid: string, imageUrl?: string): Promise<Result<null, { message: string }>> => {
  const user = await getCurrentUser();
  if (!user) return success(null); // 비로그인 시 로그 생략

  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const supabase = createClient();
  const { error } = await supabase
    .from('download_history')
    .insert({
      user_id: user.id,
      template_id: templateId,
      ssid: ssid || 'MY HOME WIFI', // 빈칸일 때 기본값 설정
      image_url: imageUrl, // 이미지 주소 저장
      expires_at: expiresAt.toISOString(),
    });

  if (error) return failure({ message: error.message });
  
  // 성공적으로 삽입 후 /my-downloads 캐시 초기화
  revalidatePath('/my-downloads');
  return success(null);
};

// 템플릿 언락 상태 조회
export const getUnlockedTemplates = async (ssid: string): Promise<Result<string[], { message: string }>> => {
  const user = await getCurrentUser();
  if (!user) return success([]);

  const supabase = createClient();
  const { data, error } = await supabase
    .from('unlock_history')
    .select('template_id')
    .eq('user_id', user.id)
    .eq('ssid', ssid);

  if (error) return failure({ message: error.message });
  
  return success(data.map((d: { template_id: string }) => d.template_id));
};
