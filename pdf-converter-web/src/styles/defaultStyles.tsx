import { IoMdClose } from "react-icons/io";
import styled from "styled-components";

export const PrimaryButton = styled.button`
  padding: 10px 16px;
  background-color: ${(props) => props.theme.colors.lightPurple};
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.darkPurple};
    transition: 0.3s;
  }
`;

export const CloseIcon = styled(IoMdClose)`
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.lightPurple};
    transition: 0.3s;
  }
`;
