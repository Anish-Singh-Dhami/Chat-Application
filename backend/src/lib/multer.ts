import multer from "multer";
import path from "path";

const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
});

const diskStorage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const unqiueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unqiueSuffix+path.extname(file.originalname));
  },
});

const uploadDisk = multer({
  storage: diskStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB limit
  },
});

export { uploadMemory, uploadDisk };
