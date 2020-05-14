import React, { useState, useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { useForm } from "react-hook-form"
import '../styles/order-app.scss'

import { checkArrayEquality } from "../utils/checkArrayEquality"

import { useBodyScrollLock } from "../hooks/useBodyScrollLock"
import { Accordion, AccordionItem } from "../components/accordion"
import Star from "../svg/star.svg"
import X from "../svg/x.svg"
import Minus from "../svg/minus.svg"
import Plus from "../svg/plus.svg"

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
    }
    `)

    const [order, setOrder] = useState(typeof localStorage !== "undefined" && localStorage.getItem("order"))
    const [modalData, setModalData] = useState({})

    useEffect(() => {
        if (order === null) {
            localStorage.setItem("order", JSON.stringify({ orderItems: [] }))
            setOrder(JSON.stringify({ orderItems: [] }))
        }
    }, [order])


    const menuSections = data.allMarkdownRemark.nodes.filter(elem => elem.frontmatter.specialTitle === null)

    return (
        <div className="order-app">
            <Accordion>
                <Menu setModalData={setModalData} menuSections={menuSections} />
            </Accordion>
            {Object.getOwnPropertyNames(modalData).length !== 0 && <ItemModal modalData={modalData} setModalData={setModalData} />}
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

const ItemModal = ({ modalData, setModalData, ...props }) => {
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

        setCurrentPrice(basePrice + sum)
    }, [selectedOptions, basePrice, modalData.orderOptions])

    const addToOrder = data => {
        const userSelections = Object.entries(data)
        //Remove quantity from a list of menu item options
        userSelections.pop()
        const toAdd = {
            menuItem: modalData.menuItem,
            options: userSelections
                .map(option => option[1] === true ? option[0] : null)
                .filter(option => option !== null),
            quantity: Number(data.quantity)
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

        console.log(order)
        localStorage.setItem("order", JSON.stringify(order))
    }

    return (
        <div className="item-modal-container">
            <form className="item-modal-body" onSubmit={handleSubmit(addToOrder)}>
                <h2>{modalData.menuItem}</h2>
                <section className="inner-body">
                    {modalData.menuItemImage && <img className="modal-image" src={modalData.menuItemImage} alt={modalData.menuItem} />}
                    <p className="modal-description">{modalData.menuItemDescription}</p>
                    <button className="modal-exit" onClick={() => setModalData({})}><X /></button>
                    {modalData.orderOptions && <h3>Options</h3>}
                    {modalData.orderOptions && modalData.orderOptions.map((option) => (
                        <div key={option.orderOptionName} className="checkbox-container">
                            <input className="checkbox" type="checkbox" name={option.orderOptionName} ref={register} />
                            <label className="checkbox-label" htmlFor={option.orderOptionName}>
                                {option.orderOptionName} {option.orderOptionPriceChange > 0 && <>(+ ${option.orderOptionPriceChange.toFixed(2)})</>}</label>
                        </div>
                    ))}
                    <label htmlFor="quantity" className="quantity-label">Quantity</label>
                    <div className="quantity-flex">
                        <button className="quantity-button" type="button" onClick={() => setQuantity(quantity >= 2 ? quantity - 1 : 1)}><Minus /></button>
                        <input className="quantity-input" type="number" min="1" name="quantity" value={quantity} readOnly={true} ref={register} />
                        <button className="quantity-button" type="button" onClick={() => setQuantity(quantity + 1)}><Plus /></button>
                    </div>
                </section>
                <input type="submit" className="add-to-order-button" value={"Add to Order - $" + currentPrice.toFixed(2)} />
            </form>
        </div>
    )
}