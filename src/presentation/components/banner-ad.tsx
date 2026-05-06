'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * 띠 광고 컴포넌트 (BannerAd)
 *
 * [위치 전략]
 * - 기본값: position fixed, bottom: 0 → 항상 화면 맨 아래 딱 붙음
 * - footer가 viewport 안으로 들어올 때:
 *   bottom = window.innerHeight - footer.getBoundingClientRect().top
 *
 * [재계산 트리거 - 이중 감지]
 * 1. scroll 이벤트: 사용자가 스크롤할 때
 * 2. ResizeObserver(document.body): 템플릿 전환 등으로 페이지 높이가 바뀔 때
 *    → 스크롤 이벤트 없이 콘텐츠 높이만 변해도 즉시 재계산
 */
const BannerAd = () => {
  const [bottomPx, setBottomPx] = useState<number>(0);

  // requestAnimationFrame ID — 클린업 시 취소
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const footerEl = document.querySelector('footer');
    if (!footerEl) return;

    // scroll·resize·ResizeObserver 모두 동일한 계산 함수를 공유
    const calculate = () => {
      const footerTop = footerEl.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;

      if (footerTop < viewportHeight) {
        // footer가 화면 안으로 들어왔을 때만 위로 밀어냄
        setBottomPx(viewportHeight - footerTop);
      } else {
        setBottomPx(0);
      }
    };

    // rAF로 감싸서 불필요한 리렌더 최소화
    const scheduleCalculate = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(calculate);
    };

    // [트리거 1] scroll 이벤트 — 사용자가 스크롤할 때
    window.addEventListener('scroll', scheduleCalculate, { passive: true });

    // [트리거 2] resize 이벤트 — 뷰포트 크기 변경 시
    window.addEventListener('resize', scheduleCalculate, { passive: true });

    // [트리거 3] ResizeObserver — 템플릿 전환 등 페이지 높이 변화 감지
    // document.body를 관찰해 콘텐츠 높이가 바뀌면 즉시 재계산
    const resizeObserver = new ResizeObserver(scheduleCalculate);
    resizeObserver.observe(document.body);

    // 초기 1회 실행 (페이지 로드 시 footer가 이미 viewport 안에 있는 경우 대비)
    calculate();

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      window.removeEventListener('scroll', scheduleCalculate);
      window.removeEventListener('resize', scheduleCalculate);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <aside
      id="banner-ad"
      aria-label="광고 영역"
      style={{
        position: 'fixed',
        bottom: `${bottomPx}px`,
        left: 0,
        width: '100%',
        height: '50px',
        zIndex: 40,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        pointerEvents: 'auto',
      }}
    >
      {/* 좌측 AD 레이블 */}
      <span
        style={{
          fontSize: '10px',
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.08em',
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        AD
      </span>

      {/* 좌측 광고 텍스트 */}
      <p
        style={{
          color: 'rgba(255,255,255,0.85)',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.03em',
          margin: '0 12px',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flex: 1,
          textAlign: 'left',
        }}
      >
        ✨ 24시간 청소 대행 서비스 — 매장·숙소 운영, 이제 맡기세요 | 상담 무료
      </p>

      {/* 우측: 버튼 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <button
          onClick={(e) => e.preventDefault()}
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#fff',
            background: 'rgba(59,130,246,0.8)',
            border: 'none',
            borderRadius: '6px',
            padding: '5px 10px',
            cursor: 'pointer',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          무료 상담 받기 →
        </button>
      </div>
    </aside>
  );
};

export default BannerAd;
