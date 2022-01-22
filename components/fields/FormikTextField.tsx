import { TextFieldProps, TextField } from '@mui/material';
import { useField } from 'formik';

type FormikFieldProps = { name: string };
function FormikTextField({
  name,
  ...props
}: TextFieldProps & FormikFieldProps) {
  const [inputProps, metaProps, helperProps] = useField(name);

  return (
    <>
      <TextField
        value={inputProps.value}
        onBlur={_ => helperProps.setTouched(true)}
        onChange={e =>
          helperProps.setValue(
            props.type === 'number' ? Number(e.target.value) : e.target.value
          )
        }
        error={metaProps.touched && Boolean(metaProps.error)}
        helperText={metaProps.touched && metaProps.error}
        {...props}
      />
    </>
  );
}

export default FormikTextField;
