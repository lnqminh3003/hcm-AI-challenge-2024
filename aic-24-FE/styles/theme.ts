import { ThemeConfig } from "antd";
import { COLORS } from "../src/constants";
import { roboto } from "./global";
import { pxToCalc } from "./helper";

export const theme = {
  colors: {
    primary: COLORS.PURPLE_1,
    secondary: COLORS.BLACK_2,
    success: COLORS.GREEN_1,
    error: COLORS.RED_1,
    warning: COLORS.YELLOW_1,

    line: COLORS.GREY_6,
    white: COLORS.WHITE_1,

    contrastText: COLORS.WHITE_1,
    text: COLORS.WHITE_1,
    textSecondary: COLORS.GREY_2,

    textPrimarySecondary: COLORS.BLACK_1,
    textDarkPrimary: COLORS.PURPLE_2,

    bg: COLORS.WHITE_1,
    lightPrimaryBg: COLORS.PURPLE_6,
    primaryBg: COLORS.PURPLE_3,
    secondaryBg: COLORS.GREY_5,
    linearGradientBg: `linear-gradient(180deg, #EAF1F880 30%, #EAF1F800 100%)`,
    inverseLinearGradientBg: `linear-gradient(180deg, #EAF1F800 30%, ${COLORS.PURPLE_6} 80%, white 100%)`,
    purpleGradientBg: `linear-gradient(318.61deg, #686ae3, #6e2b89 96.92%), #fff`,

    cardHighlightHeader: COLORS.GREY_7,
  },
  utils: {
    pxToCalc: pxToCalc,
  },
};

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: theme.colors.primary,
    fontFamily: roboto.style.fontFamily,
    borderRadius: 8,
  },
  components: {
    Layout: {
      colorBgHeader: "white",
    },
    Card: {
      boxShadowTertiary: "0px 2px 4px 0px rgba(0, 0, 0, 0.08)",
    },
    Popover: {
      padding: 0,
      paddingSM: 0,
    },
  },
};
