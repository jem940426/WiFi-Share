export type EncryptionType = 'WPA' | 'WEP' | 'nopass';

export interface WiFiConfig {
  ssid: string;
  password?: string;
  encryption: EncryptionType;
  hidden: boolean;
}
