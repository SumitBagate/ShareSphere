import { auth } from "./firebaseConfig"; 
// Import Firebase Auth instance 

const API_URL = "http://localhost:5000/api"; // Ensure this matches backend route

// ✅ Upload File to Backend
export const uploadFile = async (file) => {
    const user = auth.currentUser;
    if (!user) {
        console.error("No authenticated user found!");
        return null;
    }

    const token = await user.getIdToken(); // Get Firebase authentication token

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`, // Include Firebase token
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error uploading file:", error);
        return null;
    }
};

// ✅ Fetch Files from Backend
export const getFiles = async () => {
    try {
        const response = await fetch(`${API_URL}/files`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const files = await response.json();

        return files.map(file => ({
            ...file,
            url: `${API_URL}/file/${file._id}`, // Use backend route to serve file data
        }));
    } catch (error) {
        console.error("Error fetching files:", error);
        return [];
    }
};
