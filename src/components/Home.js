import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import "./../css/Home.css";

function Home() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    id: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
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
    if (!validate()) return;

    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("id", "==", formData.id)
      );
      const q2 = query(
        usersRef,
        where("email", "==", formData.email)
      );

      const querySnapshot1 = await getDocs(q);
      const querySnapshot2 = await getDocs(q2);

      let userData = null;

      if (!querySnapshot1.empty) {
        userData = querySnapshot1.docs[0].data();
      } else if (!querySnapshot2.empty) {
        userData = querySnapshot2.docs[0].data();
      }

      if (userData) {
        // If exists: navigate to Welcome with existing data
        navigate("/welcome", { state: { user: userData } });
      } else {
        // Else: add new user, then navigate
        await addDoc(usersRef, {
          ...formData,
          quiz_started: false,
          marks: 0,
        });
        navigate("/welcome", {
          state: { user: { ...formData, quiz_started: false, marks: 0 } },
        });
      }

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="home-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h1>Welcome to Our Company</h1>
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
            onChange={(e) =>
              setFormData({ ...formData, id: e.target.value })
            }
            className={errors.id ? "invalid" : ""}
          />
        </label>
        <label>
          Email<span className="required">*</span>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={errors.email ? "invalid" : ""}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Home;
