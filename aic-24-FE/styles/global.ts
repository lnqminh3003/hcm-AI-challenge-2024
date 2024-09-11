import { Roboto } from "next/font/google";
import { createGlobalStyle } from "styled-components";

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const GlobalStyled = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
  }
  
  * {
    box-sizing: border-box;
  }
`;
