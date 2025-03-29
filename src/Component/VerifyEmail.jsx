import React from "react";
import { useAuth } from "../AuthContext"; // Import your auth context

const VerifyEmail = () => {
  const { resendVerificationEmail } = useAuth();

  return (
    <div className="verify-email">
      <h2>Email Verification Required</h2>
      <p>Please check your email and click the verification link before logging in.</p>
      <button onClick={resendVerificationEmail}>Resend Verification Email</button>
    </div>
  );
};

export default VerifyEmail;
