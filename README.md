# 💶 Budget — Gestione spese personali

App per tracciare entrate e uscite con tag, grafici e filtri per anno/mese.  
Stack: **React + Vite** (frontend) · **Node.js + Express + SQLite** (backend)

---

## Struttura del progetto

```
budget/
├── server.js          ← Backend Express (API + serve frontend)
├── database.js        ← Setup SQLite con sql.js
├── package.json       ← Root: dipendenze backend + script build/start
├── railway.json       ← Configurazione Railway
├── .gitignore
└── frontend/          ← App React
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx
        ├── api.js
        ├── constants.js
        ├── main.jsx
        └── components/
```

---

## 🚀 Deploy su Railway (consigliato)

### Prerequisiti
- Account su [railway.app](https://railway.app) (gratuito)
- [Git](https://git-scm.com) installato
- [Node.js 18+](https://nodejs.org) installato

---

### Passo 1 — Crea un repository Git

```bash
# Entra nella cartella del progetto
cd budget

# Inizializza Git
git init
git add .
git commit -m "first commit"
```

---

### Passo 2 — Pubblica su GitHub

1. Vai su [github.com/new](https://github.com/new)
2. Crea un repository **privato** (consigliato) chiamato `budget`
3. Segui le istruzioni per collegare il repo locale:

```bash
git remote add origin https://github.com/TUO_USERNAME/budget.git
git branch -M main
git push -u origin main
```

---

### Passo 3 — Deploy su Railway

1. Vai su [railway.app](https://railway.app) e fai login
2. Clicca **"New Project"** → **"Deploy from GitHub repo"**
3. Seleziona il repository `budget`
4. Railway rileva automaticamente la configurazione da `railway.json`
5. Il deploy parte automaticamente — attendi 2-3 minuti

Railway eseguirà in ordine:
```
npm run build   ← compila il frontend React
npm start       ← avvia il server Express
```

---

### Passo 4 — Ottieni l'URL pubblico

1. Nel dashboard Railway, clicca sul tuo progetto
2. Vai su **Settings → Networking**
3. Clicca **"Generate Domain"**
4. Ottieni un URL tipo: `https://budget-production-xxxx.up.railway.app`

L'app è ora accessibile da qualsiasi dispositivo (PC, telefono, tablet).

---

### Aggiornamenti futuri

Ogni volta che vuoi aggiornare l'app:

```bash
git add .
git commit -m "descrizione modifiche"
git push
```

Railway rileva il push e fa il redeploy automaticamente.

---

## 💻 Sviluppo locale

### Avvio rapido

**Terminale 1 — Backend:**
```bash
npm install
npm run dev
# Server su http://localhost:8000
```

**Terminale 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
# App su http://localhost:5173
```

Grazie al proxy in `vite.config.js`, le chiamate API dal frontend vanno automaticamente al backend su porta 8000.

---

### Build locale (simula produzione)

```bash
# Dalla root del progetto
npm run build   # compila frontend in dist/
npm start       # avvia tutto su http://localhost:8000
```

---

## 🔄 Avvio automatico su macOS (locale)

Per avviare il backend automaticamente ad ogni login:

```bash
chmod +x install-service.sh
./install-service.sh
```

Per rimuovere:
```bash
./uninstall-service.sh
```

---

## ⚠️ Nota sul database su Railway

Railway usa un filesystem **effimero**: il file `spesemese.db` può essere perso ad ogni redeploy.

**Soluzioni:**

### Opzione A — Backup manuale (semplice)
Usa il pulsante **📤 Backup** nell'app prima di ogni deploy per scaricare un JSON con tutti i dati. Dopo il deploy usa **📥 Ripristina** per reimportarli.

### Opzione B — Volume persistente Railway (consigliato)
1. Nel dashboard Railway, vai su **"Add Service" → "Volume"**
2. Monta il volume su `/app/data`
3. Modifica `database.js` — cambia il percorso del DB:

```js
// Riga da modificare in database.js
const DB_PATH = process.env.DB_PATH || join(__dirname, "spesemese.db");
```

4. In Railway, aggiungi la variabile d'ambiente:
   - **Key:** `DB_PATH`
   - **Value:** `/app/data/spesemese.db`

---

## 📦 Tech stack

| Layer    | Tecnologia                        |
|----------|-----------------------------------|
| Frontend | React 18, Vite 5, Recharts        |
| Backend  | Node.js 18+, Express 4, sql.js    |
| Database | SQLite (tramite sql.js WASM)      |
| Deploy   | Railway (gratuito fino a 5$/mese) |

---

## 🔑 Variabili d'ambiente (opzionali)

| Variabile | Default        | Descrizione                    |
|-----------|----------------|--------------------------------|
| `PORT`    | `8000`         | Porta del server (Railway la imposta automaticamente) |
| `DB_PATH` | `./spesemese.db` | Percorso del file database   |
