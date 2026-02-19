// multer — это middleware (промежуточный обработчик) для Express,
// который позволяет обрабатывать файлы, загруженные через формы
// multipart/form-data (например, аватарки, документы и т.д.).
import multer from "multer";
import path from "path";
import fs from "fs";

// путь к папке для хранения файлов
const uploadDir = path.join(process.cwd(), "public", "usersimg");

// гарантируем, что папка существует
fs.mkdirSync(uploadDir, { recursive: true });

// Настройка хранилища для загружаемых файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Куда сохранять файл
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    // Имя файла при сохранении (чтобы было уникально)
    const safeOriginal = file.originalname
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_.-]/g, "");
    cb(null, `${Date.now()}-${safeOriginal}`);
  },
});

const upload = multer({ storage });

export default upload;
