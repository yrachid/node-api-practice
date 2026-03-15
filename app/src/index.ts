import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.json({
    ok: true,
  });
});

app.listen(3001, () => {
  console.log("up");
});
