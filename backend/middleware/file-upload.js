const multer = require('multer');
const path = require('path');


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, '../public/uploads'));
//     },
//     filename: function (req, file, cb) {
//             cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//     }
// });

// const filesUpload = multer({
//     storage,
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//             cb(null, true);
//         } else {
//             cb(null, false);
//             const err = new Error('Only .png, .jpg and .jpeg format allowed!')
//             err.name = 'ExtensionError'
//             return cb(err);
//         }
//     },   
// });

const storage = multer.diskStorage({
    destination: "../public/uploads",
    filename: (req, file, callback) => {
        callback(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const filesUpload = multer({
    storage: storage,
});

module.exports = filesUpload;