import React, { useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
import { QrCodeProps } from './qr-code-props';

export const QrCode = ({ qrCodeStyling }: QrCodeProps) => {
  const htmlDivRef = useRef<HTMLDivElement>(null);
  const [appended, setAppended] = useState(false);
  const [id] = useState(v4());

  useEffect(() => {
    if (htmlDivRef.current && !appended) {
      qrCodeStyling.append(htmlDivRef.current);
      if (qrCodeStyling._canvas) {
        qrCodeStyling._canvas.style.width = '100%';
      }
      setAppended(true);
    }
  }, [qrCodeStyling, htmlDivRef]);

  return <div id={id} ref={htmlDivRef} />;
};

export default QrCode;
