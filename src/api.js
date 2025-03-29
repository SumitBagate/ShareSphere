import axios from "axios";

const API_URL = "https://sharespherebackend.onrender.com/api";

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

// ✅ Response Interceptor: Handle API Errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error("API Error:", error.response.status, error.response.data);
            error.message =
                error.response.status === 404
                    ? "File not found on server"
                    : error.response.data?.message || "An error occurred";
        } else if (error.request) {
            console.error("API Error: No response received", error.request);
            error.message = "No response from server";
        } else {
            console.error("API Error:", error.message);
        }
        return Promise.reject(error);
    }
);

// ✅ Upload File Function
export const uploadFile = async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await api.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress,
        });

        return response.data || { success: false, message: "No response data" };
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

// ✅ Fetch Books Function
export const fetchBooks = async (query) => {
    if (!query) return [];

    try {
        const response = await axios.get(
            `https://openlibrary.org/search.json?q=${query}`
        );

        return response.data.docs.slice(0, 10).map((book) => ({
            title: book.title,
            author: book.author_name?.join(", ") || "Unknown",
            cover: book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                : "https://placehold.co/150x200?text=No+Cover",
        }));
    } catch (error) {
        console.error("Error fetching books:", error);
        return [];
    }
};

// ✅ Get Files Function
export const getFiles = async () => {
    try {
        const response = await api.get("/files");
        return response.data || [];
    } catch (error) {
        console.error("Error fetching files:", error);
        throw error;
    }
};

// ✅ Download File Function
export const downloadFile = async (fileId, filename, onDownloadProgress) => {
    try {
        const response = await api.get(`/download/${fileId}`, {
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

// ✅ Get File Preview URL Function
export const previewFile = (fileId, contentType) => {
    const baseUrl = `https://sharespherebackend.onrender.com/file/${fileId}`;

    if (contentType?.startsWith("image/")) {
        return baseUrl; // Directly return image URL
    } else if (contentType === "application/pdf") {
        return `${baseUrl}#view=Fit`; // Open PDFs in browser
    } else {
        return baseUrl; // Other file types (fallback)
    }
};

// ✅ Delete File Function
export const deleteFile = async (fileId) => {
    try {
        const response = await api.delete(`/files/${fileId}`);
        return response.data || { success: false, message: "No response data" };    
        
    } catch (error) {
        console.error("Error deleting file:", error);
        throw new Error(error.response?.data?.message || "Failed to delete file.");
    }
};
