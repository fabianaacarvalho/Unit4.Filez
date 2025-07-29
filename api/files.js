import express from "express";
const router = express.Router();
export default router;

import { getFilesIncludingFolderName } from "#db/queries/files";

router.route("/").get(async (req, res) => {
  const files = await getFilesIncludingFolderName();
  res.send(files);
});
