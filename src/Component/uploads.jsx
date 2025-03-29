import { useState, useEffect } from "react";
import { uploadFile, getFiles } from "../api";

const Upload = () => {
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [docName, setDocName] = useState("");
    const [description, setDescription] = useState("");
    const [fileType, setFileType] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file || !docName || !description || !fileType) {
            return alert("Please fill all fields and select a file");
        }

        try {
            await uploadFile({ file, docName, description, fileType });
            alert("Upload Successful!");
            fetchFiles(); 
        } catch (err) {
            setError("Failed to upload file");
            console.error(err);
        }
        setFile(null);
        setDocName("");
        setDescription("");
        setFileType("");
    };

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Upload File</h2>
                {error && <p className="text-red-600 text-center">{error}</p>}
                
                {/* Form Inputs */}
                <input 
                    type="text" 
                    placeholder="Document Name" 
                    value={docName} 
                    onChange={(e) => setDocName(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />
                <textarea 
                    placeholder=" Description  (Brif about content of the file)"
                  
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />
                <div className="relative w-full">
                    <select 
                        value={fileType} 
                        onChange={(e) => setFileType(e.target.value)}
                        className="w-full p-2 border rounded appearance-none mb-2"
                    >
                        <option value="">Select File Type</option>
                        <option value="PDF">PDF</option>
                        <option value="JPG">JPG</option>
                        <option value="PNG">PNG</option>
                        <option value="DOCX">DOCX</option>
                        <option value="TXT">TXT</option>
                        <option value="PPTX">PPTX</option>
                    </select>
                    <span className="absolute right-3 top-3 pointer-events-none">
                        ▼
                    </span>
                </div>

                {/* File Input */}
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition p-4">
                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-3-3m3 3l3-3M4 12a8 8 0 0116 0"></path>
                    </svg>
                    <p className="text-gray-600 text-sm">Click to upload</p>
                    <input type="file" className="hidden" onChange={handleFileChange} />
                </label>

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    Upload
                </button>

                {/* File List */}
                <h3 className="text-lg font-semibold mt-6 text-gray-700">Uploaded Files</h3>
                <ul className="mt-2 space-y-2">
                    {files.length > 0 ? (
                        files.map((file) => (
                            <li key={file._id} className="bg-gray-200 p-2 rounded-lg flex justify-between items-center">
                                <span className="text-sm truncate">{file.docName} ({file.fileType})</span>
                                <a href={`https://sharespherebackend.onrender.com/file/${file._id}`} download className="text-blue-600 hover:underline text-sm">
                                    Download
                                </a>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm text-center">No files uploaded yet</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Upload;
