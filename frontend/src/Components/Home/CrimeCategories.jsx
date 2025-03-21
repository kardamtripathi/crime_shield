import React from 'react'
import { FaShieldAlt, FaSkullCrossbones, FaUserSecret, FaCarCrash } from 'react-icons/fa'

const CrimeCategories = () => {
  const categories = [
    {
      id: 1,
      title: "Cyber Crimes",
      subTitle: "Online frauds, hacking, phishing",
      icon: <FaSkullCrossbones />
    },
    {
      id: 2,
      title: "Theft & Burglary",
      subTitle: "Home break-ins, pickpocketing",
      icon: <FaSkullCrossbones />
    },
    {
      id: 3,
      title: "Violent Crimes",
      subTitle: "Assault, murder, gang violence",
      icon: <FaSkullCrossbones />
    },
    {
      id: 4,
      title: "Fraud & Scams",
      subTitle: "Phone scams, identity theft",
      icon: <FaSkullCrossbones />
    },
    {
      id: 5,
      title: "Missing Persons",
      subTitle: "Kidnapping, human trafficking",
      icon: <FaSkullCrossbones />
    },
    {
      id: 6,
      title: "Traffic Violations",
      subTitle: "Hit-and-run, reckless driving",
      icon: <FaSkullCrossbones />
    },
    {
      id: 7,
      title: "Public Safety Alerts",
      subTitle: "Terror threats, natural disasters",
      icon: <FaSkullCrossbones />
    },
    {
      id: 8,
      title: "Community Watch",
      subTitle: "Neighborhood patrol, awareness",
      icon: <FaSkullCrossbones />
    }
  ]

  return (
    <div className='categories'>
      <h3>Crime Categories</h3>
      <div className="banner">
        {categories.map((element) => (
          <div className="card" key={element.id}>
            <div className="icon">{element.icon}</div>
            <div className="text">
              <p>{element.title}</p>
              <p>{element.subTitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CrimeCategories
