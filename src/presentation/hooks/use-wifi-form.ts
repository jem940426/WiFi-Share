import React, { useState, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { WiFiConfig } from '@/domain/types';
import { generateWiFiString } from '@/application/generate-wifi-string';
import { TemplateId } from '@/domain/template';

export const useWiFiForm = () => {
  const [config, setConfig] = useState<WiFiConfig>({
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  });
  
  const [templateId, setTemplateId] = useState<TemplateId>('basic');
  const [unlockedIds, setUnlockedIds] = useState<Set<TemplateId>>(new Set());
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  React.useEffect(() => {
    // 1. 초기 로드 시 유저 정보 및 언락 내역 가져오기
    const initData = async () => {
      try {
        const { getUnlockedTemplates } = await import('@/application/history/actions');
        const { getCurrentUser } = await import('@/application/auth/actions');

        const user = await getCurrentUser();
        setCurrentUser(user);

        if (user) {
          const result = await getUnlockedTemplates();
          console.log('[DEBUG] getUnlockedTemplates result:', JSON.stringify(result));
          console.log('[DEBUG] user.id:', user.id);
          if (result.isSuccess) {
            console.log('[DEBUG] unlocked template_ids from DB:', result.value);
            setUnlockedIds(new Set(result.value as TemplateId[]));
          }
        } else {
          console.log('[DEBUG] No user logged in — unlockedIds stays empty');
        }
      } catch {
        console.error('Failed to load user data');
      }
    };
    initData();
  }, []);
  const handleChange = (field: keyof WiFiConfig, value: string | boolean) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const unlockTemplate = (id: TemplateId) => {
    setUnlockedIds((prev) => new Set(prev).add(id));
  };

  // WiFi QR 문자열 실시간 생성결과. (최적화를 위해 useMemo 사용)
  const wifiStringResult = useMemo(() => generateWiFiString(config), [config]);

  return {
    config,
    handleChange,
    wifiStringResult,
    templateId,
    setTemplateId,
    unlockedIds,
    unlockTemplate,
    currentUser,
  };
};
