import {
  Document,
  Page,
  PDFViewer,
  StyleSheet,
  View,
  Text
} from '@react-pdf/renderer';
import QRCode from 'qrcode.react';
import { SvgComponent } from './svg-to-pdfsvg';
import React from 'react';
import debounce from 'lodash/debounce';

// Create styles
const styles = StyleSheet.create({
  page: {},
  header: {
    borderColor: '#000',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: '.1mm',
    width: '100%'
  },
  headerText: {
    margin: '1cm auto',
    width: '100%'
  },
  main: {
    flexDirection: 'row',
    display: 'flex',
    flexWrap: 'wrap'
  },

  section: {
    borderColor: '#000',
    borderStyle: 'solid',
    borderWidth: '.1mm'
  }
});

// Create Document Component
type StickerSheetPreviewProps = {
  codes: {
    item: {
      itemName: string;
      itemHref: string;
      bgColor: string;
      fgColor: string;
    };
    width: number;
    padding: number;
  }[];
  gap: number;
};
const StickerSheetPreview = ({ codes, gap }: StickerSheetPreviewProps) => {
  const [debouncedCodes, setDebouncedCodes] = useDebounce(codes, 100);
  React.useEffect(() => setDebouncedCodes(codes), [codes]);

  return (
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
              <View style={styles.header}>
                <View style={styles.headerText}>
                  <Text style={{ fontSize: '1cm', textAlign: 'center' }}>
                    Your stickers
                  </Text>
                  <Text
                    style={{
                      marginTop: '.25cm',
                      color: 'grey',
                      textAlign: 'center'
                    }}
                  >
                    Print, cut, and stick to your valuables
                  </Text>
                </View>
              </View>
              <View style={styles.main}>
                {debouncedCodes.map(({ item, width, padding }, i) => (
                  <View
                    key={i}
                    style={[
                      {
                        width: `${width}mm`,
                        margin: `${gap / 2}mm`
                      }
                    ]}
                  >
                    <Text
                      style={{
                        marginTop: '.25cm',
                        width: '100%',
                        color: 'grey',
                        textAlign: 'center'
                      }}
                    >
                      {item.itemName}
                    </Text>
                    <View
                      style={[
                        styles.section,
                        {
                          padding: `${padding}mm`,
                          height: `${width}mm`,
                          color: item.fgColor,
                          backgroundColor: item.bgColor
                        }
                      ]}
                    >
                      <QrCodeSvg
                        value={item.itemHref}
                        bgColor={item.bgColor}
                        fgColor={item.fgColor}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </Page>
          </Document>
        </PDFViewer>
      )}
    </>
  );
};

export default StickerSheetPreview;

function QrCodeSvg({
  value,
  bgColor,
  fgColor
}: Record<'value' | 'bgColor' | 'fgColor', string>) {
  return (
    <SvgComponent>
      <QRCode
        value={value}
        renderAs="svg"
        height={'100%'}
        width={'100%'}
        bgColor={bgColor}
        fgColor={fgColor}
      />
    </SvgComponent>
  );
}

export function useDebounce<T>(obj: T, wait: number = 1000) {
  const [state, setState] = React.useState(obj);

  const setDebouncedState = (_val: any) => {
    debounceFn(_val);
  };

  const debounceFn = React.useCallback(
    debounce((_prop: T) => {
      console.log('updating search');
      setState(_prop);
    }, wait),
    []
  );

  return [state, setDebouncedState] as const;
}
