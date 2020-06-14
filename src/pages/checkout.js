import React, { useState, useEffect } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import "../styles/checkout.scss"

import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useForm } from 'react-hook-form'
import { loadStripe } from '@stripe/stripe-js'

import SEO from "../components/seo"
import OrderStepper from "../components/orderStepper"

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_CLIENT_PUBLISHABLE_KEY)

const style = {
    style: {
        base: {
            fontFamily: '"Raleway", sans-serif',
            fontSize: "16px",
            color: "#00235B",
            '::placeholder': {
                fontWeight: 400,
            }
        }
    }
}

export default ({ ...props }) => {
    const data = useStaticQuery(graphql`
    query CheckoutQuery {
      allFile(filter: {sourceInstanceName: {eq: "assets"}}) {
        nodes {
          childImageSharp {
            fixed(width: 300, height: 300) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
    `)

    const [order] = useState(typeof localStorage !== "undefined" && JSON.parse(localStorage.getItem("order")))
    const [orderTotal, setOrderTotal] = useState(0)

    useEffect(() => {
        let orderTotal = 0

        order.orderItems.forEach(item => {
            orderTotal = orderTotal + (item.price * item.quantity)
        })

        setOrderTotal(orderTotal * 100)
    }, [order.orderItems])

    return (
        <>
            <SEO
                title="Checkout"
            >
                <meta name="og:image" content={data.allFile.nodes[0].childImageSharp.fixed} />
                <meta name="twitter:image" content={data.allFile.nodes[0].childImageSharp.fixed} />
                <meta name="twitter:image:alt" content={`${data.restaurantInfoJson.restaurantName} Checkout Page`} />
            </SEO>
            <div className="checkout-app">
                <OrderStepper activeStep={3} />
                <Link className="back-to-confirm" to="/order-review">Back to Order Review</Link>
                <h2>Checkout</h2>
                <StripeWrapper orderTotal={orderTotal} />
            </div>
        </>
    )
}

const Form = ({ orderTotal }) => {
    const { register, handleSubmit, errors } = useForm()
    const stripe = useStripe()
    const elements = useElements()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [stripeError, setStripeError] = useState("")

    const onSubmit = async (formData, e) => {
        e.preventDefault()
        setIsSubmitting(true)

        if (!stripe || !elements) return

        fetch("/.netlify/functions/api/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ checkoutAmount: orderTotal })
        })
            .then(res => res.json())
            .then(async (res) => {
                const { error } = await stripe.confirmCardPayment(res.client_secret, {
                    payment_method: {
                        card: elements.getElement(CardNumberElement),
                        billing_details: {
                            address: {
                                city: formData.city,
                                country: "US",
                                line1: formData.street_address,
                                postal_code: formData.postal_code,
                                state: formData.state
                            }
                        }
                    }
                })

                if (error) {
                    setStripeError({ bool: true, message: error.message })
                    setIsSubmitting(false)
                } else {
                    fetch("/.netlify/functions/api/checkout-success", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            order: JSON.parse(localStorage.getItem("order")),
                            data: formData
                        })
                    })
                        .then(res => window.location.href = '/thank-you')
                }
            })
    }

    console.log(errors)

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="section">
                <h3>Your Information</h3>
                <div className="row">
                    <span className="input-container">
                        <label htmlFor="first_name">First Name</label>
                        <input className={errors.first_name && "invalid"} type="text" placeholder="First Name" aria-label="First Name" name="first_name" ref={register({ required: true, minLength: 1, maxLength: 50 })} />
                    </span>
                    <span className="input-container">
                        <label htmlFor="last_name">Last Name</label>
                        <input type="text" className={errors.last_name && "invalid"} placeholder="Last Name" aria-label="Last Name" name="last_name" ref={register({ required: true, minLength: 1, maxLength: 50 })} />
                    </span>
                </div>
                <div className="row full-width">
                    <span className="input-container">
                        <label htmlFor="email">Email</label>
                        <input type="email" className={errors.email && "invalid"} placeholder="Email" aria-label="Email" name="email" ref={register({ required: true, minLength: 1, pattern: /^.+@[^].*\.[a-z]{2,}$/ })} />
                    </span>
                    <span className="input-container">
                        <label htmlFor="mobile_number">Mobile Number</label>
                        <input type="tel" className={errors.mobile_number && "invalid"} placeholder="Mobile Number" aria-label="Mobile Number" name="mobile_number" ref={register({ required: true, minLength: 10, maxLength: 10 })} />
                    </span>
                </div>
            </div>
            <div className="section">
                <h3>Billing Info</h3>
                <div className="row">
                    <span className="input-container full-width">
                        <label htmlFor="street_address">Street Address</label>
                        <input className={`"full-width-input"${errors.street_address && " invalid"}`} type="text" placeholder="Street Address" aria-label="Street Address" name="street_address" ref={register({ required: true, minLength: 1 })} />
                    </span>
                </div>
                <div className="row">
                    <span className="input-container city">
                        <label htmlFor="city">City</label>
                        <input type="text" className={errors.city && "invalid"} placeholder="City" aria-label="City" name="city" ref={register({ required: true, minLength: 1 })} />
                    </span>
                    <span className="input-container select">
                        <label htmlFor="state">State</label>
                        <select className={errors.state && "invalid"} name="state" ref={register({ required: true, minLength: 1, maxLength: 2 })}>
                            <option value="">State</option>
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Delaware</option>
                            <option value="DC">District of Columbia</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="PR">Puerto Rico</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option>
                        </select>
                    </span>
                    <span className="input-container postal">
                        <label htmlFor="postal_code">Postal Code</label>
                        <input type="number" className={errors.postal_code && "invalid"} placeholder="Postal Code" aria-label="Postal Code" name="postal_code" ref={register({ required: true })} />
                    </span>
                </div>
                <label className="stripe-label" htmlFor="cardnumber">
                    Card Number
                    </label>
                <CardNumberElement
                    className="stripe-form-input"
                    options={style}
                />
                <div className="row">
                    <label className="stripe-label small" htmlFor="exp-date">
                        Expiration Date
                    <CardExpiryElement
                            className="stripe-form-input expiry"
                            options={style}
                        />
                    </label>
                    <label className="stripe-label small" htmlFor="cvc">
                        Security Code
                    <CardCvcElement
                            className="stripe-form-input cvc"
                            options={style}
                        />
                    </label>
                </div>
                {stripeError.message ? <p className="stripe-error">{stripeError.message}</p> : <p className="stripe-error-placeholder"></p>}
            </div>
            <div className="submit-container">
                <button className="submit" type="submit" disabled={orderTotal === 0 || !stripe || !elements}>{isSubmitting ? "Processing..." : `Pay $${(orderTotal / 100).toFixed(2)}`}</button>
            </div>
        </form>
    )
}

const StripeWrapper = ({ order, orderTotal }) => (
    <Elements stripe={stripePromise} options={{ fonts: [{ cssSrc: "https://fonts.googleapis.com/css?family=Raleway&display=swap" }] }}>
        <Form order={order} orderTotal={orderTotal} />
    </Elements >
)