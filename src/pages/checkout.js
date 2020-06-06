import React, { useState } from "react"
// import { useStaticQuery } from "gatsby"
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useForm } from 'react-hook-form'
import { loadStripe } from '@stripe/stripe-js'
import "../styles/checkout.scss"

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY)

const style = {
    style: {
        base: {
            height: "3rem",
            fontFamily: '"Raleway", sans-serif',
            fontSize: "16px",
            color: "#00235B",
            fontWeight: 900,
            '::placeholder': {
                fontWeight: 400,
            }
        }
    }
}

export default ({ ...props }) => {
    // const data = useStaticQuery(graphql`
    //     query CheckoutQuery {
    //         allRestaurantInfoJson(filter: {deliveryBool: {ne: null}}) {
    //             edges {
    //               node {
    //                 deliveryBool
    //               }
    //             }
    //           }
    //         }
    // `)

    // const deliveryBool = data.allRestaurantInfoJson.edges[0].node.deliveryBool

    const [order] = useState(typeof localStorage !== "undefined" && JSON.parse(localStorage.getItem("order")))

    return (
        <div className="checkout-app">
            <h1>Checkout</h1>
            {order.orderItems.map((item, index) => {
                return <p key={index}>{item.menuItem}{item.options.length > 0 && <span>, with options: {item.options.map(option => <span key={option}>{option}</span>)}</span>}, quantity: {item.quantity}</p>
            })}
            <StripeWrapper order={order} />

        </div>
    )
}

const Form = ({ order }) => {
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
            body: JSON.stringify({ checkoutAmount: 10 })
        })
            .then(res => res.json())
            .then(async (res) => {
                console.log(res)
                const { error } = await stripe.confirmCardPayment(res.client_secret, {
                    payment_method: {
                        card: elements.getElement(CardNumberElement),
                        billing_details: {
                            address: {
                                city: formData.City,
                                country: "US",
                                line1: formData.Street_address,
                                postal_code: formData.Postal_Code,
                                state: formData.State
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
            <input type="text" placeholder="First name" name="First_name" ref={register({ required: true, maxLength: 80 })} />
            <input type="text" placeholder="Last name" name="Last_name" ref={register({ required: true, maxLength: 100 })} />
            <input type="email" placeholder="Email" name="email" ref={register({ required: true, pattern: /^.+@[^].*\.[a-z]{2,}$/ })} />
            <input type="text" placeholder="Street Address" name="Street_address" ref={register({ required: true })} />
            <input type="text" placeholder="City" name="City" ref={register({ required: true })} />
            <select name="State" ref={register}>
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
            <input type="number" placeholder="Postal Code" name="Postal_Code" ref={register({ required: true })} />
            <input type="tel" placeholder="Mobile Number" name="Mobile_Number" ref={register({ required: true, minLength: 6, maxLength: 12 })} />
            <label htmlFor="cardnumber">
                Card Number
                <CardNumberElement
                    className="form-input"
                    options={style}
                />
            </label>
            <label htmlFor="exp-date">
                Expiration Date
            <CardExpiryElement
                    className="form-input"
                    options={style}
                />
            </label>
            <label htmlFor="cvc">
                Security Code (CVC)
                <CardCvcElement
                    className="form-input"
                    options={style}
                />
            </label>
            {stripeError.bool && <p className="error">{stripeError.message}</p>}
            <button type="submit">{isSubmitting ? "Processing..." : "Submit"}</button>
        </form>
    )
}

const StripeWrapper = ({ order }) => (
    <Elements stripe={stripePromise} options={{ fonts: [{ cssSrc: "https://fonts.googleapis.com/css?family=Raleway&display=swap" }] }}>
        <Form order={order} />
    </Elements >
)