import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Star } from 'lucide-react';
import  FileCard from "../Component/uploadedFilecard"; // Import FileCard component
import { auth } from '../firebaseConfig'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
 // Ensure correct Firebase import

 function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (!currentUser) {
            navigate("/login"); // Redirect to login if not authenticated
        } else {
            setUser(currentUser);
        }
    });

    return () => unsubscribe(); // Cleanup function
  }, [navigate]);

  if (!user) {
      return null; // Prevent UI flash before redirect
  }
  return (

    <div className="min-h-screen bg-gray-100 p-6">
    

    <main className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
    
        <section className="bg-white p-4 rounded-lg shadow-md">
        
          <Link to="/FileList" >
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Your Uploads
          </h2>
          </Link>
          <p className="text-gray-500">You haven't uploaded any PDFs yet.</p>
        </section>

        {/* Top Rated PDFs */}
      <section className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          Top Rated PDFs
        </h2>
        <div className="flex items-center space-x-2">
          <Star size={20} className="text-yellow-500" />
          <p className="text-gray-500">No top-rated PDFs yet.</p>
        </div>
      </section>

      {/* User Activity */}
      <section className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          Recent Activity
        </h2>
        <p className="text-gray-500">No recent activity.</p>
      </section>
    </main>

    {/* ✅ Include the BookSearch component inside Dashboard */}
    <div className="mt-5 bg-white p-4 rounded-lg shadow-md">
    <div>

        <FileCard /> {/* Include the FileCard component here */}
   </div>

  </div>
</div>




// <div className="min-h-screen bg-gray-100 p-6">
//   <header className="bg-white shadow p-4 flex justify-between items-center">
//     <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
//     <Link to="/upload" className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2">
//       <Upload size={20} />
//       <span>Upload PDF</span>
//     </Link>
//   </header>

//   <main className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//     {/* Uploaded PDFs Section */}
//     <section className="bg-white p-4 rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold text-gray-700 mb-3">Your Uploads</h2>
//       <p className="text-gray-500">You haven't uploaded any PDFs yet.</p>
//     </section>

//     {/* Top Rated PDFs */}
//     <section className="bg-white p-4 rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold text-gray-700 mb-3">Top Rated PDFs</h2>
//       <div className="flex items-center space-x-2">
//         <Star size={20} className="text-yellow-500" />
//         <p className="text-gray-500">No top-rated PDFs yet.</p>
//       </div>
//     </section>

//     {/* User Activity */}
//     <section className="bg-white p-4 rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold text-gray-700 mb-3">Recent Activity</h2>
//       <p className="text-gray-500">No recent activity.</p>
//     </section>
//   </main>
// </div>

);
};
export default Dashboard;