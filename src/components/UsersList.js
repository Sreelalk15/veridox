import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import questionsData from "./QuestionsData";
import { db } from "../firebase";
import "./../css/userslist.css";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [expandedUserIds, setExpandedUserIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        usersData.sort((a, b) => (b.marks ?? 0) - (a.marks ?? 0)); // Sort by marks
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const toggleDetails = (userId) => {
    setExpandedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      (user.email ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  return (
    <div className="userlist-container full-page">
      <h2>Student Details</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Marks</th>
              <th>Time Consumed</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <React.Fragment key={user.id}>
                <tr>
                  <td>{user.id}</td>
                  <td>{`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()}</td>
                  <td>{user.email}</td>
                  <td>{user.marks ?? "N/A"}</td>
                  <td>{user.timeConsumed ?? "N/A"}</td>
                  <td>{user.updated ? user.updated.toDate().toLocaleString() : "-"}</td>
                  <td>
                    <button
                      className="details-button"
                      onClick={() => toggleDetails(user.id)}
                    >
                      {expandedUserIds.includes(user.id)
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                  </td>
                </tr>
                {expandedUserIds.includes(user.id) && user.answers && (
                  <tr>
                    <td colSpan={7} className="answer-details">
                      <strong>Answers:</strong>
                      <table className="answers-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Question</th>
                            <th>Submitted Answer</th>
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
                                <td>{idx + 1}</td>
                                <td>{question.question}</td>
                                <td>{yourAnswer}</td>
                                <td>{correctAnswer}</td>
                                <td>{isCorrect ? "✓" : "✗"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="no-users">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UsersList;
