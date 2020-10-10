const Busboy = require("busboy");

exports.checkImage = (req, res, next) => {
    let busboy = new Busboy({ headers: req.headers });
    let media = false;

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        file.on('data', function (data) {
            media = true;
        })
    })

    busboy.on("finish", function () {
        req.media = media;
        return next();
    })
    
    busboy.end(req.rawBody);
}
