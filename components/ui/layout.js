import { Footer } from "./footer"

export const Layout = ({ children, global }) => {
  // const { header, footer } = global || {}
  return (
    <>
      {children}
      <Footer />
      {/* <Footer {...footer} /> */}
    </>
  )
}