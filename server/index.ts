import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/status", (_, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.listen(3000, () => console.log("🌆 API running on http://localhost:3000"));
