import { AppProps } from "next/app";
import React from "react";
import { SessionProvider } from "next-auth/react";

import "~/styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
