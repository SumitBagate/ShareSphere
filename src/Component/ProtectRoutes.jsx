import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";

const ProtectedRoute = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>; // ✅ Prevents flickering

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
