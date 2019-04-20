const db = require("./db");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.use("/realbooks/", express.static("client/build"));
app.use(bodyParser.json());

const searchQuery =
    "SELECT id, song_name, book_name, page_number FROM master_index ORDER BY similarity(song_name, $1) DESC LIMIT 25";

app.get("/realbooks/api/songs/:query", async (req, res) => {
    try {
        const data = await db.query(searchQuery, [req.params.query]);
        res.send(data.rows);
    } catch (error) {
        res.send({
            error: true,
            message: error.message
        });
    }
});

app.get("/realbooks/api/song/:id", async (req, res) => {
    try {
        if (isNaN(parseInt(req.params.id), 10))
            throw Error("Id must be a number");
        const data = await db.query(
            "SELECT file_name FROM master_index WHERE id=$1",
            [req.params.id]
        );
        if (data.rowCount <= 0) throw Error("Song with that id does not exist");
        res.sendFile(path.join(__dirname, data.rows[0].file_name));
    } catch (error) {
        res.send({
            error: true,
            message: error.message
        });
    }
});

app.get("/realbooks/*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.listen(6000);
