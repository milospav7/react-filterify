import { Ref, useEffect, useState } from "react";
import { Input } from "reactstrap";
import { InputType } from "reactstrap/es/Input";

interface IDebouncedFieldProps {
  filteringProperty: string;
  displayName?: string;
  inputReference: Ref<Input>;
  onChange: (value: string | null) => void;
  reduxValue?: string;
  type?: InputType;
  placeholder?: string;
}

let timeout: NodeJS.Timeout | null = null;

export const DebouncedInputField: React.FC<IDebouncedFieldProps> = ({
  filteringProperty,
  displayName,
  inputReference,
  onChange,
  reduxValue,
  type,
  placeholder,
}) => {
  const [value, setValue] = useState(reduxValue);

  const saveWithDebounce = (val: string) => {
    setValue(val);
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      onChange(val);
    }, 600);
  };

  // In case when reseting filters
  useEffect(() => {
    if (value !== reduxValue) setValue(reduxValue);
  }, [reduxValue]);

  return (
    <Input
      key={`${filteringProperty}-dbf`}
      bsSize="sm"
      placeholder={placeholder || displayName}
      ref={inputReference}
      name={filteringProperty}
      type={type ?? "text"}
      value={value}
      onChange={(ev: any) => saveWithDebounce(ev.target.value)}
    />
  );
};
