/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

// Initialize dotenv
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`, // or '.env'
})

module.exports = {
  siteMetadata: {
    title: process.env.PROJ_NAME,
    description: process.env.PROJ_DESCRIPTION,
    author: process.env.PROJ_AUTHOR,
    siteUrl: `${process.env.SITE_URL}`
  },
  /* Your site config here */
  plugins: [
    'gatsby-plugin-react-helmet',
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: process.env.PROJ_NAME,
        start_url: `/`,
        // background_color: `#0d1927`,
        // theme_color: `#0d1927`,
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: `standalone`,
        icon: `src/images/leaf.svg` // This path is relative to the root of the site.
      }
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /\.inline\.svg$/
        }
      }
    }   
    
  ],
}
