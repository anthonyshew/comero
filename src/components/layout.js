import React from "react"
import '../styles/reset.scss'
import '../styles/global.scss'
import '../styles/navbar.scss'
import '../styles/home-hero.scss'
import '../styles/footer.scss'

const Layout = ({ location, children }) => {

  const rootPath = `${__PATH_PREFIX__}/`
  let header, footer


  if (location.pathname === rootPath) {
    header = (<p>index header</p>)
    footer = (<p>index footer</p>)
  } else {
    header = (<p>header</p>)
    footer = (<p>footer</p>)
  }

  return (
    <>
      <header>{header}</header>
      <main>{children}</main>
      <footer>{footer}</footer>
    </>
  )
}

export default Layout