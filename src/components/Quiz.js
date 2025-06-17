import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import questionsData from "./QuestionsData";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./../css/Quiz.css";

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const totalTime = 5 * 60; // 5 minutes in seconds

  // ✅ Shuffle helper
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedStart = localStorage.getItem("quizStartTime");
    const startTime = savedStart ? parseInt(savedStart, 10) : Date.now();
    if (!savedStart) localStorage.setItem("quizStartTime", startTime);

    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const remaining = totalTime - elapsedSeconds;
    return remaining > 0 ? remaining : 0;
  });

  // ✅ Shuffle questions ONCE on mount
  useEffect(() => {
    const shuffled = shuffleArray(questionsData);
    setShuffledQuestions(shuffled);
    setAnswers(Array(shuffled.length).fill(null));
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionChange = (index) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = index;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    return answers.reduce((score, ans, idx) => {
      if (ans === shuffledQuestions[idx].correctAnswerIndex) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  const handleSubmit = async () => {
    const score = calculateScore();
    setIsSubmitted(true);

    const timeConsumed = ((totalTime - timeLeft) / 60).toFixed(2);
    localStorage.removeItem("quizStartTime");

    let answersArray = [];

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("id", "==", user.id), where("email", "==", user.email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;

        // ✅ Fix: store real question ID
        answersArray = answers.map((selectedOptionIndex, index) => ({
          questionId: shuffledQuestions[index].id,
          selectedOptionIndex,
        }));

        await updateDoc(docRef, {
          marks: score,
          timeConsumed: timeConsumed,
          quiz_started: true,
          answers: answersArray,
        });
      }
    } catch (error) {
      console.error("Error updating marks:", error);
    }

    setTimeout(() => {
      navigate("/welcome", {
        state: {
          user: {
            ...user,
            marks: score,
            timeConsumed: timeConsumed,
            answers: answersArray,
          },
        },
      });
    }, 1500);
  };


  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ✅ Show loading until shuffledQuestions is ready
  if (shuffledQuestions.length === 0) return <div>Loading quiz...</div>;

  if (isSubmitted) {
    return (
      <div className="quiz-container">
        <h2>Answers Submitted!</h2>
        <p>Your Score: {calculateScore()} / {shuffledQuestions.length}</p>
        <p>Redirecting to Welcome page...</p>
      </div>
    );
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>Question {currentQuestionIndex + 1} of {shuffledQuestions.length}</h2>
        <div className="timer">Time Left: {formatTime(timeLeft)}</div>
      </div>

      <div className="question-box">
        <h3>{currentQuestion.question}</h3>
        <ul className="options-list">
          {currentQuestion.options.map((option, idx) => (
            <li key={idx}>
              <label className={selectedAnswer === idx ? "selected" : ""}>
                <input
                  type="radio"
                  checked={selectedAnswer === idx}
                  onChange={() => handleOptionChange(idx)}
                />
                {option}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="navigation-buttons">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="nav-btn"
        >
          Previous
        </button>
        {currentQuestionIndex < shuffledQuestions.length - 1 ? (
          <button
            onClick={handleNext}
            className="nav-btn"
            disabled={selectedAnswer === null}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="submit-btn"
            disabled={selectedAnswer === null}
          >
            Submit Answers
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
