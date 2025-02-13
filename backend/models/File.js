const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true }, // Stores file as binary data
    uploadDate: { type: Date, default: Date.now } // Automatically stores upload timestamp
});

module.exports = mongoose.model("File", FileSchema);
