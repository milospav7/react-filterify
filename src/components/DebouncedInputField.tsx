import { ChangeEvent, Ref, useEffect, useState } from "react";
import { Input } from "reactstrap";
import { InputType } from "reactstrap/es/Input";

const DEBOUNCE_INTERVAL = 350; // In ms

interface IDebouncedFieldProps {
  inputRef: Ref<Input>;
  filterValue?: string;
  filteringProperty: string;
  onChange: (value: string | null) => void;
  type?: InputType;
  placeholder?: string;
}

let timeout: NodeJS.Timeout | null = null;

export const DebouncedInputField: React.FC<IDebouncedFieldProps> = ({
  filteringProperty,
  inputRef,
  onChange,
  filterValue,
  type,
  placeholder,
}) => {
  const [debouncedValue, setDebouncedValue] = useState(filterValue ?? "");

  const saveWithDebounce = (ev: ChangeEvent<HTMLInputElement>) => {
    const inputValue = ev.target.value ?? "";
    setDebouncedValue(inputValue);
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      onChange(inputValue);
    }, DEBOUNCE_INTERVAL);
  };

  // In case when reseting filters
  useEffect(() => {
    if (debouncedValue !== filterValue) setDebouncedValue(filterValue ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValue]);

  return (
    <Input
      key={`${filteringProperty}-dbf`}
      id={`${filteringProperty}-id-dbf`}
      role="textbox"
      ref={inputRef}
      bsSize="sm"
      placeholder={placeholder}
      name={filteringProperty}
      type={type ?? "text"}
      value={debouncedValue}
      onChange={saveWithDebounce}
    />
  );
};
