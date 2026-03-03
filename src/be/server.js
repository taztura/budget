import express from "express";
import cors from "cors";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { initDb, persist, query, run, parseRecord } from "./database.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app  = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// dist viene copiata nella root del progetto dal build script
const DIST = join(__dirname, "../../dist");
app.use(express.static(DIST));

await initDb();

// ── RECORDS ──────────────────────────────────────────────────────────────────
app.get("/records", (req, res) => {
  res.json(query("SELECT * FROM records ORDER BY date DESC").map(parseRecord));
});

app.post("/records", (req, res) => {
  const { date, description, amount, type, tags = [], note = "" } = req.body;
  if (!date || !description || amount == null || !type)
    return res.status(400).json({ error: "Campi obbligatori mancanti" });
  const id = run(
    "INSERT INTO records (date,description,amount,type,tags,note) VALUES (?,?,?,?,?,?)",
    [date, description, amount, type, JSON.stringify(tags), note]
  );
  persist();
  res.status(201).json(parseRecord(query("SELECT * FROM records WHERE id=?", [id])[0]));
});

app.put("/records/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { date, description, amount, type, tags = [], note = "" } = req.body;
  if (!date || !description || amount == null || !type)
    return res.status(400).json({ error: "Campi obbligatori mancanti" });
  run(
    "UPDATE records SET date=?,description=?,amount=?,type=?,tags=?,note=? WHERE id=?",
    [date, description, amount, type, JSON.stringify(tags), note, id]
  );
  persist();
  const updated = query("SELECT * FROM records WHERE id=?", [id])[0];
  if (!updated) return res.status(404).json({ error: "Record non trovato" });
  res.json(parseRecord(updated));
});

app.delete("/records/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (!query("SELECT id FROM records WHERE id=?", [id])[0])
    return res.status(404).json({ error: "Record non trovato" });
  run("DELETE FROM records WHERE id=?", [id]);
  persist();
  res.status(204).send();
});

// ── TAGS ─────────────────────────────────────────────────────────────────────
app.get("/tags", (req, res) => {
  res.json(query("SELECT * FROM tags ORDER BY name ASC"));
});

app.post("/tags", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Nome tag obbligatorio" });
  run("INSERT OR IGNORE INTO tags (name) VALUES (?)", [name]);
  persist();
  res.status(201).json(query("SELECT * FROM tags WHERE name=?", [name])[0]);
});

app.delete("/tags/:name", (req, res) => {
  if (!query("SELECT id FROM tags WHERE name=?", [req.params.name])[0])
    return res.status(404).json({ error: "Tag non trovato" });
  run("DELETE FROM tags WHERE name=?", [req.params.name]);
  persist();
  res.status(204).send();
});

// ── BACKUP / RESTORE ─────────────────────────────────────────────────────────
app.get("/backup", (req, res) => {
  res.json({
    records: query("SELECT * FROM records ORDER BY date DESC").map(parseRecord),
    tags:    query("SELECT name FROM tags ORDER BY name").map(t => t.name)
  });
});

app.post("/restore", (req, res) => {
  const { records = [], tags = [] } = req.body;
  run("DELETE FROM records");
  run("DELETE FROM tags");
  for (const r of records)
    run("INSERT INTO records (date,description,amount,type,tags,note) VALUES (?,?,?,?,?,?)",
      [r.date||"", r.description||"", r.amount||0, r.type||"uscita", JSON.stringify(r.tags||[]), r.note||""]);
  for (const t of tags)
    run("INSERT OR IGNORE INTO tags (name) VALUES (?)", [typeof t==="string"?t:t.name]);
  persist();
  res.status(204).send();
});

// ── Fallback React ────────────────────────────────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(join(DIST, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Budget avviato su http://localhost:${PORT}`);
});
