import { useState } from 'react';
import { AiTemplateStyle } from '@/domain/ai-template';

interface UseAiTemplateReturn {
  /** 사용자가 입력한 분위기 프롬프트 */
  aiPrompt: string;
  setAiPrompt: (value: string) => void;
  /** Claude API 호출 중 여부 */
  isGenerating: boolean;
  /** AI가 생성한 스타일 (null이면 아직 미생성) */
  aiStyle: AiTemplateStyle | null;
  /** 오류 메시지 */
  aiError: string;
  /** 생성하기 실행 함수 */
  generateStyle: () => Promise<void>;
  /** 스타일 초기화 */
  resetStyle: () => void;
}

/**
 * AI 템플릿 스타일 생성 상태 관리 훅
 * application 레이어의 Server Action만 호출합니다.
 */
export const useAiTemplate = (): UseAiTemplateReturn => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiStyle, setAiStyle] = useState<AiTemplateStyle | null>(null);
  const [aiError, setAiError] = useState('');

  const generateStyle = async () => {
    if (!aiPrompt.trim()) {
      setAiError('분위기를 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    setAiError('');

    const { generateAiTemplateStyle } = await import(
      '@/application/ai/generate-template-action'
    );

    const result = await generateAiTemplateStyle(aiPrompt);

    if (result.isSuccess) {
      setAiStyle(result.value);
    } else {
      setAiError(result.error.message);
    }

    setIsGenerating(false);
  };

  const resetStyle = () => {
    setAiStyle(null);
    setAiError('');
    setAiPrompt('');
  };

  return {
    aiPrompt,
    setAiPrompt,
    isGenerating,
    aiStyle,
    aiError,
    generateStyle,
    resetStyle,
  };
};
