import styled, { css } from "styled-components";

/**
 *
 * Styled Plugin
 *
 */

export const flex = css`
  display: flex;
`;
export const flexCol = css`
  display: flex;
  flex-direction: column;
`;

export const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const flexCenterEnd = css`
  display: flex;
  justify-content: end;
  align-items: center;
`;

export const flexVerticalCenter = css`
  display: flex;
  align-items: center;
`;

export const flexColCenter = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const extend = css`
  width: 100%;
  height: 100%;
`;

export const container = css`
  width: 100%;
  padding: 0 64px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const widthRestrict = css`
  max-width: 1200px;
`;

export const horizontalSpaceBetween = css`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const fullScreen = css`
  width: 100vw;
  height: 100vh;
`;

export const fullScreenAbsolute = css`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;

export const spacer = css`
  flex: 1;
`;

export const shadow = css`
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.5);
`;

export const backgroundCenterCover = (url: string) => css`
  background-image: url(${url});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const getScaledText = (fontSize: number, isImportant = false) => css`
  font-size: ${({ theme }) => theme.utils.pxToCalc(fontSize)};
  ${isImportant && "!important"};
  @media (max-width: 768px) {
    font-size: ${`${fontSize}px`} ${isImportant && "!important"};
  }
`;

/**
 *
 *  Styled Components
 *
 */

export const Container = styled.div`
  ${container}
`;

export const WidthRestrict = styled.div`
  ${widthRestrict}
`;

export const Flex = styled.div`
  display: flex;
`;

export const FlexSpaceBetween = styled.div`
  ${flexVerticalCenter};
  justify-content: space-between;
`;

export const FlexVerticalCenter = styled.div`
  ${flexVerticalCenter};
`;

type TPadding = {
  vertical?: number;
  horizontal?: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};
export const ScaledPadding = styled.div<TPadding>`
  padding-top: ${({ vertical, theme, top }) =>
    theme.utils.pxToCalc(top || vertical || 16)};
  padding-bottom: ${({ vertical, theme, bottom }) =>
    theme.utils.pxToCalc(bottom || vertical || 16)};
  padding-left: ${({ horizontal, theme, left }) =>
    theme.utils.pxToCalc(left || horizontal || 16)};
  padding-right: ${({ horizontal, theme, right }) =>
    theme.utils.pxToCalc(right || horizontal || 16)};
`;

export const Padding = styled.div<TPadding>`
  padding-top: ${({ vertical, top }) => `${top || vertical || 16}px`};
  padding-bottom: ${({ vertical, bottom }) => `${bottom || vertical || 16}px`};
  padding-left: ${({ horizontal, left }) => `${left || horizontal || 16}px`};
  padding-right: ${({ horizontal, right }) => `${right || horizontal || 16}px`};
`;

export const OnlyPCPadding = styled.div<TPadding>`
  padding-top: ${({ vertical, top }) => `${top || vertical || 16}px`};
  padding-bottom: ${({ vertical, bottom }) => `${bottom || vertical || 16}px`};
  padding-left: ${({ horizontal, left }) => `${left || horizontal || 16}px`};
  padding-right: ${({ horizontal, right }) => `${right || horizontal || 16}px`};

  @media (max-width: 778px) {
    padding: 0;
  }
`;

export const Spacer = styled.div`
  ${spacer}
`;
