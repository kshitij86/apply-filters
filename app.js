const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');


// Set storage engine.
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, callback){
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {fileSize : 1000000000},
    fileFilter : function(req, file, callback){
        checkFileType(file, callback);
    }
}).single('m');

// Only images should be uploaded.
function checkFileType(file, callback){
    // Allowed extensions. 
    const fileTypes = /jpeg|jpg|png|gif/; 

    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    // Check its mime type.
    const mimetype = fileTypes.test(file.mimetype);
    
    if(mimetype && extname){
        callback(null, true);
    } else { 
        callback("That's not an image. Retry with one.");
    }
}

const app = express();

app.set('view engine', 'ejs');

// Template folder
app.use(express.static('./public'))

app.get('/', (req, res) => res.render('index')); 

// Catch the POST.
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err){ // If there is an error, show it in the same view.
            res.render('index', {
                msg: err
            });
        } else {
            if(req.file == undefined){
                res.render('index', {
                    msg: "You didn't select anything."
                });
            } else {
                res.render('index', {
                    msg: 'Done.',
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    });
});

const port = 5000;

app.listen(port, () => console.log(`Server started on ${port}`));
