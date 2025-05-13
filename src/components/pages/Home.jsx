import React, { useState, useEffect, useContext } from "react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import "./Home.css";

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackTutorials = [
    { id: 1, title: "JavaScript Introduction", category: "JavaScript" },
    { id: 2, title: "JavaScript Syntax", category: "JavaScript" },
    { id: 3, title: "JavaScript Variables", category: "JavaScript" },
    { id: 4, title: "JavaScript Operators", category: "JavaScript" },
    { id: 5, title: "JavaScript Data Types", category: "JavaScript" },
    { id: 6, title: "JavaScript Functions", category: "JavaScript" },
    { id: 7, title: "JavaScript Objects", category: "JavaScript" },
    { id: 8, title: "JavaScript Arrays", category: "JavaScript" },
    { id: 9, title: "JavaScript if, else, and else if", category: "JavaScript" },
    { id: 10, title: "JavaScript Switch Statement", category: "JavaScript" },
    { id: 11, title: "JavaScript For Loop", category: "JavaScript" },
    { id: 12, title: "JavaScript For In", category: "JavaScript" },
    { id: 13, title: "JavaScript For Of", category: "JavaScript" },
    { id: 14, title: "JavaScript While Loop", category: "JavaScript" },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:8081/tutorials")
      .then((response) => {
        console.log("Tutorials response:", response.data);
        const jsTutorials = response.data.filter((tut) => tut.category === "JavaScript");
        const data = jsTutorials.length >= 14 ? jsTutorials : fallbackTutorials;
        setTutorials(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tutorials:", error.response || error.message);
        setTutorials(fallbackTutorials);
        setLoading(false);
      });
  }, []);

  const handleLearnMoreClick = () => {
    navigate("/login");
  };

  const handleCardClick = (tutorialId) => {
    if (user) {
      navigate(`/tutorial/${tutorialId}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <div className="green-box">
        <div className="text-container">
          <h1>LEARN TO CODE</h1>
          <h1>LEARN WEB DEVELOPMENT THE RIGHT WAY</h1>
        </div>
        <img src="/images/box-one.svg" alt="Placeholder" className="right-image" />
      </div>

      <div className="box-two">
        <div className="content-container">
          <div className="text-container">
            <h1>JAVASCRIPT</h1>
            <h1>THE LANGUAGE FOR CREATING INTERACTIVE WEB APPLICATIONS</h1>
            <button className="learn-more-btn" onClick={handleLearnMoreClick}>
              Learn More
            </button>
          </div>
          <iframe
            className="codepen-embed"
            title="Vanilla Javascript Slideshow"
            src="https://codepen.io/zachMartinez/embed/MEONMX?default-tab=html%2Cresult"
            frameBorder="0"
            loading="lazy"
            allowTransparency="true"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="box-three">
        <h1 className="topics-title">Topics</h1>
        <div className="card-container">
          {loading ? (
            <p>Loading tutorials...</p>
          ) : (
            tutorials.map((tutorial) => (
              <div
                className="card"
                key={tutorial.id}
                onClick={() => handleCardClick(tutorial.id)}
                style={{ cursor: "pointer" }}
              >
                <span className="card-text">{tutorial.title}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="box-four">
        <img src="/images/home2.svg" alt="Placeholder" className="box-four-image" />
        <div className="box-four-text">
          <h1>Learn to Code with Fun and Practical Lessons</h1>
          <p>
            At LearnJS, we provide an engaging learning experience that makes mastering JavaScript
            both fun and practical. Our interactive tutorials let you write and test code in
            real-time, seeing instant results that bring concepts to life. Paired with dynamic
            quizzes, each lesson reinforces your skills through hands-on practice, ensuring you build
            confidence as you progress. This approach is vital for learning to code, as it transforms
            complex ideas into manageable, enjoyable challenges. Whether you’re a beginner or
            advancing your skills, our platform empowers you to create interactive web applications
            with ease, making every step of your coding journey rewarding and effective.
          </p>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Services</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
        </div>
        <div className="social-icons">
          <a href="#" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href="#" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="#" aria-label="GitHub">
            <FaGithub />
          </a>
        </div>
        <p>© 2025 LearnJS. All rights reserved.</p>
      </footer>
    </>
  );
};