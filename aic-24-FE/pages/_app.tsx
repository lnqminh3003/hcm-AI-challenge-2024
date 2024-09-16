import { useEffect } from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import { ConfigProvider } from "antd";
import { GlobalStyled, antdTheme } from "styles";
import '../styles/globals.css';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ConfigProvider theme={antdTheme}>
        <GlobalStyled />
        <Component {...pageProps} />
      </ConfigProvider>
    </>
  );
}

export default MyApp;
