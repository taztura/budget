# 💶 Budget — Gestione spese personali

App per tracciare entrate e uscite con tag, grafici e filtri per anno/mese.  
Stack: **React + Vite** (fe) · **Node.js + Express + SQLite** (be)

---

## Struttura del progetto

```
budget/
├── src/
│   ├── be/               ← Backend Node.js
│   │   ├── server.js
│   │   └── database.js
│   └── fe/               ← Frontend React
│       ├── index.html
│       ├── vite.config.js
│       ├── package.json
│       └── src/
│           ├── App.jsx
│           ├── api.js
│           ├── constants.js
│           ├── index.css
│           ├── main.jsx
│           └── components/
├── package.json          ← Root: dipendenze be + script build/start
├── railway.json          ← Config Railway
├── spesemese.db          ← Database SQLite (creato al primo avvio)
└── .gitignore
```

---

## 🚀 Deploy su Railway

### Prerequisiti
- Account su [railway.app](https://railway.app)
- Git installato
- Node.js 18+

### Passo 1 — Crea il repo Git
```bash
cd budget
git init
git add .
git commit -m "first commit"
```

### Passo 2 — Pubblica su GitHub
1. Vai su [github.com/new](https://github.com/new) → crea repo `budget` (privato)
2. Collega e pusha:
```bash
git remote add origin https://github.com/TUO_USERNAME/budget.git
git branch -M main
git push -u origin main
```

### Passo 3 — Deploy su Railway
1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Seleziona `budget`
3. Attendi 2-3 minuti — Railway esegue automaticamente:
   ```
   npm run build   ← compila il frontend in dist/
   npm start       ← avvia Express su src/be/server.js
   ```

### Passo 4 — URL pubblico
**Settings → Networking → Generate Domain**  
→ `https://budget-production-xxxx.up.railway.app`

### Aggiornamenti futuri
```bash
git add .
git commit -m "descrizione"
git push
# Railway redeploya automaticamente
```

---

## 💻 Sviluppo locale

**Terminale 1 — Backend:**
```bash
npm install
npm run dev
# → http://localhost:8000
```

**Terminale 2 — Frontend:**
```bash
cd src/fe
npm install
npm run dev
# → http://localhost:5173
```

Il proxy in `vite.config.js` instrada le chiamate API al backend automaticamente.

### Build locale (simula produzione)
```bash
npm run build   # compila fe → dist/
npm start       # tutto su http://localhost:8000
```

---

## 💾 Database persistente su Railway

Di default il DB viene perso ad ogni redeploy. Per renderlo persistente:

1. Dashboard Railway → **+ New** → **Volume** → Mount Path: `/app/data`
2. **Variables** → aggiungi:
   - Key: `DB_PATH`  
   - Value: `/app/data/spesemese.db`

---

## 🔄 Avvio automatico su macOS

```bash
chmod +x install-service.sh && ./install-service.sh
# Per rimuovere:
./uninstall-service.sh
```

---

## 📦 Tech stack

| Layer    | Tecnologia                        |
|----------|-----------------------------------|
| Frontend | React 18, Vite 5, Recharts        |
| Backend  | Node.js 18+, Express 4, sql.js    |
| Database | SQLite (tramite sql.js WASM)      |
| Deploy   | Railway                           |
