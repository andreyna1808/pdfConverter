import Select from "react-select";
import styled from "styled-components";
import { IAutoCompleteProps } from "./types";

export const StyledSelect = styled(Select)<IAutoCompleteProps>`
  .react-select__control {
    width: ${(props) => props.width || "300px"};
    background: ${(props) => props.theme.colors.secondary};
    border: 1px solid ${(props) => props.theme.colors.lightPurple};
    border-radius: 4px;
    font-family: ${(props) => props.theme.fonts.body};
    transition: border-color 0.3s;
    padding: 2px;
    cursor: pointer;
    margin: 5px 0px;

    &:hover {
      border-color: ${(props) => props.theme.colors.darkPurple};
    }
  }

  .react-select__menu {
    width: ${(props) => props.width || "300px"};
    background: ${(props) => props.theme.colors.background};
    cursor: pointer;

    scrollbar-width: thin; /* Para Firefox */
    scrollbar-color: ${(props) => props.theme.colors.lightPurple} transparent;
  }

  .react-select__menu-list {
    &::-webkit-scrollbar {
      width: 6px; /* Largura da barra de rolagem */
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: ${(props) => props.theme.colors.lightPurple};
      border-radius: 4px; /* Borda arredondada */
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${(props) => props.theme.colors.darkPurple};
    }
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
