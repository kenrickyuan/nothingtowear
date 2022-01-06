import '../styles/globals.css'
import { Layout } from "../components/ui/layout"
import { UIProvider } from "../contexts/index"
import ScrollPadlock from "scroll-padlock/dist/es/scroll-padlock.js";

function MyApp({ Component, pageProps }) {
  // const { global } = pageProps
  return (
    // <Layout global={global}>
    <UIProvider>
      <Layout >
        <Component {...pageProps} />
      </Layout>
    </UIProvider>
  )
}

void new ScrollPadlock(document.body, "no-scroll");
export default MyApp
