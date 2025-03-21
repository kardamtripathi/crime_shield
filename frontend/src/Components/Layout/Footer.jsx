import React, {useContext} from 'react'
import { Context } from '../../main'
import {Link} from 'react-router-dom'
const Footer = () => {
  const {isAuthorized} = useContext(Context);
  return (
    <footer className={isAuthorized ? "footerShow" : "footerHide"}>
      <div>&copy; All Rights Reserved by Quick Job 2024</div>
    </footer>
  )
}

export default Footer