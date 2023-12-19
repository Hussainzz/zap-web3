import React from 'react';
import { ErrorMessage, useField } from 'formik';

interface TextFieldProps {
  label: string;
  name: string;
}

type Field = { [key: string]: any } ;

type OtherProps = TextFieldProps & Field;

export const TextField: React.FC<OtherProps> = ({ label, name, ...props }) => {
  const [field, meta] = useField(name);
  return (
    <div className="mb-2">
      <label htmlFor={field.name} className='font-display text-jacarta-700 mb-1 block text-sm'>{label}</label>
      <input
        className={`hover:ring-accent/10 border w-full rounded-lg py-3 hover:ring-2 px-3 ${meta.touched && meta.error && 'is-invalid'}`}
        {...field} {...props}
        autoComplete="off"
      />
      <ErrorMessage component="div" name={field.name} className="error text-red" />
    </div>
  )
}