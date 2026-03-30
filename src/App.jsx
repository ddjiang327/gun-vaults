import { useState } from "react";

const C = {
  bg: "#F5F5F5", surface: "#FFFFFF", border: "#E8E8E8",
  accent: "#111111", text: "#111111", sub: "#777777",
  muted: "#BBBBBB", shadow: "0 1px 4px rgba(0,0,0,0.07)", error: "#CC3333",
};

const INIT_FIREARMS = [
  { id: 1, make: "Glock", model: "19 Gen5", type: "Pistol", caliber: "9mm", rounds: 1247, condition: "Excellent", location: "Main Safe", serial: "GHK123" },
  { id: 2, make: "Remington", model: "700", type: "Rifle", caliber: ".308 Win", rounds: 432, condition: "Good", location: "Gun Cabinet", serial: "REM789" },
  { id: 3, make: "Mossberg", model: "500", type: "Shotgun", caliber: "12 Gauge", rounds: 89, condition: "Good", location: "Main Safe", serial: "MOS345" },
  { id: 4, make: "Smith & Wesson", model: "686", type: "Revolver", caliber: ".357 Mag", rounds: 654, condition: "Excellent", location: "Bedside", serial: "SW901" },
];

const INIT_AMMO = [
  { id: 1, caliber: "9mm", brand: "Federal", grain: 124, type: "FMJ", qty: 450, threshold: 100 },
  { id: 2, caliber: "9mm", brand: "Hornady", grain: 147, type: "HP", qty: 80, threshold: 100 },
  { id: 3, caliber: ".308 Win", brand: "Federal", grain: 168, type: "BTHP", qty: 120, threshold: 50 },
  { id: 4, caliber: "12 Gauge", brand: "Winchester", grain: null, type: "00 Buck", qty: 45, threshold: 20 },
  { id: 5, caliber: ".357 Mag", brand: "Hornady", grain: 158, type: "XTP", qty: 200, threshold: 60 },
];

const INIT_ACTIVITIES = [
  { id: 1, type: "Hunting", date: "15 Mar 2024", location: "Pine Ridge", guns: ["Remington 700"], rounds: 3, notes: "Got a 6-point buck at 180 yards.", shared: true, reactions: 24, ammoUsed: [] },
  { id: 2, type: "Range", date: "10 Mar 2024", location: "City Range", guns: ["Glock 19 Gen5"], rounds: 100, notes: "Working on double taps.", shared: false, reactions: 0, ammoUsed: [] },
  { id: 3, type: "Cleaning", date: "08 Mar 2024", location: null, guns: ["Glock 19 Gen5"], rounds: 0, notes: "Full detail strip. Replaced recoil spring.", shared: false, reactions: 0, ammoUsed: [] },
];

const WALL_POSTS = [
  { id: 1, user: "TxHunter88", avatar: "T", type: "Hunting", location: "Hill Country, TX", story: "First axis deer of the season. 220 yard shot with the .300 Win Mag.", reactions: 47, comments: 12, guns: ["Custom Remington"] },
  { id: 2, user: "RangeRat_PDX", avatar: "R", type: "Competition", location: "Portland, OR", story: "Shot my first IDPA classifier today. 87% score.", reactions: 31, comments: 8, guns: ["Glock 34"] },
  { id: 3, user: "MtnMike", avatar: "M", type: "Hunting", location: "Rockies, CO", story: "Elk season opener. Nothing harvested but the country was stunning.", reactions: 19, comments: 5, guns: ["Weatherby Mark V"] },
];

const FIREARM_TYPES = ["Pistol", "Rifle", "Shotgun", "Revolver", "Other"];
const CONDITIONS = ["Excellent", "Good", "Fair", "Poor"];
const LOCATIONS = ["Main Safe", "Gun Cabinet", "Bedside", "Range Bag", "Vehicle", "Other"];
const CALIBERS = ["9mm", ".45 ACP", ".40 S&W", ".380 ACP", ".357 Mag", ".38 Special", "10mm", ".308 Win", ".223 Rem / 5.56", ".30-06", ".300 Win Mag", ".243 Win", "12 Gauge", "20 Gauge", ".410 Bore", "Other"];
const AMMO_TYPES = ["FMJ", "HP", "JHP", "SP", "BTHP", "FMJ-BT", "Slug", "00 Buck", "#4 Buck", "Birdshot", "Subsonic", "Match", "Tracer", "Other"];
const ACTIVITY_TYPES = ["Hunting", "Range", "Competition", "Training", "Plinking", "Other"];
const CLEANING_TYPES = ["Field Strip", "Full Detail Clean", "Bore Only", "Lubrication Only", "Inspection"];
const CLEANING_PRODUCTS = ["Hoppes No. 9", "CLP (Break-Free)", "Ballistol", "Rem Oil", "Slip 2000", "M-Pro 7", "Frog Lube", "Dry Lube", "Other"];

// Toast
const Toast = ({ message, onDone }) => {
  useState(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); });
  return (
    <div style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", background: C.accent, color: "#fff", borderRadius: 20, padding: "10px 20px", fontSize: 13, fontWeight: 600, zIndex: 999, whiteSpace: "nowrap", pointerEvents: "none" }}>
      {message}
    </div>
  );
};

// Primitives
const Badge = ({ label, filled }) => (
  <span style={{ display: "inline-block", background: filled ? C.accent : "transparent", color: filled ? "#fff" : C.sub, border: "1px solid " + (filled ? C.accent : C.border), borderRadius: 3, padding: "2px 8px", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{label}</span>
);

const HR = ({ mt, mb }) => <div style={{ height: 1, background: C.border, margin: (mt || 0) + "px 0 " + (mb || 0) + "px" }} />;

const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1.3, marginBottom: 10 }}>{children}</div>
);

const StatRow = ({ items }) => (
  <div style={{ display: "flex", background: C.bg, borderRadius: 10, border: "1px solid " + C.border, overflow: "hidden" }}>
    {items.map((s, i) => (
      <div key={s.label} style={{ flex: 1, padding: "13px 0", textAlign: "center", borderRight: i < items.length - 1 ? "1px solid " + C.border : "none" }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: C.text, fontFamily: "monospace" }}>{s.value}</div>
        <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 2 }}>{s.label}</div>
      </div>
    ))}
  </div>
);

const TopBar = ({ title, onBack, onAdd }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 12px", background: C.surface, borderBottom: "1px solid " + C.border, position: "sticky", top: 0, zIndex: 20 }}>
    <div style={{ width: 60 }}>
      {onBack && <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.text, fontSize: 14, fontWeight: 600, padding: "4px 0" }}>Back</button>}
    </div>
    <span style={{ fontWeight: 700, fontSize: 15, color: C.text, fontFamily: "Georgia, serif" }}>{title}</span>
    <div style={{ width: 60, display: "flex", justifyContent: "flex-end" }}>
      {onAdd && <button onClick={onAdd} style={{ background: C.accent, border: "none", borderRadius: 6, color: "#fff", fontWeight: 700, fontSize: 20, width: 30, height: 30, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>}
    </div>
  </div>
);

const Chips = ({ options, value, onChange }) => (
  <div style={{ display: "flex", gap: 6, padding: "10px 16px", overflowX: "auto", background: C.surface, borderBottom: "1px solid " + C.border }}>
    {options.map(o => (
      <button key={o} onClick={() => onChange(o)} style={{ background: value === o ? C.accent : C.surface, border: "1px solid " + (value === o ? C.accent : C.border), borderRadius: 20, padding: "5px 14px", color: value === o ? "#fff" : C.sub, fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{o}</button>
    ))}
  </div>
);

// Form primitives
const FormField = ({ label, required, error, children }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: error ? C.error : C.muted, textTransform: "uppercase", letterSpacing: 1.1, marginBottom: 6 }}>
      {label}{required && <span style={{ color: C.error }}> *</span>}
    </div>
    {children}
    {error && <div style={{ fontSize: 11, color: C.error, marginTop: 4 }}>{error}</div>}
  </div>
);

const TextInput = ({ value, onChange, placeholder, error }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", padding: "11px 14px", fontSize: 14, border: "1px solid " + (error ? C.error : C.border), borderRadius: 8, background: C.surface, color: C.text, outline: "none", boxSizing: "border-box", fontFamily: "Helvetica Neue, Helvetica, sans-serif" }} />
);

const SegmentedPicker = ({ options, value, onChange }) => {
  const isOther = value && value !== "" && !options.includes(value);
  const displayVal = isOther ? "Other" : value;
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {options.map(o => (
          <button key={o} onClick={() => onChange(o)} style={{ background: displayVal === o ? C.accent : C.surface, border: "1px solid " + (displayVal === o ? C.accent : C.border), borderRadius: 6, padding: "8px 14px", color: displayVal === o ? "#fff" : C.sub, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{o}</button>
        ))}
      </div>
      {(displayVal === "Other" || isOther) && (
        <input autoFocus value={isOther ? value : ""} onChange={e => onChange(e.target.value)} placeholder="Enter custom value..." style={{ marginTop: 8, width: "100%", padding: "10px 14px", fontSize: 14, border: "1px solid " + C.accent, borderRadius: 8, background: C.surface, color: C.text, outline: "none", boxSizing: "border-box", fontFamily: "Helvetica Neue, Helvetica, sans-serif" }} />
      )}
    </div>
  );
};

const SelectInput = ({ value, onChange, options, placeholder }) => {
  const isOther = value && !options.includes(value);
  const selectVal = isOther ? "Other" : value;
  return (
    <div>
      <select value={selectVal} onChange={e => onChange(e.target.value)} style={{ width: "100%", padding: "11px 14px", fontSize: 14, border: "1px solid " + C.border, borderRadius: 8, background: C.surface, color: selectVal ? C.text : C.muted, outline: "none", boxSizing: "border-box", appearance: "none", fontFamily: "Helvetica Neue, Helvetica, sans-serif" }}>
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {(selectVal === "Other" || isOther) && (
        <input autoFocus value={isOther ? value : ""} onChange={e => onChange(e.target.value)} placeholder="Enter custom caliber..." style={{ marginTop: 8, width: "100%", padding: "10px 14px", fontSize: 14, border: "1px solid " + C.accent, borderRadius: 8, background: C.surface, color: C.text, outline: "none", boxSizing: "border-box", fontFamily: "Helvetica Neue, Helvetica, sans-serif" }} />
      )}
    </div>
  );
};

const Stepper = ({ value, onChange, min }) => {
  const [editing, setEditing] = useState(false);
  const num = Number(value) || 0;
  return (
    <div style={{ display: "flex", alignItems: "center", border: "1px solid " + C.border, borderRadius: 8, overflow: "hidden", background: C.surface }}>
      <button onClick={() => onChange(String(Math.max(min !== undefined ? min : 0, num - 1)))} style={{ width: 44, height: 44, background: C.bg, border: "none", borderRight: "1px solid " + C.border, fontSize: 20, cursor: "pointer", color: C.sub, flexShrink: 0 }}>-</button>
      {editing
        ? <input autoFocus value={value} onChange={e => onChange(e.target.value)} onBlur={() => setEditing(false)} style={{ flex: 1, border: "none", outline: "none", fontSize: 18, fontWeight: 700, textAlign: "center", color: C.text, fontFamily: "monospace", background: "transparent", height: 44 }} />
        : <button onClick={() => setEditing(true)} style={{ flex: 1, border: "none", background: "transparent", cursor: "text", fontSize: 18, fontWeight: 700, textAlign: "center", color: value ? C.text : C.muted, fontFamily: "monospace", height: 44 }}>{value || "0"}</button>
      }
      <button onClick={() => onChange(String(num + 1))} style={{ width: 44, height: 44, background: C.bg, border: "none", borderLeft: "1px solid " + C.border, fontSize: 20, cursor: "pointer", color: C.sub, flexShrink: 0 }}>+</button>
    </div>
  );
};

const ModalShell = ({ title, onClose, onSave, saveLabel, children }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
    <div style={{ flex: 1 }} onClick={onClose} />
    <div style={{ background: C.bg, borderRadius: "20px 20px 0 0", maxHeight: "92vh", display: "flex", flexDirection: "column", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}>
      <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px 14px", borderBottom: "1px solid " + C.border }}>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.sub, fontSize: 14, fontWeight: 500, padding: 0 }}>Cancel</button>
        <span style={{ fontWeight: 700, fontSize: 15, color: C.text, fontFamily: "Georgia, serif" }}>{title}</span>
        <button onClick={onSave} style={{ background: C.accent, border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, padding: "6px 16px", cursor: "pointer" }}>{saveLabel || "Save"}</button>
      </div>
      <div style={{ overflowY: "auto", padding: "20px 20px 40px" }}>{children}</div>
    </div>
  </div>
);

// Add Firearm Modal
const AddFirearmModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({ make: "", model: "", type: "", caliber: "", condition: "Excellent", location: "", serial: "", purchaseDate: "", purchasePrice: "", notes: "" });
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })); };
  const handleSave = () => {
    const e = {};
    if (!form.make.trim()) e.make = "Make is required";
    if (!form.model.trim()) e.model = "Model is required";
    if (!form.type) e.type = "Select a type";
    if (!form.caliber) e.caliber = "Select a caliber";
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ id: Date.now(), ...form, rounds: 0 });
  };
  return (
    <ModalShell title="Add Firearm" onClose={onClose} onSave={handleSave}>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}><FormField label="Make" required error={errors.make}><TextInput value={form.make} onChange={v => set("make", v)} placeholder="e.g. Glock" error={errors.make} /></FormField></div>
        <div style={{ flex: 1 }}><FormField label="Model" required error={errors.model}><TextInput value={form.model} onChange={v => set("model", v)} placeholder="e.g. 19 Gen5" error={errors.model} /></FormField></div>
      </div>
      <FormField label="Type" required error={errors.type}>
        <SegmentedPicker options={FIREARM_TYPES} value={form.type} onChange={v => set("type", v)} />
        {errors.type && <div style={{ fontSize: 11, color: C.error, marginTop: 4 }}>{errors.type}</div>}
      </FormField>
      <FormField label="Caliber" required error={errors.caliber}>
        <SelectInput value={form.caliber} onChange={v => set("caliber", v)} options={CALIBERS} placeholder="Select caliber" />
      </FormField>
      <FormField label="Condition"><SegmentedPicker options={CONDITIONS} value={form.condition} onChange={v => set("condition", v)} /></FormField>
      <FormField label="Storage Location"><SegmentedPicker options={LOCATIONS} value={form.location} onChange={v => set("location", v)} /></FormField>
      <FormField label="Serial Number"><TextInput value={form.serial} onChange={v => set("serial", v)} placeholder="Optional" /></FormField>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}><FormField label="Purchase Date"><TextInput value={form.purchaseDate} onChange={v => set("purchaseDate", v)} placeholder="e.g. Jan 2022" /></FormField></div>
        <div style={{ flex: 1 }}><FormField label="Purchase Price"><TextInput value={form.purchasePrice} onChange={v => set("purchasePrice", v)} placeholder="e.g. 550" /></FormField></div>
      </div>
      <FormField label="Notes">
        <textarea value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Any additional details..." rows={3} style={{ width: "100%", padding: "11px 14px", fontSize: 14, border: "1px solid " + C.border, borderRadius: 8, background: C.surface, color: C.text, outline: "none", boxSizing: "border-box", resize: "none", lineHeight: 1.5, fontFamily: "Helvetica Neue, Helvetica, sans-serif" }} />
      </FormField>
      <div style={{ fontSize: 11, color: C.muted }}><span style={{ color: C.error }}>*</span> Required fields</div>
    </ModalShell>
  );
};

// Add Ammo Modal
const AddAmmoModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({ caliber: "", brand: "", grain: "", type: "", qty: "", threshold: "50", pricePerRound: "", notes: "" });
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })); };
  const handleSave = () => {
    const e = {};
    if (!form.caliber) e.caliber = "Select a caliber";
    if (!form.brand.trim()) e.brand = "Brand is required";
    if (!form.type) e.type = "Select ammo type";
    if (!form.qty || isNaN(Number(form.qty)) || Number(form.qty) < 1) e.qty = "Enter a valid quantity";
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ id: Date.now(), caliber: form.caliber, brand: form.brand.trim(), grain: form.grain ? Number(form.grain) : null, type: form.type, qty: Number(form.qty), threshold: Number(form.threshold) || 50, pricePerRound: form.pricePerRound ? Number(form.pricePerRound) : null, notes: form.notes.trim() });
  };
  return (
    <ModalShell title="Add Ammo" onClose={onClose} onSave={handleSave}>
      <FormField label="Caliber" required error={errors.caliber}>
        <SelectInput value={form.caliber} onChange={v => set("caliber", v)} options={CALIBERS} placeholder="Select caliber" />
      </FormField>
      <FormField label="Brand" required error={errors.brand}><TextInput value={form.brand} onChange={v => set("brand", v)} placeholder="e.g. Federal, Hornady" error={errors.brand} /></FormField>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}><FormField label="Grain Weight"><TextInput value={form.grain} onChange={v => set("grain", v)} placeholder="e.g. 124" /></FormField></div>
        <div style={{ flex: 1 }}><FormField label="Price / Round ($)"><TextInput value={form.pricePerRound} onChange={v => set("pricePerRound", v)} placeholder="e.g. 0.45" /></FormField></div>
      </div>
      <FormField label="Ammo Type" required error={errors.type}>
        <SegmentedPicker options={AMMO_TYPES} value={form.type} onChange={v => set("type", v)} />
        {errors.type && <div style={{ fontSize: 11, color: C.error, marginTop: 4 }}>{errors.type}</div>}
      </FormField>
      <FormField label="Quantity (rounds)" required error={errors.qty}>
        <Stepper value={form.qty} onChange={v => set("qty", v)} min={0} />
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          {[50, 100, 200, 500, 1000].map(n => (
            <button key={n} onClick={() => set("qty", String(n))} style={{ background: form.qty === String(n) ? C.accent : C.surface, border: "1px solid " + (form.qty === String(n) ? C.accent : C.border), borderRadius: 6, padding: "4px 10px", color: form.qty === String(n) ? "#fff" : C.sub, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{n}</button>
          ))}
        </div>
        {errors.qty && <div style={{ fontSize: 11, color: C.error, marginTop: 4 }}>{errors.qty}</div>}
      </FormField>
      <FormField label="Low Stock Alert Threshold">
        <Stepper value={form.threshold} onChange={v => set("threshold", v)} min={0} />
        <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Alert when stock drops below this number</div>
      </FormField>
      <FormField label="Notes">
        <textarea value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="e.g. bought at range, bulk order..." rows={2} style={{ width: "100%", padding: "11px 14px", fontSize: 14, border: "1px solid " + C.border, borderRadius: 8, background: C.surface, color: C.text, outline: "none", boxSizing: "border-box", resize: "none", lineHeight: 1.5, fontFamily: "Helvetica Neue, Helvetica, sans-serif" }} />
      </FormField>
      <div style={{ fontSize: 11, color: C.muted }}><span style={{ color: C.error }}>*</span> Required fields</div>
    </ModalShell>
  );
};

// Log Activity Modal
const LogActivityModal = ({ onClose, onSave, firearms, ammo }) => {
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const [form, setForm] = useState({ type: "", date: today, location: "", notes: "", shareToWall: false });
  const [selectedGuns, setSelectedGuns] = useState([]);
  const [ammoUsed, setAmmoUsed] = useState({});
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })); };
  const toggleGun = (f) => { setSelectedGuns(gs => gs.includes(f.id) ? gs.filter(g => g !== f.id) : [...gs, f.id]); };
  const setAmmoForGun = (fid, aid, rounds) => setAmmoUsed(a => ({ ...a, [fid]: { ammoId: aid, rounds: rounds === "" ? "" : Number(rounds) } }));
  const totalRounds = Object.values(ammoUsed).reduce((s, v) => s + (Number(v.rounds) || 0), 0);
  const handleNext = () => {
    if (step === 1) {
      const e = {};
      if (!form.type) e.type = "Select an activity type";
      if (!form.date.trim()) e.date = "Enter a date";
      if (Object.keys(e).length) { setErrors(e); return; }
      setStep(2);
    } else if (step === 2) {
      if (selectedGuns.length === 0) { setErrors({ guns: "Select at least one firearm" }); return; }
      setStep(3);
    }
  };
  const handleSave = () => {
    const gunNames = selectedGuns.map(id => { const f = firearms.find(f => f.id === id); return f ? f.make + " " + f.model : ""; });
    const ammoArr = Object.entries(ammoUsed).map(([fid, { ammoId, rounds }]) => {
      const a = ammo.find(a => a.id === ammoId);
      return { ammoId, firId: Number(fid), label: a ? a.caliber + " " + a.brand + " " + a.type : "", rounds: Number(rounds) || 0 };
    }).filter(a => a.rounds > 0);
    onSave({ id: Date.now(), type: form.type, date: form.date, location: form.location.trim(), notes: form.notes.trim(), shared: form.shareToWall, guns: gunNames, ammoUsed: ammoArr, rounds: totalRounds, reactions: 0 }, ammoArr);
  };
  const stepLabels = ["", "Activity Details", "Firearms & Ammo", "Review & Save"];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ flex: 1 }} onClick={onClose} />
      <div style={{ background: C.bg, borderRadius: "20px 20px 0 0", maxHeight: "92vh", display: "flex", flexDirection: "column", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: C.border }} /></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px 14px", borderBottom: "1px solid " + C.border }}>
          <button onClick={step === 1 ? onClose : () => setStep(s => s - 1)} style={{ background: "none", border: "none", cursor: "pointer", color: C.sub, fontSize: 14, fontWeight: 500, padding: 0 }}>{step === 1 ? "Cancel" : "Back"}</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.text, fontFamily: "Georgia, serif" }}>Log Activity</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>Step {step} of 3 - {stepLabels[step]}</div>
          </div>
          {step < 3
            ? <button onClick={handleNext} style={{ background: C.accent, border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, padding: "6px 16px", cursor: "pointer" }}>Next</button>
            : <button onClick={handleSave} style={{ background: C.accent, border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, padding: "6px 16px", cursor: "pointer" }}>Save</button>
          }
        </div>
        <div style={{ display: "flex", height: 3 }}>{[1,2,3].map(s => <div key={s} style={{ flex: 1, background: s <= step ? C.accent : C.border }} />)}</div>
        <div style={{ overflowY: "auto", padding: "20px 20px 40px" }}>
          {step === 1 && (
            <>
              <FormField label="Activity Type" required error={errors.type}>
                <SegmentedPicker options={ACTIVITY_TYPES} value={form.type} onChange={v => set("type", v)} />
                {errors.type && <div style={{ fontSize: 11, color: C.error, marginTop: 4 }}>{errors.type}</div>}
              </FormField>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}><FormField label="Date" required error={errors.date}><TextInput value={form.date} onChange={v => set("date", v)} placeholder="e.g. 30 Mar 2026" error={errors.date} /></FormField></div>
                <div style={{ flex: 1 }}><FormField label="Location"><TextInput value={form.location} onChange={v => set("location", v)} placeholder="e.g. Pine Ridge" /></FormField></div>
              </div>
              <FormField label="Notes / Story">
                <textarea value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="How did it go?" rows={4} style={{ width: "100%", padding: "11px 14px", fontSize: 14, border: "1px solid " + C.border, borderRadius: 8, background: C.surface, color: C.text, outline: "none", boxSizing: "border-box", resize: "none", lineHeight: 1.55, fontFamily: "Helvetica Neue, Helvetica, sans-serif" }} />
              </FormField>
              <FormField label="Share to Wall">
                <button onClick={() => set("shareToWall", !form.shareToWall)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", background: C.surface, border: "1px solid " + (form.shareToWall ? C.accent : C.border), borderRadius: 10, padding: "12px 16px", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: form.shareToWall ? C.accent : C.bg, border: "1.5px solid " + (form.shareToWall ? C.accent : C.border), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>{form.shareToWall ? "v" : ""}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>Share to The Wall</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>Other users can see and react to your post</div>
                  </div>
                </button>
              </FormField>
            </>
          )}
          {step === 2 && (
            <>
              <SectionLabel>Select Firearms Used</SectionLabel>
              {errors.guns && <div style={{ fontSize: 11, color: C.error, marginBottom: 10 }}>{errors.guns}</div>}
              {firearms.map(f => {
                const sel = selectedGuns.includes(f.id);
                const compatAmmo = ammo.filter(a => a.caliber === f.caliber);
                return (
                  <div key={f.id} style={{ marginBottom: 12 }}>
                    <button onClick={() => toggleGun(f)} style={{ display: "flex", alignItems: "center", width: "100%", background: C.surface, border: "1px solid " + (sel ? C.accent : C.border), borderRadius: 10, padding: "12px 16px", cursor: "pointer", textAlign: "left" }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: sel ? C.accent : C.bg, border: "1.5px solid " + (sel ? C.accent : C.border), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, marginRight: 12 }}>{sel ? "v" : ""}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{f.make} {f.model}</div>
                        <div style={{ fontSize: 12, color: C.sub }}>{f.caliber} - {f.type}</div>
                      </div>
                    </button>
                    {sel && (
                      <div style={{ background: C.bg, border: "1px solid " + C.border, borderTop: "none", borderRadius: "0 0 10px 10px", padding: "14px 16px" }}>
                        <SectionLabel>Ammo Used</SectionLabel>
                        {compatAmmo.length === 0 ? <div style={{ fontSize: 12, color: C.muted }}>No {f.caliber} ammo in stock</div> : compatAmmo.map(a => {
                          const entry = ammoUsed[f.id];
                          const isSel = entry && entry.ammoId === a.id;
                          return (
                            <button key={a.id} onClick={() => setAmmoForGun(f.id, a.id, entry && entry.ammoId === a.id ? entry.rounds : "")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: isSel ? "#11111108" : C.surface, border: "1px solid " + (isSel ? C.accent : C.border), borderRadius: 8, padding: "10px 12px", marginBottom: 6, cursor: "pointer", textAlign: "left" }}>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{a.brand} {a.grain ? a.grain + "gr" : ""} {a.type}</div>
                                <div style={{ fontSize: 11, color: C.sub }}>Stock: {a.qty} rounds</div>
                              </div>
                              <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid " + (isSel ? C.accent : C.border), background: isSel ? C.accent : "transparent", flexShrink: 0 }} />
                            </button>
                          );
                        })}
                        {ammoUsed[f.id] && ammoUsed[f.id].ammoId && (
                          <div style={{ marginTop: 10 }}>
                            <SectionLabel>Rounds Fired</SectionLabel>
                            <Stepper value={String(ammoUsed[f.id].rounds || "")} onChange={v => setAmmoForGun(f.id, ammoUsed[f.id].ammoId, v)} min={0} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
          {step === 3 && (
            <>
              <SectionLabel>Review Before Saving</SectionLabel>
              <div style={{ background: C.surface, borderRadius: 12, border: "1px solid " + C.border, overflow: "hidden", marginBottom: 20 }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid " + C.border }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <Badge label={form.type} filled />
                    <span style={{ fontSize: 12, color: C.muted }}>{form.date}</span>
                  </div>
                  {form.location && <div style={{ fontSize: 12, color: C.sub, marginTop: 6 }}>{form.location}</div>}
                  {form.notes && <div style={{ fontSize: 13, color: C.text, marginTop: 8, lineHeight: 1.5 }}>{form.notes}</div>}
                </div>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid " + C.border }}>
                  <SectionLabel>Firearms</SectionLabel>
                  {selectedGuns.map(id => {
                    const f = firearms.find(f => f.id === id);
                    const au = ammoUsed[id];
                    const a = au ? ammo.find(a => a.id === au.ammoId) : null;
                    return (
                      <div key={id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{f ? f.make + " " + f.model : ""}</span>
                        {a && <span style={{ fontSize: 12, color: C.sub }}>{au.rounds} x {a.brand} {a.type}</span>}
                      </div>
                    );
                  })}
                </div>
                <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: C.sub }}>Total rounds fired</span>
                  <span style={{ fontWeight: 700, fontSize: 18, color: C.text, fontFamily: "monospace" }}>{totalRounds}</span>
                </div>
              </div>
              {totalRounds > 0 && (
                <div style={{ background: C.bg, border: "1px solid " + C.border, borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 6 }}>Ammo will be deducted on save:</div>
                  {Object.entries(ammoUsed).filter(([, v]) => v.rounds > 0).map(([fid, { ammoId, rounds }]) => {
                    const a = ammo.find(a => a.id === ammoId);
                    if (!a) return null;
                    const newQty = a.qty - Number(rounds);
                    return (
                      <div key={fid} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.sub, marginBottom: 3 }}>
                        <span>{a.brand} {a.grain ? a.grain + "gr" : ""} {a.type}</span>
                        <span style={{ fontFamily: "monospace", fontWeight: 600, color: newQty < a.threshold ? C.error : C.text }}>{a.qty} to {newQty}{newQty < a.threshold ? " !LOW!" : ""}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              {form.shareToWall && <div style={{ background: C.bg, border: "1px solid " + C.border, borderRadius: 10, padding: "10px 16px", marginBottom: 20, fontSize: 12, color: C.sub }}>This activity will be shared to The Wall</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Log Cleaning Modal
const LogCleaningModal = ({ onClose, onSave, firearms }) => {
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const [form, setForm] = useState({ firearmsId: null, cleaningType: "", date: today, productsUsed: [], notes: "", setReminder: false, reminderRounds: "", reminderDate: "" });
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })); };
  const toggleProduct = p => setForm(f => ({ ...f, productsUsed: f.productsUsed.includes(p) ? f.productsUsed.filter(x => x !== p) : [...f.productsUsed, p] }));
  const handleSave = () => {
    const e = {};
    if (!form.firearmsId) e.firearm = "Select a firearm";
    if (!form.cleaningType) e.cleaningType = "Select a cleaning type";
    if (!form.date.trim()) e.date = "Enter a date";
    if (Object.keys(e).length) { setErrors(e); return; }
    const firearm = firearms.find(f => f.id === form.firearmsId);
    onSave({ id: Date.now(), type: "Cleaning", guns: firearm ? [firearm.make + " " + firearm.model] : [], cleaningType: form.cleaningType, date: form.date, productsUsed: form.productsUsed, notes: form.notes.trim(), roundsAtCleaning: firearm ? firearm.rounds : 0, reminderRounds: form.setReminder ? form.reminderRounds : "", reminderDate: form.setReminder ? form.reminderDate : "", rounds: 0, shared: false, reactions: 0, location: null, ammoUsed: [] });
  };
  const selFirearm = firearms.find(f => f.id === form.firearmsId);
  return (
    <ModalShell title="Log Cleaning" onClose={onClose} onSave={handleSave}>
      <FormField label="Firearm" required error={errors.firearm}>
        {firearms.length === 0
          ? <div style={{ fontSize: 13, color: C.muted }}>No firearms in your arsenal yet.</div>
          : firearms.map(f => (
            <button key={f.id} onClick={() => set("firearmsId", f.id)} style={{ display: "flex", alignItems: "center", width: "100%", background: C.surface, border: "1px solid " + (form.firearmsId === f.id ? C.accent : C.border), borderRadius: 10, padding: "12px 16px", marginBottom: 8, cursor: "pointer", textAlign: "left" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginRight: 12, border: "2px solid " + (form.firearmsId === f.id ? C.accent : C.border), background: form.firearmsId === f.id ? C.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {form.firearmsId === f.id && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{f.make} {f.model}</div>
                <div style={{ fontSize: 12, color: C.sub }}>{f.caliber} - {f.rounds.toLocaleString()} rounds fired</div>
              </div>
            </button>
          ))
        }
      </FormField>
      {selFirearm && (
        <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 10, padding: "12px 16px", marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, color: C.sub }}>Round count at this cleaning</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>Saved to cleaning history</div>
          </div>
          <span style={{ fontWeight: 700, fontSize: 22, color: C.text, fontFamily: "monospace" }}>{selFirearm.rounds.toLocaleString()}</span>
        </div>
      )}
      <FormField label="Cleaning Type" required error={errors.cleaningType}>
        <SegmentedPicker options={CLEANING_TYPES} value={form.cleaningType} onChange={v => set("cleaningType", v)} />
        {errors.cleaningType && <div style={{ fontSize: 11, color: C.error, marginTop: 4 }}>{errors.cleaningType}</div>}
      </FormField>
      <FormField label="Date" required error={errors.date}><TextInput value={form.date} onChange={v => set("date", v)} placeholder="e.g. 30 Mar 2026" error={errors.date} /></FormField>
      <FormField label="Products Used">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {CLEANING_PRODUCTS.map(p => {
            const on = form.productsUsed.includes(p);
            return <button key={p} onClick={() => toggleProduct(p)} style={{ background: on ? C.accent : C.surface, border: "1px solid " + (on ? C.accent : C.border), borderRadius: 6, padding: "7px 13px", color: on ? "#fff" : C.sub, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{p}</button>;
          })}
        </div>
      </FormField>
      <FormField label="Notes">
        <textarea value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Parts replaced, anything unusual noticed..." rows={3} style={{ width: "100%", padding: "11px 14px", fontSize: 14, border: "1px solid " + C.border, borderRadius: 8, background: C.surface, color: C.text, outline: "none", boxSizing: "border-box", resize: "none", lineHeight: 1.5, fontFamily: "Helvetica Neue, Helvetica, sans-serif" }} />
      </FormField>
      <FormField label="Next Cleaning Reminder">
        <button onClick={() => set("setReminder", !form.setReminder)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", background: C.surface, border: "1px solid " + (form.setReminder ? C.accent : C.border), borderRadius: 10, padding: "12px 16px", cursor: "pointer", textAlign: "left", marginBottom: form.setReminder ? 10 : 0 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: form.setReminder ? C.accent : C.bg, border: "1.5px solid " + (form.setReminder ? C.accent : C.border), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>{form.setReminder ? "v" : ""}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>Remind me to clean again</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>After X rounds or by a certain date</div>
          </div>
        </button>
        {form.setReminder && (
          <div style={{ background: C.bg, border: "1px solid " + C.border, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>After rounds fired</div>
                <TextInput value={form.reminderRounds} onChange={v => set("reminderRounds", v)} placeholder="e.g. 500" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Or by date</div>
                <TextInput value={form.reminderDate} onChange={v => set("reminderDate", v)} placeholder="e.g. Jun 2026" />
              </div>
            </div>
          </div>
        )}
      </FormField>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}><span style={{ color: C.error }}>*</span> Required fields</div>
    </ModalShell>
  );
};

// Arsenal Screen
const ArsenalScreen = ({ firearms, onSelect, onAdd }) => {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? firearms : firearms.filter(f => f.type === filter);
  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg }}>
      <TopBar title="Arsenal" onAdd={onAdd} />
      <Chips options={["All", "Pistol", "Rifle", "Shotgun", "Revolver"]} value={filter} onChange={setFilter} />
      <div style={{ padding: "12px 16px 32px" }}>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "48px 0", color: C.muted }}><div style={{ fontSize: 32, marginBottom: 12 }}>[ ]</div><div style={{ fontSize: 14, fontWeight: 600, color: C.sub }}>No firearms yet</div><div style={{ fontSize: 12, marginTop: 4 }}>Tap + to add your first</div></div>}
        {filtered.map(f => (
          <button key={f.id} onClick={() => onSelect(f)} style={{ display: "block", width: "100%", textAlign: "left", background: C.surface, borderRadius: 12, border: "1px solid " + C.border, marginBottom: 10, cursor: "pointer", boxShadow: C.shadow, padding: 0 }}>
            <div style={{ padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: C.text, fontFamily: "Georgia, serif", marginBottom: 3 }}>{f.make} {f.model}</div>
                  <div style={{ fontSize: 12, color: C.sub }}>{f.caliber}{f.location ? " - " + f.location : ""}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, fontSize: 22, color: C.text, fontFamily: "monospace" }}>{(f.rounds || 0).toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>rounds</div>
                </div>
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {f.type && <Badge label={f.type} />}
                {f.condition && <Badge label={f.condition} />}
              </div>
            </div>
            <div style={{ background: C.bg, borderTop: "1px solid " + C.border, padding: "8px 18px", borderRadius: "0 0 12px 12px", fontSize: 11, color: C.muted }}>Tap to view</div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Firearm Detail
const FirearmDetail = ({ firearm, onBack, toast, ammo, onLogActivity, onLogCleaning }) => {
  const compatible = ammo.filter(a => a.caliber === firearm.caliber);
  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg }}>
      <TopBar title={firearm.make} onBack={onBack} />
      <div style={{ background: C.surface, padding: "20px 18px", borderBottom: "1px solid " + C.border }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 3 }}>{firearm.make} {firearm.model}</div>
        <div style={{ fontSize: 13, color: C.sub, marginBottom: 14 }}>{firearm.caliber}{firearm.location ? " - " + firearm.location : ""}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
          {firearm.type && <Badge label={firearm.type} />}
          {firearm.condition && <Badge label={firearm.condition} />}
        </div>
        <StatRow items={[{ label: "Rounds Fired", value: (firearm.rounds || 0).toLocaleString() }, { label: "Caliber", value: firearm.caliber || "--" }, { label: "Condition", value: firearm.condition || "--" }]} />
      </div>
      <div style={{ padding: 16 }}>
        {compatible.length > 0 && (
          <>
            <SectionLabel>Compatible Ammo</SectionLabel>
            {compatible.map(a => {
              const low = a.qty <= a.threshold;
              return (
                <div key={a.id} style={{ background: C.surface, borderRadius: 10, border: "1px solid " + (low ? "#55555555" : C.border), padding: "12px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: C.shadow }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{a.brand} {a.grain ? a.grain + "gr" : ""}</div>
                    <div style={{ fontSize: 12, color: C.sub, marginTop: 1 }}>{a.caliber} - {a.type}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, fontSize: 20, color: C.text, fontFamily: "monospace" }}>{a.qty}</div>
                    <div style={{ fontSize: 10, fontWeight: low ? 700 : 400, color: low ? C.error : C.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>{low ? "LOW" : "rounds"}</div>
                  </div>
                </div>
              );
            })}
            <HR mt={20} mb={20} />
          </>
        )}
        <SectionLabel>History</SectionLabel>
        {INIT_ACTIVITIES.map((a, i) => (
          <div key={a.id} style={{ display: "flex", gap: 14, marginBottom: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: C.surface, border: "1.5px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.sub }}>{a.type === "Cleaning" ? "C" : "A"}</div>
              {i < INIT_ACTIVITIES.length - 1 && <div style={{ flex: 1, width: 1, background: C.border, marginTop: 4 }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{a.type}</span>
                <span style={{ fontSize: 11, color: C.muted }}>{a.date}</span>
              </div>
              {a.location && <div style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>{a.location}</div>}
              <div style={{ fontSize: 12, color: C.sub, lineHeight: 1.5 }}>{a.notes}</div>
              {a.rounds > 0 && <div style={{ fontSize: 11, fontWeight: 600, color: C.text, marginTop: 4 }}>{a.rounds} rounds fired</div>}
            </div>
          </div>
        ))}
        <HR mt={4} mb={20} />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onLogActivity} style={{ flex: 1, background: C.accent, border: "none", borderRadius: 10, padding: "13px 0", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Log Activity</button>
          <button onClick={onLogCleaning} style={{ flex: 1, background: C.surface, border: "1px solid " + C.border, borderRadius: 10, padding: "13px 0", color: C.text, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Log Cleaning</button>
        </div>
      </div>
    </div>
  );
};

// Ammo Screen
const AmmoScreen = ({ ammo, onAdd }) => {
  const grouped = ammo.reduce((acc, a) => { if (!acc[a.caliber]) acc[a.caliber] = []; acc[a.caliber].push(a); return acc; }, {});
  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg }}>
      <TopBar title="Ammo Stock" onAdd={onAdd} />
      <div style={{ padding: "12px 16px 32px" }}>
        {ammo.length === 0 && <div style={{ textAlign: "center", padding: "48px 0", color: C.muted }}><div style={{ fontSize: 32, marginBottom: 12 }}>[ ]</div><div style={{ fontSize: 14, fontWeight: 600, color: C.sub }}>No ammo logged yet</div><div style={{ fontSize: 12, marginTop: 4 }}>Tap + to add your first batch</div></div>}
        {Object.entries(grouped).map(([caliber, rounds]) => (
          <div key={caliber} style={{ marginBottom: 24 }}>
            <SectionLabel>{caliber}</SectionLabel>
            {rounds.map(a => {
              const low = a.qty <= a.threshold;
              return (
                <div key={a.id} style={{ background: C.surface, borderRadius: 10, border: "1px solid " + (low ? "#55555544" : C.border), padding: "13px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: C.shadow }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{a.brand}</div>
                    <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{a.grain ? a.grain + "gr - " : ""}{a.type}{a.pricePerRound ? " - $" + Number(a.pricePerRound).toFixed(2) + "/rd" : ""}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {low && <span style={{ fontSize: 10, fontWeight: 700, color: C.text, background: C.bg, border: "1px solid " + C.border, borderRadius: 3, padding: "2px 7px", textTransform: "uppercase", letterSpacing: 0.8 }}>Low</span>}
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, fontSize: 22, color: C.text, fontFamily: "monospace" }}>{a.qty}</div>
                      <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>rounds</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// Activities Screen
const ActivitiesScreen = ({ activities, onAdd }) => {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? activities : activities.filter(a => a.type === filter);
  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg }}>
      <TopBar title="Activities" onAdd={onAdd} />
      <Chips options={["All", "Hunting", "Range", "Competition", "Training", "Plinking", "Cleaning"]} value={filter} onChange={setFilter} />
      <div style={{ padding: "12px 16px 32px" }}>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "48px 0", color: C.muted }}><div style={{ fontSize: 32, marginBottom: 12 }}>[ ]</div><div style={{ fontSize: 14, fontWeight: 600, color: C.sub }}>No activities yet</div><div style={{ fontSize: 12, marginTop: 4 }}>Tap + to log your first session</div></div>}
        {filtered.map(a => (
          <div key={a.id} style={{ background: C.surface, borderRadius: 12, border: "1px solid " + C.border, marginBottom: 10, overflow: "hidden", boxShadow: C.shadow }}>
            <div style={{ padding: "14px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <Badge label={a.type} filled />
                <span style={{ fontSize: 11, color: C.muted }}>{a.date}</span>
              </div>
              {a.location && <div style={{ fontSize: 12, color: C.sub, marginBottom: 5 }}>{a.location}</div>}
              {a.notes && <div style={{ fontSize: 13, color: C.text, lineHeight: 1.55, marginBottom: 10 }}>{a.notes}</div>}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {a.guns.map(g => <Badge key={g} label={g} />)}
                {a.rounds > 0 && <Badge label={a.rounds + " rds"} />}
              </div>
            </div>
            {a.shared && <div style={{ background: C.bg, borderTop: "1px solid " + C.border, padding: "8px 18px", fontSize: 11, color: C.muted }}>Shared to Wall - {a.reactions} reactions</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

// Wall Screen
const WallScreen = () => {
  const [reacted, setReacted] = useState({});
  const toggle = (id, e) => setReacted(r => ({ ...r, [id + "-" + e]: !r[id + "-" + e] }));
  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg }}>
      <TopBar title="The Wall" />
      <div style={{ padding: "12px 16px 32px" }}>
        {WALL_POSTS.map(p => (
          <div key={p.id} style={{ background: C.surface, borderRadius: 12, border: "1px solid " + C.border, marginBottom: 14, overflow: "hidden", boxShadow: C.shadow }}>
            <div style={{ padding: "14px 16px 12px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{p.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{p.user}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{p.location}</div>
              </div>
              <Badge label={p.type} filled />
            </div>
            <HR />
            <div style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6, marginBottom: 10 }}>{p.story}</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                {p.guns.map(g => <Badge key={g} label={g} />)}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {["+1", "fire", "shot"].map(emoji => {
                  const on = reacted[p.id + "-" + emoji];
                  return <button key={emoji} onClick={() => toggle(p.id, emoji)} style={{ background: on ? C.accent : C.bg, border: "1px solid " + (on ? C.accent : C.border), borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: on ? 700 : 400, color: on ? "#fff" : C.sub, cursor: "pointer" }}>{emoji}</button>;
                })}
                <span style={{ marginLeft: "auto", fontSize: 11, color: C.muted }}>{p.reactions} - {p.comments} comments</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Profile Screen
const ProfileScreen = ({ toast, firearms, activities }) => {
  const settings = [
    { label: "App Lock", desc: "Biometric enabled", msg: "App Lock settings" },
    { label: "Cloud Sync", desc: "Synced just now", msg: "Cloud Sync settings" },
    { label: "Notifications", desc: "On", msg: "Notification preferences" },
    { label: "Privacy", desc: "", msg: "Privacy settings" },
    { label: "Export Data", desc: "PDF / CSV", msg: "Exporting your data..." },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg }}>
      <TopBar title="Profile" />
      <div style={{ background: C.surface, padding: "20px 18px", borderBottom: "1px solid " + C.border }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", flexShrink: 0, background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20 }}>J</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: C.text, fontFamily: "Georgia, serif" }}>JohnDoe_TX</div>
            <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>Hunter and shooter since 2008</div>
          </div>
        </div>
        <StatRow items={[{ label: "Firearms", value: firearms.length }, { label: "Activities", value: activities.length }, { label: "Followers", value: 128 }]} />
      </div>
      <div style={{ background: C.surface, margin: "12px 16px 0", borderRadius: 12, border: "1px solid " + C.border, overflow: "hidden", boxShadow: C.shadow }}>
        {settings.map((item, i) => (
          <div key={item.label}>
            <button onClick={() => toast(item.msg)} style={{ display: "flex", alignItems: "center", width: "100%", padding: "15px 18px", cursor: "pointer", background: "none", border: "none", textAlign: "left" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{item.label}</div>
                {item.desc ? <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{item.desc}</div> : null}
              </div>
              <span style={{ color: C.muted, fontSize: 16 }}>{">"}</span>
            </button>
            {i < settings.length - 1 && <HR />}
          </div>
        ))}
      </div>
      <div style={{ background: C.surface, margin: "12px 16px 0", borderRadius: 12, border: "1px solid " + C.border, overflow: "hidden", boxShadow: C.shadow }}>
        <button onClick={() => toast("Signing out...")} style={{ display: "flex", alignItems: "center", width: "100%", padding: "15px 18px", cursor: "pointer", background: "none", border: "none", textAlign: "left" }}>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 600, color: C.sub, fontSize: 14 }}>Sign Out</div></div>
          <span style={{ color: C.muted, fontSize: 16 }}>{">"}</span>
        </button>
      </div>
      <div style={{ height: 28 }} />
    </div>
  );
};

const TABS = [
  { id: "arsenal", label: "Arsenal" },
  { id: "ammo", label: "Ammo" },
  { id: "activities", label: "Activities" },
  { id: "wall", label: "Wall" },
  { id: "profile", label: "Profile" },
];

export default function App() {
  const [tab, setTab] = useState("arsenal");
  const [selected, setSelected] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [showAddFirearm, setShowAddFirearm] = useState(false);
  const [showAddAmmo, setShowAddAmmo] = useState(false);
  const [showLogActivity, setShowLogActivity] = useState(false);
  const [showLogCleaning, setShowLogCleaning] = useState(false);
  const [firearms, setFirearms] = useState(INIT_FIREARMS);
  const [ammo, setAmmo] = useState(INIT_AMMO);
  const [activities, setActivities] = useState(INIT_ACTIVITIES);

  const toast = msg => setToastMsg(msg);

  const handleSaveFirearm = f => { setFirearms(fs => [{ ...f, id: Date.now() }, ...fs]); setShowAddFirearm(false); toast(f.make + " " + f.model + " added!"); };
  const handleSaveAmmo = a => { setAmmo(prev => [{ ...a, id: Date.now() }, ...prev]); setShowAddAmmo(false); toast(a.brand + " " + a.caliber + " added - " + a.qty + " rounds"); };
  const handleSaveActivity = (act, ammoArr) => {
    setActivities(a => [act, ...a]);
    if (ammoArr.length > 0) setAmmo(prev => prev.map(a => { const used = ammoArr.find(u => u.ammoId === a.id); return used ? { ...a, qty: Math.max(0, a.qty - used.rounds) } : a; }));
    setShowLogActivity(false);
    const total = ammoArr.reduce((s, u) => s + u.rounds, 0);
    toast(act.type + " logged" + (total > 0 ? " - " + total + " rounds deducted" : "") + "!");
  };
  const handleSaveCleaning = c => { setActivities(a => [c, ...a]); setShowLogCleaning(false); toast("Cleaning logged for " + (c.guns[0] || "firearm") + "!"); };

  const renderScreen = () => {
    if (tab === "arsenal") return selected
      ? <FirearmDetail firearm={selected} onBack={() => setSelected(null)} toast={toast} ammo={ammo} onLogActivity={() => setShowLogActivity(true)} onLogCleaning={() => setShowLogCleaning(true)} />
      : <ArsenalScreen firearms={firearms} onSelect={setSelected} onAdd={() => setShowAddFirearm(true)} />;
    if (tab === "ammo") return <AmmoScreen ammo={ammo} onAdd={() => setShowAddAmmo(true)} />;
    if (tab === "activities") return <ActivitiesScreen activities={activities} onAdd={() => setShowLogActivity(true)} />;
    if (tab === "wall") return <WallScreen />;
    if (tab === "profile") return <ProfileScreen toast={toast} firearms={firearms} activities={activities} />;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: C.bg, fontFamily: "Helvetica Neue, Helvetica, sans-serif", maxWidth: 430, margin: "0 auto", boxShadow: "0 0 40px rgba(0,0,0,0.08)", position: "relative", overflow: "hidden" }}>
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>{renderScreen()}</div>
      <div style={{ display: "flex", background: C.surface, borderTop: "1px solid " + C.border, padding: "8px 0 12px", zIndex: 30 }}>
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => { setTab(t.id); setSelected(null); }} style={{ flex: 1, background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", padding: "4px 0" }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: active ? C.accent : "transparent" }} />
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? C.text : C.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>{t.label}</span>
            </button>
          );
        })}
      </div>
      {showAddFirearm && <AddFirearmModal onClose={() => setShowAddFirearm(false)} onSave={handleSaveFirearm} />}
      {showAddAmmo && <AddAmmoModal onClose={() => setShowAddAmmo(false)} onSave={handleSaveAmmo} />}
      {showLogActivity && <LogActivityModal onClose={() => setShowLogActivity(false)} onSave={handleSaveActivity} firearms={firearms} ammo={ammo} />}
      {showLogCleaning && <LogCleaningModal onClose={() => setShowLogCleaning(false)} onSave={handleSaveCleaning} firearms={firearms} />}
      {toastMsg && <Toast message={toastMsg} onDone={() => setToastMsg(null)} />}
    </div>
  );
}
