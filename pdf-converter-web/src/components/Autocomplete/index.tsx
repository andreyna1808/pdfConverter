import { StyledSelect } from "./styles";
import { IAutoCompleteProps } from "./types";

const AutoComplete: React.FC<IAutoCompleteProps> = ({
  options,
  onChange,
  width,
}) => {
  return (
    <StyledSelect
      classNamePrefix="react-select"
      options={options}
      onChange={onChange}
      placeholder="Selecione..."
      width={width}
      isSearchable
      autoFocus
    />
  );
};

export default AutoComplete;
