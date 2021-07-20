import dynamic from 'next/dynamic';

export const SuccessQrCodeNoSSR = dynamic(() => import('./success-qr-code'), {
  ssr: false,
});
