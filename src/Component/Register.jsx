import { useState, useContext } from "react";
import { AuthContext } from "../Auth"; // Import AuthContext for authentication
import { Link } from "react-router-dom";
import { fetchSignInMethodsForEmail } from "firebase/auth"; // Firebase function to check sign-in methods
import { auth } from "../firebaseConfig"; // Import Firebase auth instance

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // State for loading indicator

  const { registerWithEmail } = useContext(AuthContext); // Access register function

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true); // Start loading

    try {
      // Check existing sign-in methods for the email
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.includes("google.com")) {
        setErrorMessage(
          "This email is linked to a Google account. Please use Google Sign-In."
        );
        setLoading(false);
        return;
      }

      // Proceed with email/password registration if no conflict
      await registerWithEmail(email, password);
      alert("Account created successfully! You can now log in.");
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error.code)); // Handle Firebase errors
    }

    setLoading(false); // Stop loading
  };

  // 🔹 Convert Firebase error codes to user-friendly messages
  const getFriendlyErrorMessage = (errorCode) => {
    const errorMessages = {
      "auth/email-already-in-use": "This email is already in use. Try logging in instead.",
      "auth/weak-password": "Password should be at least 6 characters.",
      "auth/invalid-email": "Invalid email format. Please enter a valid email.",
      "auth/network-request-failed": "Network error. Check your internet connection.",
      default: "Something went wrong. Please try again.",
    };
    return errorMessages[errorCode] || errorMessages.default;
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>

        {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-md"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded-md"
          />

          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account? 
          <Link to="/login" className="text-blue-500 hover:underline ml-2">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
