import React, {useState, useContext, useEffect} from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {useNavigate, useParams} from 'react-router-dom'
import {Context} from '../../main'
import { BACKEND_URL } from '../../BackendUrl';
import { CircularProgress } from '@mui/material'
const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const {isAuthorized, user} = useContext(Context)
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const resume = e.target.files[0];
    setResume(resume);
  }
  const {id} = useParams();
  const handleApplication = async(e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("coverLetter", coverLetter);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("jobID", id);
    formData.append("resume", resume);
    try{
      const {data} = await axios.post(`${BACKEND_URL}/api/application/fillApplication`, formData, 
      {withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data"
      }})
      setName("");
      setEmail("");
      setCoverLetter("");
      setPhone("");
      setResume("");
      setAddress("");
      toast.success(data.message);
      setLoading(false);
      navigate('/job/getAll');
    }
    catch(error){
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }
  useEffect(() => {
    if(!isAuthorized){
      navigate('/')
    }
  }, [isAuthorized])
  useEffect(() => {
    if(user && user.role !== "Job Seeker"){
      navigate('/')
    }
  }, [user])
  return (
    <section className='application'>
      <div className="container">
        <h3>Application Form</h3>
        <form onSubmit={handleApplication}>
          <input type="text" placeholder='Enter your Name' value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder='Enter your Email' value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="number" placeholder='Enter your Phone Number' value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input type="text" placeholder='Enter your Address' value={address} onChange={(e) => setAddress(e.target.value)} />
          <textarea placeholder='Cover Letter' value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
          <div>
            <label style={{textAlign: 'start', display: 'block', fontSize:'20px'}}>Select Resume</label>
            <input type='file' accept='.jpg, .jpeg, .png, .webp' onChange={handleFileChange} style={{width: "100%"}} />
          </div>
          {
            loading ? 
            <div className='loaderContainer'>
              <CircularProgress style={{color: "#0096c7"}} />
            </div>
            : <button type='submit'>Submit Application</button>
          }
        </form>
      </div>
    </section>
  )
}

export default Application
