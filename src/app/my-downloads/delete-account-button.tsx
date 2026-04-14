'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, UserX, AlertTriangle } from 'lucide-react';
import { deleteAccount } from '@/application/user/actions';

export const DeleteAccountButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAccount();
      if (result.isSuccess) {
        // 탈퇴 완료 후 메인으로 이동
        router.push('/');
        router.refresh();
      } else {
        alert('탈퇴 처리 중 오류가 발생했습니다: ' + result.error.message);
        setIsDeleting(false);
        setShowModal(false);
      }
    } catch (e) {
      alert('탈퇴 처리 중 예상치 못한 오류가 발생했습니다.');
      setIsDeleting(false);
      setShowModal(false);
    }
  };

  return (
    <>
      {/* 탈퇴 버튼 */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-5 py-2.5 text-rose-400 hover:text-rose-300 border border-rose-500/30 hover:border-rose-400/60 rounded-xl text-sm font-semibold transition-all hover:bg-rose-500/10"
      >
        <UserX className="w-4 h-4" />
        탈퇴하기
      </button>

      {/* 탈퇴 확인 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 배경 오버레이 */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !isDeleting && setShowModal(false)}
          />
          {/* 모달 박스 */}
          <div className="relative z-10 bg-[#111827] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-rose-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">정말 탈퇴하시겠습니까?</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  탈퇴 시 모든 다운로드 기록과 계정 정보가<br />
                  <span className="text-rose-400 font-semibold">영구적으로 삭제</span>되며 복구할 수 없습니다.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm font-bold transition-colors disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isDeleting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> 탈퇴 처리 중...</>
                  ) : (
                    '탈퇴 확인'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
