/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IOption {
  value: string | number;
  label: string;
}

export interface IMultiSelectProps {
  options: IOption[];
  onChange: (selectedOptions: any) => void;
  width?: string;
  placeholder?: string;
  value?: any;
  required?: boolean;
}
