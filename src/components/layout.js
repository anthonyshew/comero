import React from "react"
import '../styles/reset.scss'
import '../styles/global.scss'
import '../styles/home-hero.scss'
import Image from "gatsby-image"
import { useStaticQuery, graphql } from "gatsby"

const Layout = ({ location, children }) => {
  const data = useStaticQuery(graphql`
    query layoutQuery {
      companyLogo: file(absolutePath: {regex: "/logo.jpg/"}) {
        childImageSharp {
          fixed(width: 300, height: 300) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      hero: file(absolutePath: {regex: "/hero.jpg/"}) {
        childImageSharp {
          fluid(maxWidth: 1500) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      contentJson {
        restaurantMotto
        restaurantName
        restaurantAbout
      }
    }
  `)

  const { restaurantMotto, restaurantName } = data.contentJson

  let header, footer

  header = (
    <>
      <nav id="home" className="navbar">
        <a href="#home">Home</a>
        <a href="#store">Location & Hours</a>
        <a href="#menu">Menu</a>
        {data.contentJson.restaurantAbout.length > 0 ? <a href="#about">About</a> : null}
      </nav>
      <div className="hero-container">
        <Image className="hero-image" fluid={data.hero.childImageSharp.fluid} alt={`${data.contentJson.restaurantName}'s Restaurant & Food.`} />
        <div className="flex-container">
          <Image className="header-logo" fixed={data.companyLogo.childImageSharp.fixed} alt="Restaurant logo." />
          <div className="text-content">
            <h1>{restaurantName}</h1>
            <h2>{restaurantMotto}</h2>
          </div>
        </div>
      </div>
    </>
  )
  footer = (<nav id="home" className="navbar">
    <a href="#home">Home</a>
    <a href="#store">Location & Hours</a>
    <a href="#menu">Menu</a>
    {data.contentJson.restaurantAbout.length > 0 ? <a href="#about">About</a> : null}
  </nav>)

  return (
    <>
      <header className="index-header">{header}</header>
      <main className="index-main">{children}</main>
      <footer className="index-footer">{footer}</footer>
    </>
  )
}

export default Layout