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
    cursor: text;
    margin: 5px 0px;

    &:hover {
      border-color: ${(props) => props.theme.colors.darkPurple};
    }

    &:focus {
      outline: none;
    }
  }

  .react-select__menu {
    width: ${(props) => props.width || "300px"};
    background: ${(props) => props.theme.colors.background};
    cursor: pointer;
    border: solid 1px ${(props) => props.theme.colors.menu};

    scrollbar-width: thin;
    scrollbar-color: ${(props) => props.theme.colors.lightPurple} transparent;
  }

  .react-select__menu-list {
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: ${(props) => props.theme.colors.lightPurple};
      border-radius: 4px; 
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
