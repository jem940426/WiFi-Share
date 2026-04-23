import React, { forwardRef } from 'react';
import { TemplateId } from '@/domain/template';
import { AiTemplateStyle } from '@/domain/ai-template';
import { BasicTemplate } from './templates/BasicTemplate';
import { InteriorTemplate } from './templates/InteriorTemplate';
import { CafeTemplate } from './templates/CafeTemplate';
import { PosterTemplate } from './templates/PosterTemplate';
import { AiTemplate } from './templates/AiTemplate';

// AI 템플릿용 기본 스타일 (생성 전 프리뷰용)
const DEFAULT_AI_STYLE: AiTemplateStyle = {
  backgroundColor: '#1a1a2e',
  pointColor: '#e94560',
  fontStyle: 'sans-serif',
  topText: '편하게 연결하세요',
  bottomText: 'Scan to Connect',
};

interface Props {
  templateId: TemplateId;
  wifiString: string;
  ssid: string;
  isLocked?: boolean;
  aiStyle?: AiTemplateStyle | null;
}

export const WiFiPreview = forwardRef<HTMLDivElement, Props>(
  ({ templateId, wifiString, ssid, isLocked = false, aiStyle }, ref) => {
    
    // We wrap the dynamic template inside the ref container for html2canvas
    // so that the background and specific dimensions of each template are respected.
    return (
      <div ref={ref} className="relative transition-all duration-500">
        {templateId === 'basic' && <BasicTemplate wifiString={wifiString} ssid={ssid} isLocked={isLocked} />}
        {templateId === 'interior' && <InteriorTemplate wifiString={wifiString} ssid={ssid} isLocked={isLocked} />}
        {templateId === 'cafe' && <CafeTemplate wifiString={wifiString} ssid={ssid} isLocked={isLocked} />}
        {templateId === 'poster' && <PosterTemplate wifiString={wifiString} ssid={ssid} isLocked={isLocked} />}
        {templateId === 'ai' && (
          <AiTemplate
            wifiString={wifiString}
            ssid={ssid}
            isLocked={isLocked}
            style={aiStyle ?? DEFAULT_AI_STYLE}
          />
        )}
      </div>
    );
  }
);

WiFiPreview.displayName = 'WiFiPreview';

