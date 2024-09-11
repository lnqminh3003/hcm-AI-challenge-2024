import "styled-components";
import { theme } from "styles";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: typeof theme.colors;
    utils: typeof theme.utils;
  }
}
