import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";

export const ToastContainerStyled = styled.div`
  .Toastify__toast {
    font-family: ${({ theme }) => theme.fonts.body};
    border-radius: 8px;
    padding: 12px;
  }

  .Toastify__toast--success {
    background-color: ${({ theme }) => theme.colors.lightPurple};
    color: ${({ theme }) => theme.colors.white};
  }

  .Toastify__toast--error {
    background-color: ${({ theme }) => theme.colors.toastError};
    color: ${({ theme }) => theme.colors.white};
  }
`;
