'use server';

import { createClient } from '@/infrastructure/supabase/server';
import { createAdminClient } from '@/infrastructure/supabase/admin';
import { getCurrentUser } from '@/application/auth/actions';
import { Result, success, failure } from '@/domain/result';
import { revalidatePath } from 'next/cache';

/**
 * Supabase Storage의 퍼블릭 URL에서 파일 경로(path)를 추출합니다.
 * 예: "https://.../storage/v1/object/public/qrcodes/xxx.png" → "xxx.png"
 */
const extractFilePath = (imageUrl: string): string | null => {
  const marker = '/object/public/qrcodes/';
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) return null;
  return imageUrl.slice(idx + marker.length);
};

/**
 * 특정 다운로드 내역 1건을 삭제합니다.
 * - download_history 테이블 row 삭제
 * - Supabase Storage 이미지 파일 삭제
 */
export const deleteDownloadRecord = async (
  recordId: string,
  imageUrl?: string
): Promise<Result<null, { message: string }>> => {
  const user = await getCurrentUser();
  if (!user) return failure({ message: '로그인이 필요합니다.' });

  const supabase = createClient();

  console.log('Attempting to delete record:', { recordId, userId: user.id });

  // 1. DB row 삭제 (본인 데이터만 허용)
  const { error: dbError, count } = await supabase
    .from('download_history')
    .delete({ count: 'exact' }) // 삭제된 행 개수 확인을 위해 count 옵션 추가
    .eq('id', recordId)
    .eq('user_id', user.id);

  if (dbError) {
    console.error('Database Delete Error:', dbError.message);
    return failure({ message: dbError.message });
  }

  console.log('Database Delete Success. Rows affected:', count);

  // 2. Storage 이미지 삭제
  if (imageUrl) {
    const filePath = extractFilePath(imageUrl);
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from('qrcodes')
        .remove([filePath]);
      // 스토리지 삭제 실패는 기록 삭제 성공 후이므로 로그만 남깁니다.
      if (storageError) console.error('Storage file delete failed:', storageError.message);
    }
  }

  revalidatePath('/my-downloads');
  return success(null);
};

/**
 * 회원 탈퇴를 처리합니다.
 * - 해당 유저의 모든 테이블 데이터 삭제
 * - Storage의 QR 이미지 파일 전체 삭제
 * - Supabase Auth에서 계정 영구 삭제 (Service Role Key 필요)
 */
export const deleteAccount = async (): Promise<Result<null, { message: string }>> => {
  const user = await getCurrentUser();
  if (!user) return failure({ message: '로그인이 필요합니다.' });

  const supabase = createClient();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey || serviceKey.includes('your_service_role_key')) {
    return failure({ message: '탈퇴 기능 사용을 위해 SUPABASE_SERVICE_ROLE_KEY 설정이 필요합니다.' });
  }

  const adminClient = createAdminClient();

  // 1. 해당 유저의 이미지 URL 목록 수집 (Storage 파일 삭제를 위해)
  const { data: historyData } = await supabase
    .from('download_history')
    .select('image_url')
    .eq('user_id', user.id);

  // 2. Storage 이미지 일괄 삭제
  if (historyData && historyData.length > 0) {
    const filePaths = historyData
      .map((row) => (row.image_url ? extractFilePath(row.image_url) : null))
      .filter((p): p is string => p !== null);

    if (filePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('qrcodes')
        .remove(filePaths);
      if (storageError) console.error('Storage bulk delete failed:', storageError.message);
    }
  }

  // 3. 관련 테이블 데이터 삭제
  await supabase.from('download_history').delete().eq('user_id', user.id);
  await supabase.from('unlock_history').delete().eq('user_id', user.id);
  await supabase.from('user_flow_logs').delete().eq('user_id', user.id);

  // 4. Supabase Auth에서 계정 완전 삭제 (Service Role Key 필요)
  const { error: authError } = await adminClient.auth.admin.deleteUser(user.id);
  if (authError) return failure({ message: '계정 삭제 중 오류가 발생했습니다: ' + authError.message });

  revalidatePath('/my-downloads');
  revalidatePath('/admin');
  
  return success(null);
};
