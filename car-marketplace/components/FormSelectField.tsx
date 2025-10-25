// components/FormSelectField.tsx
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SelectOption = {
  id: number;
  name: string;
};

interface FormSelectFieldProps {
  htmlFor: string;
  label: string;
  placeholder: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export const FormSelectField = ({
  htmlFor,
  label,
  placeholder,
  options,
  onValueChange,
  disabled = false,
  required = false,
}: FormSelectFieldProps) => {
  return (
    <div className="mt-5">
      <Label className="mb-2" htmlFor={htmlFor}>
        {label}
      </Label>
      <Select onValueChange={onValueChange} disabled={disabled} required={required}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id.toString()}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
