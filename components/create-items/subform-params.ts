import React from 'react';
import { Form } from './form';

export interface SubformParams {
  form: Form;
  setForm: React.Dispatch<Form>;
}
