import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./routes/index";
import { theme } from "./styles/theme";
import { ToastContainerStyled } from "./components/Toast/styles";
import { ToastContainer } from "react-toastify";

const AppContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.fonts.body};
  min-height: 100vh;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastContainerStyled>
        <ToastContainer />
      </ToastContainerStyled>
      <AppContainer>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
