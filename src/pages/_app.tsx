import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../comps/store";
import Header from "@/comps/header";
import Footer from "@/comps/footer";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <>
       <Head>
        <link rel="icon" type="image/png" href="/BLACKS.png" />
        <title>BLACKSFIT</title>
      </Head>
        <Header />
        <main className="p-6">
          <Component {...pageProps} />
        </main>
        <Footer/>
      </>
    </Provider>
  );
}
