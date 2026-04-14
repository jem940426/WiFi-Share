import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * 서비스 역할(Service Role) 키를 사용하는 관리자 전용 Supabase 클라이언트입니다.
 * RLS를 우회하므로 서버 액션에서만 사용해야 합니다.
 * 절대 클라이언트 컴포넌트에서 사용하지 마세요.
 */
export const createAdminClient = () =>
  createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
