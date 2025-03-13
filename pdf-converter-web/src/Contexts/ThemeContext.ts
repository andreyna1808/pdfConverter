import { IThemeContextType } from "../components/Layout/types";
import { createContext } from "react";

export const ThemeContext = createContext<IThemeContextType | undefined>(
  undefined
);
