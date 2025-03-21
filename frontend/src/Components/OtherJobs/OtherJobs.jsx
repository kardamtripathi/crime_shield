import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../../main";
import { BACKEND_URL } from "../../BackendUrl";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import OtherJobDetails from "./OtherJobDetails";
import { CircularProgress } from "@mui/material";

const OtherJobs = () => {
  const [crimeTopic, setCrimeTopic] = useState(""); // crime topic to fetch related news
  const [location, setLocation] = useState("");
  const [news, setNews] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modelOpen, setModelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthorized } = useContext(Context);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_URL}/api/crimeNews/news?crimeTopic=${crimeTopic}&location=${location}`,
        { withCredentials: true }
      );
      setNews(response.data.newsResult); // Update with the correct news array
      setShow(true);
      toast.success(response.data.message);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setShow(false);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const handleButton = (element) => {
    setSelectedJob(element);
    setModelOpen(true);
  };

  const closeModel = () => {
    setModelOpen(false);
  };

  const handleJobDetailsClose = () => {
    setSelectedJob(null);
    closeModel();
  };

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/login");
    }
  }, [isAuthorized]);

  useEffect(async () => {
    try {
      setLoading(true);
      const initialTopic = "cyber crime";
      const initialLocation = "India"
      console.log(crimeTopic, "hoho ", location);
      setCrimeTopic(initialTopic);
      setLocation(initialLocation);
      const response = await axios.get(
        `${BACKEND_URL}/api/crimeNews/news?crimeTopic=${initialTopic}&location=${initialLocation}`,
        { withCredentials: true }
      );
      setNews(response.data.newsResult);
      setShow(true);
      toast.success(response.data.message);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setShow(false);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }, [])

  return (
    <>
      <section className="otherJobPage">
        <div className="container">
          <h1>Cyber Crime and Crime News</h1>
          <form onSubmit={handleSubmit}>
            <div className="inputTag">
              <label>Crime Topic</label>
              <div>
                <input
                  type="text"
                  value={crimeTopic}
                  onChange={(e) => setCrimeTopic(e.target.value)}
                  placeholder="Enter Crime Topic"
                />
              </div>
            </div>
            <div className="inputTag">
              <label>Location</label>
              <div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter Location"
                />
              </div>
            </div>
            {loading ? (
              <div className="loaderContainer">
                <CircularProgress style={{ color: "#0096c7" }} />
              </div>
            ) : (
              <button type="submit">Search News</button>
            )}
          </form>
        </div>
      </section>

      {show && (
        <section className="jobs page">
          <div className="container">
            <h1>Latest Crime News</h1>
            <div className="banner">
              {news && news.length > 0 ? (
                news.map((article, index) => (
                  <div className="card" key={index}>
                    <p>{article.title}</p>
                    <p>{article.source.name}</p>
                    <p>{article.date}</p>
                    <a href={article.link} target="_blank" rel="noopener noreferrer">
                      Read more
                    </a>
                    {article.thumbnail && (
                      <img
                        src={article.thumbnail}
                        alt={article.title}
                        width="100%"
                        style={{ borderRadius: "10px" }}
                      />
                    )}
                    <button
                      onClick={() => handleButton(article)}
                      style={{ padding: "10px" }}
                      id="otherJobsBtn"
                    >
                      More Details
                    </button>
                  </div>
                ))
              ) : (
                <p>No News Found</p>
              )}
            </div>
          </div>
        </section>
      )}

      {modelOpen && selectedJob && (
        <OtherJobDetails job={selectedJob} onClose={handleJobDetailsClose} />
      )}
    </>
  );
};

export default OtherJobs;
