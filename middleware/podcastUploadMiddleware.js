import multer from 'multer';
import path from 'path';

// Configure storage for images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/podcasts/images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure storage for audio
const audioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/podcasts/episodes');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// File filter for audio
const audioFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an audio file! Please upload only audio files.'), false);
  }
};

// Create multer upload instances
export const uploadPodcastImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('image');

export const uploadPodcastAudio = multer({
  storage: audioStorage,
  fileFilter: audioFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
}).single('audio');

// Middleware to handle both uploads
export const uploadPodcastFiles = (req, res, next) => {
  uploadPodcastImage(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    uploadPodcastAudio(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  });
};
