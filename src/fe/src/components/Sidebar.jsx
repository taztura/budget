import { useRef, useEffect, useState } from "react";

function Icon({ d, size=18, stroke="currentColor", strokeWidth=1.75 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {Array.isArray(d) ? d.map((p,i) => <path key={i} d={p}/>) : <path d={d}/>}
    </svg>
  );
}

const ICONS = {
  dashboard: ["M3 3h7v7H3z","M14 3h7v7h-7z","M3 14h7v7H3z","M14 14h7v7h-7z"],
  list:      ["M9 6h11","M9 12h11","M9 18h11","M4 6h.01M4 12h.01M4 18h.01"],
  tags:      ["M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z","M7 7h.01"],
  compose:   ["M12 5v14M5 12h14"],
  backup:    ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"],
  restore:   ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M17 8l-5-5-5 5","M12 3v12"],
  menu:      "M3 12h18M3 6h18M3 18h18",
  more:      "M12 5v.01M12 12v.01M12 19v.01",
};

const NAV = [
  { id:"dashboard", label:"Dashboard" },
  { id:"list",      label:"Movimenti" },
  { id:"tags",      label:"Tag"       },
];

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

/* Logo identico allo stile Cloudflare: icona arancione + testo bold */
function Logo() {
  return (
    <div className="logo">
      <div className="logo__icon" style={{width:30, height:30}}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
          stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      </div>
      <span className="logo__text">Budget</span>
    </div>
  );
}

/* ── MOBILE ─────────────────────────────────────────────────────────────────── */
function MobileLayout({ tab, setTab, onAdd, onExport, onImport, children }) {
  const fileRef = useRef();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="mobile-layout">
      <header className="mobile-header">
        <Logo/>
        <button className="mobile-header__btn" onClick={()=>setDrawerOpen(true)}>
          <Icon d={ICONS.more} size={20} stroke="#6e6e76"/>
        </button>
      </header>

      <main className="mobile-main">{children}</main>

      <nav className="mobile-nav">
        {NAV.map(({id, label}) => {
          const active = tab === id;
          return (
            <button key={id} onClick={()=>setTab(id)}
              className={`mobile-nav__btn${active?" mobile-nav__btn--active":""}`}>
              <Icon d={ICONS[id]} size={19} stroke={active?"#f6821f":"#9898a0"} strokeWidth={active?2:1.75}/>
              <span className={`mobile-nav__label${active?" mobile-nav__label--active":""}`}>{label}</span>
            </button>
          );
        })}
        <button className="mobile-fab" onClick={onAdd}>
          <Icon d={ICONS.compose} stroke="#fff" strokeWidth={2.5} size={22}/>
        </button>
      </nav>

      {drawerOpen && (
        <>
          <div className="drawer-overlay" onClick={()=>setDrawerOpen(false)}/>
          <div className="drawer">
            <div className="drawer__handle"/>
            {[
              { icon:ICONS.backup,  label:"Esporta backup",    action:()=>{ onExport(); setDrawerOpen(false); } },
              { icon:ICONS.restore, label:"Ripristina backup", action:()=>{ fileRef.current.click(); setDrawerOpen(false); } },
            ].map(({icon,label,action}) => (
              <button key={label} className="drawer__btn" onClick={action}>
                <Icon d={icon} size={17} stroke="#404045"/>
                {label}
              </button>
            ))}
          </div>
        </>
      )}
      <input ref={fileRef} type="file" accept=".json" style={{display:"none"}}
        onChange={e=>{ onImport(e); e.target.value=""; }}/>
    </div>
  );
}

/* ── DESKTOP ────────────────────────────────────────────────────────────────── */
function DesktopLayout({ tab, setTab, collapsed, setCollapsed, onAdd, onExport, onImport, children }) {
  const fileRef = useRef();
  const W = collapsed ? 54 : 220;
  const justify  = collapsed ? "center" : "flex-start";
  const btnWidth = collapsed ? 36 : "100%";
  const btnPad   = collapsed ? 0 : collapsed ? 0 : "0 12px";
  /* nav active ha border-left: compensiamo con padding-left ridotto */
  const activePad = collapsed ? 0 : "0 12px 0 9px";

  return (
    <div className="desktop-layout">
      <aside className="sidebar" style={{width:W}}>

        {/* Header con bordo arancione in basso — come Cloudflare */}
        <div className="sidebar__header" style={{padding: collapsed ? "0 9px" : "0 8px 0 14px"}}>
          <button className="sidebar__hamburger" onClick={()=>setCollapsed(c=>!c)}>
            <Icon d={ICONS.menu} size={18} stroke="#6e6e76"/>
          </button>
          {!collapsed && <Logo/>}
        </div>

        {/* Pulsante aggiungi */}
        <div className="sidebar__compose-wrap">
          <button className="sidebar__compose" onClick={onAdd}
            style={{width:btnWidth, padding: collapsed ? 0 : "0 14px", justifyContent:justify}}>
            <Icon d={ICONS.compose} stroke="#fff" strokeWidth={2.5} size={17}/>
            {!collapsed && <span>Aggiungi</span>}
          </button>
        </div>

        {/* Navigazione */}
        <nav className="sidebar__nav">
          {NAV.map(({id, label}) => {
            const active = tab === id;
            return (
              <button key={id} onClick={()=>setTab(id)}
                className={`nav-btn${active?" nav-btn--active":""}`}
                style={{
                  width: btnWidth,
                  padding: active && !collapsed ? activePad : btnPad,
                  justifyContent: justify
                }}>
                <Icon d={ICONS[id]} size={17}
                  stroke={active ? "#f6821f" : "#6e6e76"}
                  strokeWidth={active ? 2.1 : 1.75}/>
                {!collapsed && <span>{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar__bottom">
          {[
            { icon:ICONS.backup,  label:"Backup",     action:onExport },
            { icon:ICONS.restore, label:"Ripristina", action:()=>fileRef.current.click() },
          ].map(({icon,label,action}) => (
            <button key={label} className="action-btn" onClick={action}
              style={{width:btnWidth, padding:btnPad, justifyContent:justify}}>
              <Icon d={icon} size={16} stroke="#9898a0"/>
              {!collapsed && <span>{label}</span>}
            </button>
          ))}
        </div>

        <input ref={fileRef} type="file" accept=".json" style={{display:"none"}}
          onChange={e=>{ onImport(e); e.target.value=""; }}/>
      </aside>

      <div className="sidebar-spacer" style={{width:W}}/>
      <main className="desktop-main">{children}</main>
    </div>
  );
}

export default function Sidebar(props) {
  const isMobile = useIsMobile();
  const { children, collapsed, setCollapsed, ...rest } = props;
  if (isMobile) return <MobileLayout {...rest}>{children}</MobileLayout>;
  return <DesktopLayout {...rest} collapsed={collapsed} setCollapsed={setCollapsed}>{children}</DesktopLayout>;
}
