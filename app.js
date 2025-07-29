import express from "express";
const app = express();
export default app;

import foldersRouter from "#api/folders";
import filesRouter from "#api/files";

app.use(express.json());

app.use("/files", filesRouter);
app.use("/folders", foldersRouter);

// PostgreSQL errors have codes that we can check to send better
// error messages to the client.
app.use((err, req, res, next) => {
  // Unique constraint violation
  if (err.code === "23505") {
    return res.status(400).send(err.detail);
  }

  next(err);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
