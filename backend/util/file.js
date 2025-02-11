const fs = require("fs");

const deleteFile = (filePath) => {
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      // Nếu file tồn tại, tiến hành xóa
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("❌ Error deleting file:", err);
        } else {
          console.log("✅ File deleted successfully:", filePath);
        }
      });
    } else {
      console.warn("⚠️ File not found, skipping deletion:", filePath);
    }
  });
};

exports.deleteFile = deleteFile;
