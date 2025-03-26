import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Configure axios instance
const api = axios.create({
    baseURL: API_URL,
    timeout: 30000, // 30 seconds timeout
});

// Request interceptor
api.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(response => response, error => {
    if (error.response) {
        console.error('API Error:', error.response.status, error.response.data);
        // Handle 404 specifically
        if (error.response.status === 404) {
            error.message = "File not found on server";
        }
    } else if (error.request) {
        console.error('API Error: No response received', error.request);
        error.message = "No response from server";
    } else {
        console.error('API Error:', error.message);
    }
    return Promise.reject(error);
});

// Upload File Function
export const uploadFile = async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await api.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

// Get Files Function
export const getFiles = async () => {
    try {
        const response = await api.get("/files");
        return response.data;
    } catch (error) {
        console.error("Error fetching files:", error);
        throw error;
    }
};

// Enhanced Download File Function
export const downloadFile = async (fileId, filename, onDownloadProgress) => {
    try {
        // First verify file exists
        const fileInfo = await api.get(`/files/${fileId}`);
        if (!fileInfo.data) {
            throw new Error("File not found");
        }

        // Then download the file
        const response = await api.get(`/download/${fileId}`, {
            responseType: 'blob',
            onDownloadProgress: progressEvent => {
                if (onDownloadProgress && progressEvent.lengthComputable) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onDownloadProgress(progress);
                }
            }
        });

        // Validate response
        if (!response.data || response.data.size === 0) {
            throw new Error("Empty file received");
        }

        // Create download link
        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', filename || fileInfo.data.filename || `file-${fileId}`);
        
        // Different handling for iOS
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
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
            message: error.response?.data?.message || 
                   error.message || 
                   "Failed to download file" 
        };
    }
};
