import { useState, useMemo } from 'react';
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
  };
};
