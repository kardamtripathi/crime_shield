import React from 'react'
import notFoundLogo from '../../assets/not-found.png'
import {Link} from "react-router-dom"
const NotFound = () => {
  return (
    <>
      <section className='root notfound page'>
        <div className='container'>
          <img src={notFoundLogo} id='notFoundImg' alt='NotFound' />
          <Link to='/' id='homeLink'>RETURN TO HOME</Link>
        </div>
      </section>
    </>
  )
}

export default NotFound