import { Close, RemoveCircleOutline, Square } from '@mui/icons-material';
import {
  Stack,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  MenuItem,
  Button,
  Theme,
  useTheme,
  Drawer,
  DrawerProps
} from '@mui/material';
import FormikSelectField from 'components/fields/FormikSelectField';
import FormikTextField from 'components/fields/FormikTextField';
import StickerSheetPreview from 'components/StickerSheetPreview';
import { FieldArray, Formik, FormikProps } from 'formik';
import { IItem } from 'models/schema/item';
import items from 'pages/api/items';
import React from 'react';
import { theme } from 'styles/theme';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const itemSchema = z.object({
  itemSlug: z.string(),
  itemName: z.string(),
  itemHref: z.string(),
  bgColor: z.string(),
  fgColor: z.string()
});

const schema = z.object({
  gap: z.number().min(0),
  codes: z.array(
    z
      .object({
        item: itemSchema,
        width: z.number().min(0),
        padding: z.number().min(0)
      })
      .refine(data => data.padding * 2 < data.width, {
        message: 'Padding cannot take up whole thing',
        path: ['padding']
      })
  )
});

type Schema = z.infer<typeof schema>;
export type PrintFormItemSchema = z.infer<typeof itemSchema>;

const generateInitialValues = (items: IItem[], baseUrl: string): Schema => {
  return {
    gap: 10,
    codes: items.map(item => ({
      item: {
        itemSlug: item.itemSlug,
        itemName: item.itemName,
        itemHref: `${baseUrl}/items/${item.itemSlug}`,
        bgColor: '#ffffff',
        fgColor: '#000000'
      },
      width: 50,
      padding: 5
    }))
  };
};

const PrintFormForm = ({
  items,
  baseUrl,
  values
}: PrintFormProps & Pick<FormikProps<Schema>, 'values'>) => {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderLeft: `solid 1px ${theme.palette.grey[200]}`,
        padding: '1rem',
        boxShadow: theme.shadows[2],
        maxWidth: '20rem',
        overflowX: 'hidden'
      }}
    >
      <Stack gap="1rem">
        <Typography variant="h4">Print out codes</Typography>
        <Typography variant="h6">Page</Typography>

        <FormikTextField
          name={`gap`}
          size="small"
          label="gap"
          InputLabelProps={{ shrink: true }}
          autoComplete="off"
          fullWidth
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">mm</InputAdornment>
          }}
        />
        <Stack>
          <Typography variant="h6">Codes</Typography>
          <Stack gap="1rem">
            <FieldArray name="codes">
              {arrayHelper => (
                <>
                  {values.codes.map((code, i) => (
                    <React.Fragment key={i}>
                      <Typography variant="body1">
                        Code {i + 1}
                        <IconButton
                          onClick={() => {
                            arrayHelper.remove(i);
                          }}
                        >
                          <RemoveCircleOutline />
                        </IconButton>
                      </Typography>

                      {items.length > 1 && (
                        <FormikSelectField
                          name={`codes.${i}.item`}
                          label="Item"
                          size="small"
                          mapValue={{
                            formikToMui: (formikValue: PrintFormItemSchema) =>
                              items.findIndex(
                                itemm => itemm.itemSlug === formikValue.itemSlug
                              ),
                            muiToFormik: (muiValue: number) => ({
                              itemSlug: items[muiValue].itemSlug,
                              itemName: items[muiValue].itemName,
                              itemHref: `${baseUrl}/items/${items[muiValue].itemSlug}`
                            })
                          }}
                        >
                          {items.map((itemm, ii) => (
                            <MenuItem key={ii} value={ii}>
                              {itemm.itemName}
                            </MenuItem>
                          ))}
                        </FormikSelectField>
                      )}

                      <Stack direction="row" gap="1rem">
                        <FormikTextField
                          name={`codes.${i}.width`}
                          size="small"
                          label="Size"
                          InputLabelProps={{ shrink: true }}
                          autoComplete="off"
                          type="number"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">mm</InputAdornment>
                            )
                          }}
                        />
                        <FormikTextField
                          name={`codes.${i}.padding`}
                          size="small"
                          label="Padding"
                          InputLabelProps={{ shrink: true }}
                          autoComplete="off"
                          type="number"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">mm</InputAdornment>
                            )
                          }}
                        />
                      </Stack>
                      <Stack direction="row" gap="1rem">
                        <FormikTextField
                          name={`codes.${i}.item.bgColor`}
                          size="small"
                          label="Background"
                          InputLabelProps={{ shrink: true }}
                          autoComplete="off"
                          type="color"
                        />
                        <FormikTextField
                          name={`codes.${i}.item.fgColor`}
                          size="small"
                          label="Foreground"
                          InputLabelProps={{ shrink: true }}
                          autoComplete="off"
                          type="color"
                        />
                      </Stack>
                    </React.Fragment>
                  ))}
                  <Button
                    variant="outlined"
                    onClick={_ => {
                      arrayHelper.push({
                        item: {
                          itemSlug: items[0].itemSlug,
                          itemName: items[0].itemName,
                          itemHref: `${baseUrl}/items/${items[0].itemSlug}`
                        },
                        width: 50,
                        padding: 5
                      });
                    }}
                  >
                    Add another
                  </Button>
                </>
              )}
            </FieldArray>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

type PrintFormProps = { items: IItem[]; baseUrl: string };
const PrintForm = ({ items, baseUrl }: PrintFormProps) => {
  const initialValues = generateInitialValues(items, baseUrl);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const onSubmit = (values: Schema) => {};
  const theme = useTheme<Theme>();
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(schema)}
      onSubmit={values => onSubmit(values)}
    >
      {({ values }) => (
        <Stack position={'absolute'} sx={{ inset: 0 }} direction={'row'}>
          <Stack
            flex={1}
            alignItems={'center'}
            overflow="auto"
            padding={2}
            gap={2}
            sx={{
              backgroundColor: theme.palette.grey[300]
            }}
          >
            <Button
              sx={{ display: display.zeroToSm }}
              variant="outlined"
              onClick={() => setMobileOpen(true)}
            >
              Edit
            </Button>
            <StickerSheetPreview codes={values.codes} gap={values.gap} />
          </Stack>
          <Box display={display.smToInf}>
            <PrintFormForm values={values} baseUrl={baseUrl} items={items} />
          </Box>
          <Drawer
            sx={{ display: display.zeroToSm, zIndex: 10000000 }}
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
          >
            <IconButton
              sx={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 1
              }}
              onClick={() => setMobileOpen(false)}
            >
              <Close></Close>
            </IconButton>
            <PrintFormForm values={values} baseUrl={baseUrl} items={items} />
          </Drawer>
        </Stack>
      )}
    </Formik>
  );
};

export default PrintForm;

const display = {
  zeroToSm: { xs: 'block', sm: 'none' },
  smToInf: { xs: 'none', sm: 'block' }
};

const Responsive = {
  Mobile: (props: { children: React.ReactNode }) => (
    <Box display={{ xs: 'block', sm: 'none' }}>{props.children}</Box>
  )
};
