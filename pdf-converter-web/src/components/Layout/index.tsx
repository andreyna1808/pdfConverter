import Navbar from "../NavBar";
import { darkTheme, lightTheme } from "../../styles/theme";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { ToastContainerStyled } from "../Toast/styles";
import { ThemeProvider } from "styled-components";
import { AppContainer } from "./styles";
import { ILayoutProps } from "./types";
import { ThemeContext } from "../../Contexts/ThemeContext";

const Layout = ({ children }: ILayoutProps) => {
  const storedTheme =
    localStorage.getItem("theme") === "light" ? lightTheme : darkTheme;
  const [theme, setTheme] = useState(storedTheme);

  const toggleTheme = () => {
    const newTheme = theme === darkTheme ? lightTheme : darkTheme;
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme === lightTheme ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <AppContainer>
          <ToastContainerStyled>
            <ToastContainer />
          </ToastContainerStyled>
          <Navbar />
          {children}
        </AppContainer>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default Layout;
