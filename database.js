import initSqlJs from "sql.js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || join(__dirname, "spesemese.db");

// sql.js lavora in memoria — salviamo su disco ad ogni scrittura
let db;

export async function initDb() {
  const SQL = await initSqlJs();

  if (existsSync(DB_PATH)) {
    // Carica il file esistente
    const fileBuffer = readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
    console.log("📂 DB caricato da", DB_PATH);
  } else {
    // Nuovo DB
    db = new SQL.Database();
    console.log("🆕 Nuovo DB creato");
  }

  // Crea tabelle
  db.run(`
    CREATE TABLE IF NOT EXISTS records (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      date        TEXT    NOT NULL,
      description TEXT    NOT NULL,
      amount      REAL    NOT NULL,
      type        TEXT    NOT NULL,
      tags        TEXT    NOT NULL DEFAULT '[]',
      note        TEXT    NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS tags (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT    NOT NULL UNIQUE
    );
  `);

  // Seed se vuoto
  const count = db.exec("SELECT COUNT(*) as n FROM records")[0]?.values[0][0] ?? 0;
  if (count === 0) {
    const sampleRecords = [
      ["2025-01-10", "Affitto",      900,   "uscita",  '["fisso"]',          ""],
      ["2025-01-15", "Esselunga",    87.5,  "uscita",  '["necessità"]',      ""],
      ["2025-01-25", "Stipendio",    2200,  "entrata", '["lavoro"]',          ""],
      ["2025-02-10", "Affitto",      900,   "uscita",  '["fisso"]',          ""],
      ["2025-02-18", "Cinema+cena",  62,    "uscita",  '["lusso"]',          ""],
      ["2025-02-25", "Stipendio",    2200,  "entrata", '["lavoro"]',          ""],
      ["2025-02-28", "Freelance",    450,   "entrata", '["lavoro","extra"]', ""],
      ["2025-03-10", "Affitto",      900,   "uscita",  '["fisso"]',          ""],
      ["2025-03-14", "Bolletta",     134,   "uscita",  '["fisso","utenze"]', ""],
      ["2025-03-25", "Stipendio",    2200,  "entrata", '["lavoro"]',          ""],
    ];
    for (const r of sampleRecords) {
      db.run("INSERT INTO records (date,description,amount,type,tags,note) VALUES (?,?,?,?,?,?)", r);
    }
    for (const t of ["fisso","variabile","necessità","lusso","lavoro","utenze","extra"]) {
      db.run("INSERT OR IGNORE INTO tags (name) VALUES (?)", [t]);
    }
    persist();
    console.log("✅ Seed completato");
  }

  return db;
}

// Salva il DB su disco (chiamato dopo ogni scrittura)
export function persist() {
  const data = db.export();
  writeFileSync(DB_PATH, Buffer.from(data));
}

// Helper: esegui una query e restituisci array di oggetti
export function query(sql, params = []) {
  const result = db.exec(sql, params);
  if (!result.length) return [];
  const { columns, values } = result[0];
  return values.map(row => {
    const obj = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  });
}

// Helper: esegui INSERT/UPDATE/DELETE e restituisci lastInsertRowid
export function run(sql, params = []) {
  db.run(sql, params);
  return db.exec("SELECT last_insert_rowid() as id")[0]?.values[0][0];
}

export function parseRecord(r) {
  return { ...r, tags: JSON.parse(r.tags) };
}
