import { darkTheme } from "../../styles/theme";
import { ReactNode } from "react";

export interface ILayoutProps {
  children: ReactNode;
}

export interface IThemeContextType {
  theme: typeof darkTheme;
  toggleTheme: () => void;
}
