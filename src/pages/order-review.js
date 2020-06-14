import React, { useState, useEffect } from 'react'
import { Link, useStaticQuery, graphql } from "gatsby"
import "../styles/order-review.scss"

import SEO from "../components/seo"
import OrderStepper from "../components/orderStepper"
import TrashCan from "../svg/trash-can.svg"

export default ({ ...props }) => {
    const data = useStaticQuery(graphql`
    query OrderReviewQuery {
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

    const [initialRender, setInitialRender] = useState(true)
    const [orderToConfirm, setOrderToConfirm] = useState(typeof localStorage !== "undefined" ? JSON.parse(localStorage.getItem("order")) : { orderItems: [] })
    const [orderTotal, setOrderTotal] = useState(0.00)

    useEffect(() => {
        if (initialRender) {
            setInitialRender(false)
            setOrderToConfirm({
                orderItems: orderToConfirm.orderItems.map(item => {
                    return {
                        ...item,
                        id: parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(16).toString().replace(".", ""))
                    }
                })
            })
        }
    }, [orderToConfirm.orderItems, initialRender])

    useEffect(() => {
        localStorage.setItem("order", JSON.stringify({ orderItems: [...orderToConfirm.orderItems] }))
    }, [orderToConfirm])

    useEffect(() => {
        let orderTotal = 0

        orderToConfirm.orderItems.forEach(item => {
            orderTotal = orderTotal + (item.price * item.quantity)
        })

        setOrderTotal(orderTotal)
    }, [orderToConfirm])

    const remove = (id) => {
        setOrderToConfirm({
            orderItems: orderToConfirm.orderItems.filter(elem => elem.id !== id)
        })
    }

    const addQuantity = (id, quantity) => {
        const newOrder = orderToConfirm.orderItems.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    quantity: quantity + 1
                }
            } else { return { ...item } }
        })

        setOrderToConfirm({ orderItems: newOrder })
    }

    const subtractQuantity = (id, quantity) => {

        const newOrder = orderToConfirm.orderItems.map(item => {
            if (item.id === id && quantity > 1) {
                return {
                    ...item,
                    quantity: quantity - 1
                }
            } else { return { ...item } }
        })

        setOrderToConfirm({ orderItems: newOrder })

    }

    return (
        <>
            <SEO
                title="Order Review"
            >
                <meta name="og:image" content={data.allFile.nodes[0].childImageSharp.fixed} />
                <meta name="twitter:image" content={data.allFile.nodes[0].childImageSharp.fixed} />
                <meta name="twitter:image:alt" content={`${data.restaurantInfoJson.restaurantName} Order Review Page`} />
            </SEO>
            <div className="order-app-review">
                <OrderStepper activeStep={2} />
                <div className="review-container">
                    <Link className="back-to-menu" to="/order">Back to Menu</Link>
                    <h2>Review Your Order</h2>
                    <h2>Total: ${orderTotal.toFixed(2)}</h2>
                    {orderToConfirm.orderItems.length === 0 ? <EmptyOrder /> : orderToConfirm.orderItems.map((item, index) => (
                        <div key={index} id={item.id} className="order-item" style={item.image ? { backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${item.image})` } : {}}>
                            <button className="remove" aria-label="Remove From Order" onClick={() => remove(item.id)}><TrashCan /></button>
                            <h3>{item.menuItem}</h3>
                            {item.options.length > 0 && <div className="options"> Add: {item.options.map((option, index) => {
                                if (index + 1 === item.options.length) {
                                    return <span key={option}>{option} </span>
                                } else {
                                    return <span key={option}>{option}, </span>
                                }
                            })}</div>}
                            <div className="quantity-container">
                                <p className="quantity">Quantity: {item.quantity}</p>
                                <div className="quantity-adjusters">
                                    <button className="quantity-button down" onClick={() => subtractQuantity(item.id, item.quantity)}>One Less...</button>
                                    <button className="quantity-button up" onClick={() => addQuantity(item.id, item.quantity)}>One More!</button>
                                </div>
                            </div>
                            {item.chefNote.length > 0 && <p className="chef-note">Note to Chef: {item.chefNote}</p>}
                        </div>
                    ))}
                </div>
                {orderToConfirm.orderItems.length > 0 && <Link to="/checkout" className="confirm-order-review">Confirm Order</Link>}
            </div >
        </>
    )
}

const EmptyOrder = () => (
    <div className="empty-order">
        <p>Uh oh, looks like your order is empty!</p>
        <Link className="back-to-menu" to="/order">Back to Menu</Link>
    </div>
)