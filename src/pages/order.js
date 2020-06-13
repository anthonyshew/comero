import React, { useState, useEffect } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { useForm } from "react-hook-form"
import '../styles/order-app.scss'

import { checkArrayEquality } from "../utils/checkArrayEquality"

import { useBodyScrollLock } from "../hooks/useBodyScrollLock"
import { Accordion, AccordionItem } from "../components/accordion"
import OrderStepper from "../components/orderStepper"
import Star from "../svg/star.svg"
import X from "../svg/x.svg"

export default ({ ...props }) => {
    const data = useStaticQuery(graphql`
    query AppQuery {
        allMarkdownRemark {
            nodes {
              frontmatter {
                orderPosition
                menuSectionList {
                  menuItem
                  menuItemPrice
                  menuItemDescription
                  menuItemImage
                  favorite
                  orderOptions {
                      orderOptionName
                      orderOptionPriceChange
                  }
                }
                sectionTitle
                specialTitle
                specialSubtitle
                specialDescription
              }
            }
          }
          restaurantInfoJson {
              restaurantName
          }
    }
    `)

    const [order, setOrder] = useState(typeof localStorage !== "undefined" && JSON.parse(localStorage.getItem("order")))
    const [modalData, setModalData] = useState({})
    const [isCheckoutButtonVisible, setIsCheckoutButtonVisible] = useState(false)

    useEffect(() => {
        if (order === null) {
            localStorage.setItem("order", JSON.stringify({ orderItems: [] }))
            setOrder(({ orderItems: [] }))
        }
    }, [order])

    useEffect(() => {
        if (order && order.orderItems.length > 0) {
            setIsCheckoutButtonVisible(true)
        } else {
            setIsCheckoutButtonVisible(false)
        }
    }, [order])

    const menuSections = data.allMarkdownRemark.nodes.filter(elem => elem.frontmatter.specialTitle === null)

    return (
        <div className="order-app">
            <OrderStepper activeStep={1} />
            <h2>Our Takeout Menu</h2>
            <Accordion>
                <Menu setModalData={setModalData} menuSections={menuSections} />
            </Accordion>
            {Object.getOwnPropertyNames(modalData).length !== 0 && <ItemModal modalData={modalData} setModalData={setModalData} setOrder={setOrder} />}
            {isCheckoutButtonVisible && Object.getOwnPropertyNames(modalData.length === 0) && <CheckoutButton />}
        </div>
    )
}

const Menu = ({ menuSections, setModalData }) => {

    const openMenuItem = (menuItem, e) => {
        setModalData(menuItem)
    }

    return (
        <>
            {menuSections.sort((a, b) => a.frontmatter.orderPosition - b.frontmatter.orderPosition).map(({ frontmatter }) => (
                <AccordionItem key={frontmatter.sectionTitle} header={frontmatter.sectionTitle}>
                    {frontmatter.menuSectionList.map((item) => (
                        <button key={item.menuItem} className="menu-item" onClick={() => openMenuItem(item)}>
                            <h4>{item.favorite && <Star />} {item.menuItem}: ${String(item.menuItemPrice.toFixed(2))}</h4>
                            <div className="menu-item-body">
                                <p className="menu-item-description">{item.menuItemDescription}</p>
                            </div>
                        </button>
                    ))}
                </AccordionItem>
            ))}
        </>
    )
}

const ItemModal = ({ modalData, setModalData, setOrder }) => {
    const [basePrice] = useState(modalData.menuItemPrice)
    const [currentPrice, setCurrentPrice] = useState(basePrice)
    const [quantity, setQuantity] = useState(1)
    useBodyScrollLock()
    const { register, handleSubmit, watch } = useForm()

    const selectedOptions = modalData.orderOptions ? watch(modalData.orderOptions.map(option => option.orderOptionName)) : []

    useEffect(() => {
        const toAdd = []

        Object.keys(selectedOptions).filter(key => selectedOptions[key] === true).forEach((key) => {
            modalData.orderOptions.map((option) => {
                if (option.orderOptionName === key) {
                    return toAdd.push(option.orderOptionPriceChange)
                }

                return null
            })
        })

        const sum = toAdd.reduce((a, b) => a + b, 0)

        setCurrentPrice((basePrice + sum) * quantity)
    }, [selectedOptions, basePrice, modalData.orderOptions, quantity])

    const addToOrder = data => {
        const userSelections = Object.entries(data)
        //Remove quantity from a list of menu item options
        userSelections.pop()

        const toAdd = {
            menuItem: modalData.menuItem,
            image: modalData.menuItemImage,
            options: userSelections
                .map(option => option[1] === true ? option[0] : null)
                .filter(option => option !== null),
            quantity: Number(data.quantity),
            price: currentPrice,
            chefNote: data.chef_note
        }

        let order = JSON.parse(localStorage.getItem("order"))
        let orderChangedBool = false

        order.orderItems.forEach(item => {
            if (item.menuItem === toAdd.menuItem && checkArrayEquality(item.options, toAdd.options)) {
                orderChangedBool = true
                return item.quantity = item.quantity + toAdd.quantity
            }
        })

        if (!orderChangedBool) order.orderItems.push(toAdd)

        localStorage.setItem("order", JSON.stringify(order))
        setOrder(order)
        setModalData({})
    }

    return (
        <div className="item-modal-container">
            <form className="item-modal-body" onSubmit={handleSubmit(addToOrder)}>
                <h2>{modalData.menuItem}</h2>
                <section className="inner-body">
                    {modalData.menuItemImage && <img className="modal-image" src={modalData.menuItemImage} alt={modalData.menuItem} />}
                    <p className="modal-description">{modalData.menuItemDescription}</p>
                    <button className="modal-exit" aria-label="Close menu item pop up" onClick={() => setModalData({})}><X /></button>
                    {modalData.orderOptions && <h3>Options</h3>}
                    {modalData.orderOptions && modalData.orderOptions.map((option) => (
                        <div key={option.orderOptionName} className="checkbox-container">
                            <input className="checkbox" type="checkbox" aria-label={option.orderOptionName} name={option.orderOptionName} ref={register} />
                            <label className="checkbox-label" htmlFor={option.orderOptionName}>
                                {option.orderOptionName} {option.orderOptionPriceChange > 0 && <>(+ ${option.orderOptionPriceChange.toFixed(2)})</>}</label>
                        </div>
                    ))}
                    <label htmlFor="quantity" className="quantity-label">Quantity</label>
                    <div className="quantity-flex">
                        <button className="quantity-button" type="button" onClick={() => setQuantity(quantity >= 2 ? quantity - 1 : 1)}><span className="minus-fix">-</span></button>
                        <input className="quantity-input" type="number" aria-label="Quantity" name="quantity" value={quantity} readOnly={true} ref={register} />
                        <button className="quantity-button" type="button" onClick={() => setQuantity(quantity + 1)}><span>+</span></button>
                    </div>
                    <label className="chef-note-label" htmlFor="chef_note">Notes to Chef</label>
                    <input className="chef-note" type="text" aria-label="Chef Note" name="chef_note" ref={register} />
                </section>
                <input type="submit" className="add-to-order-button" aria-label={"Add to Order - $" + currentPrice.toFixed(2)} value={"Add to Order - $" + currentPrice.toFixed(2)} />
            </form>
        </div>
    )
}

const CheckoutButton = ({ ...props }) => (
    <Link to="/order-review" className="checkout-button">View Order & Checkout</Link>
)