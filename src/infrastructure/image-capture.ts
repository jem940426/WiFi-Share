import html2canvas from 'html2canvas';
import { Result, success, failure } from '../domain/result';

/**
 * 특정 DOM 요소를 PNG 이미지로 변환하여 다운로드합니다. (일반 템플릿용)
 */
export const downloadElementAsPng = async (
  element: HTMLElement,
  filename: string = 'wifi-qrcode.png'
): Promise<Result<void, Error>> => {
  try {
    const canvas = await html2canvas(element, {
      scale: 3, // 고해상도 캡처
      width: element.offsetWidth,
      height: element.offsetHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      scrollY: -window.scrollY, // 스크롤 위치 보정
      backgroundColor: null, // 투명 배경 지원
      logging: false,
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return success(undefined);
  } catch (error) {
    return failure(error instanceof Error ? error : new Error('이미지 캡처 중 알림 없는 오류 발생'));
  }
};

/**
 * 포스터 전용 캡처: 요소 하단 잘림을 방지하기 위해 엄격한 높이/너비 옵션 강제 적용
 */
export const downloadPosterElementAsPng = async (
  element: HTMLElement,
  filename: string = 'wifi-qrcode.png'
): Promise<Result<void, Error>> => {
  try {
    const canvas = await html2canvas(element, {
      scale: 3,
      width: element.offsetWidth,
      height: element.scrollHeight, // auto나 offsetHeight 대신 실제 내부 콘텐츠를 모두 덮는 scrollHeight 활용
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      scrollY: -window.scrollY,
      y: 0, // y를 0으로 고정하여 캡처 윈도우가 최상단부터 시작하게 강제
      backgroundColor: null,
      logging: false,
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return success(undefined);
  } catch (error) {
    return failure(error instanceof Error ? error : new Error('이미지 캡처 중 알림 없는 오류 발생'));
  }
};
