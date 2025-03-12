import { StyledSelect } from "./styles";
import { IAutoCompleteProps } from "./types";

const AutoComplete: React.FC<IAutoCompleteProps> = ({
  placeholder = "Selecione...",
  options,
  onChange,
  width,
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
    />
  );
};

export default AutoComplete;
