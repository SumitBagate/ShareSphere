import { useState, useEffect } from "react";
import { getFiles } from "../api";

const FileList = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const res = await getFiles();
            setFiles(Array.isArray(res) ? res : []); // Ensure res is always an array
        } catch (error) {
            console.error("Error fetching files:", error);
            setFiles([]); // Set to empty array if error occurs
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-3xl">
                <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Uploaded Files</h2>

                {files.length > 0 ? (
                    <ul className="mt-4 space-y-4 w-full">
                        {files.map((file) => (
                            <li key={file._id} className="bg-gray-200 p-4 rounded-lg flex items-center justify-between shadow-md">
                                <div className="flex items-center gap-4">
                                    {file.contentType && file.contentType.startsWith("image/") ? (
                                        <img 
                                            src={file.url} 
                                            alt={file.filename} 
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-300" 
                                        />
                                    ) : (
                                        <span className="text-lg font-medium truncate">{file.filename}</span>
                                    )}
                                </div>
                                <a 
                                    href={file.url} 
                                    download 
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                                >
                                    Download
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center text-lg">No files uploaded yet</p>
                )}
            </div>
        </div>
    );
};

export default FileList;
