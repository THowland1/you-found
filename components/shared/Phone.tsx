import { Theme } from '@emotion/react';
import { SxProps, Box } from '@mui/material';
import LandingPage from 'components/items/LandingPage';
import { IItem } from 'models/schema/item';

const Phone = ({ item, sx = {} }: { item: IItem; sx?: SxProps<Theme> }) => {
  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: '3rem',
        height: '600px',
        width: '352px',
        border: 'solid 16px black',
        margin: 'auto',
        position: 'relative',
        overflow: 'auto',
        '::-webkit-scrollbar': {
          display: 'none'
        },
        ...sx
      }}
    >
      <LandingPage item={item} />
    </Box>
  );
};

export default Phone;
