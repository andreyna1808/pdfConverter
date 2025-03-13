/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { IMultiSelectProps } from "./type";
import { StyledMultiSelect } from "./styles";
import {
  MultiValueContainer,
  RemoveIcon,
  OptionContainer,
  Checkbox,
} from "./styles";

const MultiSelect: React.FC<IMultiSelectProps> = ({
  options,
  onChange,
  width = "300px",
  placeholder = "Selecione...",
  value,
  required = false,
}) => {
  return (
    <StyledMultiSelect
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      isMulti
      hideSelectedOptions={false}
      closeMenuOnSelect={false}
      components={{ Option: CustomOption, MultiValue: CustomMultiValue }}
      value={value}
      width={width}
      classNamePrefix="react-select"
      required={required}
    />
  );
};

const CustomOption = (props: any) => {
  const { data, isSelected, innerRef, innerProps } = props;

  return (
    <OptionContainer ref={innerRef} {...innerProps}>
      <Checkbox type="checkbox" checked={isSelected} readOnly />
      {data.label}
    </OptionContainer>
  );
};

const CustomMultiValue = (props: any) => {
  const { data, removeProps } = props;

  return (
    <MultiValueContainer>
      {data.label}
      <RemoveIcon {...removeProps}>✖</RemoveIcon>
    </MultiValueContainer>
  );
};

export default MultiSelect;
