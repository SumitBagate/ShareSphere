import { useEffect, useState } from "react";



const AdminPanel = () => {
  const [files, setFiles] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch files from the server
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in to manage files.");
        return;
      }
      const res = await axios.get("/api/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to fetch files.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file deletion
  const handleDelete = async (fileID) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in to delete files.");
        return;
      }
      await axios.delete(`/api/files/${fileID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles((prev) => prev.filter((f) => f._id !== fileID));
      setDeleting(null); // Close the dialog
    } catch (err) {
      console.error("Error deleting file:", err);
      setError("Failed to delete file.");
    }
  };

  // Effect hook to load files initially
  useEffect(() => {
    fetchFiles();
  }, []);

  // File size formatting function (in KB/MB/GB)
  const formatFileSize = (sizeInBytes) => {
    const sizeInKB = sizeInBytes / 1024;
    if (sizeInKB < 1024) return `${sizeInKB.toFixed(2)} KB`;
    const sizeInMB = sizeInKB / 1024;
    if (sizeInMB < 1024) return `${sizeInMB.toFixed(2)} MB`;
    const sizeInGB = sizeInMB / 1024;
    return `${sizeInGB.toFixed(2)} GB`;
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <p>Manage your uploaded files here.</p>

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md">
          <strong>{error}</strong>
        </div>
      )}

      {loading ? (
        <div className="text-center">Loading files...</div>
      ) : files.length === 0 ? (
        <p className="text-muted-foreground">No files found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file) => (
            <Card key={file._id}>
              <CardContent className="p-4 space-y-2">
                <div className="font-semibold">{file.fileName}</div>
                <div className="text-sm text-muted-foreground">
                  Type: {file.fileType}
                </div>
                <div className="text-sm text-muted-foreground">
                  Size: {formatFileSize(file.size)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Uploaded By: {file.uploadedBy}
                </div>

                {/* Delete Button and Confirmation Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => setDeleting(file._id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </DialogTrigger>

                  {/* Confirmation Dialog */}
                  {deleting === file._id && (
                    <DialogContent>
                      <p className="text-lg mb-4">
                        Are you sure you want to delete this file?
                      </p>
                      <div className="flex justify-end gap-4">
                        <Button
                          variant="ghost"
                          onClick={() => setDeleting(null)} // Close dialog without deleting
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(file._id)} // Confirm deletion
                        >
                          Confirm Delete
                        </Button>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
