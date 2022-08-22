import '../styles/globals.css'
import { Layout } from "../components/sharedUi/layout"
import { UIProvider } from "../contexts/index"

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
export default MyApp
