import React from 'react'
import { useStaticQuery, graphql } from "gatsby"

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
                  favorite
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

    const menuSections = data.allMarkdownRemark.nodes.filter(elem => elem.frontmatter.specialTitle === null)


    return (
        <div className="order-app">
            <Accordion>
                <Menu menuSections={menuSections} />
            </Accordion>
        </div>
    )
}

const Menu = ({ menuSections }) => (
    <>
        {menuSections.sort((a, b) => a.frontmatter.orderPosition - b.frontmatter.orderPosition).map(({ frontmatter }) => (
            <AccordionItem key={frontmatter.sectionTitle} header={frontmatter.sectionTitle}>
                {frontmatter.menuSectionList.map((item) => (
                    <div key={item.menuItem} className="menu-item">
                        <h4>{item.favorite && <Star />} {item.menuItem}: ${String(item.menuItemPrice.toFixed(2))}</h4>
                        <div className="menu-item-body" style={{ minHeight: item.menuItemImage ? "200px" : null }}>
                            <p className="menu-item-description">{item.menuItemDescription}</p>
                        </div>
                    </div>
                ))}
            </AccordionItem>
        ))}
    </>
)