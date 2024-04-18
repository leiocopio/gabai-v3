import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PasswordReset = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/user/" + id)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      axios
        .put("http://localhost:4000/api/update/" + id, {
          password: newPassword,
        })
        .then((response) => navigate("/"))
        .catch((error) => console.error(error));
    } else {
      console.log("Passwords do not match");
    }
  };

  const isDisabled = () => (newPassword && confirmPassword ? false : true);

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <form onSubmit={handleSubmit}>
        <label htmlFor="newPassword">Type new Password</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label htmlFor="confirmPassword">Confirm new Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" disabled={isDisabled()}>
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default PasswordReset;
