import { Footer } from "./footer"
import { ErrorModal } from "./errorModal"

export const Layout = ({ children, global }) => {
  // const { header, footer } = global || {}
  return (
    <>
      <main>
        {children}
      </main>
      <Footer />
      <ErrorModal />
      {/* <Footer {...footer} /> */}
    </>
  )
}