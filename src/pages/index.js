import React from "react"
import '../styles/index.scss'
import { useStaticQuery, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const Index = ({ location }) => {
  const data = useStaticQuery(graphql`
  query MenuQuery {
    allMarkdownRemark {
      nodes {
        frontmatter {
          title
          list {
            menuItemImage
            menuItem
            menuItemDescription
          }
        }
      }
    }
  }
  `)

  const menuSections = data.allMarkdownRemark.nodes

  return (
    <Layout location={location}>
      <SEO
        title="Home"
      >
        <meta name="og:image" content="/media/aaml-logo.jpg" />
        <meta name="twitter:image" content="/media/aaml-logo.jpg" />
        <meta name="twitter:image:alt" content="Adopt a Minor Leaguer Home Page" />
      </SEO>
      {menuSections.map(({ frontmatter }) => (
        <>
          <h2>{frontmatter.title}</h2>
          {frontmatter.list.map((item) => (
            <>
              <h3>{item.menuItem}</h3>
              <p>{item.menuItemDescription}</p>
              <img src={item.menuItemImage} alt={item.menuItem} />
            </>))}
        </>
      ))}
    </Layout>
  )
}

export default Index