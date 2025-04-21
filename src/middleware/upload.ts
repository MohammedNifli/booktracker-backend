import multer from 'multer';
import { randomBytes } from 'crypto';
import { join } from 'path';

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(process.cwd(), 'uploads'));
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    const randomName = randomBytes(16).toString('hex');
    cb(null, `${randomName}.${ext}`);
  }
});

// Create multer instance
export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});