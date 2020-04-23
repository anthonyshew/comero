let { createProxyMiddleware } = require("http-proxy-middleware")

require('dotenv').config()

module.exports = {
  siteMetadata: {
    title: `Adopt a Minor Leaguer`,
    author: {
      name: `Anthony Shew`,
      summary: `who develops things.`,
    },
    description: `#StandwithMiLB`,
    siteUrl: `https://adoptaminorleaguer.com/`,
    social: {
      twitter: `/adoptmilbplayer`,
      facebook: `/groups/218122932877473/`,
      instagram: `/adoptanmilbplayer/`,
    },
    donate: {
      shop: `https://promotionsetc.commonsku.com/shop/e5be5b9c-b850-4648-9d5f-830033b386b2`,
    }
  },
  developMiddleware: app => {
    app.use(
      "/.netlify/functions",
      createProxyMiddleware({
        target: "http://localhost:9000",
        pathRewrite: {
          "/.netlify/functions": "",
        },
      })
    )
  },
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-netlify-cms`,
    `gatsby-background-image`,
    `gatsby-transformer-sharp`,
    `gatsby-transformer-json`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/restaurantMenu`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/siteEditor.json`,
        name: `siteEditor`,
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /svg/
        }
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GOOGLE_ANALYTICS_ID,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Gatsby Starter Blog`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        // icon: `content/assets/aaml-logo.jpg`,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
