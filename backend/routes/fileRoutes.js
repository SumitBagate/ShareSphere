const express = require("express");
const multer = require("multer");
const File = require("../models/File"); // Import the file model

const router = express.Router();

// Set up multer for handling file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload file endpoint
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const newFile = new File({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      data: req.file.buffer, // Save file as binary data
      uploadedBy: req.body.userId, // You can use a userId from Firebase or any other source
    });

    await newFile.save();
    res.json({ message: "File uploaded successfully!", file: newFile });
  } catch (err) {
    console.error("Error saving file:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all files endpoint
router.get("/files", async (req, res) => {
  try {
    const files = await File.find().sort({ uploadDate: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get file by ID endpoint (download)
router.get("/file/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    res.set("Content-Type", file.contentType);
    res.send(file.data);
  } catch (err) {
    console.error("Error retrieving file:", err);
    res.status(500).json({ error: "Server error while retrieving file" });
  }
});

module.exports = router;
