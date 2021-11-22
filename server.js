const express = require("express");
const app = express();
const db = require("./db");
const { uploader } = require("./uploader.js");
app.use(express.static("public"));
app.use(express.json());
const s3 = require("./s3");

app.get("/modal/:imageid", (req, res) => {
    db.getModalImage(req.params.imageid)
        .then((response) => {
            res.json(response.rows);
        })
        .catch((err) => {
            console.log("error in getModalImage: ", err);
        });
});

app.get("/images", (req, res) => {
    db.getImages()
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getImages: ", err);
        });
});

app.get("/moreImages/:lastImageId", (req, res) => {
    db.getMoreImages(req.params.lastImageId)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getMoreImages: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    let fullURL =
        "https://radfarimagebucket.s3.amazonaws.com/" + req.file.filename;
    db.postImage(
        fullURL,
        req.body.username,
        req.body.title,
        req.body.description
    )
        .then((results) => {
            res.json(results.rows[0]);
        })
        .catch((err) => console.log("err in profile update: ", err));
});

app.post("/comment/:imageid", (req, res) => {
    console.log(req.body.username, req.body.comment, req.params.imageid);
    db.postComment(req.body.username, req.body.comment, req.params.imageid)
        .then((results) => {
            console.log("postComment results: ", results.rows);
            res.json(results.rows[0]);
        })
        .catch((err) => console.log("err in postComment: ", err));
});

app.get("/comments/:imageid", (req, res) => {
    console.log("req.params.imageid: ", req.params.imageid);
    db.getComments(req.params.imageid)
        .then((response) => {
            console.log("response: ", response.rows);
            res.json(response.rows);
        })
        .catch((err) => {
            console.log("error in getModalImage: ", err);
        });
});

app.listen(8080, () => console.log("Listening on 8080 imageBoard"));
