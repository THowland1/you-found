import { TextFieldProps, TextField, InputAdornment, Box } from '@mui/material';
import { useField } from 'formik';
import React, { useCallback } from 'react';
import { Square } from '@mui/icons-material';

type FormikFieldProps = { name: string };
function FormikTextField({
  name,
  ...props
}: TextFieldProps & FormikFieldProps) {
  const [inputProps, metaProps, helperProps] = useField(name);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      helperProps.setValue(
        props.type === 'number' ? Number(e.target.value) : e.target.value
      );
    },
    []
  );
  return (
    <>
      <TextField
        value={inputProps.value}
        onBlur={_ => helperProps.setTouched(true)}
        onChange={onChange}
        error={metaProps.touched && Boolean(metaProps.error)}
        helperText={metaProps.touched && metaProps.error}
        {...props}
        {...(props.type === 'color'
          ? {
              type: 'text',
              InputProps: {
                startAdornment: props.type === 'color' && (
                  <InputAdornment position="start">
                    <label style={{ display: 'flex' }}>
                      <Box
                        style={{
                          position: 'absolute',
                          opacity: 0
                        }}
                      >
                        <input
                          type="color"
                          value={inputProps.value}
                          onChange={onChange}
                        />
                      </Box>
                      <Square
                        htmlColor={inputProps.value}
                        sx={{ boxShadow: t => t.shadows[1] }}
                      />
                    </label>
                  </InputAdornment>
                )
              }
            }
          : {})}
      />
    </>
  );
}

export default FormikTextField;
