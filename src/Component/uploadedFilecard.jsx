import { useEffect, useState } from "react";
import { getFiles } from "../api";

const FileCard = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const res = await getFiles();
            setFiles(res || []);
        } catch (err) {
            setError("Failed to fetch files");
            console.error(err);
        }
    };

    return (
        <div className="bg-gray-100 p-6 flex flex-wrap gap-4 justify-center">
            {error && <p className="text-red-600 text-center w-full">{error}</p>}
            {files.length > 0 ? (
                files.map((file) => (
                    <div key={file._id} className="bg-white shadow-lg rounded-xl p-4 w-64">
                        <h3 className="text-lg font-semibold text-gray-700 truncate">{file.docName}</h3>
                        <p className="text-sm text-gray-500">Type: {file.fileType}</p>
                        <p className="text-sm text-gray-500">Description: {file.description}</p>
                        <div className="mt-3 text-center">
                            <a href={`https://sharespherebackend.onrender.com/file/${file._id}`} download className="text-blue-600 hover:underline text-sm">
                                Download
                            </a>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-sm text-center w-full">No files uploaded yet</p>
            )}
        </div>
    );
};

export default FileCard;
