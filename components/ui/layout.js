import { Footer } from "./footer"

export const Layout = ({ children, global }) => {
  // const { header, footer } = global || {}
  return (
    <>
      <main>
        {children}
      </main>
      <Footer />
      {/* <Footer {...footer} /> */}
    </>
  )
}