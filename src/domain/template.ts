export type TemplateId = 'basic' | 'interior' | 'cafe' | 'poster' | 'ai';

export interface TemplateInfo {
  id: TemplateId;
  name: string;
  isPremium: boolean;
  price: number; // KRW
  isAiGenerated?: boolean; // AI 생성형 여부
}

export const TEMPLATES: Record<TemplateId, TemplateInfo> = {
  basic: { id: 'basic', name: '기본형', isPremium: false, price: 0 },
  interior: { id: 'interior', name: '감성형', isPremium: true, price: 900 },
  cafe: { id: 'cafe', name: '카페형', isPremium: true, price: 1500 },
  poster: { id: 'poster', name: '포스터형', isPremium: true, price: 1500 },
  ai: { id: 'ai', name: 'AI 생성형', isPremium: true, price: 2000, isAiGenerated: true },
};

