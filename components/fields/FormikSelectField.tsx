import {
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  SelectProps
} from '@mui/material';
import { useField } from 'formik';
import { useState } from 'react';
import { v4 } from 'uuid';

type FormikFieldProps = { name: string };
function FormikSelectField<T>({
  name,
  mapValue = {
    formikToMui: formikValue => formikValue,
    muiToFormik: muiValue => muiValue
  },
  ...props
}: SelectProps<T> &
  FormikFieldProps & {
    mapValue?: {
      formikToMui: (formikValue: any) => any;
      muiToFormik: (muiValue: any) => any;
    };
  }) {
  const [inputProps, metaProps, helperProps] = useField(name);
  const [id] = useState(v4());

  return (
    <FormControl
      sx={{ minWidth: 80 }}
      error={metaProps.touched && Boolean(metaProps.error)}
      fullWidth
    >
      <InputLabel id={`${name}-label-${id}`}>{props.label}</InputLabel>
      <Select
        onBlur={_ => helperProps.setTouched(true)}
        labelId={`${name}-label-${id}`}
        id={`${name}-${id}`}
        value={mapValue.formikToMui(inputProps.value)}
        onChange={e =>
          helperProps.setValue(mapValue.muiToFormik(e.target.value))
        }
        {...props}
      ></Select>
      <FormHelperText error>{metaProps.error}</FormHelperText>
    </FormControl>
  );
}

export default FormikSelectField;
