import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../comps/store";
import Header from "@/comps/header";
import Footer from "@/comps/footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <>
        <Header />
        <main className="p-6">
          <Component {...pageProps} />
        </main>
        <Footer/>
      </>
    </Provider>
  );
}
