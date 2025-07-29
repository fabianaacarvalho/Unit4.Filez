import db from "./db/client.js";

import express from "express";
const app = express();
export default app;

app.use(express.json());

//GET /files
app.route("/files").get(async (req, res) => {
  const { rows: files } = await db.query(`
      SELECT 
        files.*,
        folders.name AS folder_name
      FROM 
        files
      JOIN folders ON folders.id = files.folder_id;
    `);
  res.json(files);
});

//GET /folders
app.route("/folders").get(async (req, res) => {
  const { rows: folders } = await db.query("SELECT * FROM folders");
  res.json(folders);
});

//GET /folders/:id
app.route("/folders/:id").get(async (req, res) => {
  const { id } = req.params;

  const {
    rows: [folder],
  } = await db.query("SELECT * FROM folders WHERE id = $1", [id]);

  if (!folder) return res.status(404).send({ error: "Folder not found" });

  const {
    rows: [result],
  } = await db.query(
    `SELECT json_agg(f) AS files FROM (SELECT * FROM files WHERE folder_id = $1) f`,
    [id]
  );
  folder.files = result.files ?? [];
  res.json(folder);
});

//POST /folders/:id/files
app.route("/folders/:id/files").post(async (req, res) => {
  const { id } = req.params;

  if (!req.body) {
    return res.status(400).send({ error: "Request body is missing" });
  }
  const { name, size } = req.body;
  const {
    rows: [folder],
  } = await db.query("SELECT * FROM folders WHERE id = $1", [id]);

  if (!folder) return res.status(404).send({ error: "Folder not found" });

  if (!name || size == null) {
    return res.status(400).send({ error: "Missing name or size" });
  }

  const {
    rows: [file],
  } = await db.query(
    `INSERT INTO files (name, size, folder_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
    [name, size, id]
  );
  res.status(201).json(file);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong :(");
});
