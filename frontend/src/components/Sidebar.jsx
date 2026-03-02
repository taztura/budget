import { useRef, useEffect, useState } from "react";

// ── SVG Icons ────────────────────────────────────────────────────────────────
function Icon({ d, size=20, stroke="#5F6368", strokeWidth=1.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {Array.isArray(d) ? d.map((p,i) => <path key={i} d={p}/>) : <path d={d}/>}
    </svg>
  );
}

const ICONS = {
  dashboard: [
    "M3 3h7v7H3z",
    "M14 3h7v7h-7z",
    "M3 14h7v7H3z",
    "M14 14h7v7h-7z"
  ],
  list: [
    "M9 6h11",
    "M9 12h11",
    "M9 18h11",
    "M4 6h.01M4 12h.01M4 18h.01"
  ],
  tags: [
    "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z",
    "M7 7h.01"
  ],
  compose: [
    "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
    "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
  ],
  backup: [
    "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
    "M7 10l5 5 5-5",
    "M12 15V3"
  ],
  restore: [
    "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
    "M17 8l-5-5-5 5",
    "M12 3v12"
  ],
  menu: "M3 12h18M3 6h18M3 18h18",
  plus: "M12 5v14M5 12h14",
  more: "M12 5v.01M12 12v.01M12 19v.01",
  logo: [
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z",
    "M12 6v6l4 2"
  ],
};

const NAV = [
  { id:"dashboard", label:"Dashboard" },
  { id:"list",      label:"Lista"     },
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

// ── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ small }) {
  return (
    <div style={{display:"flex", alignItems:"center", gap:9}}>
      <div style={{
        width: small ? 28 : 32, height: small ? 28 : 32,
        borderRadius:8, background:"linear-gradient(135deg,#1A73E8,#0D47A1)",
        display:"flex", alignItems:"center", justifyContent:"center",
        flexShrink:0, boxShadow:"0 2px 6px rgba(26,115,232,.35)"
      }}>
        <svg width={small?16:18} height={small?16:18} viewBox="0 0 24 24" fill="none"
          stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      </div>
      {!small && (
        <span style={{
          fontFamily:"'DM Sans',sans-serif", fontSize:17, fontWeight:700,
          color:"#1a1a2e", letterSpacing:"-.4px", whiteSpace:"nowrap"
        }}>
          Budget
        </span>
      )}
    </div>
  );
}

// ── MOBILE ───────────────────────────────────────────────────────────────────
function MobileLayout({ tab, setTab, onAdd, onExport, onImport, children }) {
  const fileRef = useRef();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div style={{display:"flex", flexDirection:"column", minHeight:"100vh", background:"#F1F3F4"}}>

      {/* Top header */}
      <header style={{
        position:"sticky", top:0, zIndex:200,
        background:"#fff", borderBottom:"1px solid #E8EAED",
        height:56, display:"flex", alignItems:"center",
        padding:"0 16px", justifyContent:"space-between",
        boxShadow:"0 1px 3px rgba(0,0,0,.08)"
      }}>
        <Logo/>
        <button onClick={()=>setDrawerOpen(true)} style={{
          width:36, height:36, borderRadius:"50%", border:"none",
          background:"transparent", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center"
        }}>
          <Icon d={ICONS.more} stroke="#5F6368" size={22}/>
        </button>
      </header>

      <main style={{flex:1, padding:"16px 16px 80px", overflowX:"hidden"}}>
        {children}
      </main>

      {/* Bottom nav */}
      <nav style={{
        position:"fixed", bottom:0, left:0, right:0, zIndex:200,
        background:"#fff", borderTop:"1px solid #E8EAED",
        display:"flex", alignItems:"center",
        height:60, paddingBottom:"env(safe-area-inset-bottom)"
      }}>
        {NAV.map(({id, label}) => {
          const active = tab === id;
          return (
            <button key={id} onClick={()=>setTab(id)} style={{
              flex:1, display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:4,
              border:"none", background:"transparent", cursor:"pointer",
              color: active ? "#1A73E8" : "#9AA0A6",
              padding:"6px 0", transition:"color .15s"
            }}>
              <Icon d={ICONS[id]} stroke={active?"#1A73E8":"#9AA0A6"} strokeWidth={active?2:1.7} size={20}/>
              <span style={{fontSize:10, fontWeight: active?700:500, fontFamily:"'DM Sans',sans-serif"}}>{label}</span>
            </button>
          );
        })}

        {/* FAB */}
        <button onClick={onAdd} style={{
          position:"absolute", right:16, bottom:68,
          width:52, height:52, borderRadius:"50%",
          background:"#1A73E8", color:"#fff", border:"none",
          cursor:"pointer", boxShadow:"0 4px 12px rgba(26,115,232,.4)",
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"transform .15s, box-shadow .15s"
        }}
          onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.08)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";}}
        >
          <Icon d={ICONS.plus} stroke="#fff" strokeWidth={2.2} size={22}/>
        </button>
      </nav>

      {/* Drawer */}
      {drawerOpen && (
        <>
          <div onClick={()=>setDrawerOpen(false)} style={{
            position:"fixed", inset:0, background:"rgba(0,0,0,.3)", zIndex:300,
            animation:"oi .2s ease"
          }}/>
          <div style={{
            position:"fixed", bottom:0, left:0, right:0, zIndex:301,
            background:"#fff", borderRadius:"20px 20px 0 0",
            padding:"12px 0 32px", animation:"slideUp .25s ease"
          }}>
            <div style={{width:36, height:4, background:"#DADCE0", borderRadius:2, margin:"0 auto 20px"}}/>
            {[
              { icon: ICONS.backup,  label:"Esporta backup",    action:()=>{ onExport(); setDrawerOpen(false); } },
              { icon: ICONS.restore, label:"Ripristina backup", action:()=>{ fileRef.current.click(); setDrawerOpen(false); } },
            ].map(({icon,label,action}) => (
              <button key={label} onClick={action} style={{
                display:"flex", alignItems:"center", gap:16,
                width:"100%", padding:"14px 24px", border:"none",
                background:"transparent", cursor:"pointer",
                fontSize:15, color:"#3C4043", fontWeight:500,
                fontFamily:"'DM Sans',sans-serif"
              }}>
                <Icon d={icon} stroke="#5F6368" size={20}/>
                {label}
              </button>
            ))}
          </div>
        </>
      )}
      <input ref={fileRef} type="file" accept=".json"
        onChange={e=>{ onImport(e); e.target.value=""; }} style={{display:"none"}}/>
    </div>
  );
}

// ── DESKTOP ──────────────────────────────────────────────────────────────────
function DesktopLayout({ tab, setTab, collapsed, setCollapsed, onAdd, onExport, onImport, children }) {
  const fileRef = useRef();
  const W = collapsed ? 64 : 220;

  function NavBtn({ id, label }) {
    const active = tab === id;
    return (
      <button onClick={()=>setTab(id)} style={{
        display:"flex", alignItems:"center", gap:14,
        justifyContent: collapsed ? "center" : "flex-start",
        width: collapsed ? 44 : "100%", height:44,
        padding: collapsed ? 0 : "0 14px",
        borderRadius:12, border:"none", cursor:"pointer",
        background: active ? "#E8F0FE" : "transparent",
        color: active ? "#1A73E8" : "#3C4043",
        fontWeight: active ? 700 : 500,
        fontSize:14, transition:"background .15s", marginBottom:2,
        fontFamily:"'DM Sans',sans-serif"
      }}
        onMouseEnter={e=>{ if(!active) e.currentTarget.style.background="#F1F3F4"; }}
        onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent"; }}
      >
        <Icon d={ICONS[id]} stroke={active?"#1A73E8":"#5F6368"} strokeWidth={active?2:1.7} size={19}/>
        {!collapsed && <span style={{whiteSpace:"nowrap"}}>{label}</span>}
      </button>
    );
  }

  return (
    <div style={{display:"flex", minHeight:"100vh", background:"#F1F3F4"}}>
      <aside style={{
        width:W, minHeight:"100vh", background:"#fff",
        borderRight:"1px solid #E8EAED", display:"flex", flexDirection:"column",
        transition:"width .2s ease", overflow:"hidden",
        position:"fixed", top:0, left:0, bottom:0, zIndex:200
      }}>

        {/* Header */}
        <div style={{height:64, display:"flex", alignItems:"center",
          padding: collapsed ? "0 10px" : "0 8px 0 14px", gap:10}}>
          <button onClick={()=>setCollapsed(c=>!c)} style={{
            width:40, height:40, borderRadius:10, border:"none",
            background:"transparent", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            flexShrink:0, transition:"background .15s"
          }}
            onMouseEnter={e=>e.currentTarget.style.background="#F1F3F4"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
          >
            <Icon d={ICONS.menu} stroke="#5F6368" size={20}/>
          </button>
          {!collapsed && <Logo/>}
        </div>

        {/* Compose */}
        <div style={{padding: collapsed ? "4px 10px" : "4px 12px", marginBottom:12}}>
          <button onClick={onAdd} style={{
            display:"flex", alignItems:"center", gap:12,
            justifyContent: collapsed ? "center" : "flex-start",
            width: collapsed ? 44 : "100%", height:44,
            padding: collapsed ? 0 : "0 16px",
            borderRadius:12, border:"none", cursor:"pointer",
            background:"#1A73E8", color:"#fff",
            fontWeight:700, fontSize:14,
            boxShadow:"0 1px 4px rgba(26,115,232,.4)",
            transition:"all .2s", fontFamily:"'DM Sans',sans-serif"
          }}
            onMouseEnter={e=>e.currentTarget.style.boxShadow="0 3px 10px rgba(26,115,232,.5)"}
            onMouseLeave={e=>e.currentTarget.style.boxShadow="0 1px 4px rgba(26,115,232,.4)"}
          >
            <Icon d={ICONS.compose} stroke="#fff" strokeWidth={2} size={17}/>
            {!collapsed && <span>Aggiungi</span>}
          </button>
        </div>

        {/* Nav */}
        <nav style={{flex:1, padding: collapsed ? "0 10px" : "0 12px"}}>
          {NAV.map(n => <NavBtn key={n.id} {...n}/>)}
        </nav>

        {/* Bottom */}
        <div style={{padding: collapsed ? "12px 10px" : "12px 12px", borderTop:"1px solid #E8EAED"}}>
          {[
            { icon:ICONS.backup,  label:"Backup",     action:onExport },
            { icon:ICONS.restore, label:"Ripristina", action:()=>fileRef.current.click() },
          ].map(({icon,label,action}) => (
            <button key={label} onClick={action} style={{
              display:"flex", alignItems:"center", gap:14,
              justifyContent: collapsed ? "center" : "flex-start",
              width: collapsed ? 44 : "100%", height:40,
              padding: collapsed ? 0 : "0 14px",
              borderRadius:10, border:"none", cursor:"pointer",
              background:"transparent", color:"#5F6368",
              fontSize:13, fontWeight:500, transition:"background .15s", marginBottom:2,
              fontFamily:"'DM Sans',sans-serif"
            }}
              onMouseEnter={e=>e.currentTarget.style.background="#F1F3F4"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <Icon d={icon} stroke="#5F6368" size={17}/>
              {!collapsed && <span style={{whiteSpace:"nowrap"}}>{label}</span>}
            </button>
          ))}
        </div>
        <input ref={fileRef} type="file" accept=".json"
          onChange={e=>{ onImport(e); e.target.value=""; }} style={{display:"none"}}/>
      </aside>

      <div style={{width:W, flexShrink:0, transition:"width .2s ease"}}/>

      <main style={{flex:1, padding:"24px 28px", overflowX:"hidden"}}>
        {children}
      </main>
    </div>
  );
}

// ── EXPORT ───────────────────────────────────────────────────────────────────
export default function Sidebar(props) {
  const isMobile = useIsMobile();
  const { children, collapsed, setCollapsed, ...rest } = props;
  if (isMobile) return <MobileLayout {...rest}>{children}</MobileLayout>;
  return <DesktopLayout {...rest} collapsed={collapsed} setCollapsed={setCollapsed}>{children}</DesktopLayout>;
}
