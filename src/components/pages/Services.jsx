import React from "react";
import { Link } from "react-router-dom";
import "./Services.css";

export const Services = () => {
  return (
    <div className="about-us-container">
      <header className="header">
        <h1>About LEARNCODE</h1>
        <p>Discover the story behind our interactive Coding learning platform.</p>
      </header>

      <section className="about-section mission">
        <h2>Our Purpose</h2>
        <p>
          LEARNCODE is designed to make programming accessible to everyone, from complete beginners to aspiring developers. Our goal is to empower learners by providing an engaging, hands-on environment where you can explore coding concepts, experiment with real code, and test your knowledge through interactive challenges. Whether you’re learning variables or diving into functions, LEARNCODE offers a clear, structured path to mastering JavaScript and other programming languges.
        </p>
        <p>
          We created this platform to bridge the gap between theory and practice. By combining concise tutorials, in-browser coding exercises, and instant feedback quizzes, LEARNCODE helps you build confidence and skills at your own pace—no prior experience required.
        </p>
      </section>

      <section className="about-section development">
        <h2>How We Built LEARNCODE</h2>
        <p>
          LEARNCODE is a modern web application crafted with cutting-edge technologies to ensure a seamless and dynamic user experience. Here’s a glimpse into how we brought it to life:
        </p>
        <div className="tech-grid">
          <div className="tech-item">
            <h3>Frontend: React</h3>
            <p>
              The user interface is built with React, a powerful JavaScript library that enables fast, component-based development. This allows us to create interactive features like our in-browser code editor and dynamic quiz system.
            </p>
          </div>
          <div className="tech-item">
            <h3>Backend: Node.js & Express</h3>
            <p>
              Our backend runs on Node.js with Express, handling user authentication, tutorial data, and progress tracking. It ensures smooth communication between the frontend and our database.
            </p>
          </div>
          <div className="tech-item">
            <h3>Database: MySQL</h3>
            <p>
              We use MySQL to store tutorial content, quiz questions, and user progress securely. Its relational structure supports scalable content management as LearnJS grows.
            </p>
          </div>
          <div className="tech-item">
            <h3>Code Editor</h3>
            <p>
              The interactive code editor is integrated to let users write and test code directly in the browser, with real-time output for an immersive learning experience.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section impact">
        <h2>Our Impact</h2>
        <p>
          LEARNCODE is more than just a learning tool—it’s a community of curious minds exploring the world of coding. We’re passionate about democratizing education and helping learners worldwide unlock their potential. Our platform is designed to be intuitive, engaging, and adaptable, ensuring that anyone can start coding with confidence.
        </p>
        <div className="stats-grid">
          <div className="stat-item">
            <h3>1000+</h3>
            <p>Active Learners</p>
          </div>
          <div className="stat-item">
            <h3>10+</h3>
            <p>Tutorials Available</p>
          </div>
          <div className="stat-item">
            <h3>99%</h3>
            <p>User Satisfaction</p>
          </div>
        </div>
      </section>

      <section className="about-section cta">
        <h2>Join the Learning Revolution</h2>
        <p>
          Ready to start your coding journey? Explore LearnJS and discover how fun and rewarding programming can be.
        </p>
        <Link to="/tutorial/1" className="cta-button">
          Start Coding Now
        </Link>
      </section>

      <footer className="footer">
        <p>&copy; 2025 LearnJS. All rights reserved.</p>
      </footer>
    </div>
  );
};