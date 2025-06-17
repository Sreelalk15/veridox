import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import "./../css/Home.css";

function Home() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    id: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = true;
    if (!formData.lastName.trim()) newErrors.lastName = true;
    if (!formData.id.trim()) newErrors.id = true;
    if (!formData.email.trim()) newErrors.email = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("id", "==", formData.id.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // ID not found, show error
        setMessage("Your id not existed in the record.");
        return;
      }

      // ID exists, get the user doc and ref
      const userDoc = querySnapshot.docs[0];
      const userRef = doc(db, "users", userDoc.id);
      const userData = userDoc.data();

      // Prepare trimmed form data for comparison
      const trimmedFormData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
      };

      // Check if any fields differ
      const fieldsToCheck = ["firstName", "lastName", "email"];
      let hasChanges = false;
      const updateData = {};

      for (const field of fieldsToCheck) {
        if (userData[field] !== trimmedFormData[field]) {
          hasChanges = true;
          updateData[field] = trimmedFormData[field];
        }
      }

      // If changes exist, update Firestore document with updated fields
      if (hasChanges) {
        await updateDoc(userRef, updateData);
      }

      // Add Firestore document ID to the user object before passing forward
      const userWithDocId = {
        ...userData,
        ...updateData,
        docId: userDoc.id,
      };

      navigate("/welcome", { state: { user: userWithDocId } });
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="home-container">
      <form onSubmit={handleSubmit} className="user-form">
        <label>
          First Name<span className="required">*</span>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className={errors.firstName ? "invalid" : ""}
          />
        </label>
        <label>
          Last Name<span className="required">*</span>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className={errors.lastName ? "invalid" : ""}
          />
        </label>
        <label>
          ID<span className="required">*</span>
          <input
            type="text"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            className={errors.id ? "invalid" : ""}
          />
        </label>
        <label>
          Email<span className="required">*</span>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={errors.email ? "invalid" : ""}
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Home;
