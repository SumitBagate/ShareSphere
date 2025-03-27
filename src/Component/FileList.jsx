import { useState, useEffect } from "react";
import { getFiles, downloadFile, deleteFile } from "../api";
import noImage from "/img.png"; // Fallback image

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null); // For file preview modal
    const [downloadingId, setDownloadingId] = useState(null);
    const [downloadProgress, setDownloadProgress] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchFiles = async () => {
            setLoading(true);
            try {
                const res = await getFiles();
                if (isMounted) setFiles(Array.isArray(res) ? res : []);
            } catch (error) {
                if (isMounted) setError("Failed to load files. Please try again.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchFiles();
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handlePreview = (file) => {
        setPreviewUrl(`https://sharespherebackend.onrender.com/file/${file._id}`);
    };

    const handleDownload = async (fileId, filename) => {
        setDownloadingId(fileId);
        setDownloadProgress((prev) => ({ ...prev, [fileId]: 0 }));
        setError(null);

        try {
            await downloadFile(fileId, filename, (progress) => {
                setDownloadProgress((prev) => ({ ...prev, [fileId]: progress }));
            });
        } catch (error) {
            console.error("Download error:", error);
            setError("Failed to download file");
        } finally {
            setDownloadingId(null);
            setTimeout(() => {
                setDownloadProgress((prev) => {
                    const newProgress = { ...prev };
                    delete newProgress[fileId];
                    return newProgress;
                });
            }, 1000);
        }
    };

    const handleDelete = async (fileId) => {
        if (!window.confirm("Are you sure you want to delete this file?")) return;

        setError(null);

        try {
            await deleteFile(fileId);
            setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
        } catch (error) {
            console.error("Delete error:", error);
            setError("Failed to delete file. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-700">Uploaded Files</h2>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
                        <span>{error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading files...</div>
                ) : files.length > 0 ? (
                    <ul className="mt-4 space-y-3 w-full">
                        {files.map((file) => (
                            <li
                                key={file._id}
                                className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex items-center justify-between shadow-sm transition-all"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    {file.contentType?.startsWith("image/") ? (
                                        <img
                                            src={`https://sharespherebackend.onrender.com/file/${file._id}`}
                                            alt={file.filename}
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-300 cursor-pointer"
                                            onClick={() => handlePreview(file)}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = noImage;
                                            }}
                                        />
                                    ) : file.contentType === "application/pdf" ? (
                                        <a href={`https://sharespherebackend.onrender.com/file/${file._id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            Open PDF
                                        </a>
                                    ) : (
                                        <div className="min-w-0">
                                            <p className="text-lg font-medium truncate">{file.filename}</p>
                                            <p className="text-sm text-gray-500">
                                                {file.size ? `${(file.size / 1024).toFixed(1)} KB` : "Size unknown"} • {file.contentType || "Unknown type"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col items-end w-40">
                                    <button
                                        onClick={() => handlePreview(file)}
                                        className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold mb-2"
                                    >
                                        Preview
                                    </button>
                                    <button
                                        onClick={() => handleDownload(file._id, file.filename)}
                                        disabled={downloadingId === file._id}
                                        className={`px-4 py-2 rounded-lg transition text-sm font-semibold w-full ${
                                            downloadingId === file._id ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                                        }`}
                                    >
                                        {downloadingId === file._id ? <span className="animate-spin">⏳</span> : "Download"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file._id)}
                                        className="px-4 py-2 mt-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
                                        aria-label="Delete file"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-12 text-gray-500">No files uploaded yet.</div>
                )}
            </div>

            {/* Modal for preview */}
            {previewUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">File Preview</h3>
                            <button onClick={() => setPreviewUrl(null)} className="text-red-500 font-bold text-lg">✖</button>
                        </div>
                        <div className="max-h-[70vh] overflow-auto flex justify-center">
                            {previewUrl.endsWith(".pdf") ? (
                                <iframe src={previewUrl} className="w-full h-[500px]"></iframe>
                            ) : (
                                <img src={previewUrl} alt="Preview" className="max-w-full max-h-[500px] object-contain"/>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileList;
