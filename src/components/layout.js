import React from "react"
import '../styles/reset.scss'
import '../styles/global.scss'
import '../styles/home-hero.scss'
import '../styles/footer.scss'
import Image from "gatsby-image"
import { useStaticQuery } from "gatsby"

const Layout = ({ location, children }) => {
  const data = useStaticQuery(graphql`
    query layoutQuery {
      companyLogo: file(absolutePath: {regex: "/logo.jpg/"}) {
        childImageSharp {
          fixed(width: 320, height: 320) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)

  let header, footer

  header = (<Image className="header-logo" fixed={data.companyLogo.childImageSharp.fixed} alt="Restaurant logo." />)
  footer = (<p>footer</p>)

  return (
    <>
      <header>{header}</header>
      <main>{children}</main>
      <footer>{footer}</footer>
    </>
  )
}

export default Layout