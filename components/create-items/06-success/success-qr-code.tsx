import {
  Button,
  ButtonGroup,
  List,
  ListItem,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { DEFAULT_QR_CODE_OPTIONS } from 'components/qr-code/default-qr-code-options';
import { QrCode } from 'components/qr-code/qr-code';
import SplitButton from 'components/split-button/split-button';
import QRCodeStyling, { FileExtension } from 'qr-code-styling';
import React, { useState } from 'react';

function getUrlFromId(itemId: string) {
  return `https://youfound.app/${itemId}`;
}

interface Props {
  itemName: string;
  itemId: string;
}

export default function SuccessQrCode({ itemId, itemName }: Props) {
  const [qrCodeStyling] = useState(
    new QRCodeStyling({
      ...DEFAULT_QR_CODE_OPTIONS,
      data: getUrlFromId(itemId),
    })
  );

  const [doop, setDoop] = useState(12);
  function download(extension: FileExtension) {
    return () =>
      qrCodeStyling.download({
        extension,
        name: `QR Code: ${itemId}`,
      });
  }

  return (
    <List key={itemId}>
      <ListItem>
        <Typography variant='h6' component='h3'>
          {itemName}
        </Typography>
      </ListItem>
      <ListItem>
        <QrCode qrCodeStyling={qrCodeStyling} />
      </ListItem>
      <ListItem>
        <SplitButton
          buttonProps={{
            variant: 'outlined',
            color: 'secondary',
          }}
          onMainButtonClick={download('png')}
          mainButtonChildren={<>Download as PNG</>}
        >
          <MenuItem onClick={download('png')}>Download as PNG</MenuItem>
          <MenuItem onClick={download('jpeg')}>Download as JPEG</MenuItem>
          <MenuItem onClick={download('svg')}>Download as SVG</MenuItem>
          <MenuItem onClick={download('webp')}>Download as WebP</MenuItem>
        </SplitButton>
      </ListItem>
    </List>
  );
}
