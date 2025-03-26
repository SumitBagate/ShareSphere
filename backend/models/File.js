const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("File", FileSchema);
