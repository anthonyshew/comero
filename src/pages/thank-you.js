import React, { useEffect } from 'react'
import { Link, useStaticQuery, graphql } from "gatsby"
import "../styles/thank-you.scss"

import SEO from "../components/seo"

export default ({ location }) => {
  const { orderSettings, restaurantInfoJson } = useStaticQuery(graphql`
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
      restaurantInfoJson {
        logo
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
      />
      <div className="thank-you-page">
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