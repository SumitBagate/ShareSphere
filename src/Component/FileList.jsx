import { useState, useEffect } from "react";
import { getFiles, downloadFile } from "../api";

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [downloadingId, setDownloadingId] = useState(null);
    const [downloadProgress, setDownloadProgress] = useState({});
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        fetchFiles();
<<<<<<< HEAD
    }, [retryCount]); // Retry when retryCount changes
=======
    }, [retryCount]);
>>>>>>> 5007beaebce50f3b79be06b860c497eb6f82b883

    const fetchFiles = async () => {
        try {
            const res = await getFiles();
            setFiles(Array.isArray(res) ? res : []);
            setError(null);
        } catch (error) {
            console.error("Error fetching files:", error);
            setError("Failed to load files. Please try again.");
            setFiles([]);
        }
    };

    const handleDownload = async (fileId, filename) => {
        setDownloadingId(fileId);
<<<<<<< HEAD
        setDownloadProgress(prev => ({ ...prev, [fileId]: 0 }));
        setError(null);

        try {
            const result = await downloadFile(
                fileId,
                filename,
                (progress) => {
                    setDownloadProgress(prev => ({ ...prev, [fileId]: progress }));
                }
            );

            if (!result.success) {
                throw new Error(result.message || "Download failed");
            }
        } catch (error) {
            console.error("Download error:", error);
            setError(error.message || "Failed to download file");
        } finally {
            setDownloadingId(null);
            // Keep progress visible briefly after completion
            setTimeout(() => {
                setDownloadProgress(prev => {
=======
        setDownloadProgress((prev) => ({ ...prev, [fileId]: 0 }));
        setError(null);

        try {
            await downloadFile(
                fileId,
                filename,
                (progress) => {
                    setDownloadProgress((prev) => ({ ...prev, [fileId]: progress }));
                }
            );
        } catch (error) {
            console.error("Download error:", error);
            setError("Failed to download file");
        } finally {
            setDownloadingId(null);
            setTimeout(() => {
                setDownloadProgress((prev) => {
>>>>>>> 5007beaebce50f3b79be06b860c497eb6f82b883
                    const newProgress = { ...prev };
                    delete newProgress[fileId];
                    return newProgress;
                });
            }, 1000);
        }
    };

    const handleRetry = () => {
<<<<<<< HEAD
        setRetryCount(prev => prev + 1);
=======
        setRetryCount((prev) => prev + 1);
>>>>>>> 5007beaebce50f3b79be06b860c497eb6f82b883
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-700">Uploaded Files</h2>
<<<<<<< HEAD
                    <button 
=======
                    <button
>>>>>>> 5007beaebce50f3b79be06b860c497eb6f82b883
                        onClick={handleRetry}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-semibold transition"
                    >
                        Refresh List
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
                        <span>{error}</span>
<<<<<<< HEAD
                        <button 
=======
                        <button
>>>>>>> 5007beaebce50f3b79be06b860c497eb6f82b883
                            onClick={handleRetry}
                            className="px-3 py-1 bg-red-200 hover:bg-red-300 rounded text-sm font-medium"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {files.length > 0 ? (
                    <ul className="mt-4 space-y-3 w-full">
                        {files.map((file) => (
<<<<<<< HEAD
                            <li 
                                key={file._id} 
=======
                            <li
                                key={file._id}
>>>>>>> 5007beaebce50f3b79be06b860c497eb6f82b883
                                className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex items-center justify-between shadow-sm transition-all"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    {file.contentType?.startsWith("image/") ? (
                                        <div className="relative">
<<<<<<< HEAD
                                            <img 
                                                src={`http://localhost:5000/api/${file.url}`} 
                                                alt={file.filename} 
                                                className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23EEE'/%3E%3Ctext x='50%' y='50%' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%23AAA'%3EImage%3C/text%3E%3C/svg%3E";
                                                }}
                                            />
                                            {file.contentType.startsWith("image/") && (
                                                <span className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                                    {file.contentType.split('/')[1]}
                                                </span>
                                            )}
=======
                                            <img
                                                src={`https://sharespherebackend.onrender.com/file/${file._id}`}
                                                alt={file.filename}
                                                className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/64?text=No+Image";
                                                }}
                                            />
                                            <span className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                                {file.contentType.split("/")[1]}
                                            </span>
>>>>>>> 5007beaebce50f3b79be06b860c497eb6f82b883
                                        </div>
                                    ) : (
                                        <div className="min-w-0">
                                            <p className="text-lg font-medium truncate">{file.filename}</p>
                                            <p className="text-sm text-gray-500">
<<<<<<< HEAD
                                                {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Size unknown'} • 
                                                {file.contentType || 'Unknown type'}
=======
                                                {file.size ? `${(file.size / 1024).toFixed(1)} KB` : "Size unknown"} •{" "}
                                                {file.contentType || "Unknown type"}
>>>>>>> 5007beaebce50f3b79be06b860c497eb6f82b883
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col items-end w-40">
                                    <button
                                        onClick={() => handleDownload(file._id, file.filename)}
                                        disabled={downloadingId === file._id}
                                        className={`px-4 py-2 rounded-lg transition text-sm font-semibold w-full ${
<<<<<<< HEAD
                                            downloadingId === file._id 
                                                ? "bg-blue-400 cursor-not-allowed" 
                                                : "bg-blue-600 hover:bg-blue-700 text-white"
                                        }`}
                                    >
                                        {downloadingId === file._id 
                                            ? `${downloadProgress[file._id] || 0}%` 
                                            : "Download"}
                                    </button>
                                    {downloadingId === file._id && (
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                            <div 
                                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
=======
                                            downloadingId === file._id
                                                ? "bg-blue-400 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700 text-white"
                                        }`}
                                    >
                                        {downloadingId === file._id ? `${downloadProgress[file._id] || 0}%` : "Download"}
                                    </button>
                                    {downloadingId === file._id && (
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                            <div
                                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
>>>>>>> 5007beaebce50f3b79be06b860c497eb6f82b883
                                                style={{ width: `${downloadProgress[file._id] || 0}%` }}
                                            ></div>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-12">
<<<<<<< HEAD
                        <p className="text-gray-500 text-lg mb-4">
                            {error ? "Couldn't load files" : "No files uploaded yet"}
                        </p>
=======
                        <p className="text-gray-500 text-lg mb-4">{error ? "Couldn't load files" : "No files uploaded yet"}</p>
>>>>>>> 5007beaebce50f3b79be06b860c497eb6f82b883
                        {error && (
                            <button
                                onClick={handleRetry}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileList;