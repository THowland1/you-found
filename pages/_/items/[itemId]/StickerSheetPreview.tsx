import {
  Document,
  Page,
  PDFViewer,
  StyleSheet,
  View
} from '@react-pdf/renderer';
import QRCode from 'qrcode.react';
import { SvgComponent } from './svg-to-pdfsvg';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    display: 'flex',
    flexWrap: 'wrap'
  },
  section: {
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderWidth: '.5mm'
  }
});

// Create Document Component
type StickerSheetPreviewProps = {
  codes: {
    value: string;
    width: number;
    padding: number;
  }[];
  gap: number;
};
const StickerSheetPreview = ({ codes, gap }: StickerSheetPreviewProps) => (
  <>
    {typeof window !== 'undefined' && (
      <PDFViewer
        style={{
          height: '100%',
          width: '100%'
        }}
      >
        <Document>
          <Page size="A4" style={styles.page}>
            {codes.map(({ value, width, padding }, i) => (
              <View
                style={[
                  styles.section,
                  {
                    padding: `${padding}mm`,
                    height: `${width}mm`,
                    width: `${width}mm`,
                    margin: `${gap / 2}mm`
                  }
                ]}
              >
                <QrCodeSvg value={value} />
              </View>
            ))}
          </Page>
        </Document>
      </PDFViewer>
    )}
  </>
);

export default StickerSheetPreview;

function QrCodeSvg({ value }: { value: string }) {
  return (
    <SvgComponent>
      <QRCode value={value} renderAs="svg" height={'100%'} width={'100%'} />
    </SvgComponent>
  );
}
