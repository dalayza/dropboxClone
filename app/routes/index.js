var express = require('express');
var router = express.Router();
var formidable = require('formidable');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/upload', (req, res) => { // 4

  let form = new formidable.IncomingForm({ // formidable maneja archivos
    uploadDir: './upload',
    keepExtensions: true
  });

  form.parse(req, (err, fields, files) => {

    res.json({
      files
    }); 

  }); // interpreta los datos

});


module.exports = router;
