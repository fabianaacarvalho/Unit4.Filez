import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

const folders = [{ name: "Folder1" }, { name: "Folder2" }, { name: "Folder3" }];

async function seed() {
  await db.query("DELETE FROM files");
  await db.query("DELETE FROM folders");

  // Insert folders
  for (const folder of folders) {
    const {
      rows: [f],
    } = await db.query(`INSERT INTO folders (name) VALUES ($1) RETURNING *`, [
      folder.name,
    ]);

    // Insert files into each folder
    for (let i = 1; i <= 5; i++) {
      await db.query(
        `INSERT INTO files (name, size, folder_id)
       VALUES ($1, $2, $3)`,
        [`${folder.name}_file${i}.txt`, i * 100, f.id]
      );
    }
  }
}
