import '../styles/globals.css'
import { Layout } from "../components/ui/layout"
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
