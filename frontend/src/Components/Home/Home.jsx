import React, { useContext } from 'react'
import {Context} from '../../main'
import {Navigate} from 'react-router-dom'
import HeroSection from './HeroSection'
import HowItWorks from './HowItWorks'
import CrimeCategories from './CrimeCategories'
import PopularOrganizations from './PopularOrganisations'
const Home = () => {
  const {isAuthorized} = useContext(Context);
  if(!isAuthorized){
    return <Navigate to={"/login"} />
  }
  return (
    <section className='homepage page'>
      <HeroSection/>
      <HowItWorks/>
      <CrimeCategories/>
      <PopularOrganizations/>
    </section>
  )
}

export default Home