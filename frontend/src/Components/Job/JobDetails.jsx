import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import axios from 'axios'
import {Context} from '../../main'
import { BACKEND_URL } from '../../BackendUrl';
import { CircularProgress } from '@mui/material';
const JobDetails = () => {
  const {id} = useParams();
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {isAuthorized, user} = useContext(Context);
  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/job/${id}`, {withCredentials: true})
    .then((res) => {
      setJob(res.data.job);
      setLoading(false);
    })
    .catch((error) => {
      navigate('/notfound')
      setLoading(false);
    })
  }, []) 
  useEffect(() => {
    if(!isAuthorized){
      navigate('/login')
    }
  }, [isAuthorized])
  return (
    <section className='jobDetail page'>
      <div className="container">
        <h3>Job Details</h3>
        {
          loading ? 
          <CircularProgress style={{color: "#0096c7"}} />
          : 
          <div className="banner">
            <p>Title: <span>{job.title}</span></p>
            <p>Category: <span>{job.category}</span></p>
            <p>Country: <span>{job.country}</span></p>
            <p>City: <span>{job.city}</span></p>
            <p>Location: <span>{job.location}</span></p>
            <p>Description: <span>{job.description}</span></p>
            <p>Posted On: <span>{job.jobPostedOn}</span></p>
            <p>Salary: {job.fixedSalary ? (<span>{job.fixedSalary}</span>) : 
            (<span>{job.salaryFrom} - {job.salaryTo}</span>)}</p>
            <p>
              {user && user.role === "Employer" ? <></> : <Link to={`/application/${job._id}`}>Apply</Link>}
            </p>
          </div>
        }
      </div>
    </section>
  )
}

export default JobDetails
