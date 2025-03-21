import React from 'react'
import { FaUserPlus, FaEye, FaShieldAlt } from 'react-icons/fa'
import { MdReport } from 'react-icons/md'

const HowItWorks = () => {
  return (
    <div className='howitworks'>
      <div className="container">
        <h3>How Crime Shield Works</h3>
        <div className="banner">
          <div className="card">
            <FaUserPlus />
            <p>Create an Account</p>
            <p>Sign up to stay updated on crime reports and contribute to a safer society.</p>
          </div>
          <div className="card">
            <MdReport />
            <p>Report a Crime</p>
            <p>Submit crime reports anonymously to alert authorities and the community.</p>
          </div>
          <div className="card">
            <FaEye />
            <p>Stay Informed</p>
            <p>Track crime trends and receive real-time safety alerts for your area.</p>
          </div>
          <div className="card">
            <FaShieldAlt />
            <p>Protect Your Community</p>
            <p>Work together to prevent crime and create a safer environment.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks
