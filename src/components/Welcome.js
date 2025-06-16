import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import questionsData from "./QuestionsData";
import "./../css/Welcome.css";

function Welcome() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleStartQuiz = () => {
    navigate("/quiz", { state: { user } });
  };

  const handleShowResult = () => {
    setShowResult(true);
  };

  // Match question and user answer with question data
  const renderResultTable = () => {
    if (!user?.answers) return <p>No answers found.</p>;

    return (
      <div className="table-scroll-container">
        <table className="result-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Your Answer</th>
              <th>Correct Answer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {user.answers.map(({ questionId, selectedOptionIndex }, idx) => {
              const question = questionsData.find(q => q.id === questionId);
              if (!question) return null;

              const yourAnswer = question.options[selectedOptionIndex];
              const correctAnswer = question.options[question.correctAnswerIndex];
              const isCorrect = selectedOptionIndex === question.correctAnswerIndex;

              return (
                <tr key={questionId} className={isCorrect ? "correct" : "incorrect"}>
                  <td>{idx + 1}</td>  {/* This is just for numbering rows, not option indexes */}
                  <td>{question.question}</td>
                  <td>{yourAnswer}</td>
                  <td>{correctAnswer}</td>
                  <td>{isCorrect ? "✓" : "✗"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="welcome-container">
      <h1>Welcome, {user?.firstName} {user?.lastName}!</h1>
      <h2>Your ID: {user?.id}</h2>
      
      {user && user.marks != null && (
        <>
          <h3>Your Marks: {user?.marks}</h3>
          <h3>Time Taken: {user?.timeConsumed} sec</h3>
          <p>You have completed the quiz. Well done!</p>

          {!showResult && (
            <button className="show-result-btn" onClick={handleShowResult}>Show My Result</button>
          )}

          {showResult && (
            <>
              {renderResultTable()}
              <br></br>
              <button className="hide-result-btn" onClick={() => setShowResult(false)}>Hide Result</button>
            </>
          )}

        </>
      )}

      {!user?.marks && (
        <>
          <h3>Quiz Rules:</h3>
          <div className="quiz-rules-box">
            <ul>
              <li>Each question is mandatory.</li>
              <li>No negative marking.</li>
              <li>Do not refresh the page during the quiz.</li>
              <li>Submit your answers within the time limit.</li>
            </ul>
          </div>
          <button onClick={handleStartQuiz}>Start Quiz</button>
        </>
      )}
    </div>
  );
}

export default Welcome;
