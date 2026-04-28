/**
 * 이메일 관련 순수 함수 모음 (domain 레이어)
 * 외부 라이브러리 의존 없음
 */

/**
 * 이메일 주소를 마스킹 처리합니다.
 * 예: jemmaeng9@gmail.com → jem****@gmail.com
 * - 로컬 파트(@ 앞)의 첫 3자만 남기고 나머지를 ****로 대체
 * - 3자 미만인 경우 전체를 ****로 대체
 */
export const maskEmail = (email: string): string => {
  const atIndex = email.indexOf('@');
  if (atIndex === -1) return '****'; // 유효하지 않은 이메일

  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex); // '@gmail.com' 포함

  const visibleLength = Math.min(3, local.length);
  const maskedLocal = local.slice(0, visibleLength) + '****';

  return `${maskedLocal}${domain}`;
};
