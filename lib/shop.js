// lib/shop.js
// ---------------------------------------------------------------------------
// Data layer for Little Crafts by Jie.
// Products and the commissions on/off flag both live in a Google Sheet that
// Jie edits. The site reads the published CSV directly in the browser, so her
// edits appear within seconds WITHOUT a rebuild/redeploy.
//
// HOW TO GET THESE URLS (one-time, ~2 min):
//   1. Open the Google Sheet.
//   2. File > Share > Publish to web.
//   3. Under "Link", choose the tab (e.g. "Products"), format = "Comma-separated
//      values (.csv)", click Publish. Copy the URL. Repeat for the "settings" tab.
//   4. Paste the two URLs below.
// ---------------------------------------------------------------------------

export const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6KoMd-EtDcou4uANTDJI8QtjBhyUnSwdVEqdSvSgs3jkwHcvrlJrMeshXRxG_I_iYp__F_ctKz-tm/pub?gid=1005901194&single=true&output=csv";

export const SETTINGS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6KoMd-EtDcou4uANTDJI8QtjBhyUnSwdVEqdSvSgs3jkwHcvrlJrMeshXRxG_I_iYp__F_ctKz-tm/pub?gid=474251689&single=true&output=csv";

// --- CSV parsing (quote-aware) ---------------------------------------------
export function parseCSV(text) {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .filter((l) => l.trim() !== "");
  if (!lines.length) return [];
  const parseLine = (line) => {
    const out = [];
    let cur = "";
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) {
        if (c === '"') {
          if (line[i + 1] === '"') {
            cur += '"';
            i++;
          } else q = false;
        } else cur += c;
      } else {
        if (c === ",") {
          out.push(cur);
          cur = "";
        } else if (c === '"') q = true;
        else cur += c;
      }
    }
    out.push(cur);
    return out;
  };
  const headers = parseLine(lines[0]).map((h) => h.trim().toLowerCase());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = parseLine(lines[i]);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = (cells[idx] || "").trim();
    });
    rows.push(obj);
  }
  return rows;
}

// --- helpers ---------------------------------------------------------------
const inStock = (s) => /^(y|yes|true|in stock|1)/i.test(String(s || "").trim());

// Resolve the sheet's photo_url into a URL the browser can load:
//   - full http(s) link             -> used as-is (e.g. a Cloudinary URL)
//   - root-relative path (/foo.png)  -> used as-is
//   - bare filename (red-heart.png)  -> served from /products/<filename>
// So the sheet can just hold the uploaded file's NAME — Jie doesn't have to
// remember the /products/ prefix. (Google Drive links don't work: Drive blocks
// image hotlinking, so those fall back to the neutral placeholder.)
const resolvePhoto = (raw) => {
  const s = String(raw || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("/")) return s;
  return "/products/" + s.replace(/^products\//i, "");
};

// Products sheet columns: name | price | category | in_stock | photo_url | description
// (`size` is optional — currently driven from code/seed and the Size Guide page,
// but it's read here too so it can be added as a sheet column later with no code change.)
export function normalizeProducts(rows) {
  return (rows || [])
    .map((r) => {
      const priceClean = String(r.price || "")
        .replace(/^£\s*/, "")
        .trim();
      return {
        name: r.name || "",
        priceLabel: priceClean ? "£" + priceClean : "",
        category: (r.category || "").trim() || "handmade",
        soldOut: !inStock(r.in_stock ?? r.stock),
        size: (r.size || "").trim(),
        description: (r.description || "").trim(),
        photo: resolvePhoto(r.photo_url ?? r.photo),
      };
    })
    .filter((p) => p.name.trim() !== "");
}

export async function fetchProducts() {
  const res = await fetch(SHEET_CSV_URL, { cache: "no-store" });
  const text = await res.text();
  return normalizeProducts(parseCSV(text));
}

// settings sheet: a key/value tab, e.g. a column `commissions_open` with value yes/no
export async function fetchCommissionsOpen() {
  const res = await fetch(SETTINGS_CSV_URL, { cache: "no-store" });
  const rows = parseCSV(await res.text());
  let val;
  if (rows.length) {
    if ("commissions_open" in rows[0]) val = rows[0].commissions_open;
    else {
      const kv = rows.find((r) => /commission/i.test(r.key || r.setting || ""));
      if (kv) val = kv.value;
    }
  }
  return /^(y|yes|true|open|1)/i.test(String(val || "").trim());
}
