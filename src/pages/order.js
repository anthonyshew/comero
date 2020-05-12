import React, { useState, useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { useForm } from "react-hook-form"
import '../styles/order-app.scss'

import { useBodyScrollLock } from "../hooks/useBodyScrollLock"
import { Accordion, AccordionItem } from "../components/accordion"
import Star from "../svg/star.svg"

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
                            <div className="menu-item-body" style={{ minHeight: item.menuItemImage ? "200px" : null }}>
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
    console.log(modalData)
    useBodyScrollLock()

    return (
        <div className="item-modal" onClick={() => setModalData({})}>
            {JSON.stringify(modalData)}
        </div>
    )
}