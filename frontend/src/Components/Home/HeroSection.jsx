import React from 'react'
import HeroImg from '../../assets/crime_shield_landing_page.jpeg'
import { FaShieldAlt, FaUserSecret, FaUsers, FaExclamationTriangle } from 'react-icons/fa'

const HeroSection = () => {
  const details = [
    {
      id: 1,
      title: "Report Crimes Anonymously",
      icon: <FaUserSecret />
    },
    {
      id: 2,
      title: "Stay Alert & Aware",
      icon: <FaExclamationTriangle />
    },
    {
      id: 3,
      title: "Community Protection",
      icon: <FaUsers />
    },
    {
      id: 4,
      title: "Verified Reports",
      icon: <FaShieldAlt />
    }
  ]

  return (
    <div className='heroSection'>
      <div className="container">
        <div className="title">
          <h1>Welcome to Crime Shield</h1>
          <p>
            Your safety is our priority. Stay informed about crime trends in your area, 
            report suspicious activities anonymously, and help build a safer community. 
            Together, we can make a difference.
          </p>
        </div>
        <div className="image" style={{borderRadius:"5%"}}>
          <img src={HeroImg} alt='Crime Awareness' />
        </div>
      </div>
      <div className="details">
        {details.map(element => (
          <div className="card" key={element.id}>
            <div className="icon">{element.icon}</div>
            <div className="content">
              <p>{element.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HeroSection
