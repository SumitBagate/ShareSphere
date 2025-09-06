import { useEffect, useState } from "react";
import axios from 'axios';
import { getFiles } from "../api";
import { ThumbsUp } from 'lucide-react'; // ⬅️ At the top of the file
import { downloadFile } from "../api"  ;
import { handleLikeClick as likeOnServer} from "../api"; // Import the preview function
import { previewFile } from "../api"; // Import the preview function
import ReportModal from "../Component/report";
import { reportIssue } from "../api"; // Import the report function
import '@react-pdf-viewer/core/lib/styles/index.css'; 
const BASE_URL = import.meta.env.VITE_API_URL;

const FileCard = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loadingFileId, setLoadingFileId] = useState(null);
  const [credits, setCredits] = useState(0);
  const [previews, setPreviews] = useState({});
  const [likingFileId, setLikingFileId] = useState(null);
  const [reportingFileId, setReportingFileId] = useState(null);
  const [likedFiles, setLikedFiles] = useState([]);


  const [isModalOpen, setIsModalOpen] = useState(false);// New state to store selected file ID for reporting

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





  useEffect(() => {
    const loadPreviews = async () => {
      try {
        const newPreviews = {};
        await Promise.all(
          files.map(async (file) => {
            const { fileID, contentType, _id, fileType } = file;
            
            // Grouping file type checks for clarity
            const isPreviewable = fileType?.startsWith("image/") ||
                                  fileType === "application/pdf" ||
                                  fileType?.startsWith("video/") ||
                                  fileType?.startsWith("audio/");
            
            if (isPreviewable) {
              const url = await previewFile(fileID, contentType);
              console.log("Preview URL for", _id, ":", url);
              if (url) {
                // Only set if the preview URL is new or changed
                newPreviews[_id] = url;
              }
            }
          })
        );
        
        // Update state only if there are new previews
        if (Object.keys(newPreviews).length > 0) {
          setPreviews((prevPreviews) => ({
            ...prevPreviews,
            ...newPreviews,
          }));
        }
      } catch (err) {
        console.error("Error loading previews", err);
      }
    };
  
    // Trigger preview loading when files are available
    if (files.length > 0) {
      loadPreviews();
    }
  }, [files]);
  
  
  const handleReportSubmit = ({ fileId, complaint }) => {
    console.log("📝 Complaint submitted for file ID:", fileId);
    console.log("📄 Complaint text:", complaint);
    // You can send this data to your backend here
  };
  

  //--------------------DOWNLOAD-------------------//
  const handleDownload = async (fileID, filename) => {
    try {
      setLoadingFileId(fileID);
      
      // Optimistic update: Decrease credits by 5 immediately
      const newCredits = credits - 5;
      setCredits(newCredits); // Update state optimistically
      
      // Dispatch the event with the updated credits
      window.dispatchEvent(new CustomEvent("credits-updated", { detail: newCredits }));
      
      // Proceed with the file download
      const result = await downloadFile(fileID, filename, (progress) => {
        console.log(`Download Progress: ${progress}%`);
      });
  
      if (result.success) {
        // If successful, confirm the credits update by fetching the latest from the backend
        const token = localStorage.getItem("authToken");
        const updatedCredits = await getUserCredits(token);
        setCredits(updatedCredits);  // Update the state with actual credits
        window.dispatchEvent(new CustomEvent("credits-updated", { detail: updatedCredits }));
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Error during download");
      console.error("Download error:", err);
    } finally {
      setLoadingFileId(null);
    }
  };
  
  // const handleDownload = async (fileID, filename) => {
  //   try {
  //     setLoadingFileId(fileID);
  //     const result = await downloadFile(fileID, filename, (progress) => {
  //       console.log(`Download Progress: ${progress}%`);
  //     });
  
  //     if (result.success) {
  //       const token = localStorage.getItem("authToken");
  //       const updatedCredits = await getUserCredits(token);
  //       setCredits(updatedCredits);
  //       window.dispatchEvent(new Event("credits-updated"));
  //     } else {
  //       setError(result.message);
  //     }
  //   } catch (err) {
  //     setError("Error during download");
  //     console.error("Download error:", err);
  //   } finally {
  //     setLoadingFileId(null);
  //   }
  // };
  
//---------------------credits-------------------//
  
  const getUserCredits = async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/credits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.credits;
    } catch (err) {
      console.error("Error fetching credits", err);
      return 0;
    }
  };

//---------------------like-------------------//  
const handleLikeClick = async (fileId) => {
  try {
    setLikingFileId(fileId); // Disable the like button while loading

    const alreadyLiked = likedFiles.includes(fileId);

    // Optimistically update UI
    setFiles((prevFiles) =>
      prevFiles.map((file) => {
        if (file._id === fileId) {
          const newLikes = alreadyLiked
            ? file.likes.filter((id) => id !== "me") // 'me' is a placeholder for current user
            : [...file.likes, "me"];

          return {
            ...file,
            likes: newLikes,
          };
        }
        return file;
      })
    );

    // Call the backend
    const updatedLikesCount = await likeOnServer(fileId);

    // Update the actual like count (as number)
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file._id === fileId
          ? {
              ...file,
              likes: Array(updatedLikesCount).fill("user"), // simulate list of users
            }
          : file
      )
    );

    // Update liked list
    setLikedFiles((prev) =>
      alreadyLiked
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  } catch (err) {
    console.error("Failed to like file:", err);
  } finally {
    setLikingFileId(null); // Re-enable the button
  }
};



  
  return (
    <div className="bg-gray-100 p-6 flex flex-wrap gap-4 justify-center ">
      {error && <p className="text-red-600 text-center w-full">{error}</p>}
      {files.length > 0 ? (
        files.map((file) => {
          const { _id, contentType, docName, title, fileID, filename, description, likes } = file;
          const fileUrl = previews[file._id];
          // Get the URL to display

          return (
          <div key={file._id} className="bg-white shadow-lg  rounded-xl p-4 w-64">
            <h3 className="text-lg font-semibold text-gray-700 truncate">{file.docName}</h3>
            <p className="text-sm text-gray-500">Title: {file.title}</p>
          


            {file.fileType === "application/pdf" && fileUrl ? (
                <div className="my-2 h-96">
                  <iframe
                      src={`${fileUrl}#page=1&toolbar=0&embedded=true `}  // Add more URL params
                      className="w-full   blur-[1px]"
                      width="100%"
                      height="100%"
                      title={file.docName}
                      frameBorder="0"
                    />
                                </div>
              ) : file.fileType?.startsWith("image/") && fileUrl ? (
                <img src={fileUrl} alt={filename} className="w-full h-auto object-cover rounded my-2" />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-sm text-gray-500 rounded">
                  Preview Not Available
                </div>
              )}


            {/* Details */}
                    <p className="text-sm text-gray-500 whitespace-pre-line break-words">
                  <span className="font-medium text-gray-600">Description:</span> {file.description}
          </p>

          <p className="text-sm text-gray-500 whitespace-pre-line break-words">
            <span className="font-medium text-gray-600">Type:</span> {file.fileType}
          </p>



         
            <div className="mt-3 text-center flex justify-between items-center px-2">
            <div className="flex items-center gap-1 text-gray-600">
              
              
          
              </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                 <button
  disabled={likingFileId === file._id}
  className={`flex items-center gap-1 text-sm ${
    likingFileId === file._id ? 'opacity-50 cursor-not-allowed' : ''
  }`}
  onClick={() => handleLikeClick(file._id)}
>
  <span className="text-black font-medium">{file.likes?.length || 0}</span>
  <ThumbsUp
    className={`w-4 h-4 ${
      likedFiles.includes(file._id) ? 'text-red-600' : 'text-blue-600'
    }`}
  />
</button>




              <button
    className="text-red-500 hover:underline text-sm"
    onClick={() => {
      setIsModalOpen(true);
      setReportingFileId(file._id);
    }}
  >
    Report
  </button>
            </div>

        
            <div className="mt-3 text-center">
              <button
               onClick={() => handleDownload(file._id, file.filename)}
               
               className={`text-blue-600 hover:underline text-sm disabled:opacity-50`}
               disabled={loadingFileId === file._id}
               >
                {loadingFileId === file._id ? "Downloading..." : "Download"}
              </button>
              <div className="mt-2">
                
                </div>

    

              
            </div>
          </div>
        )
})

      ) : (
        <p className="text-gray-500 text-sm text-center w-full">
          No files uploaded yet
        </p>
      )}

      {/* <div className="text-center w-full mt-4">
        <p>Your Credits: <span className="font-semibold">{credits}</span></p>
      </div> */}
    
      <ReportModal
  isOpen={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    setReportingFileId(null);
  }}
  fileId={reportingFileId}
/>



    </div>
    
  );
};

export default FileCard;
