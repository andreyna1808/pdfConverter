/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IOption {
  value: string;
  label: string;
}

export interface IAutoCompleteProps {
  options: IOption[];
  onChange: (selectedOption: any) => void;
  width?: string;
  placeholder?: string;
}
