import React, { useContext, useState } from 'react'
import { Context } from '../../main';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from '../../assets/logo.jpg';
import axios from 'axios';
import {GiHamburgerMenu} from 'react-icons/gi'
import '../../App.css'
import { BACKEND_URL } from '../../BackendUrl'
import CircularProgress from '@mui/material/CircularProgress';
const Navbar = () => {
  const [show, setShow] = useState(false);
  const {isAuthorized, setIsAuthorized, user} = useContext(Context);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async() => {
    try{
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/user/logout`, {withCredentials: true});
      toast.success(response.data.message);
      setIsAuthorized(false);
      setLoading(false);
      navigate('/login');
    }
    catch(error){
      toast.error(error.response.data.message);
      setIsAuthorized(true);
      setLoading(true);
    }
  }
  return (
    <>
      <nav className = {isAuthorized ? "navbarShow" : "navbarHide"}>
        <div className="container">
          <div className="logo">
            <img src={Logo} alt='logo' />
          </div>
            <ul className={!show ? "menu" : "show-menu menu"} >
              <li>
                <Link to={'/'} onClick={() => setShow(false)}>Home</Link>
              </li>
              {/* <li>
                <Link to={'/job/getAll'} onClick={() => setShow(false)}>All Jobs</Link>
              </li> */}
              {
                user && user.role === "Citizen" ? (<li>
                  <Link to={'/my-cases'} onClick={() => setShow(false)}> My Cases
                  </Link>
                </li>) : (
                  <li>
                  <Link to={'/all-cases'} onClick={() => setShow(false)}> All Cases
                  </Link>
                </li>)
              }
              {
                user && user.role === "Citizen" ? (<li>
                  <Link to={'/report'} onClick={() => setShow(false)}> Report Case
                  </Link>
                </li>) : (<></>)
              }
              {/* {
                user && user.role === "Employer" ? (
                  <>
                    <li>
                      <Link to={'job/post'} onClick={() => setShow(false)}>Post New Job</Link>
                    </li>
                    <li>
                      <Link to={'job/me'} onClick={() => setShow(false)}>Your Jobs</Link>
                    </li>
                  </>
                ) : (
                  <></>
                )
              } */}
              <li>
                <Link to={'/otherJobs'} onClick={() => setShow(false)}>Trending Crime News</Link>
              </li>
              <li>
                <Link to={'/it-act'} onClick={() => setShow(false)}>IT Act</Link>
              </li>
              {loading ? <CircularProgress style={{color: "#0096c7"}} /> : <button onClick={handleLogout}>Logout</button>}
            </ul>
            <div className='hamburger'>
              <GiHamburgerMenu onClick={() => setShow(!show)} />
            </div>
          </div>
      </nav>
    </>
  )
}

export default Navbar