var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/images"
);

module.exports.postImage = (url, username, title, description) => {
    const q = `
INSERT into images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *`;
    const params = [url, username, title, description];
    return db.query(q, params);
};

module.exports.getModalImage = (imageid) => {
    const q = `SELECT * FROM images WHERE id = ($1)`;
    const params = [imageid];
    return db.query(q, params);
};

module.exports.getImages = () => {
    const q = `
    SELECT * FROM images
    ORDER BY id DESC
    LIMIT 6;`;
    return db.query(q);
};

module.exports.getMoreImages = (lastImageId) => {
    const q = `
      SELECT url, title, id, (
      SELECT id FROM images
      ORDER BY id ASC
      LIMIT 1
  ) AS "lowestId" FROM images
  WHERE id < $1
  ORDER BY id DESC
  LIMIT 6;`;
    const params = [lastImageId];
    return db.query(q, params);
};

module.exports.getComments = (imageid) => {
    const q = `SELECT * FROM comments WHERE imageid = ($1)`;
    const params = [imageid];
    return db.query(q, params);
};

module.exports.postComment = (username, comment, imageid) => {
    const q = `
INSERT into comments (username, comment, imageid) VALUES ($1, $2, $3) RETURNING *`;
    const params = [username, comment, imageid];
    return db.query(q, params);
};
