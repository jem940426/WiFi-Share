import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  wifiString: string;
  ssid: string;
  isLocked?: boolean;
}

/**
 * 포스터형 템플릿 컴포넌트
 *
 * ⚠️ Tailwind 클래스 사용 금지
 * html2canvas와 브라우저 간 렌더링 불일치 방지를 위해 모든 스타일을 인라인으로 정의.
 * 텍스트 정렬은 반드시 textAlign: 'left'를 명시해야 브라우저/캡처 결과가 동일함.
 * 레이아웃 기준: 실제 PNG 다운로드 결과물
 */
export const PosterTemplate: React.FC<Props> = ({ wifiString, ssid, isLocked }) => {
  return (
    <div
      style={{
        backgroundColor: '#E63946',
        color: '#F1FAEE',
        padding: '32px',
        borderRadius: '32px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '320px',
        height: '540px',
        border: '4px solid #1D3557',
        overflow: 'hidden',
        fontFamily: 'Arial, Helvetica, sans-serif',
        boxSizing: 'border-box',
        flexShrink: 0,
        textAlign: 'left', // 전체 텍스트 오른쪽 정렬 방지 — html2canvas 기본값 대응
      }}
    >
      {/* 상단 텍스트 영역 */}
      <div style={{ width: '100%', flex: 1, textAlign: 'left' }}>
        <h2
          style={{
            fontSize: '36px',
            fontWeight: 900,
            lineHeight: 1.1,
            color: '#1D3557',
            letterSpacing: '-0.03em',
            margin: 0,
            marginBottom: '12px',
            textAlign: 'left', // 명시적 왼쪽 정렬
          }}
        >
          비밀번호는
          <br />
          QR에게
          <br />
          물어보세요{' '}
          <span style={{ display: 'inline-block', transform: 'translateY(4px) scale(0.9)' }}>
            🤫
          </span>
        </h2>

        {/* 구분선 */}
        <div
          style={{
            width: '48px',
            height: '8px',
            backgroundColor: '#F1FAEE',
            marginTop: '12px',
            marginBottom: '24px',
          }}
        />

        {/* 네트워크 ID 섹션 */}
        <div style={{ width: '100%' }}>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.9)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              margin: 0,
              marginBottom: '4px',
              textAlign: 'left', // 명시적 왼쪽 정렬
            }}
          >
            NETWORK ID
          </p>
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 900,
              paddingBottom: '4px',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              margin: 0,
              color: '#F1FAEE',
              textAlign: 'left', // 명시적 왼쪽 정렬
            }}
          >
            {ssid || 'MY HOME WIFI'}
          </h3>
        </div>
      </div>

      {/* 하단 QR 코드 영역 — 중앙 정렬 (다운로드 결과물 기준) */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '24px',
        }}
      >
        {/* QR 코드 박스 */}
        <div
          style={{
            backgroundColor: '#F1FAEE',
            padding: '12px',
            borderRadius: '12px',
            border: '4px solid #1D3557',
            display: 'inline-block',
            marginBottom: '16px',
            boxShadow: '4px 4px 0px 0px rgba(29,53,87,1)',
            position: 'relative',
          }}
        >
          {/* 잠금 상태 블러 오버레이 */}
          {isLocked && (
            <div
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                bottom: '8px',
                left: '8px',
                backgroundColor: 'rgba(241,250,238,0.8)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '4px',
                  backgroundColor: 'rgba(29,53,87,0.4)',
                  transform: 'rotate(45deg)',
                  borderRadius: '9999px',
                  position: 'absolute',
                }}
              />
              <div
                style={{
                  width: '48px',
                  height: '4px',
                  backgroundColor: 'rgba(29,53,87,0.4)',
                  transform: 'rotate(-45deg)',
                  borderRadius: '9999px',
                  position: 'absolute',
                }}
              />
            </div>
          )}
          <QRCodeSVG
            value={wifiString || 'WIFI:T:nopass;S:;P:;;'}
            size={130}
            level="M"
            fgColor="#1D3557"
            includeMargin={false}
          />
        </div>

        {/* SCAN TO CONNECT 레이블 */}
        <p
          style={{
            fontSize: '13px',
            fontWeight: 900,
            letterSpacing: '0.2em',
            color: '#1D3557',
            textTransform: 'uppercase',
            backgroundColor: '#F1FAEE',
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '4px',
            paddingBottom: '4px',
            border: '2px solid #1D3557',
            margin: 0,
            textAlign: 'center', // 레이블은 중앙 정렬
          }}
        >
          SCAN TO CONNECT
        </p>
      </div>
    </div>
  );
};
