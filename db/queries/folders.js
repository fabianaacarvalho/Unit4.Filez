import db from "#db/client";

export async function createFolder(name) {
  const sql = `
  INSERT INTO folders
    (name)
  VALUES
    ($1)
  RETURNING *
  `;

  const {
    rows: [folder],
  } = await db.query(sql, [name]);
  return folder;
}

export async function getFolders() {
  const sql = `
  SELECT *
  FROM folders
  `;
  const { rows: folders } = await db.query(sql);
  return folders;
}

export async function getFolderByIdIncludingFiles(id) {
  const sql = `
  SELECT
    *,
    (
      SELECT json_agg(files)
      FROM files
      WHERE files.folder_id = folders.id
    ) as files
  FROM folders
  WHERE id = $1
  `;
  const {
    rows: [folder],
  } = await db.query(sql, [id]);
  return folder;
}
