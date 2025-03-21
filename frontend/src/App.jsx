import './App.css';
import logo from './logo.svg';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import axios from 'axios'
import { Context } from './main';
import Navbar from './Components/Layout/Navbar'
import Footer from './Components/Layout/Footer'
import Home from './Components/Home/Home'
import Register from './Components/Auth/Register'
import Login from './Components/Auth/Login'
import Jobs from './Components/Job/Jobs'
import JobDetails from './Components/Job/JobDetails'
import Application from './Components/Application/Application'
import MyApplications from './Components/Application/MyApplications'
import PostJob from './Components/Job/PostJob'
import MyJobs from './Components/Job/MyJobs'
import NotFound from './Components/NotFound/NotFound'
import { useEffect, useContext } from 'react';
import { BACKEND_URL } from './BackendUrl';
import OtherJobs from './Components/OtherJobs/OtherJobs';
import OtherJobDetails from './Components/OtherJobs/OtherJobDetails';
import ForgotPassword from './Components/Auth/ForgotPassword';
import ResetPassword from './Components/Auth/ResetPassword';
import ItAct from './Components/ItAct/ItAct';
import CyberCrimeForm from './Components/CyberCrime/CyberCrimeReporting';
import Chatbot from './Components/Chatbot/Chatbot.jsx';
import ViewCases from './Components/CyberCrime/ViewCases.jsx';
import ViewAllCases from './Components/CyberCrime/ViewAllCases.jsx';
const App = () => {
  const {isAuthorized, setIsAuthorized, setUser} = useContext(Context);
  useEffect(() => {
    const fetchUser = async() => {
      try{
        const response = await axios.get(`${BACKEND_URL}/api/user/getUser`, {withCredentials: true, mode: "cors"});
        setUser(response.data.user);
        setIsAuthorized(true);
      }
      catch(error){
        setIsAuthorized(false);
      }
    };
    fetchUser();
  }, [isAuthorized]);
  return (
    <>
    
    <div><Toaster/></div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path = '/' element = {<Home />} />
          <Route path = '/register' element = {<Register />} />
          <Route path = '/login' element = {<Login />} />
          <Route path = '/forgotPassword' element = {<ForgotPassword />} />
          <Route path = '/resetPassword/:id/:token' element = {<ResetPassword />} />
          <Route path = '/job/getAll' element = {<Jobs />} />
          <Route path = '/job/:id' element = {<JobDetails />} />
          <Route path = '/application/:id' element = {<Application />} />
          <Route path = '/application/me' element = {<MyApplications />} />
          <Route path = '/job/post' element = {<PostJob />} />
          <Route path = '/job/me' element = {<MyJobs />} />
          <Route path = '/otherJobs' element = {<OtherJobs />} />
          <Route path = '/otherJobs/:id' element = {<OtherJobDetails/>} render={(props) => <OtherJobDetails {...props} />} />
          <Route path='/it-act' element={<ItAct />} />
          <Route path ='/report' element={<CyberCrimeForm />} />
          <Route path ='/my-cases' element={<ViewCases />} />
          <Route path ='/all-cases' element={<ViewAllCases />} />
          <Route path = '*' element = {<NotFound />} />
        </Routes>
        <Chatbot />
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
