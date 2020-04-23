import React, { useRef } from "react"
import '../styles/index.scss'

import useAnimateOnVisible from "../hooks/useAnimateOnVisible"
import Layout from "../components/layout"
import SEO from "../components/seo"

const Index = ({ data, location }) => {

  const playerMessage = useRef(null)
  const sponsorMessage = useRef(null)
  useAnimateOnVisible({ element: playerMessage })
  useAnimateOnVisible({ element: sponsorMessage })

  const playerCard = useRef(null)
  const sponsorCard = useRef(null)
  const companyCard = useRef(null)
  useAnimateOnVisible({ element: companyCard })
  useAnimateOnVisible({ element: playerCard })
  useAnimateOnVisible({ element: sponsorCard })

  return (
    <Layout location={location}>
      <SEO
        title="Home"
      >
        <meta name="og:image" content="/media/aaml-logo.jpg" />
        <meta name="twitter:image" content="/media/aaml-logo.jpg" />
        <meta name="twitter:image:alt" content="Adopt a Minor Leaguer Home Page" />
      </SEO>
    Hola, mundo!
    </Layout>
  )
}

export default Index