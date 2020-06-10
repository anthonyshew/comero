import React, { useEffect } from 'react'
import { Link, useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import "../styles/thank-you.scss"

export default ({ location }) => {
  const { allFile, restaurantInfoJson, companyLogo } = useStaticQuery(graphql`
    query ThankYouQuery{
    allFile(filter: {sourceInstanceName: {eq: "orderSettings"}}) {
        edges {
          node {
            childRestaurantInfoJson {
              takeoutDelay
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
      companyLogo: file(absolutePath: {regex: "/logo.jpg/"}) {
        childImageSharp {
          fixed(width: 300, height: 300) {
            ...GatsbyImageSharpFixed
          }
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
    <div className="thank-you-page">
      <Image className="company-logo" fixed={companyLogo.childImageSharp.fixed} alt="Restaurant logo." />
      <div className="flex">
        <h1>{restaurantInfoJson.restaurantName} thanks&nbsp;you!</h1>
        <p className="wait-time">Your food will be ready for pickup in <strong className="bold">approximately {allFile.edges[0].node.childRestaurantInfoJson.takeoutDelay} minutes!</strong></p>
        <h2 className="address bold">Our Address:</h2>
        <p className="address-line">{restaurantInfoJson.address.streetAddress}</p>
        <p className="address-line">{restaurantInfoJson.address.city}, {restaurantInfoJson.address.state}, {restaurantInfoJson.address.zipCode}</p>
        <Link className="back-to-index" to="/">Back to Home</Link>
      </div>
    </div>
  )
}