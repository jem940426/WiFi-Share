import React, { forwardRef } from 'react';
import { TemplateId } from '@/domain/template';
import { BasicTemplate } from './templates/BasicTemplate';
import { InteriorTemplate } from './templates/InteriorTemplate';
import { CafeTemplate } from './templates/CafeTemplate';
import { PosterTemplate } from './templates/PosterTemplate';

interface Props {
  templateId: TemplateId;
  wifiString: string;
  ssid: string;
  isLocked?: boolean;
}

export const WiFiPreview = forwardRef<HTMLDivElement, Props>(
  ({ templateId, wifiString, ssid, isLocked = false }, ref) => {
    
    // We wrap the dynamic template inside the ref container for html2canvas
    // so that the background and specific dimensions of each template are respected.
    return (
      <div ref={ref} className="relative transition-all duration-500">
        {templateId === 'basic' && <BasicTemplate wifiString={wifiString} ssid={ssid} isLocked={isLocked} />}
        {templateId === 'interior' && <InteriorTemplate wifiString={wifiString} ssid={ssid} isLocked={isLocked} />}
        {templateId === 'cafe' && <CafeTemplate wifiString={wifiString} ssid={ssid} isLocked={isLocked} />}
        {templateId === 'poster' && <PosterTemplate wifiString={wifiString} ssid={ssid} isLocked={isLocked} />}
      </div>
    );
  }
);

WiFiPreview.displayName = 'WiFiPreview';
