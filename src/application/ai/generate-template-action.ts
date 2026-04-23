'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { AiTemplateStyle } from '@/domain/ai-template';
import { Result, success, failure } from '@/domain/result';

const SYSTEM_PROMPT = `You are a WiFi QR card designer.
User will describe a mood/style in Korean.
Respond ONLY with JSON, no other text:
{
  "backgroundColor": "hex color",
  "pointColor": "hex color",
  "fontStyle": "serif" or "sans-serif" or "monospace",
  "topText": "short Korean phrase (max 15 chars)",
  "bottomText": "short phrase (max 20 chars)"
}`;

/**
 * Google Gemini API를 호출하여 사용자 입력 분위기에 맞는 템플릿 스타일을 생성합니다.
 */
export const generateAiTemplateStyle = async (
  prompt: string
): Promise<Result<AiTemplateStyle, { message: string }>> => {
  if (!prompt.trim()) {
    return failure({ message: '분위기를 입력해주세요.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return failure({ message: 'API 키가 설정되지 않았습니다.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.0-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();

    // JSON 블록 추출 (마크다운 코드 블록 포함 대응)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return failure({ message: '올바른 JSON 응답을 받지 못했습니다.' });
    }

    const parsed = JSON.parse(jsonMatch[0]) as AiTemplateStyle;

    // 필수 필드 검증
    if (
      !parsed.backgroundColor ||
      !parsed.pointColor ||
      !parsed.fontStyle ||
      !parsed.topText ||
      !parsed.bottomText
    ) {
      return failure({ message: '생성된 스타일 데이터가 불완전합니다.' });
    }

    return success(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
    return failure({ message });
  }
};
