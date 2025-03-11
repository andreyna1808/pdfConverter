import Select from "react-select";
import styled from "styled-components";
import { IAutoCompleteProps } from "./types";

export const StyledSelect = styled(Select)<IAutoCompleteProps>`
  .react-select__control {
    width: ${(props) => props.width || "300px"};
    background: ${(props) => props.theme.colors.secondary};
    border: 2px solid ${(props) => props.theme.colors.lightPurple};
    border-radius: 4px;
    font-family: ${(props) => props.theme.fonts.body};
    transition: border-color 0.3s;
    padding: 2px;
    cursor: pointer;

    &:hover {
      border-color: ${(props) => props.theme.colors.darkPurple};
    }
  }

  .react-select__menu {
    background: ${(props) => props.theme.colors.background};
    cursor: pointer;
  }

  .react-select__option {
    color: ${(props) => props.theme.colors.white};
    background: ${(props) => props.theme.colors.background};
    cursor: pointer;

    &:hover {
      background: ${(props) => props.theme.colors.lightPurple};
    }
  }
`;
