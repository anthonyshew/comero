import React from "react"
import '../styles/index.scss'
import { useStaticQuery, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Accordion from "../components/accordion"

const Index = ({ location }) => {
  const data = useStaticQuery(graphql`
  query IndexQuery {
    map: file(absolutePath: {regex: "/map.png/"}) {
      childImageSharp {
        fixed(width: 200, height: 200) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    contentJson {
      restaurantName
      restaurantMotto
      restaurantAbout
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
          menuSectionList {
            menuItemImage
            menuItem
            menuItemDescription
          }
          sectionTitle
          title
        }
      }
    }
  }
  `)

  const menuSections = data.allMarkdownRemark.nodes
  const { mondayHours, tuesdayHours, wednesdayHours, thursdayHours, fridayHours, saturdayHours, sundayHours } = data.contentJson
  const { streetAddress, city, state, zipCode } = data.contentJson.address

  return (
    <Layout location={location}>
      <SEO
        title="Home"
      >
        <meta name="og:image" content="/media/aaml-logo.jpg" />
        <meta name="twitter:image" content="/media/aaml-logo.jpg" />
        <meta name="twitter:image:alt" content={`${data.contentJson.restaurantName} Home Page`} />
      </SEO>
      <section id="store" className="store-container">
        <Hours hoursByDay={[mondayHours, tuesdayHours, wednesdayHours, thursdayHours, fridayHours, saturdayHours, sundayHours]} />
        <div className="location">
          <h2>Our Location</h2>
          <iframe src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d2757.968168405609!2d-112.27001268454082!3d46.2707368791188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e0!4m0!4m5!1s0x535b4221ef65f597%3A0x98562d025d6625ea!2s123%20Main%20St%2C%20Basin%2C%20MT%2059631!3m2!1d46.270736899999996!2d-112.26782399999999!5e0!3m2!1sen!2sus!4v1587792937492!5m2!1sen!2sus" title="Map" aria-hidden="false"></iframe>
          <p className="map-subtitle">(Click map to get directions)</p>
          <p>{data.contentJson.restaurantName}</p>
          <p>{streetAddress}</p>
          <p>{city}, {state} {zipCode}</p>
        </div>
      </section>

      <Accordion />

      <section id="menu" className="menu-container">
        <h2>Menu</h2>
        {menuSections.map(({ frontmatter }) => (
          <div key={frontmatter.sectionTitle} className="menu-section">
            <h3>{frontmatter.sectionTitle}</h3>
            {frontmatter.menuSectionList.map((item) => (
              <div key={item.menuItem} className="menu-item">
                <h4>{item.menuItem}</h4>
                <p>{item.menuItemDescription}</p>
                <img src={item.menuItemImage} alt={item.menuItem} />
              </div>))}
          </div>
        ))}
      </section>

      {data.contentJson.restaurantAbout.length > 0 ? (
        <section id="about" className="about-container">
          <h2>About Us</h2>
          <p>{data.contentJson.restaurantAbout}</p>
        </section>
      ) : null}


    </Layout>
  )
}

export default Index

const Hours = ({ hoursByDay }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <div className="hours">
      <h2>Our Hours</h2>
      {
        hoursByDay.map((day, index) => {
          const hourListing = day.open === day.close ? "CLOSED" : `${day.open} - ${day.close}`
          return (<div key={days[index]} className="day"><span className="bold">{days[index]}:</span> {hourListing}</div>)
        })
      }
    </div>
  )
}