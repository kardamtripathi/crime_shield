import React, {useState, useContext, useEffect} from 'react'
import {Context} from '../../main'
import axios from 'axios'
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
import ResumeModel from './ResumeModal'
import { BACKEND_URL } from '../../BackendUrl';
import { CircularProgress } from '@mui/material'
const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [modelOpen, setModelOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const {isAuthorized, user} = useContext(Context);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    try{
      setLoading(true);
      if(user && user.role === "Employer"){
        axios.get(`${BACKEND_URL}/api/application/employer/getAllApplications`, {withCredentials: true})
        .then((res) => {
          setApplications(res.data.applications);
        })
      }
      else if(user && user.role === "Job Seeker"){
        axios.get(`${BACKEND_URL}/api/application/jobSeeker/getAllApplications`, {withCredentials: true})
        .then((res) => {
          setApplications(res.data.applications);
        })
      }
      setLoading(false);
    }
    catch(error){
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }, [isAuthorized])
  useEffect(() => {
    if(!isAuthorized){
      navigate('/')
    }
  }, [isAuthorized])
  const deleteApplication = (id) => {
    try{
      setLoading(true);
      axios.delete(`${BACKEND_URL}/api/application/delete/${id}`, {withCredentials: true})
      .then((res) => {
        toast.success(res.data.message);
        setApplications((prevApplication) => prevApplication.filter((application) => application._id !== id))
      })
      setLoading(false);
    }
    catch(error){
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }
  const openModel = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModelOpen(true);
  }
  const closeModel = () => {
    setModelOpen(false);
  }
  return (
    <section className='my_applications page'>
      {user && user.role === "Job Seeker" ? (
        <div className="container">
          <h1>My Applications</h1>
          {
            loading ? <CircularProgress style={{color: "#0096c7"}} /> : <></>
          }
          {
            applications.length <= 0 ? (
              <>{" "} 
                <h4>No Applications Found</h4>
              </>
            ) : (
              applications.map((element) => {
                return (
                  <JobSeekerCard element={element} key={element._id} deleteApplication={deleteApplication} openModel={openModel} />
                )
              })
            )
          }
        </div>
      ) : (
        <div className="container">
          <h1>Applications from Job Seekers</h1>
          {
            loading ? <CircularProgress style={{color: "#0096c7"}} /> : <></>
          }
          {
            applications.length <= 0 ? (
              <>{" "} 
                <h4>No Applications Found</h4>
              </>
            ) : (
              applications.map((element) => {
                return (
                  <EmployerCard element={element} key={element._id} openModel={openModel} />
                )
              })
            )
          }
        </div>
      )}
      {modelOpen && (
        <ResumeModel imageUrl={resumeImageUrl} onClose={closeModel}/>
      )}
    </section>
  )
}

export default MyApplications
const JobSeekerCard = ({element, deleteApplication, openModel}) => {
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name: </span>{element.name}
          </p>
          <p>
            <span>Email: </span>{element.email}
          </p>
          <p>
            <span>Phone: </span>{element.phone}
          </p>
          <p>
            <span>Address: </span>{element.address}
          </p>
          <p>
            <span>Cover Letter: </span>{element.coverLetter}
          </p>
        </div>
        <div className="resume">
          <img src={element.resume.url} alt="Resume" onClick={() => openModel(element.resume.url)} />
        </div>
        <div className="btn_area">
          <button onClick={() => deleteApplication(element._id)}>Delete Application</button>
        </div>
      </div>
    </>
  )
}
const EmployerCard = ({element, openModel}) => {
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name: </span>{element.name}
          </p>
          <p>
            <span>Email: </span>{element.email}
          </p>
          <p>
            <span>Phone: </span>{element.phone}
          </p>
          <p>
            <span>Address: </span>{element.address}
          </p>
          <p>
            <span>Cover Letter: </span>{element.coverLetter}
          </p>
        </div>
        <div className="resume">
          <img src={element.resume.url} alt="Resume" onClick={() => openModel(element.resume.url)} />
        </div>
      </div>
    </>
  )
}
