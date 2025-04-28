import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "../../BackendUrl";
import './NewsCarousel.css';
import CircularProgress from '@mui/material/CircularProgress';

// Import the required CSS files for react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NewsCard = ({ article }) => {
  return (
    <div className="news-card">
      <div className="news-image-container">
        
      <div className="live-text live-blink">LIVE</div>
        {article.thumbnail || article.imageUrl ? (
          <img
            src={article.thumbnail || article.imageUrl}
            alt={article.title}
            className="news-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.parentNode.innerHTML = '<div class="no-image">No Image Available</div>';
            }}
          />
        ) : (
          <div className="no-image">No Image Available</div>
        )}
      </div>
      
      <div className="news-header">
        <div className="live-indicator live-blink"></div>
        <h3 className="news-title">{article.title}</h3>
      </div>
      
      <a 
        href={article.link || article.url || "#"} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="read-more-button"
      >
        Read More
      </a>
    </div>
  );
};

const NewsCarousel = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const initialTopic = "cyber crime";
        const initialLocation = "India";
        const cachedNews = localStorage.getItem("cachedNews");
        const cachedTimestamp = localStorage.getItem("cachedNewsTimestamp");
        const now = new Date().getTime();
        const cacheExpiryTime = 10 * 60 * 1000;

        if (cachedNews && cachedTimestamp && now - cachedTimestamp < cacheExpiryTime) {
          const parsedNews = JSON.parse(cachedNews);
          console.log("Using cached news data:", parsedNews);
          setNews(parsedNews);
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${BACKEND_URL}/api/crimeNews/news?crimeTopic=${initialTopic}&location=${initialLocation}`,
          { withCredentials: true }
        );

        console.log("Raw news data:", response.data.newsResult);

        const filteredNews = response.data.newsResult
          .filter(article => article.title)
          .slice(0, 10);

        console.log("Filtered news data:", filteredNews);

        setNews(filteredNews);
        localStorage.setItem("cachedNews", JSON.stringify(filteredNews));
        localStorage.setItem("cachedNewsTimestamp", now.toString());
        toast.success(response.data.message);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to fetch news");
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (current, next) => setActiveSlide(next),
    appendDots: dots => (
      <div>
        <ul className="custom-dots">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div className={`dot ${i === activeSlide ? 'active-dot' : ''}`} />
    )
  };

  if (loading) {
    return (
      <div className="loaderContainer">
        <CircularProgress />
      </div>
    );
  }
  
  if (!loading && news.length === 0) {
    return <div className="empty-news">No news found</div>;
  }
  
  return (
    <div className="news-carousel">
      <h2>Latest Cyber Crime News</h2>
      <Slider {...settings}>
        {news.map((article, index) => (
          <div key={index}>
            <NewsCard article={article} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewsCarousel;