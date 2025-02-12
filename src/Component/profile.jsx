import React, { useContext, useEffect } from "react";
import { AuthContext } from "../Auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect if not logged in
    }
  }, [user, navigate]);

  if (!user) return null; // Prevents rendering if user is null

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h2>

        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-24 h-24 mx-auto rounded-full mb-4"
          />
        ) : (
          <div className="w-24 h-24 mx-auto bg-gray-300 rounded-full mb-4 flex items-center justify-center text-gray-700">
            No Image
          </div>
        )}

        <p className="text-lg font-medium text-gray-800">{user.displayName || "No Name"}</p>
        <p className="text-gray-600">{user.email}</p>

        <button
          onClick={logout}
          className="mt-6 w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
