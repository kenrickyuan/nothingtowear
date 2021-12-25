import '../styles/globals.css'
import { Layout } from "../components/ui/layout"


function MyApp({ Component, pageProps }) {
  // const { global } = pageProps
  return (
    // <Layout global={global}>
    <Layout >
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
