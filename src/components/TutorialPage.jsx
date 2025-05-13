import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import CodeEditor from "./CodeEditor";
import "./TutorialPage.css";

export const TutorialPage = () => {
  const { id } = useParams();
  const tutorialId = parseInt(id, 10);
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(null);
  const [tutorialList, setTutorialList] = useState([]);
  const [totalTutorials, setTotalTutorials] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState(null);
  const [profileStats, setProfileStats] = useState(null); // ✅ New state

  useEffect(() => {
    axios
      .get("http://localhost:8081/profile", { withCredentials: true })
      .then((res) => {
        console.log("Auth success");
        setAuthChecked(true);
        setProfileStats(res.data); // ✅ Store profile stats
      })
      .catch((error) => {
        console.error("Authentication error:", error.response || error.message);
        if (error.response?.status === 401) navigate("/login");
        else setError("Authentication failed.");
      });
  }, [navigate]);

  useEffect(() => {
    if (tutorialId < 1 || tutorialId > 16 || (tutorialId > 14 && tutorialId < 15)) {
      navigate("/tutorial/1");
    }
  }, [tutorialId, navigate]);

  useEffect(() => {
    if (!authChecked) return;
    const controller = new AbortController();
    axios
      .get("http://localhost:8081/tutorials", {
        withCredentials: true,
        signal: controller.signal
      })
      .then((res) => {
        const allTutorials = res.data;
        setTutorialList(allTutorials);
        const jsTutorials = allTutorials.filter((t) => t.category === "JavaScript");
        if (tutorialId >= 1 && tutorialId <= 14) setTotalTutorials(jsTutorials.length || 14);
        else setTotalTutorials(1);
      })
      .catch(() => {
        setTutorialList([
          { id: 1, title: "JavaScript Introduction", category: "JavaScript" },
          { id: 15, title: "PHP Basics", category: "PHP" },
          { id: 16, title: "Python Basics", category: "Python" },
        ]);
        setTotalTutorials(1);
      });
    return () => controller.abort();
  }, [authChecked, tutorialId]);

  useEffect(() => {
    if (!authChecked) return;
    const controller = new AbortController();
    setLoading(true);
    axios
      .get(`http://localhost:8081/tutorials/${tutorialId}`, {
        withCredentials: true,
        signal: controller.signal
      })
      .then((response) => {
        const data = response.data;
        const parsedContent = typeof data.content === "string" ? JSON.parse(data.content || "[]") : data.content || [];
        const parsedQuiz = typeof data.quiz === "string" ? JSON.parse(data.quiz || "[]") : data.quiz || [];
        setTutorial({ ...data, content: parsedContent, quiz: parsedQuiz });
        return axios.get("http://localhost:8081/user/progress", {
          withCredentials: true,
          signal: controller.signal
        });
      })
      .then((progressRes) => {
        const completedCount = progressRes.data.completed || 0;
        setCompleted(completedCount > 0 && tutorialId <= completedCount);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Tutorial load error:", err);
        setError("Failed to load tutorial.");
        setTutorial({ title: "Tutorial Not Found", content: [], quiz: [] });
        setLoading(false);
      });

    return () => controller.abort();
  }, [authChecked, tutorialId]);

  const handleAnswerChange = (questionIndex, answer) => {
    setQuizAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const calculateScore = () => {
    if (!tutorial?.quiz?.length) return "0/0";
    let correct = 0;
    tutorial.quiz.forEach((q, i) => {
      if (quizAnswers[i] === q.correctAnswer) correct++;
    });
    return `${correct}/${tutorial.quiz.length}`;
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const score = parseInt(calculateScore().split("/")[0]);
  
    axios
      .post(`http://localhost:8081/tutorials/${tutorialId}/quiz`, { score }, { withCredentials: true })
      .then(() => {
        return axios.get("http://localhost:8081/profile", { withCredentials: true });
      })
      .then((res) => {
        console.log("Updated profile after quiz:", res.data);
        setProfileStats(res.data); // ✅ Trigger re-render
      })
      .catch((error) => {
        console.error("Error saving quiz or fetching updated profile:", error);
      });
  };
  

  const handleCompleteToggle = () => {
    const newCompleted = !completed;
    setCompleted(newCompleted);
    if (newCompleted) {
      axios
        .post(`http://localhost:8081/tutorials/${tutorialId}/complete`, {}, { withCredentials: true })
        .catch((err) => {
          console.error("Error marking tutorial completed:", err);
          setCompleted(false);
        });
    }
  };

  const goToPrevious = () => {
    if (tutorialId > 1) {
      navigate(`/tutorial/${tutorialId - 1}`);
      resetQuizState();
    }
  };

  const goToNext = () => {
    if (tutorialId < totalTutorials) {
      navigate(`/tutorial/${tutorialId + 1}`);
      resetQuizState();
    }
  };

  const resetQuizState = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setCompleted(false);
  };

  if (error) return <div className="error">{error}</div>;
  if (loading) return <div className="loading">Loading...</div>;
  if (!tutorial) return <div className="error">Tutorial not found</div>;

  return (
    <div className="about-container">
      <div className="sidebar">
        <h2 className="sidebar-title">Tutorials</h2>
        <ul className="sidebar-list">
          {tutorialList.map((tut) => (
            <li key={tut.id} className="sidebar-item">
              <Link to={`/tutorial/${tut.id}`} className="tutorial-link">
                {tut.title}
              </Link>
            </li>
          ))}
        </ul>
        {profileStats && (
          <div className="profile-stats">
            <p><strong>User:</strong> {profileStats.name}</p>
            <p><strong>Email:</strong> {profileStats.email}</p>
            <p><strong>Quizzes Taken:</strong> {profileStats.quizzesTaken}</p>
            <p><strong>Average Score:</strong> {profileStats.averageScore}</p>
          </div>
        )}
      </div>

      <div className="content">
        <h1>{tutorial.title}</h1>
        {tutorial.content.map((section, index) => {
          switch (section.type) {
            case "heading": return <h2 key={index}>{section.value}</h2>;
            case "paragraph": return <p key={index}>{section.value}</p>;
            case "list": return (
              <ul key={index}>{section.value.map((item, i) => <li key={i}>{item}</li>)}</ul>
            );
            case "iframe": return (
              <iframe key={index} src={section.value} width="100%" height="300" frameBorder="0" title={`CodePen ${index}`} sandbox="allow-scripts allow-same-origin" />
            );
            case "editor": return (
              <div key={index} className="code-editor-section">
                {section.description && <p>{section.description}</p>}
                <CodeEditor />
              </div>
            );
            default: return null;
          }
        })}

        <div className="quiz-section">
          <h2>Quiz</h2>
          {tutorial.quiz.length > 0 ? (
            <>
              {tutorial.quiz.map((q, index) => (
                <div key={index} className="quiz-question">
                  <p>{q.question}</p>
                  {q.options.map((opt, i) => (
                    <label key={i} className="quiz-option">
                      <input
                        type="radio"
                        name={`q-${index}`}
                        value={opt}
                        checked={quizAnswers[index] === opt}
                        onChange={() => handleAnswerChange(index, opt)}
                        disabled={quizSubmitted}
                      />
                      {opt}
                      {quizSubmitted && opt === q.correctAnswer && <span className="quiz-feedback correct"> (Correct)</span>}
                      {quizSubmitted && quizAnswers[index] === opt && opt !== q.correctAnswer && <span className="quiz-feedback incorrect"> (Incorrect)</span>}
                    </label>
                  ))}
                </div>
              ))}
              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length !== tutorial.quiz.length}
                >
                  Submit Quiz
                </button>
              ) : (
                <p>Your Score: {calculateScore()}</p>
              )}
            </>
          ) : (
            <p>No quiz questions available for this tutorial.</p>
          )}
        </div>

        <div className="completion-checkbox">
          <label>
            <input type="checkbox" checked={completed} onChange={handleCompleteToggle} />
            Mark as Completed
          </label>
        </div>

        <div className="navigation-arrows">
          <button className="arrow-button" onClick={goToPrevious} disabled={tutorialId === 1}>◀</button>
          <button className="arrow-button" onClick={goToNext} disabled={tutorialId === totalTutorials}>▶</button>
        </div>
      </div>
    </div>
  );
};
