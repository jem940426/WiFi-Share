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
    // 1. 초기 로드 시 유저 정보 가져오기
    const initUser = async () => {
      try {
        const { getCurrentUser } = await import('@/application/auth/actions');
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch {
        console.error('Failed to load user data');
      }
    };
    if (!currentUser) {
      initUser();
    }
  }, [currentUser]);

  React.useEffect(() => {
    // SSID나 비밀번호 변경 시 일단 언락 상태 초기화 (즉시 잠금)
    setUnlockedIds(new Set());

    const fetchUnlocks = async () => {
      if (!currentUser || !config.ssid.trim()) return;
      try {
        const { getUnlockedTemplates } = await import('@/application/history/actions');
        const result = await getUnlockedTemplates(config.ssid);
        if (result.isSuccess) {
          setUnlockedIds(new Set(result.value as TemplateId[]));
        }
      } catch {
        console.error('Failed to fetch unlocked templates');
      }
    };

    // 500ms 디바운스 처리
    const timer = setTimeout(() => {
      fetchUnlocks();
    }, 500);

    return () => clearTimeout(timer);
  }, [config.ssid, config.password, currentUser]);

  const handleChange = (field: keyof WiFiConfig, value: string | boolean) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const unlockTemplate = (id: TemplateId) => {
    setUnlockedIds((prev) => new Set(prev).add(id));
  };

  const removeUnlockId = (id: TemplateId) => {
    setUnlockedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const clearAllUnlocks = () => {
    setUnlockedIds(new Set());
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
    removeUnlockId,
    clearAllUnlocks,
    currentUser,
  };
};
