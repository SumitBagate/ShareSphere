const express = require("express");
const multer = require("multer");
const admin = require("firebase-admin");  // Firebase Admin SDK
const mongoose = require("mongoose");
const File = require("../models/File");   // Import File model

const router = express.Router();

// ✅ Middleware for Firebase Token Verification
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Attach user info to request
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

// ✅ Multer Storage Configuration (for local uploads)
const storage = multer.memoryStorage(); // Use memoryStorage to store files in MongoDB as binary data
const upload = multer({ storage });

// ✅ Upload File API (Saves File in MongoDB)
router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const newFile = new File({
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            data: req.file.buffer,  // Store file as binary data
            uploadedBy: req.user.uid, // Store Firebase UID of uploader
            uploadDate: new Date()
        });

        await newFile.save();
        res.json({ message: "File uploaded successfully!", file: newFile });
    } catch (err) {
        console.error("Error saving file:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get All Files API
router.get("/files", async (req, res) => {
    try {
        const files = await File.find().sort({ uploadDate: -1 });
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Serve File by ID (Download Support)
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
