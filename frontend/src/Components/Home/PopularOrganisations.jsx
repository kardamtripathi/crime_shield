import React from 'react'
import { FaBalanceScale, FaHandsHelping } from 'react-icons/fa'
import { GiPoliceBadge } from 'react-icons/gi'
import { MdOutlineSecurity } from 'react-icons/md'

const PopularOrganizations = () => {
  const organizations = [
    {
      id: 1,
      title: "Local Police Department",
      location: "Downtown HQ, City Center",
      services: "Emergency Response, Crime Investigation",
      icon: <GiPoliceBadge />
    },
    {
      id: 2,
      title: "Cyber Crime Cell",
      location: "Tech Park, Cyber Hub",
      services: "Online Frauds, Digital Safety",
      icon: <MdOutlineSecurity />
    },
    {
      id: 3,
      title: "Legal Aid Services",
      location: "Community Support Office",
      services: "Legal Help, Victim Protection",
      icon: <FaBalanceScale />
    },
    {
      id: 4,
      title: "Neighborhood Watch",
      location: "Various Communities",
      services: "Patrols, Awareness Programs",
      icon: <FaHandsHelping />
    }
  ]

  return (
    <div className="companies">
      <div className="container">
        <h3>Safety & Law Enforcement</h3>
        <div className="banner">
          {organizations.map((element) => (
            <div className="card" key={element.id}>
              <div className="content">
                <div className="icon">{element.icon}</div>
                <div className="text">
                  <p><strong>{element.title}</strong></p>
                  <p>{element.location}</p>
                  <p>{element.services}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PopularOrganizations
