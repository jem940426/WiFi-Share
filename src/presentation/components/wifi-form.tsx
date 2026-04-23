import React from 'react';
import { WiFiConfig, EncryptionType } from '@/domain/types';
import { Wifi, KeyRound, ShieldCheck, EyeOff } from 'lucide-react';

interface Props {
  config: WiFiConfig;
  onChange: (field: keyof WiFiConfig, value: string | boolean) => void;
  isDisabled?: boolean;
}

export const WiFiForm: React.FC<Props> = ({ config, onChange, isDisabled = false }) => {
  return (
    <div className={`relative flex flex-col gap-5 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 ${isDisabled ? 'opacity-50 grayscale-[30%]' : ''}`}>
      {/* 폼 전체 비활성화 오버레이 */}
      {isDisabled && (
        <div 
          className="absolute inset-0 z-50 cursor-not-allowed rounded-2xl" 
          title="네트워크 정보를 수정하려면 템플릿을 '기본형'으로 변경해주세요." 
        />
      )}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Wi-Fi 설정</h2>
        <p className="text-white/60 text-sm">네트워크 정보를 입력하면 QR 코드가 실시간으로 업데이트됩니다.</p>
      </div>

      <div className="space-y-4 mt-2">
        {/* SSID Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-white/80 flex items-center gap-2">
            <Wifi size={16} className="text-blue-400" />
            네트워크 이름 (SSID)
          </label>
          <input
            id="ssid-input"
            type="text"
            value={config.ssid}
            onChange={(e) => onChange('ssid', e.target.value)}
            disabled={isDisabled}
            placeholder="예: MY HOME WIFI"
            className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-white/80 flex items-center gap-2">
            <KeyRound size={16} className="text-blue-400" />
            비밀번호
          </label>
          <input
            type="password"
            value={config.password || ''}
            onChange={(e) => onChange('password', e.target.value)}
            disabled={config.encryption === 'nopass' || isDisabled}
            placeholder={config.encryption === 'nopass' ? '비밀번호 없음' : 'WPA/WEP 비밀번호'}
            className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Encryption Type */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-white/80 flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-400" />
            암호화 방식
          </label>
          <div className="flex gap-3">
            {(['WPA', 'WEP', 'nopass'] as EncryptionType[]).map((type) => (
              <button
                key={type}
                onClick={() => onChange('encryption', type)}
                disabled={isDisabled}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  config.encryption === type
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {type === 'nopass' ? '없음' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Hidden Network */}
        <div className="flex items-center justify-between pt-2">
          <label className="text-sm font-medium text-white/80 flex items-center gap-2 cursor-pointer">
            <EyeOff size={16} className="text-blue-400" />
            숨겨진 네트워크 여부
          </label>
          <button
            onClick={() => onChange('hidden', !config.hidden)}
            disabled={isDisabled}
            className={`w-12 h-6 rounded-full transition-colors relative disabled:opacity-50 disabled:cursor-not-allowed ${config.hidden ? 'bg-blue-500' : 'bg-white/20'}`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                config.hidden ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
