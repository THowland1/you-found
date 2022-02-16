import {
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormHelperText,
  Switch,
  SwitchProps
} from '@mui/material';
import { useField } from 'formik';

type FormikFieldProps = { name: string };
type SwitchWithLabelProps = SwitchProps &
  Omit<FormControlLabelProps, 'control'> &
  FormikFieldProps;
function FormikSwitchField({
  name,
  ...props
}: SwitchWithLabelProps): JSX.Element {
  const [inputProps, metaProps, helperProps] = useField(name);

  return (
    <FormControl error={metaProps.touched && Boolean(metaProps.error)}>
      {Boolean(props.label) ? (
        <FormControlLabel
          label={props.label}
          labelPlacement="start"
          control={
            <Switch
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
      ) : (
        <Switch
          {...props}
          checked={Boolean(inputProps.value)}
          value={Boolean(inputProps.value)}
          onBlur={_ => helperProps.setTouched(true)}
          onChange={e => {
            helperProps.setValue(e.target.checked);
          }}
        />
      )}

      {metaProps.touched && Boolean(metaProps.error) && (
        <FormHelperText>{metaProps.error}</FormHelperText>
      )}
    </FormControl>
  );
}

export default FormikSwitchField;
