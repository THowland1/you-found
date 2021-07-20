import dynamic from 'next/dynamic';

export const QrCodeNoSSR = dynamic(() => import('./qr-code'), {
  ssr: false,
});
