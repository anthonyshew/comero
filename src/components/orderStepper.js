import React from 'react'
import { useStaticQuery, graphql } from "gatsby"
import "../styles/order-stepper.scss"

export default ({ activeStep }) => {
    const { restaurantInfoJson, allFile } = useStaticQuery(graphql`
    query OrderStepperQuery {
        restaurantInfoJson {
            restaurantName
            takeoutDelay
        }
        allFile(filter: {sourceInstanceName: {eq: "orderSettings"}}) {
            edges {
              node {
                childRestaurantInfoJson {
                  takeoutDelay
                }
              }
            }
          }
      }
    `)

    return (
        <div className="order-stepper-container">
            <h1>{restaurantInfoJson.restaurantName}</h1>
            <div className="steps-container">
                <div className={`step one${activeStep === 1 ? " active" : ""}`}>
                    Food
                </div>
                <div className={`step two${activeStep === 2 ? " active" : ""}`}>
                    Review
                </div>
                <div className={`step three${activeStep === 3 ? " active" : ""}`}>
                    Pay
                </div>
            </div>
            <p className="wait-time">Current Takeout Wait Time: {allFile.edges[0].node.childRestaurantInfoJson.takeoutDelay} minutes</p>
        </div>
    )
}