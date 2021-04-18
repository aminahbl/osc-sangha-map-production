import React from 'react'

import Layout from '../components/layout'
import SanghaMap from '../components/SanghaMap'
import SEO from '../components/seo'

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={['gatsby', 'application', 'react']} />
    <SanghaMap />
  </Layout>
)

export default IndexPage
