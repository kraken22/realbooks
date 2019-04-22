const db = require("./db");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.use("/realbooks/", express.static("client/build"));
app.use(bodyParser.json());

const bookNames = [
  "RealBk1",
  "RealBk2",
  "RealBk3",
  "NewReal1",
  "NewReal2",
  "NewReal3",
  "Colorado",
  "EvansBk",
  "JazzFake",
  "JazzLTD",
  "Library"
];

const searchQuery =
  "SELECT id, song_name, book_name, page_number FROM master_index WHERE similarity(song_name, $1) > 0.1 ORDER BY similarity(song_name, $1) DESC LIMIT 15";

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
    if (isNaN(parseInt(req.params.id), 10)) throw Error("Id must be a number");
    const data = await db.query(
      "SELECT *, (SELECT page_number FROM master_index WHERE book_name='RealBk1' and page_number > (SELECT page_number FROM master_index WHERE id=$1) ORDER BY page_number LIMIT 1) - page_number + 1 as length FROM master_index WHERE id=$1;",
      [req.params.id]
    );
    if (data.rowCount <= 0) throw Error("Song with that id does not exist");
    res.send(data.rows[0]);
  } catch (error) {
    res.send({
      error: true,
      message: error.message
    });
  }
});

app.get("/realbooks/api/image/:book/:page", async (req, res) => {
  try {
    const { book, page } = req.params;
    if (!bookNames.includes(book)) throw Error("Invalid book name");
    if (isNaN(parseInt(page), 10)) throw Error("Invalid page number");
    const filepath = path.join(__dirname, "data", book, `${book}-${page}.jpeg`);
    res.sendFile(filepath);
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
