import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import "./../css/addstudentid.css";

const AddStudentId = () => {
  const [studentId, setStudentId] = useState("");
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const fetchStudents = async () => {
    try {
      const q = query(collection(db, "users"), orderBy("created", "desc"));
      const querySnapshot = await getDocs(q);
      const studentsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        studentId: doc.data().id,
        updated: doc.data().created?.toDate(),
      }));
      setStudents(studentsList);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedId = studentId.trim();

    if (!trimmedId) {
      setMessage("Please enter a valid Student ID.");
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(trimmedId)) {
      setMessage("Student ID must be alphanumeric (letters and numbers only).");
      return;
    }

    try {
      // Check if ID already exists
      const q = query(collection(db, "users"), where("id", "==", trimmedId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setMessage(`Student ID '${trimmedId}' already exists.`);
        return;
      }

      // Add only id and updated timestamp
      await addDoc(collection(db, "users"), {
        id: trimmedId,
        created: serverTimestamp(),
      });

      setMessage(`Student ID '${trimmedId}' added successfully!`);
      setStudentId("");
      fetchStudents();
      setCurrentPage(1);
    } catch (error) {
      console.error("Error adding student ID:", error);
      setMessage("Failed to add student ID. Please try again.");
    }
  };

  // Pagination calculations
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(students.length / studentsPerPage);

  // Page buttons array
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="add-student-container">
      <h2 style={{ textAlign: "center" }}>Add Student ID</h2>
      <form onSubmit={handleSubmit} className="add-student-form">
        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {message && <p className="message">{message}</p>}

      <h3>Student IDs</h3>
      <div className="table-wrapper">
        <table className="student-ids-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Added On</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length === 0 ? (
              <tr>
                <td colSpan="2" style={{ textAlign: "center" }}>
                  No students added yet.
                </td>
              </tr>
            ) : (
              currentStudents.map(({ id, studentId, updated }) => (
                <tr key={id}>
                  <td>{studentId}</td>
                  <td>{updated ? updated.toLocaleString() : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination buttons */}
      {totalPages > 1 && (
        <div className="pagination">
          {pageNumbers.map((number) => (
            <button
              key={number}
              className={`page-button ${number === currentPage ? "active" : ""}`}
              onClick={() => setCurrentPage(number)}
              disabled={number === currentPage}
            >
              {number}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddStudentId;
