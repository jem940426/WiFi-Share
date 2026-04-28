import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: '개인정보 처리방침 | WiFi-Share',
  description: 'WiFi-Share 서비스의 개인정보 수집·이용에 관한 처리방침입니다.',
};

// 처리방침 섹션 데이터 타입 정의
interface PolicySection {
  id: string;
  title: string;
  content: React.ReactNode;
}

// 처리방침 시행일
const EFFECTIVE_DATE = '2026년 4월 28일';

// 정책 섹션 목록
const SECTIONS: PolicySection[] = [
  {
    id: 'collection',
    title: '1. 수집하는 개인정보 항목',
    content: (
      <div className="space-y-2">
        <p className="text-white/70">WiFi-Share는 회원가입 및 서비스 제공을 위해 아래의 최소한의 개인정보만을 수집합니다.</p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left pb-3 text-white/50 font-medium w-1/3">구분</th>
                <th className="text-left pb-3 text-white/50 font-medium">항목</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 text-white/70 font-medium">필수 수집 항목</td>
                <td className="py-3 text-white/70">이메일 주소</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    id: 'purpose',
    title: '2. 개인정보의 수집 및 이용 목적',
    content: (
      <div className="space-y-3">
        <p className="text-white/70">수집한 개인정보는 다음의 목적을 위해서만 사용됩니다.</p>
        <ul className="space-y-2">
          {[
            '회원 식별 및 회원가입 처리',
            '로그인 인증 및 본인 확인',
            'WiFi-Share 서비스 이용 (QR 코드 생성, 다운로드 기록 관리)',
            '서비스 관련 공지사항 및 중요 안내 전달',
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-white/70">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'retention',
    title: '3. 개인정보의 보유 및 이용 기간',
    content: (
      <div className="space-y-3">
        <p className="text-white/70">
          이용자의 개인정보는 서비스 이용 기간 동안 보유하며,{' '}
          <strong className="text-white font-semibold">회원 탈퇴 시 즉시 삭제</strong>됩니다.
        </p>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-blue-300 text-sm font-medium">
            단, 관계 법령에 의해 보존이 필요한 경우에는 해당 법령에서 정한 기간 동안 보유할 수 있습니다.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'third-party',
    title: '4. 개인정보의 제3자 제공',
    content: (
      <div className="space-y-3">
        <p className="text-white/70">
          WiFi-Share는 이용자의 개인정보를{' '}
          <strong className="text-white font-semibold">제3자에게 제공하지 않습니다.</strong>
        </p>
        <p className="text-white/60 text-sm">
          단, 이용자의 사전 동의가 있거나 법률의 특별한 규정 또는 법령상 의무를 준수하기 위해 불가피한 경우에는 예외로 합니다.
        </p>
      </div>
    ),
  },
  {
    id: 'consignment',
    title: '5. 개인정보 처리 위탁',
    content: (
      <div className="space-y-3">
        <p className="text-white/70">
          원활한 서비스 제공을 위해 아래와 같이 개인정보 처리를 위탁하고 있습니다.
        </p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left pb-3 text-white/50 font-medium w-1/3">수탁업체</th>
                <th className="text-left pb-3 text-white/50 font-medium">위탁 업무 내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 text-white font-semibold">Supabase, Inc.</td>
                <td className="py-3 text-white/70">회원 인증(Authentication) 및 데이터 저장·관리</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-white/50 text-sm">
          위탁 계약 시 개인정보 보호법 제26조에 따라 위탁업무 수행 목적 외 개인정보 처리 금지, 기술적·관리적 보호조치, 재위탁 제한 등을 규정하고 있습니다.
        </p>
      </div>
    ),
  },
  {
    id: 'rights',
    title: '6. 이용자의 권리',
    content: (
      <div className="space-y-3">
        <p className="text-white/70">이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
        <ul className="space-y-2">
          {[
            '개인정보 열람 요청',
            '개인정보 정정·삭제 요청',
            '개인정보 처리 정지 요청',
            '회원 탈퇴(개인정보 즉시 삭제)',
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-white/70">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-white/50 text-sm mt-2">
          권리 행사는 서비스 내 계정 설정 또는 개인정보 보호책임자에게 이메일로 문의 주시기 바랍니다.
        </p>
      </div>
    ),
  },
  {
    id: 'contact',
    title: '7. 개인정보 보호책임자',
    content: (
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
        <p className="text-white/70 text-sm">개인정보 관련 문의사항은 아래로 연락 주시기 바랍니다.</p>
        <ul className="space-y-1 text-sm">
          <li className="flex gap-2">
            <span className="text-white/40 w-24 shrink-0">서비스명</span>
            <span className="text-white/80">WiFi-Share</span>
          </li>
          <li className="flex gap-2">
            <span className="text-white/40 w-24 shrink-0">이메일</span>
            <span className="text-blue-400">support@wifi-share.app</span>
          </li>
        </ul>
      </div>
    ),
  },
];

const PrivacyPage = () => {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto">
        {/* 뒤로가기 */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          홈으로 돌아가기
        </Link>

        {/* 페이지 헤더 */}
        <div className="mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-4 border border-blue-500/20">
            <Shield className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">개인정보 처리방침</h1>
          <p className="text-white/50 text-sm">
            시행일: <span className="text-white/70 font-medium">{EFFECTIVE_DATE}</span>
          </p>
          <p className="text-white/50 text-sm mt-2">
            WiFi-Share(이하 &quot;회사&quot;)는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.
          </p>
        </div>

        {/* 처리방침 섹션 목록 */}
        <div className="space-y-6">
          {SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6"
            >
              <h2 className="text-lg font-bold text-white mb-4">{section.title}</h2>
              <div>{section.content}</div>
            </section>
          ))}
        </div>

        {/* 하단 안내 */}
        <p className="text-center text-white/30 text-xs mt-10">
          본 방침은 {EFFECTIVE_DATE}부터 적용됩니다. 변경 시 서비스 내 공지를 통해 안내드립니다.
        </p>
      </div>
    </main>
  );
};

export default PrivacyPage;
