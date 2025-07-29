import db from "#db/client";

import { createFile } from "#db/queries/files";
import { createFolder } from "#db/queries/folders";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  for (let i = 1; i <= 3; i++) {
    const folder = await createFolder("Folder " + i);
    for (let j = 1; j <= 5; j++) {
      await createFile("File " + j, 1000 * j, folder.id);
    }
  }
}
