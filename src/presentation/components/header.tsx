import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/application/auth/actions';
import { createClient } from '@/infrastructure/supabase/server';
import { Wifi, LogOut, User, Key } from 'lucide-react';

export default async function Header() {
  const user = await getCurrentUser();
  let isAdmin = false;

  if (user) {
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    isAdmin = !!data?.is_admin;
  }

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-lg border-b border-white/10 bg-black/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
            <Wifi className="w-5 h-5 text-blue-400" />
          </div>
          <span className="font-black text-white tracking-wide">WiFi-Share</span>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link href="/admin" className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full hover:bg-white/10">
                  <Key className="w-4 h-4" />
                  어드민
                </Link>
              )}
              <Link href="/my-downloads" className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full hover:bg-white/10">
                <User className="w-4 h-4" />
                마이 기록
              </Link>
              <form action={async () => {
                'use server';
                const { handleSignOut } = await import('@/application/auth/signout-action');
                await handleSignOut();
              }}>
                <button type="submit" className="text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 rounded-full hover:bg-rose-500/20">
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                로그인
              </Link>
              <Link href="/auth/signup" className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-full transition-colors shadow-lg shadow-blue-500/20">
                회원가입
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
