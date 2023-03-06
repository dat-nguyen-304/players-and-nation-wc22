const multer = require('multer');
import path from 'path';

const storageUser = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/public/uploads/users")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
const uploadUser = multer({
    storage: storageUser
})

const storageNation = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/public/uploads/nations")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
const uploadNation = multer({
    storage: storageNation
})

const storagePlayer = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/public/uploads/players")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
const uploadPlayer = multer({
    storage: storagePlayer
})

export { uploadNation, uploadUser, uploadPlayer };