// components/FormInputField.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { InputHTMLAttributes } from 'react';

interface FormInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FormInputField = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  ...props
}: FormInputFieldProps) => {
  return (
    <div className="mt-5">
      <Label className="mb-2" htmlFor={id}>
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
    </div>
  );
};
