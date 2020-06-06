import React from "react"
import '../styles/index.scss'
import { Link, useStaticQuery, graphql } from "gatsby"

import Phone from "../svg/phone.svg"
import Email from "../svg/email.svg"
import Star from "../svg/star.svg"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { Accordion, AccordionItem } from "../components/accordion"

const Index = ({ location }) => {
  const data = useStaticQuery(graphql`
  query IndexQuery {
    restaurantInfoJson {
      restaurantName
      restaurantMotto
      restaurantAbout
      phone
      email
      address {
        streetAddress
        city
        state
        zipCode
      }
      mondayHours {
        open
        close
      }
      tuesdayHours {
        open
        close
      }
      wednesdayHours {
        open
        close
      }
      thursdayHours {
        open
        close
      }
      fridayHours {
        open
        close
      }
      saturdayHours {
        open
        close
      }
      sundayHours {
        open
        close
      }
    }
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

  const menuSpecials = data.allMarkdownRemark.nodes.filter(elem => elem.frontmatter.specialTitle !== null)
  const menuSections = data.allMarkdownRemark.nodes.filter(elem => elem.frontmatter.specialTitle === null)
  const { mondayHours, tuesdayHours, wednesdayHours, thursdayHours, fridayHours, saturdayHours, sundayHours } = data.restaurantInfoJson
  const { streetAddress, city, state, zipCode } = data.restaurantInfoJson.address

  return (
    <Layout location={location}>
      <SEO
        title="Home"
      >
        <meta name="og:image" content="/content/assets/hero.jpg" />
        <meta name="twitter:image" content="/content/assets/hero.jpg" />
        <meta name="twitter:image:alt" content={`${data.restaurantInfoJson.restaurantName} Home Page`} />
      </SEO>
      <section id="store" className="store-container">
        <Hours hoursByDay={[mondayHours, tuesdayHours, wednesdayHours, thursdayHours, fridayHours, saturdayHours, sundayHours]} />
        <div className="location">
          <h2>Our Location</h2>
          <iframe className="map" src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d2757.968168405609!2d-112.27001268454082!3d46.2707368791188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e0!4m0!4m5!1s0x535b4221ef65f597%3A0x98562d025d6625ea!2s123%20Main%20St%2C%20Basin%2C%20MT%2059631!3m2!1d46.270736899999996!2d-112.26782399999999!5e0!3m2!1sen!2sus!4v1587792937492!5m2!1sen!2sus" title="Map" aria-hidden="false"></iframe>
          <p className="map-subtitle">(Click map to get directions)</p>
          <p>{data.restaurantInfoJson.restaurantName}</p>
          <p>{streetAddress}</p>
          <p>{city}, {state} {zipCode}</p>
          <div className="phone"><Phone /><p>{data.restaurantInfoJson.phone}</p></div>
          {data.restaurantInfoJson.email && <div className="email"><Email /><p className="email">{data.restaurantInfoJson.email}</p></div>}
        </div>
      </section>

      <section id="menu" className="menu-container">
        <Link to="/order" className="order-link">Order online!</Link>
        <h2>Menu</h2>
        <Accordion>
          {menuSpecials.length > 0 && <Specials menuSpecials={menuSpecials} />}
          <Menu menuSections={menuSections} />
        </Accordion>
      </section>

      {
        data.restaurantInfoJson.restaurantAbout.length > 0 ? (
          <section id="about" className="about-section">
            <div className="about-container">
              <h2>About Us</h2>
              <div className="about-text">
                {data.restaurantInfoJson.restaurantAbout.split("\n").map((item, i) => <p key={i}>{item}</p>)}
              </div>
            </div>
          </section>
        ) : null
      }

    </Layout >
  )
}

export default Index

const Specials = ({ menuSpecials }) => (
  <AccordionItem header={<><Star />"Specials & Deals!"</>}>
    {menuSpecials.map(({ frontmatter }) => (
      <div key={frontmatter.specialTitle} className="menu-item specials">
        <h4>{frontmatter.specialTitle}</h4>
        <h5 className="special-subtitle">{frontmatter.specialSubtitle}</h5>
        <p className="special-description">{frontmatter.specialDescription.split("\n").map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</p>
      </div>
    ))}
  </AccordionItem>
)

const Menu = ({ menuSections }) => (
  <>
    {menuSections.sort((a, b) => a.frontmatter.orderPosition - b.frontmatter.orderPosition).map(({ frontmatter }) => (
      <AccordionItem key={frontmatter.sectionTitle} header={frontmatter.sectionTitle}>
        {frontmatter.menuSectionList.map((item) => (
          <div key={item.menuItem} className="menu-item">
            <h4>{item.favorite && <Star />} {item.menuItem}: ${String(item.menuItemPrice.toFixed(2))}</h4>
            <div className="menu-item-body" style={{ minHeight: item.menuItemImage ? "200px" : null }}>
              {item.menuItemImage && <img className="menu-item-image" src={item.menuItemImage} alt={item.menuItem} loading="lazy" />}
              <p className="menu-item-description">{item.menuItemDescription}</p>
            </div>
          </div>
        ))}
      </AccordionItem>
    ))}
  </>
)

const Hours = ({ hoursByDay }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <div className="hours">
      <h2>Our Hours</h2>
      {
        hoursByDay.map((day, index) => {
          const hourListing = day.open === day.close ? "CLOSED" : `${day.open} - ${day.close}`
          return (<div key={days[index]} className="day"><span className="bold">{days[index]}:</span> <p className="hour-listing">{hourListing}</p></div>)
        })
      }
    </div>
  )
}