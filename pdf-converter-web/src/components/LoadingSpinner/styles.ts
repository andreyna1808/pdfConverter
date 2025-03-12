import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${(props) => props.theme.colors.lightPurple}; /* Borda principal */
  border-top: 4px solid ${(props) => props.theme.colors.darkPurple}; /* Cor da animação */
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
`;
