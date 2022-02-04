import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormControlLabelProps,
  FormControl,
  FormHelperText
} from '@mui/material';
import { useField } from 'formik';

type FormikFieldProps = { name: string };
type CheckboxWithLabelProps = CheckboxProps &
  Omit<FormControlLabelProps, 'control'> &
  FormikFieldProps;
function FormikCheckboxField({
  name,
  ...props
}: CheckboxWithLabelProps): JSX.Element {
  const [inputProps, metaProps, helperProps] = useField(name);

  return (
    <FormControl error={metaProps.touched && Boolean(metaProps.error)}>
      <FormControlLabel
        label={props.label}
        control={
          <Checkbox
            {...props}
            checked={Boolean(inputProps.value)}
            value={Boolean(inputProps.value)}
            onBlur={_ => helperProps.setTouched(true)}
            onChange={e => {
              helperProps.setValue(e.target.checked);
            }}
          />
        }
      />
      {metaProps.touched && Boolean(metaProps.error) && (
        <FormHelperText>{metaProps.error}</FormHelperText>
      )}
    </FormControl>
  );
}

export default FormikCheckboxField;
