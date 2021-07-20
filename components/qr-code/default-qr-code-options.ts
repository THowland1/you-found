import QRCodeStyling, {
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType,
  Options,
} from 'qr-code-styling';

export const DEFAULT_QR_CODE_OPTIONS: Options = {
  type: 'canvas' as DrawType,
  data: 'http://qr-code-styling.com',
  image: '/logo-circle.svg',
  margin: 0,
  qrOptions: {
    typeNumber: 0 as TypeNumber,
    mode: 'Byte' as Mode,
    errorCorrectionLevel: 'M' as ErrorCorrectionLevel,
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.5,
    margin: 5,
    crossOrigin: 'anonymous',
  },
  dotsOptions: {
    color: '#222222',
    // gradient: {
    //   type: 'linear', // 'radial'
    //   rotation: 0,
    //   colorStops: [{ offset: 0, color: '#8688B2' }, { offset: 1, color: '#77779C' }]
    // },
    type: 'square' as DotType,
  },
  backgroundOptions: {
    color: 'transparent',
    // gradient: {
    //   type: 'linear', // 'radial'
    //   rotation: 0,
    //   colorStops: [{ offset: 0, color: '#ededff' }, { offset: 1, color: '#e6e7ff' }]
    // },
  },
  cornersSquareOptions: {
    color: '#222222',
    type: 'square' as CornerSquareType,
    // gradient: {
    //   type: 'linear', // 'radial'
    //   rotation: 180,
    //   colorStops: [{ offset: 0, color: '#25456e' }, { offset: 1, color: '#4267b2' }]
    // },
  },
  cornersDotOptions: {
    color: '#222222',
    type: 'square' as CornerDotType,
    // gradient: {
    //   type: 'linear', // 'radial'
    //   rotation: 180,
    //   colorStops: [{ offset: 0, color: '#00266e' }, { offset: 1, color: '#4060b3' }]
    // },
  },
};
