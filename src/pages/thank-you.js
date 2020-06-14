import React, { useEffect } from 'react'
import { Link, useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import "../styles/thank-you.scss"

import SEO from "../components/seo"

export default ({ location }) => {
  const { orderSettings, logo, restaurantInfoJson } = useStaticQuery(graphql`
    query ThankYouQuery{
    orderSettings: allFile(filter: {sourceInstanceName: {eq: "orderSettings"}}) {
        edges {
          node {
            childRestaurantInfoJson {
              takeoutDelay
            }
          }
        }
      }
      logo: allFile(filter: {sourceInstanceName: {eq: "assets"}}) {
        nodes {
          name
          childImageSharp {
            fixed(width: 300, height: 300) {
              ...GatsbyImageSharpFixed
            }
            fluid(maxWidth: 1500) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
      restaurantInfoJson {
        restaurantName
        address {
          city
          state
          streetAddress
          zipCode
        }
    }
    }
    `)

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("order", JSON.stringify({ orderItems: [] }))
    }
  }, [])

  return (
    <>
      <SEO
        title="Thank You"
      >
        <meta name="og:image" content={logo.nodes[0].childImageSharp.fixed} />
        <meta name="twitter:image" content={logo.nodes[0].childImageSharp.fixed} />
        <meta name="twitter:image:alt" content={`${restaurantInfoJson.restaurantName} Thank You Page`} />
      </SEO>
      <div className="thank-you-page">
        <Image className="company-logo" fixed={logo.nodes.filter(node => node.name === "logo")[0].childImageSharp.fixed} alt="Restaurant logo." />
        <div className="flex">
          <h1>{restaurantInfoJson.restaurantName} thanks&nbsp;you!</h1>
          <p className="wait-time">Your food will be ready for pickup in <strong className="bold">approximately {orderSettings.edges[0].node.childRestaurantInfoJson.takeoutDelay} minutes!</strong></p>
          <h2 className="address bold">Our Address:</h2>
          <p className="address-line">{restaurantInfoJson.address.streetAddress}</p>
          <p className="address-line">{restaurantInfoJson.address.city}, {restaurantInfoJson.address.state}, {restaurantInfoJson.address.zipCode}</p>
          <Link className="back-to-index" to="/">Back to Home</Link>
        </div>
      </div>
    </>
  )
}