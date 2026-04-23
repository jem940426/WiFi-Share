/**
 * Claude API가 반환하는 AI 커스텀 템플릿 데이터 구조
 * (Domain 레이어 - 외부 라이브러리 의존성 없음)
 */
export interface AiTemplateStyle {
  /** 배경색 (hex) */
  backgroundColor: string;
  /** 포인트 색상 (hex) */
  pointColor: string;
  /** 폰트 스타일 */
  fontStyle: 'serif' | 'sans-serif' | 'monospace';
  /** 상단 문구 (한국어, 최대 15자) */
  topText: string;
  /** 하단 문구 (영어 포함, 최대 20자) */
  bottomText: string;
}
