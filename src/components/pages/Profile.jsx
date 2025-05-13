import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.css";

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [badges, setBadges] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8081/profile", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        return axios.get("http://localhost:8081/user/badges", { withCredentials: true });
      })
      .then((badgeRes) => {
        setBadges(badgeRes.data);
        return axios.get("http://localhost:8081/leaderboard", { withCredentials: true });
      })
      .then((leaderRes) => {
        setLeaders(leaderRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error loading profile/leaderboard/badges:", err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    axios
      .post("http://localhost:8081/logout", {}, { withCredentials: true })
      .then(() => (window.location.href = "/login"))
      .catch((error) => console.error("Logout error:", error));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <div className="error">Please log in to view your profile.</div>;

  const totalTutorials = 14;
  const completed = user.quizzesTaken || 0;
  const progressPercentage = totalTutorials > 0 ? (completed / totalTutorials) * 100 : 0;
  const averageScore = isNaN(user.averageScore) ? "0.0" : parseFloat(user.averageScore).toFixed(1);

  return (
    <div className="profile-container">
      <header className="header">
        <h1>Your Profile</h1>
        <p>Track your learning journey with LearnJS.</p>
      </header>

      <section className="profile-section user-info">
        <div className="avatar-placeholder"></div>
        <h2>Welcome, {user.name}</h2>
        <p className="email">{user.email}</p>
        <p><strong>XP:</strong> {user.xp} | <strong>Level:</strong> {user.level}</p>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </section>

      <section className="profile-section progress">
        <h2>Tutorial Progress</h2>
        <div className="progress-circle">
          <svg className="progress-ring" width="120" height="120">
            <circle className="progress-ring__track" cx="60" cy="60" r="54" strokeWidth="12" />
            <circle
              className="progress-ring__fill"
              cx="60"
              cy="60"
              r="54"
              strokeWidth="12"
              strokeDasharray="339.292"
              strokeDashoffset={339.292 * (1 - progressPercentage / 100)}
            />
          </svg>
          <div className="progress-text">
            <span>{progressPercentage.toFixed(0)}%</span>
            <p>Completed</p>
          </div>
        </div>
        <p>{completed} of {totalTutorials} tutorials completed</p>
      </section>

      <section className="profile-section score">
        <h2>Average Quiz Score</h2>
        <div className="score-card">
          <span className="score-value">{averageScore}%</span>
          <p>Keep up the great work!</p>
        </div>
      </section>

      <section className="profile-section badges">
        <h2>🏅 Your Badges</h2>
        {badges.length === 0 ? (
          <p>You haven't earned any badges yet.</p>
        ) : (
          <ul className="badge-list">
            {badges.map((badge, i) => (
              <li key={i} className="badge-item">
                <span className="badge-icon">🏅</span> {badge.title}
                <br />
                <small>{new Date(badge.awarded_at).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="profile-section leaderboard">
        <h2>🏆 Leaderboard</h2>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Tutorials</th>
              <th>Score</th>
              <th>Badges</th>
              <th>XP</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((entry, index) => (
              <tr key={entry.email} className={entry.email === user.email ? "highlight" : ""}>
                <td>{index + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.tutorialsCompleted}</td>
                <td>{entry.averageScore || 0}%</td>
                <td>{"🏅".repeat(entry.badgeCount || 0)}</td>
                <td>{entry.xp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="footer">
        <p>© 2025 LearnJS. All rights reserved.</p>
      </footer>
    </div>
  );
};
