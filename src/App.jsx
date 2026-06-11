import { useState, useRef, useCallback } from "react";

// ─── Catalog ──────────────────────────────────────────────────────────────────
const TOPS = [
  { id: "office_blazer.jpg",  name: "Black Business Blazer",  label: "BLAZER", src: "/catalog/tops/office_blazer.jpg"  },
  { id: "white_blazer.jpg",   name: "White Formal Shirt",      label: "SHIRT",  src: "/catalog/tops/white_blazer.jpg"   },
  { id: "navy_suit.jpg",      name: "Navy Suit Jacket",        label: "SUIT",   src: "/catalog/tops/navy_suit.jpg"      },
  { id: "grey_blazer.jpg",    name: "Grey Slim Blazer",        label: "BLAZER", src: "/catalog/tops/grey_blazer.jpg"    },
  { id: "striped_shirt.jpg",  name: "Oxford Striped Shirt",    label: "SHIRT",  src: "/catalog/tops/striped_shirt.jpg"  },
  { id: "turtleneck.jpg",     name: "Black Turtleneck",        label: "KNIT",   src: "/catalog/tops/turtleneck.jpg"     },
];

const BOTTOMS = [
  { id: "black.jpg",          name: "Black Formal Trousers",   label: "TROUSER", src: "/catalog/bottoms/black.jpg"         },
  { id: "shopping.jpg",       name: "Blue Slim Jeans",         label: "JEANS",   src: "/catalog/bottoms/shopping.jpg"      },
  { id: "charcoal.jpg",       name: "Charcoal Trousers",       label: "TROUSER", src: "/catalog/bottoms/charcoal.jpg"      },
  { id: "navy_trousers.jpg",  name: "Navy Flat-Front Chinos",  label: "CHINO",   src: "/catalog/bottoms/navy_trousers.jpg" },
  { id: "beige_chino.jpg",    name: "Beige Slim Chinos",       label: "CHINO",   src: "/catalog/bottoms/beige_chino.jpg"   },
  { id: "grey_trousers.jpg",  name: "Grey Wool Trousers",      label: "TROUSER", src: "/catalog/bottoms/grey_trousers.jpg" },
];

const TRANSFORMATIONS = [
  {
    value: "none",
    title: "Current Physique",
    desc:  "Your body exactly as it is today",
    icon:  "◎",
  },
  {
    value: "1_month",
    title: "1 Month In",
    desc:  "Leaner, slightly broader — early gains",
    icon:  "◑",
  },
  {
    value: "4_months",
    title: "4 Months In",
    desc:  "Athletic, defined — committed results",
    icon:  "●",
  },
];

// ─── Design tokens ────────────────────────────────────────────────────────────
const ink    = "#0D0D0D";
const cream  = "#F7F4EE";
const silk   = "#E8E3D9";
const gold   = "#B8960C";
const goldLt = "#D4AF37";
const muted  = "#7A7469";
const white  = "#FFFFFF";

// ─── Split-screen reveal ──────────────────────────────────────────────────────
function SplitReveal({ before, after }) {
  const [pct, setPct] = useState(50);
  const wrapRef = useRef(null);
  const dragging = useRef(false);

  const clamp = (v) => Math.min(Math.max(v, 4), 96);

  const move = useCallback((clientX) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setPct(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  return (
    <div
      ref={wrapRef}
      onMouseMove={(e) => { if (dragging.current) move(e.clientX); }}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
      onTouchEnd={() => (dragging.current = false)}
      style={{
        position: "relative", overflow: "hidden",
        userSelect: "none", width: "100%", aspectRatio: "9/16",
        background: silk,
      }}
    >
      {/* After — base layer */}
      <img src={after}  alt="After"  draggable={false}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />

      {/* Before — clipped left */}
      <div style={{ position: "absolute", inset: 0, width: `${pct}%`, overflow: "hidden" }}>
        <img src={before} alt="Before" draggable={false}
          style={{ position: "absolute", inset: 0,
            width: `${10000 / pct}%`, maxWidth: "none",
            height: "100%", objectFit: "cover" }} />
      </div>

      {/* Tags */}
      {["BEFORE", "AFTER"].map((t, i) => (
        <div key={t} style={{
          position: "absolute", top: 14,
          ...(i === 0 ? { left: 14 } : { right: 14 }),
          background: "rgba(13,13,13,0.72)",
          color: white, fontSize: 9, fontFamily: "sans-serif",
          letterSpacing: "0.22em", textTransform: "uppercase",
          padding: "4px 10px", backdropFilter: "blur(6px)",
          zIndex: i === 0 ? 10 : 5,
          opacity: i === 0 ? (pct > 15 ? 1 : 0) : (pct < 85 ? 1 : 0),
          transition: "opacity 0.2s",
        }}>{t}</div>
      ))}

      {/* Handle */}
      <div
        onMouseDown={(e) => { dragging.current = true; e.preventDefault(); }}
        onTouchStart={() => (dragging.current = true)}
        style={{
          position: "absolute", top: 0,
          left: `${pct}%`, transform: "translateX(-50%)",
          width: 2, height: "100%",
          background: goldLt, cursor: "ew-resize", zIndex: 20,
        }}
      >
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 38, height: 38, borderRadius: "50%",
          background: goldLt, display: "flex",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
          fontSize: 14, color: ink, fontWeight: 700,
        }}>⇔</div>
      </div>
    </div>
  );
}

// ─── Catalog grid ─────────────────────────────────────────────────────────────
function CatalogGrid({ items, selected, onSelect }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item.id)}
          title={item.name}
          style={{
            cursor: "pointer", position: "relative",
            aspectRatio: "1/1", overflow: "hidden",
            border: selected === item.id ? `2.5px solid ${gold}` : `2px solid transparent`,
            background: silk, transition: "border-color 0.15s, opacity 0.15s",
          }}
        >
          <img
            src={item.src} alt={item.name} draggable={false}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={(e) => { e.target.style.opacity = "0"; }}
          />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: selected === item.id ? gold : "rgba(13,13,13,0.55)",
            color: white, fontSize: 8, fontFamily: "sans-serif",
            letterSpacing: "0.16em", textTransform: "uppercase",
            padding: "3px 0", textAlign: "center",
            transition: "background 0.15s",
          }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Section block ────────────────────────────────────────────────────────────
function Section({ step, title, children }) {
  return (
    <div style={{ background: white, border: `1px solid ${silk}` }}>
      <div style={{
        padding: "15px 22px", borderBottom: `1px solid ${silk}`,
        display: "flex", alignItems: "baseline", gap: 10,
      }}>
        <span style={{
          fontSize: 9, fontFamily: "sans-serif", letterSpacing: "0.28em",
          color: gold, textTransform: "uppercase",
        }}>{step}</span>
        <span style={{
          fontSize: 12, fontFamily: "sans-serif", letterSpacing: "0.18em",
          textTransform: "uppercase", fontWeight: 700, color: ink,
        }}>{title}</span>
      </div>
      <div style={{ padding: "18px 22px" }}>{children}</div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [userFile,       setUserFile]       = useState(null);
  const [portrait,       setPortrait]       = useState(null);
  const [top,            setTop]            = useState(TOPS[0].id);
  const [bottom,         setBottom]         = useState(BOTTOMS[0].id);
  const [transformation, setTransformation] = useState("none");
  const [loading,        setLoading]        = useState(false);
  const [result,         setResult]         = useState(null);
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setUserFile(file);
    setPortrait(URL.createObjectURL(file));
    setResult(null);
  };

  const generate = async () => {
    if (!userFile) { alert("Please upload your portrait first."); return; }
    setLoading(true);
    setResult(null);

    const fd = new FormData();
    fd.append("user_file",      userFile);
    fd.append("top_id",         top);
    fd.append("bottom_id",      bottom);
    fd.append("transformation", transformation);

    try {
      // Inside your generate() function
      console.log(`${import.meta.env.VITE_API_URL}`);
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/process-transformation`, {
    method: "POST", 
    body: fd,
});
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setResult(URL.createObjectURL(await res.blob()));
    } catch (err) {
      alert(`Generation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = result;
    a.download = "office-presence-look.jpg";
    a.click();
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${cream}; }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        .catalog-item:hover { opacity: 0.82; }
        .trans-card:hover   { border-color: ${goldLt} !important; }
        .gen-btn:hover:not(:disabled) { background: #222 !important; }
        .dl-btn:hover  { background: ${gold} !important; color: ${white} !important; }
        .rm-btn:hover  { border-color: #ccc !important; }
      `}</style>

      {/* ── Masthead ── */}
      <header style={{
        background: white, borderBottom: `1px solid ${silk}`,
        padding: "0 48px", height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 13, fontFamily: "sans-serif", fontWeight: 700,
            letterSpacing: "0.28em", textTransform: "uppercase", color: ink }}>
            Office Presence
          </div>
          <div style={{ fontSize: 10, fontFamily: "sans-serif",
            letterSpacing: "0.2em", color: muted, textTransform: "uppercase" }}>
            Virtual Fitting Room
          </div>
        </div>
        <div style={{ fontSize: 10, fontFamily: "sans-serif", color: muted, letterSpacing: "0.1em" }}>
          Powered by Gemini AI
        </div>
      </header>

      {/* ── Hero ── */}
      <div style={{
        textAlign: "center", padding: "48px 32px 44px",
        borderBottom: `1px solid ${silk}`, background: white,
      }}>
        <p style={{ fontSize: 10, fontFamily: "sans-serif", letterSpacing: "0.35em",
          textTransform: "uppercase", color: gold, marginBottom: 12 }}>
          Dress to Impress
        </p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(32px, 5vw, 56px)",
          fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.01em", color: ink, marginBottom: 12 }}>
          See the Outfit<br />Before You Wear It
        </h1>
        <p style={{ fontSize: 14, fontFamily: "sans-serif", color: muted, letterSpacing: "0.04em" }}>
          Upload your portrait · Select garments · Choose your physique goal · Generate
        </p>
      </div>

      {/* ── Main layout ── */}
      <div style={{
        maxWidth: 1160, margin: "0 auto", padding: "40px 32px 80px",
        display: "grid", gridTemplateColumns: "340px 1fr", gap: 40, alignItems: "start",
      }}>

        {/* ── Left column: controls ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* 01 Upload */}
          <Section step="01" title="Your Portrait">
            {portrait ? (
              <>
                <div style={{ position: "relative", width: "100%", aspectRatio: "3/4", overflow: "hidden", background: silk }}>
                  <img src={portrait} alt="Your portrait"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{
                    position: "absolute", bottom: 10, left: 10,
                    background: "rgba(13,13,13,0.7)", color: white,
                    fontSize: 9, fontFamily: "sans-serif", letterSpacing: "0.2em",
                    textTransform: "uppercase", padding: "4px 8px", backdropFilter: "blur(4px)",
                  }}>Your Photo</div>
                </div>
                <button className="rm-btn" onClick={() => { setUserFile(null); setPortrait(null); setResult(null); fileRef.current.value = ""; }}
                  style={{
                    marginTop: 10, width: "100%", padding: "9px",
                    background: "transparent", border: `1px solid ${silk}`,
                    color: muted, cursor: "pointer", fontSize: 9,
                    fontFamily: "sans-serif", letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}>
                  Remove &amp; Re-upload
                </button>
              </>
            ) : (
              <>
                <div
                  onClick={() => fileRef.current.click()}
                  onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                  onDragOver={(e) => e.preventDefault()}
                  style={{
                    border: `1.5px dashed ${silk}`, background: cream,
                    padding: "36px 20px", textAlign: "center", cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 28, color: muted, marginBottom: 8 }}>↑</div>
                  <p style={{ fontSize: 11, fontFamily: "sans-serif", letterSpacing: "0.14em",
                    textTransform: "uppercase", color: muted }}>
                    Drop portrait here
                  </p>
                  <p style={{ fontSize: 10, fontFamily: "sans-serif", color: silk, marginTop: 4 }}>
                    or click to browse
                  </p>
                </div>
                <input ref={fileRef} type="file" accept="image/*"
                  style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
              </>
            )}
          </Section>

          {/* 02 Top */}
          <Section step="02" title="Select Top">
            <CatalogGrid items={TOPS} selected={top} onSelect={setTop} />
          </Section>

          {/* 03 Bottom */}
          <Section step="03" title="Select Bottom">
            <CatalogGrid items={BOTTOMS} selected={bottom} onSelect={setBottom} />
          </Section>

          {/* 04 Transformation */}
          <Section step="04" title="Physique Goal">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {TRANSFORMATIONS.map((t) => {
                const sel = transformation === t.value;
                return (
                  <div key={t.value} className="trans-card"
                    onClick={() => setTransformation(t.value)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "12px 14px", cursor: "pointer",
                      border: sel ? `1.5px solid ${gold}` : `1.5px solid ${silk}`,
                      background: sel ? "#FDFAF3" : white,
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: 18, color: sel ? gold : muted, lineHeight: 1 }}>{t.icon}</span>
                    <div>
                      <div style={{ fontSize: 11, fontFamily: "sans-serif", fontWeight: 700,
                        letterSpacing: "0.15em", textTransform: "uppercase",
                        color: sel ? gold : ink }}>
                        {t.title}
                      </div>
                      <div style={{ fontSize: 10, fontFamily: "sans-serif", color: muted,
                        letterSpacing: "0.04em", marginTop: 2 }}>
                        {t.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Generate CTA */}
          <button className="gen-btn"
            onClick={generate}
            disabled={loading || !userFile}
            style={{
              width: "100%", padding: "16px",
              background: loading || !userFile ? muted : ink,
              color: white, border: "none",
              cursor: loading || !userFile ? "not-allowed" : "pointer",
              fontSize: 11, fontFamily: "sans-serif", letterSpacing: "0.28em",
              textTransform: "uppercase", fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "background 0.2s",
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: 14, height: 14, borderRadius: "50%",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  borderTop: "1.5px solid white",
                  display: "inline-block", animation: "spin 0.8s linear infinite",
                }} />
                Generating…
              </>
            ) : "Generate My Look →"}
          </button>
        </div>

        {/* ── Right column: result ── */}
        <div style={{ background: white, border: `1px solid ${silk}`, display: "flex", flexDirection: "column" }}>

          {/* Canvas header */}
          <div style={{
            padding: "15px 24px", borderBottom: `1px solid ${silk}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 10, fontFamily: "sans-serif", letterSpacing: "0.28em",
              textTransform: "uppercase", color: muted }}>
              Result Canvas
            </span>
            <span style={{
              fontSize: 9, fontFamily: "sans-serif", letterSpacing: "0.2em",
              textTransform: "uppercase", color: result ? gold : muted,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%",
                background: result ? gold : silk }} />
              {result ? "Ready" : loading ? "Processing…" : "Awaiting Input"}
            </span>
          </div>

          {/* Loading state */}
          {loading && (
            <div style={{
              flex: 1, minHeight: 480, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 18, padding: 48,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                border: `2px solid ${silk}`, borderTop: `2px solid ${gold}`,
                animation: "spin 0.9s linear infinite",
              }} />
              <p style={{ fontSize: 10, fontFamily: "sans-serif", letterSpacing: "0.25em",
                textTransform: "uppercase", color: muted }}>
                Crafting your look…
              </p>
              <p style={{ fontSize: 11, fontFamily: "sans-serif", color: silk }}>
                This may take 15–30 seconds
              </p>
            </div>
          )}

          {/* Result: split reveal */}
          {!loading && result && (
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              <SplitReveal before={portrait} after={result} />
              <div style={{ padding: "14px 24px 6px", borderTop: `1px solid ${silk}` }}>
                <p style={{ fontSize: 9, fontFamily: "sans-serif", letterSpacing: "0.2em",
                  textTransform: "uppercase", color: muted }}>
                  Drag the divider to compare before &amp; after
                </p>
              </div>
              <div style={{ padding: "8px 24px 20px" }}>
                <button className="dl-btn" onClick={download} style={{
                  width: "100%", padding: "12px",
                  background: "transparent", border: `1px solid ${gold}`,
                  color: gold, cursor: "pointer", fontSize: 10,
                  fontFamily: "sans-serif", letterSpacing: "0.2em",
                  textTransform: "uppercase", fontWeight: 600,
                  transition: "all 0.2s",
                }}>
                  ↓ &nbsp; Download Result
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && !result && (
            <div style={{
              flex: 1, minHeight: 480, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 12, padding: 60,
            }}>
              <div style={{ fontSize: 52, opacity: 0.1 }}>👔</div>
              <p style={{ fontSize: 11, fontFamily: "sans-serif", letterSpacing: "0.18em",
                textTransform: "uppercase", color: muted, textAlign: "center" }}>
                Your styled portrait<br />will appear here
              </p>
              <p style={{ fontSize: 12, fontFamily: "sans-serif", color: silk, marginTop: 4 }}>
                Select an outfit and tap Generate
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: `1px solid ${silk}`, padding: "18px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: white,
      }}>
        <span style={{ fontSize: 10, fontFamily: "sans-serif", color: muted,
          letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Office Presence · Virtual Fitting Room
        </span>
        <span style={{ fontSize: 10, fontFamily: "sans-serif", color: silk, letterSpacing: "0.1em" }}>
          AI-generated results may vary
        </span>
      </footer>
    </>
  );
}
