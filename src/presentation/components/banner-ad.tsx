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
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}
    >
      {/* 좌측 AD 레이블 */}
      <span
        style={{
          position: 'absolute',
          left: '12px',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.08em',
          userSelect: 'none',
        }}
      >
        AD
      </span>

      {/* 광고 텍스트 */}
      <p
        style={{
          color: 'rgba(255,255,255,0.85)',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          margin: 0,
          userSelect: 'none',
        }}
      >
        광고 영역
      </p>
    </aside>
  );
};

export default BannerAd;
