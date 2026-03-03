import { useState, useMemo, useEffect } from "react";
import { loadAll, createRecord, updateRecord, deleteRecord, createTag, deleteTag, getBackup, postRestore } from "./api.js";
import { emptyForm, getYear } from "./constants.js";

import Sidebar     from "./components/Sidebar.jsx";
import YearPills   from "./components/YearPills.jsx";
import Toast       from "./components/Toast.jsx";
import RecordModal from "./components/RecordModal.jsx";
import Dashboard   from "./components/Dashboard.jsx";
import ListView    from "./components/ListView.jsx";
import TagsView    from "./components/TagsView.jsx";

export default function App() {
  const [records,   setRecords]   = useState([]);
  const [allTags,   setAllTags]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [tab,       setTab]       = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [filters,   setFilters]   = useState({ year:"", month:"", type:"", tag:"", q:"" });
  const [modal,     setModal]     = useState(null);
  const [form,      setForm]      = useState(emptyForm());
  const [toast,     setToast]     = useState(null);

  useEffect(() => { reload(); }, []);

  async function reload() {
    setLoading(true); setError(null);
    try {
      const data = await loadAll();
      setRecords(data.records);
      setAllTags(data.tags);
    } catch {
      setError("Impossibile connettersi al backend. Assicurati che il server sia avviato su http://localhost:8000");
    } finally { setLoading(false); }
  }

  function showToast(msg, type="ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }

  function openAdd()    { setForm(emptyForm()); setModal("add"); }
  function openEdit(r)  { setForm({ ...r, amount: String(r.amount) }); setModal(r.id); }
  function closeModal() { setModal(null); }

  async function saveForm() {
    if (!form.description.trim()) return showToast("Inserisci una descrizione", "err");
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) return showToast("Importo non valido", "err");
    const entry = { date:form.date, description:form.description, amount:amt, type:form.type, tags:form.tags, note:form.note };
    try {
      if (modal === "add") { await createRecord(entry); showToast(form.type==="entrata" ? "Entrata aggiunta ✓" : "Uscita aggiunta ✓"); }
      else                 { await updateRecord(modal, entry); showToast("Aggiornato ✓"); }
      closeModal(); reload();
    } catch { showToast("Errore nel salvataggio", "err"); }
  }

  async function handleDeleteRecord(id) {
    try { await deleteRecord(id); showToast("Eliminato", "warn"); closeModal(); reload(); }
    catch { showToast("Errore nell'eliminazione", "err"); }
  }

  async function handleAddTag(name) {
    if (!allTags.includes(name)) {
      try { await createTag(name); setAllTags(p => [...p, name]); }
      catch { showToast("Errore nella creazione del tag", "err"); }
    }
  }

  async function handleDeleteTag(name) {
    try { await deleteTag(name); setAllTags(p => p.filter(t => t !== name)); }
    catch { showToast("Errore nell'eliminazione del tag", "err"); }
  }

  async function handleExport() {
    try {
      const data = await getBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type:"application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "budget-backup.json"; a.click();
      showToast("Backup esportato ✓");
    } catch { showToast("Errore nel backup", "err"); }
  }

  async function handleImport(e) {
    const file = e.target.files[0]; if (!file) return;
    try {
      await postRestore(JSON.parse(await file.text()));
      showToast("Backup ripristinato ✓"); reload();
    } catch { showToast("File non valido o errore nel ripristino", "err"); }
  }

  const availableYears = useMemo(() =>
    [...new Set(records.map(r => getYear(r.date)).filter(Boolean))].sort().reverse(),
    [records]
  );
  const yearLabel = filters.year || (availableYears[0] ?? new Date().getFullYear().toString());
  const TAB_TITLES = { dashboard:"Dashboard", list:"Lista movimenti", tags:"Gestione tag" };

  if (loading) return <div className="app-loading">Caricamento…</div>;

  if (error) return (
    <div className="app-error">
      <div className="app-error__icon">⚠️</div>
      <div className="app-error__title">{error}</div>
      <div className="app-error__code">cd backend<br/>npm install<br/>npm run dev</div>
      <button className="app-error__btn" onClick={reload}>Riprova</button>
    </div>
  );

  return (
    <Sidebar tab={tab} setTab={setTab} collapsed={collapsed} setCollapsed={setCollapsed}
      onAdd={openAdd} onExport={handleExport} onImport={handleImport}>
      <Toast toast={toast}/>
      <RecordModal modal={modal} form={form} setForm={setForm} allTags={allTags}
        onSave={saveForm} onDelete={handleDeleteRecord} onClose={closeModal} onAddTag={handleAddTag}/>
      <h1 className="page-title">{TAB_TITLES[tab]}</h1>
      {tab !== "tags" && (
        <YearPills availableYears={availableYears} selectedYear={filters.year}
          onChange={y => setFilters(f => ({ ...f, year:y }))}/>
      )}
      {tab === "dashboard" && (
        <Dashboard records={records} allTags={allTags} filters={filters}
          yearLabel={yearLabel} onEditRecord={openEdit} onViewAll={()=>setTab("list")}/>
      )}
      {tab === "list" && (
        <ListView records={records} allTags={allTags} filters={filters}
          setFilters={setFilters} onEditRecord={openEdit} onAdd={openAdd}/>
      )}
      {tab === "tags" && (
        <TagsView allTags={allTags} records={records}
          onAddTag={handleAddTag} onDeleteTag={handleDeleteTag}/>
      )}
    </Sidebar>
  );
}
