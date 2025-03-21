import React, {useContext, useState, useEffect} from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
import {Context} from '../../main'
import { BACKEND_URL } from '../../BackendUrl';
import { CircularProgress } from '@mui/material'
const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("default");
  const {isAuthorized, user} = useContext(Context);
  const [loading, setLoading] = useState(false);
  const handleJobPost = async(e) => {
    e.preventDefault();
    setLoading(true);
    if(salaryType === "Fixed Salary"){
      setSalaryFrom("")
      setSalaryTo("");
    }
    else if(salaryType === "Ranged Salary"){
      setFixedSalary("");
    }
    else{
      setSalaryFrom("")
      setSalaryTo("");
      setFixedSalary("");
    }
    await axios.post(`${BACKEND_URL}/api/job/addJob`, fixedSalary.length >= 4 ? {
      title,description, category, country, city, location, fixedSalary
    } : 
    {
      title, description, category, country, city, location, salaryFrom, salaryTo
    }, {withCredentials: true, 
    headers: {
      "Content-Type": "application/json"
    }})
    .then((res) => {
      toast.success(res.data.message)
      setLoading(false);
    })
    .catch((error) => {
      toast.error(error.response.data.message)
      setLoading(false);
    })
  }
  const navigate = useNavigate();
  useEffect(() => {
    if(!isAuthorized){
      navigate("/")
    }
  }, [isAuthorized])
  useEffect(() => {
    if(user && user.role !== "Employer"){
      navigate('/login')
    }
  }, [user])
  return (
    <>
      <div className="job_post page">
        <div className="container">
          <h3>Post a Job</h3>
          {
            <form onSubmit={handleJobPost}>
            <div className="wrapper">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Enter Job Title' />
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                <option value="Web Developer">Web Developer</option>
                <option value="Accounts & Finance">Accounts & Finance</option>
                <option value="Graphics & Design">Graphics & Design</option>
                <option value="Software Developer">Software Developer</option>
                <option value="HR">HR</option>
                <option value="Android Developer">Android Developer</option>
                <option value="Senior Software Developer">Senior Software Developer</option>
                <option value="AI-ML Engineer">AI-ML Engineer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="wrapper">
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder='Enter a Country' />
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder='Enter a City' />
              </div>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Enter a Location' />
              <div className="salary_wrapper">
                <select value={salaryType} onChange={(e) => setSalaryType(e.target.value)}>
                  <option value="default">Select Salary</option>
                  <option value="Fixed Salary">Fixed Salary</option>
                  <option value="Ranged Salary">Ranged Salary</option>
                </select>
                <div>
                  {salaryType === "default" ? (
                    <p>Provide Salary Type</p>
                  ) : (
                    salaryType === "Fixed Salary" ? (
                      <input type='number' placeholder='Enter Salary' value={fixedSalary} onChange={(e) => setFixedSalary(e.target.value)} />
                    ) : 
                    <div className="ranged_salary">
                      <input type='number' placeholder='Salary From' value={salaryFrom} onChange={(e) => setSalaryFrom(e.target.value)} />
                      <input type='number' placeholder='Salary To' value={salaryTo} onChange={(e) => setSalaryTo(e.target.value)} />
                    </div>
                  )}
                </div>
              </div>
              <textarea rows="10" value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Enter Job Description' />
              {
                loading ? 
                <div className='loaderContainer'>
                  <CircularProgress style={{color: "#0096c7"}} />
                </div>
                : <button type='submit'>Add Job</button>
              }
          </form>
          }
        </div>
      </div>
    </>
  )
}

export default PostJob
