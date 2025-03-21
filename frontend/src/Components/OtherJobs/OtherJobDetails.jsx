import React from "react";

const OtherJobDetails = ({ job, onClose }) => {
  return (
    <div className="otherJob-modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <section className="otherJobDetail page">
          <div className="container">
            <h3>Crime News Details</h3>
            <div className="banner">
              <p>Title: <span>{job.title}</span></p>
              <p>
                Source: <span>{job.source.name}</span>
                <img src={job.source.icon} width='200px' height='20px' alt="Source Logo" />
              </p>
              <p>Author: <span>{job.source.authors[0]}</span></p>
              <p>
                Link: <a href={job.link} target="_blank" rel="noopener noreferrer">Click here to read more</a>
              </p>
              {job.thumbnail && (
                <img
                  src={job.thumbnail}
                  alt={job.title}
                  width="50%"
                  style={{ borderRadius: "10px" }}
                />
              )}
              <p>Date: {job.date}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OtherJobDetails;
