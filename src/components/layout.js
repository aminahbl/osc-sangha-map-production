import React from "react"
import PropTypes from "prop-types"

import {layoutWrapper} from "./layout.module.scss"

const Layout = ({ children }) => (
  <main className={layoutWrapper}>{children}</main>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
