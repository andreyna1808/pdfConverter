/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { IMultiSelectProps } from "./type";
import { StyledMultiSelect } from "./styles";

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
    <div
      ref={innerRef}
      {...innerProps}
      style={{ display: "flex", alignItems: "center", padding: "8px" }}
    >
      <input
        type="checkbox"
        checked={isSelected}
        readOnly
        style={{ marginRight: "8px" }}
      />
      {data.label}
    </div>
  );
};

const CustomMultiValue = (props: any) => {
  const { data, removeProps } = props;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "#6b46c1",
        color: "white",
        padding: "4px",
        borderRadius: "4px",
        margin: "2px",
      }}
    >
      {data.label}
      <span {...removeProps} style={{ marginLeft: "8px", cursor: "pointer" }}>
        ✖
      </span>
    </div>
  );
};

export default MultiSelect;
