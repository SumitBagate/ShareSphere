import React, { createContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  EmailAuthProvider,
  linkWithCredential,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setEmailVerified(user.emailVerified); // Check email verification status
      } else {
        setUser(null);
        setEmailVerified(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Register with Email + Send Verification Email
  const registerWithEmail = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      setUser(newUser);

      // Send email verification
      await sendEmailVerification(newUser);
      alert("Verification email sent! Please check your inbox.");
      
      navigate("/verify-email"); // Redirect user to verification page
    } catch (error) {
      console.error("Signup error:", error.code, error.message);
      alert(`Signup failed: ${error.message}`);
    }
  };

  // ✅ Login with Email (Only if Verified)
  const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      let loggedInUser = userCredential.user;

      // Check if email is verified
      if (!loggedInUser.emailVerified) {
        await signOut(auth); // Log them out
        alert("Please verify your email before logging in.");
        return;
      }

      setUser(loggedInUser);
      navigate("/profile");
    } catch (error) {
      console.error("Email login error:", error.code, error.message);
      alert(`Login failed: ${error.message}`);
    }
  };

  // ✅ Resend Verification Email
  const resendVerificationEmail = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        alert("Verification email sent again! Please check your inbox.");
      } catch (error) {
        console.error("Error resending verification email:", error.code, error.message);
      }
    }
  };

  // ✅ Logout Function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error.code, error.message);
    }
  };
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;
  
      // Check if an account with the same email exists
      const signInMethods = await fetchSignInMethodsForEmail(auth, googleUser.email);
  
      if (signInMethods.includes("password") && auth.currentUser) {
        // Link Google account to existing email account
        const credential = GoogleAuthProvider.credentialFromResult(result);
        await linkWithCredential(auth.currentUser, credential);
        console.log("Google account linked successfully!");
      }
  
      setUser(googleUser);
      navigate("/profile");
    } catch (error) {
      console.error("Google login error:", error.code, error.message);
      alert(`Google login error: ${error.message}`);
    }
  };
  

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      emailVerified,
      loginWithGoogle, 
      loginWithEmail,
      registerWithEmail,
      resendVerificationEmail,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
