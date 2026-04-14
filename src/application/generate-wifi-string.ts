import { WiFiConfig } from '../domain/types';
import { Result, success, failure } from '../domain/result';

/**
 * WiFi 정보를 QR 코드용 문자열 포맷으로 변환합니다.
 * 포맷: WIFI:T:WPA;S:mynetwork;P:mypass;;
 */
export const generateWiFiString = (config: WiFiConfig): Result<string, Error> => {
  if (!config.ssid.trim()) {
    return failure(new Error('SSID는 필수 입력값입니다.'));
  }

  // 이스케이프 처리 (특수문자 처리 규칙에 따름)
  const escapeString = (str: string) => {
    return str.replace(/([\\;:])/g, '\\$1');
  };

  const escapedSsid = escapeString(config.ssid);
  let wifiString = `WIFI:S:${escapedSsid};`;

  if (config.encryption !== 'nopass') {
    wifiString += `T:${config.encryption};`;
    if (config.password) {
      const escapedPassword = escapeString(config.password);
      wifiString += `P:${escapedPassword};`;
    }
  } else {
    wifiString += 'T:nopass;';
  }

  if (config.hidden) {
    wifiString += 'H:true;';
  }

  wifiString += ';';

  return success(wifiString);
};
