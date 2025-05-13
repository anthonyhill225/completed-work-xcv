import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

export const About = () => {
  const tutorials = [
    { id: 1, title: "JavaScript" },
    { id: 15, title: "PHP" },
    { id: 16, title: "Python" },
  ];

  return (
    <div className="about-container">
      <div className="sidebar">
        <h2 className="sidebar-title">Tutorials</h2>
        <ul className="sidebar-list">
          {tutorials.map((tut) => (
            <li key={tut.id} className="sidebar-item">
              <Link to={`/tutorial/${tut.id}`} className="tutorial-link">
                {tut.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="content">
        <h1>Welcome to the Tutorials Page</h1>
        <p>Select a tutorial from the sidebar to view its content.</p>
      </div>
    </div>
  );
};