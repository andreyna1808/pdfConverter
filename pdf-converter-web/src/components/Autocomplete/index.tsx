import { StyledSelect } from "./styles";
import { IAutoCompleteProps } from "./types";

const AutoComplete: React.FC<IAutoCompleteProps> = ({
  placeholder = "Selecione...",
  options,
  onChange,
  width,
  required = false,
  value,
}) => {
  return (
    <StyledSelect
      classNamePrefix="react-select"
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      width={width}
      isSearchable
      autoFocus
      required={required}
      value={value}
    />
  );
};

export default AutoComplete;
