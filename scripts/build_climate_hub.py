"""
Climate Atlas hub generator: climate/index.html is DERIVED from the climate guide pages (SSOT).

Every climate/*.html guide is parsed for name, latitude, Köppen class and DLI KPIs, then
rendered into one filterable hub page. Each guide's back-link is pointed at the hub so the
40 guides form a connected cluster (hub -> guide, guide -> hub) instead of orphans.

Usage: python build_climate_hub.py
"""
import html as html_lib
import json
import os
import re

PORTAL_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLIMATE_DIR = os.path.join(PORTAL_DIR, "climate")
HUB_PATH = os.path.join(CLIMATE_DIR, "index.html")
HUB_URL = "https://inwoovation.com/climate/"
OLD_BACKLINK = '<a href="/guides.html"'
OLD_BACKLINK_TEXT = "← Return to Guides & Articles"
NEW_BACKLINK_TEXT = "← Global Ag-Climate Atlas (all hubs)"


def _first(pattern, text, default=""):
    match = re.search(pattern, text, re.S | re.I)
    return html_lib.unescape(re.sub(r"<[^>]+>", "", match.group(1))).strip() if match else default


def _kpi(text, label_fragment):
    pattern = r'<div class="kpi-val"[^>]*>(.*?)</div>\s*<div class="kpi-lbl">[^<]*' + label_fragment
    return _first(pattern, text, "—")


def _signed_latitude(badge):
    match = re.search(r"([\d.]+)\s*°\s*([NS])", badge)
    if not match:
        return None
    value = float(match.group(1))
    return value if match.group(2) == "N" else -value


def parse_guide(filename):
    with open(os.path.join(CLIMATE_DIR, filename), encoding="utf-8") as fh:
        page = fh.read()
    badge = _first(r'<span class="climate-badge">(.*?)</span>', page)
    return {
        "file": filename,
        "name": _first(r"<h1[^>]*>(.*?)</h1>", page) or filename,
        "lat": _signed_latitude(badge),
        "koppen": _kpi(page, "Köppen"),
        "dli_summer": _kpi(page, "Summer"),
        "dli_winter": _kpi(page, "Winter Minimum"),
        "desc": _first(r'<meta name="description" content="([^"]*)"', page),
    }


def load_guides():
    files = sorted(f for f in os.listdir(CLIMATE_DIR) if f.endswith(".html") and f != "index.html")
    guides = [parse_guide(f) for f in files]
    return sorted(guides, key=lambda g: -(g["lat"] if g["lat"] is not None else -999))


def _lat_label(lat):
    if lat is None:
        return "—"
    return f"{abs(lat):.1f}°{'N' if lat >= 0 else 'S'}"


def render_card(guide):
    esc = html_lib.escape
    search_blob = esc(f"{guide['name']} {guide['koppen']}".lower())
    return f"""        <a class="atlas-card" href="{esc(guide['file'])}" data-search="{search_blob}">
            <span class="atlas-lat">{_lat_label(guide['lat'])}</span>
            <h2>{esc(guide['name'])}</h2>
            <p class="atlas-koppen">{esc(guide['koppen'])}</p>
            <dl>
                <div><dt>Summer DLI</dt><dd>{esc(guide['dli_summer'])}</dd></div>
                <div><dt>Winter DLI</dt><dd>{esc(guide['dli_winter'])}</dd></div>
            </dl>
        </a>"""


def render_jsonld(guides):
    items = [{"@type": "ListItem", "position": i + 1, "name": g["name"],
              "url": f"{HUB_URL}{g['file']}"} for i, g in enumerate(guides)]
    data = {"@context": "https://schema.org", "@type": "CollectionPage",
            "name": "Global Ag-Climate Atlas for Greenhouse Engineering", "url": HUB_URL,
            "publisher": {"@type": "Organization", "name": "Inwoovation Lab", "url": "https://inwoovation.com"},
            "mainEntity": {"@type": "ItemList", "numberOfItems": len(items), "itemListElement": items}}
    return json.dumps(data, ensure_ascii=False, indent=2)


def render_hub(guides):
    count = len(guides)
    title = f"Global Ag-Climate Atlas: {count} Greenhouse Climate Hubs | Inwoovation Lab"
    desc = (f"Compare {count} commercial greenhouse regions by latitude, Köppen climate class and "
            "seasonal Daily Light Integral (DLI) to plan screens, lighting and heating.")
    cards = "\n".join(render_card(g) for g in guides)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-V4RYJBMEDE"></script>
    <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){{dataLayer.push(arguments);}}
       gtag('js', new Date());
       gtag('config', 'G-V4RYJBMEDE');
    </script>
    <meta name="google-adsense-account" content="ca-pub-8597809158257497">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{html_lib.escape(title)}</title>
    <link rel="canonical" href="{HUB_URL}" />
    <meta name="description" content="{html_lib.escape(desc)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{HUB_URL}">
    <meta property="og:title" content="{html_lib.escape(title)}">
    <meta property="og:description" content="{html_lib.escape(desc)}">
    <meta property="og:image" content="https://inwoovation.com/og-cover.jpg">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8597809158257497" crossorigin="anonymous"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../styles.css">
    <style>
        .atlas {{ max-width: 1180px; margin: 32px auto 64px; padding: 0 24px; }}
        .atlas-back {{ color: #38bdf8; text-decoration: none; font-weight: 600; font-size: 0.95rem; }}
        .atlas-head {{ text-align: center; margin: 24px 0 28px; }}
        .atlas-head h1 {{ font-family: 'Outfit', sans-serif; font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 800; color: #f8fafc; margin-bottom: 12px; }}
        .atlas-head p {{ color: #94a3b8; font-size: 1.05rem; line-height: 1.7; max-width: 760px; margin: 0 auto; }}
        .atlas-filter {{ display: block; width: 100%; max-width: 520px; margin: 0 auto 28px; padding: 14px 18px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.14); background: rgba(15,23,42,0.85); color: #f8fafc; font-size: 1rem; font-family: inherit; }}
        .atlas-filter:focus {{ outline: 2px solid #38bdf8; outline-offset: 2px; }}
        .atlas-grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }}
        .atlas-card {{ display: block; text-decoration: none; background: rgba(30,41,59,0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 20px; transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }}
        .atlas-card:hover, .atlas-card:focus-visible {{ transform: translateY(-3px); border-color: rgba(56,189,248,0.5); box-shadow: 0 12px 28px rgba(56,189,248,0.15); }}
        .atlas-lat {{ display: inline-block; font-size: 0.75rem; font-weight: 700; letter-spacing: .05em; color: #38bdf8; background: rgba(56,189,248,0.12); padding: 4px 10px; border-radius: 8px; }}
        .atlas-card h2 {{ font-family: 'Outfit', sans-serif; font-size: 1.08rem; color: #f8fafc; margin: 10px 0 6px; line-height: 1.35; }}
        .atlas-koppen {{ color: #10b981; font-size: 0.85rem; margin-bottom: 12px; }}
        .atlas-card dl {{ display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }}
        .atlas-card dt {{ color: #94a3b8; font-size: 0.72rem; text-transform: uppercase; letter-spacing: .04em; }}
        .atlas-card dd {{ color: #f8fafc; font-weight: 700; font-family: 'Outfit', sans-serif; }}
        .atlas-empty {{ display: none; text-align: center; color: #94a3b8; margin-top: 24px; }}
        footer {{ text-align: center; color: #94a3b8; font-size: 0.85rem; padding: 32px 16px; }}
        footer a {{ color: #94a3b8; }}
    </style>
    <script type="application/ld+json">
{render_jsonld(guides)}
    </script>
</head>
<body>
<main class="atlas">
    <a class="atlas-back" href="/guides.html">← Guides &amp; Articles</a>
    <header class="atlas-head">
        <h1>Global Ag-Climate Atlas</h1>
        <p>{count} commercial greenhouse regions, ordered north to south. Each hub summarises latitude,
           Köppen climate class and seasonal natural Daily Light Integral (DLI, mol/m²/day) as a starting
           point for screen, lighting and heating design.</p>
    </header>
    <label for="atlas-filter" class="visually-hidden" style="position:absolute;left:-9999px;">Filter climate hubs</label>
    <input id="atlas-filter" class="atlas-filter" type="search" placeholder="Filter by region or climate class (e.g. Cfb, Spain, desert)…" autocomplete="off">
    <section class="atlas-grid" id="atlas-grid">
{cards}
    </section>
    <p class="atlas-empty" id="atlas-empty">No hub matches that filter.</p>
</main>
<footer>
    <p>© 2026 Inwoovation Lab | <a href="/privacy-policy.html">Privacy Policy</a> | <a href="/terms-of-service.html">Terms of Service</a> | <a href="/about.html">About</a> | <a href="/contact.html">Contact</a></p>
</footer>
<script>
(function () {{
    var input = document.getElementById('atlas-filter');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.atlas-card'));
    var empty = document.getElementById('atlas-empty');
    input.addEventListener('input', function () {{
        var query = input.value.trim().toLowerCase();
        var shown = 0;
        cards.forEach(function (card) {{
            var match = !query || card.getAttribute('data-search').indexOf(query) !== -1;
            card.style.display = match ? '' : 'none';
            if (match) shown++;
        }});
        empty.style.display = shown ? 'none' : 'block';
    }});
}})();
</script>
</body>
</html>
"""


BACKLINK_RE = re.compile(r'<a href="/guides\.html"([^>]*)>(\s*)← Return to Guides &(?:amp;)? Articles')


def relink_guide_backlinks(guides):
    """Point each guide's '← Return to Guides' anchor (and only that anchor) at the hub. Idempotent."""
    changed = 0
    for guide in guides:
        path = os.path.join(CLIMATE_DIR, guide["file"])
        with open(path, encoding="utf-8", newline="") as fh:
            page = fh.read()
        updated = BACKLINK_RE.sub(lambda m: f'<a href="/climate/"{m.group(1)}>{m.group(2)}{NEW_BACKLINK_TEXT}', page)
        if updated != page:
            with open(path, "w", encoding="utf-8", newline="") as fh:
                fh.write(updated)
            changed += 1
    return changed


def build():
    guides = load_guides()
    unparsed = [g["file"] for g in guides if g["lat"] is None]
    if unparsed:
        raise SystemExit(f"❌ Climate hub: latitude badge not found in {unparsed}")
    with open(HUB_PATH, "w", encoding="utf-8") as fh:
        fh.write(render_hub(guides))
    relinked = relink_guide_backlinks(guides)
    print(f"🌍 Climate hub built: {len(guides)} guides -> climate/index.html ({relinked} back-links repointed)")
    return guides


if __name__ == "__main__":
    build()
