import axios from "axios";

// Import Firebase Authentication module if it's not imported already
import { getIdToken } from "firebase/auth";
import { auth } from "./firebaseConfig"; // path must be correct


// const API_URL = "https://sharespherebackend.onrender.com/api/files";
const API_URL = import.meta.env.VITE_API_URL ;
console.log("API_URL from .env:", API_URL);



// Configure axios instance
const api = axios.create({
    baseURL: API_URL,
    timeout: 30000, // 30 seconds timeout
});


// ✅ Request Interceptor: Attach Auth Token
api.interceptors.request.use(
    (config) => {
        try {
            const token = localStorage.getItem("authToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error retrieving auth token:", error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);


// Handle API Errors Gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      error.message =
        error.response.status === 404
          ? "File not found on server"
          : error.response.data?.message || "An error occurred";
    } else if (error.request) {
      error.message = "No response from server";
    }
    return Promise.reject(error);
  }
);

// export const handleLikeClick = async (fileId) => {
//   try {
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       alert("Please login to like files.");
//       return;
//     }

//     setLikingFileId(fileId);
//     const updatedLikesCount = await handleLike(fileId); // ✅ get accurate count

//     // Update the file in state with new likes count
//     setFiles((prevFiles) =>
//       prevFiles.map((file) =>
//         file._id === fileId ? { ...file, likes: updatedLikesCount } : file
//       )
//     );
//   } catch (err) {
//     console.error("Failed to like file:", err);
//   } finally {
//     setLikingFileId(null);
//   }
// };

export const handleLikeClick = async (fileId) => {
    try {

      const token = localStorage.getItem("authToken");
      
      if (!token) {
        alert("Please login to like files.");
        return;
      }
  
      const response = await api.post(`/files/like/${fileId}`);

  
      if (response.data && response.data.likesCount !== undefined) {
        return response.data.likesCount; // Ensure this is being returned correctly
      } else {
        throw new Error("Failed to update likes");
      }
    } catch (err) {
      console.error("Failed to like file:", err);
      throw err;
    }
  };
  
  

// ✅ Upload File Function
export const uploadFile = async (formData, onUploadProgress) => {
    try {
        console.log("🔗 Hitting URL:", `${API_URL}/upload`);

        const response = await api.post("/files/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress,
        });

        return response; // This returns the full Axios response object
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};



export const getFiles = async () => {
    try {
        const token = localStorage.getItem("authToken");

        if (!token) {
            throw new Error("No auth token found.");
        }

        console.log("Fetching files with token...");
        const response = await api.get("/files/all", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
           
        });

        console.log("Fetched files:", response.data);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching files:", error);
        throw error;
    }
};


// Firebase token

export const getFreshToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
  
    return await getIdToken(user, true); // Force refresh token
  };

// In your reportIssue function
export const reportIssue = async (fileId, issueType, details) => {
    const token = await getFreshToken();
  
    return axios.post(
      `${API_URL}/files/report/${fileId}`, // <-- Include the fileId in the URL
      { issueType, details }, // Payload
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };
  

//get user credits

// api.js
export const getUserCredits = async () => {
    const token = await getFreshToken();
  
    return axios.get(`${API_URL}/user/credits`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  


//get user uploaded files

export  const getMyUploads = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/user/myuploads`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("API Response:", response.data); // Log response data
      return response;
    } catch (error) {
      console.error("Error fetching files:", error.response || error); // Log detailed error
      throw error; // Rethrow error so it can be handled in the component
    }
  };



// ✅ Download File Function
export const downloadFile = async (fileId, filename, onDownloadProgress) => {
    try {    console.log("🔗 Hitting URL:", `${API_URL}/files/download/${fileId}`);
        const response = await api.get(`/files/download/${fileId}`, {
            responseType: "blob",
            onDownloadProgress: (progressEvent) => {
                if (onDownloadProgress && progressEvent.lengthComputable) {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onDownloadProgress(progress);
                }
            },
        });

        if (!response.data || response.data.size === 0) {
            throw new Error("Empty file received");
        }

        // Get MIME type from response headers
        const contentType = response.headers["content-type"] || "application/octet-stream";
        const blob = new Blob([response.data], { type: contentType });

        // Create download link
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", filename || `file-${fileId}`);

        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        }

        document.body.appendChild(link);
        link.click();

        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        }, 100);

        return { success: true };
    } catch (error) {
        console.error("Download error:", error);
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to download file",
        };
    }
};

// api.js
const previewCache = new Map();

export const previewFile = async (fileID, contentType) => {
  // Check if the preview is already in the cache
  if (previewCache.has(fileID)) {
    console.log("Returning cached preview for", fileID);
    return previewCache.get(fileID);
  }

  try {
    const response = await fetch(`${API_URL}/files/preview/${fileID}`);
    const blob = await response.blob();
    const previewUrl = URL.createObjectURL(blob);

    // Cache the preview
    previewCache.set(fileID, previewUrl);
    console.log("Caching preview for", fileID);
    return previewUrl;
  } catch (error) {
    console.error("Error fetching preview:", error);
    return null; // Return null if the preview cannot be fetched
  }
};

  


// ✅ Delete File Function
export const deleteFile = async (fileId) => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("authToken");
  
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
  
      // Include the token in the Authorization header
      const response = await axios.delete(`${API_URL}/files/delete/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token here
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error deleting file:", error);
  
      // Handle error response
      if (error.response) {
        throw new Error(error.response.data.error || "Error deleting the file.");
      } else {
        throw new Error("Network error or server is down. Please try again later.");
      }
    }
  };
  