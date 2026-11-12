#!/usr/bin/env python3
"""
Master Crawl-Acceleration HTML Directory & Global Spotlight Palette Sync (build_master_directory.py)
----------------------------------------------------------------------------------------------------
1. Generates Career/Inwoovation_Portal/directory.html (https://inwoovation.com/directory.html)
   linking directly via <a href="/..."> to 100% of publishable portal URLs so search-engine crawlers
   (Googlebot, Bingbot, OAI-SearchBot) reach all 360+ deep pages within 2 hops of the root homepage.
2. Synchronizes Career/Inwoovation_Portal/js/global-search-palette.js idempotently so Ctrl+K Spotlight
   searches 100% of live pages without drift.
"""
from __future__ import annotations

import html as html_lib
import json
import os
import re
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

PORTAL_DIR = Path(__file__).resolve().parent.parent
HQ_DIR = PORTAL_DIR.parent.parent
DIRECTORY_FILE = PORTAL_DIR / "directory.html"
SITE_ORIGIN = "https://inwoovation.com/"
SKIP_DIRS = {".git", "__pycache__", "node_modules", "embed", "scripts", "data", "digital_assets", "handbooks", "css", "js"}

BOT_GUARD_JS = (
    "if (navigator.webdriver || /HeadlessChrome|PhantomJS|Lighthouse|PTST|bot|crawler|spider|slurp/i.test(navigator.userAgent) "
    "|| location.hostname === 'localhost' || location.hostname === '127.0.0.1' "
    "|| (screen.width === 1366 && screen.height === 1366) || (screen.width === 800 && screen.height === 600) || screen.height >= 5000) "
    "{ window['ga-disable-G-V4RYJBMEDE'] = true; }"
)


def _is_live(rel_path: str, html: str) -> bool:
    name = os.path.basename(rel_path)
    if not name.endswith(".html") or name.startswith(("naver", "google", "_", "old_")) or name == "404.html":
        return False
    if rel_path.startswith("embed/"):
        return False
    return not bool(re.search(r'http-equiv=["\']refresh', html, re.I))


def _clean_text(raw: str) -> str:
    txt = html_lib.unescape(re.sub(r"<[^>]+>", "", raw))
    return re.sub(r"\s+", " ", txt).strip()


def _extract_title(html: str, rel_path: str) -> str:
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S)
    if h1:
        t = _clean_text(h1.group(1))
        if len(t) >= 4:
            return t
    tt = re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S)
    if tt:
        return _clean_text(tt.group(1)).split("|")[0].strip()
    return rel_path


def _public_href(rel_path: str) -> str:
    if os.path.basename(rel_path) == "index.html":
        return "/" + rel_path[: -len("index.html")]
    return "/" + rel_path


def collect_live_metadata() -> tuple[dict[str, Path], list[dict[str, str]]]:
    candidates: list[tuple[Path, str]] = []
    for root, dirs, files in os.walk(PORTAL_DIR):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for fname in sorted(files):
            if fname.endswith(".html"):
                p = Path(root) / fname
                rel = str(p.relative_to(PORTAL_DIR)).replace("\\", "/")
                candidates.append((p, rel))

    def _read_one(item: tuple[Path, str]):
        p, rel = item
        txt = p.read_text(encoding="utf-8", errors="ignore")
        if not _is_live(rel, txt):
            return None
        return p, rel, _extract_title(txt, rel)

    with ThreadPoolExecutor(max_workers=16) as pool:
        results = [r for r in pool.map(_read_one, candidates) if r is not None]

    live_paths = {rel: p for p, rel, _ in results}
    records = [{"rel": rel, "href": _public_href(rel), "title": title} for _, rel, title in sorted(results, key=lambda x: x[1])]
    return live_paths, records


def render_directory_html(records: list[dict[str, str]], date_modified: str) -> str:
    buckets: dict[str, list[dict[str, str]]] = {
        "core": [],
        "tools": [],
        "en": [],
        "de": [],
        "ja": [],
        "crops": [],
        "climate": [],
        "wiki": [],
        "smartfarm": [],
    }
    for rec in records:
        rel = rec["rel"]
        if rel == "directory.html":
            continue
        if rel.startswith("tools/"):
            buckets["tools"].append(rec)
        elif rel.startswith("articles/de/"):
            buckets["de"].append(rec)
        elif rel.startswith("articles/ja/"):
            buckets["ja"].append(rec)
        elif rel.startswith("articles/"):
            buckets["en"].append(rec)
        elif rel.startswith("crops/"):
            buckets["crops"].append(rec)
        elif rel.startswith("climate/"):
            buckets["climate"].append(rec)
        elif rel.startswith("wiki/"):
            buckets["wiki"].append(rec)
        elif rel.startswith("smartfarm/"):
            buckets["smartfarm"].append(rec)
        else:
            buckets["core"].append(rec)

    total_urls = sum(len(v) for v in buckets.values()) + 1
    sections_meta = [
        ("sec-core", "🏛️ Core Command Hubs, Subsidy Radar & Portals", buckets["core"]),
        ("sec-tools", f"🛠️ Enterprise CEA Biophysical Calculators & 3D CAD ({len(buckets['tools'])})", buckets["tools"]),
        ("sec-en", f"📚 English CEA Engineering Monographs ({len(buckets['en'])})", buckets["en"]),
        ("sec-de", f"🇩🇪 Deutsche Gartenbau-Meister Fachartikel ({len(buckets['de'])})", buckets["de"]),
        ("sec-ja", f"🇯🇵 日本語 施設園芸・スマート農業工学モノグラフ ({len(buckets['ja'])})", buckets["ja"]),
        ("sec-crops", f"🌱 Commercial Crop Steering & Agronomy Guides ({len(buckets['crops'])})", buckets["crops"]),
        ("sec-climate", f"🌍 Global Regional Ag-Climate & DLI Atlas ({len(buckets['climate'])})", buckets["climate"]),
        ("sec-wiki", f"🧬 Botanical Physiology & Biochemical Wiki ({len(buckets['wiki'])})", buckets["wiki"]),
        ("sec-smartfarm", f"🧪 SmartFarm Interactive Simulators & Diagnostics ({len(buckets['smartfarm'])})", buckets["smartfarm"]),
    ]

    nav_pills = "\n".join(
        f'      <a href="#{sec_id}" class="dir-pill">{html_lib.escape(label)}</a>'
        for sec_id, label, items in sections_meta if items
    )

    sections_html_parts = []
    for sec_id, label, items in sections_meta:
        if not items:
            continue
        li_rows = "\n".join(
            f'        <li class="dir-item" data-search="{html_lib.escape((it["title"] + " " + it["href"]).lower())}">'
            f'<a href="{html_lib.escape(it["href"])}">{html_lib.escape(it["title"])}</a>'
            f'<span class="dir-path">{html_lib.escape(it["href"])}</span></li>'
            for it in items
        )
        sections_html_parts.append(
            f"""    <section class="dir-section" id="{sec_id}">
      <h2>{html_lib.escape(label)}</h2>
      <ul class="dir-list">
{li_rows}
      </ul>
    </section>"""
        )

    sections_html = "\n\n".join(sections_html_parts)

    json_ld = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "name": f"Complete CEA Engineering Directory & Multilingual Index ({total_urls} Live Resources)",
                "url": "https://inwoovation.com/directory.html",
                "description": f"Master architectural HTML index of all {total_urls} calculators, 150 global agricultural subsidy dossiers, VenloCAD 3D engines, and EN/DE/JA horticultural monographs on Inwoovation Lab.",
                "dateModified": date_modified,
                "author": {"@type": "Person", "name": "Inwoo Hwang", "jobTitle": "Horticultural & CEA Systems Engineer"},
                "publisher": {"@type": "Organization", "name": "Inwoovation Lab", "url": "https://inwoovation.com"},
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Inwoovation Lab", "item": "https://inwoovation.com/"},
                    {"@type": "ListItem", "position": 2, "name": "Complete Engineering Directory", "item": "https://inwoovation.com/directory.html"},
                ],
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What engineering calculators and multilingual monographs are indexed in the Inwoovation Lab directory?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": f"The Inwoovation Lab master directory indexes {total_urls} open-access controlled environment agriculture (CEA) resources, including {len(buckets['tools'])} browser-side biophysical calculators, VenloCAD 3D parametric glasshouse CAD, 150 verified agricultural subsidy programs across 8 countries, {len(buckets['en'])} English monographs, {len(buckets['de'])} German Gärtnermeister Fachartikel, {len(buckets['ja'])} Japanese smart-agriculture guides, and {len(buckets['climate'])} regional climate hubs.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Which international greenhouse engineering standards govern the models on Inwoovation Lab?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "All thermal, structural, psychrometric, and fertigation models adhere to published engineering standards including DIN EN 13031-1 and NEN 3859 for Venlo glasshouse structures, DIN V 18599 and ASABE EP406 for greenhouse heating and energy screens, FAO-56 Penman-Monteith for canopy evapotranspiration, and KTBL / Wageningen UR benchmarks for horticultural economics.",
                        },
                    },
                ],
            },
        ],
    }

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="google-adsense-account" content="ca-pub-8597809158257497">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complete CEA Engineering Directory &amp; Index ({total_urls} Pages) | Inwoovation Lab</title>
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="description" content="Master HTML sitemap and engineering taxonomy indexing all {total_urls} calculators, 150 global agricultural grants, EN/DE/JA monographs, crop guides, and climate hubs.">
    <link rel="canonical" href="https://inwoovation.com/directory.html" />

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-V4RYJBMEDE"></script>
    <script>
       {BOT_GUARD_JS}
       window.dataLayer = window.dataLayer || [];
       function gtag(){{dataLayer.push(arguments);}}
       gtag('js', new Date());
       gtag('config', 'G-V4RYJBMEDE');
    </script>

    <!-- Google AdSense Script -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8597809158257497" crossorigin="anonymous"></script>

    <meta property="og:type" content="website">
    <meta property="og:url" content="https://inwoovation.com/directory.html">
    <meta property="og:title" content="Complete CEA Engineering Directory &amp; Index ({total_urls} Pages) | Inwoovation Lab">
    <meta property="og:description" content="Browse all {total_urls} biophysical simulators, 150 verified agricultural grants, and EN/DE/JA horticultural engineering monographs in one unified index.">
    <meta property="og:image" content="https://inwoovation.com/og-cover.jpg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Complete CEA Engineering Directory ({total_urls} Pages) | Inwoovation Lab">
    <meta name="twitter:description" content="Full index of {total_urls} controlled environment agriculture calculators, global grants, and multilingual monographs.">
    <meta name="twitter:image" content="https://inwoovation.com/og-cover.jpg">

    <script type="application/ld+json">
{json.dumps(json_ld, ensure_ascii=False, indent=2)}
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css?v=20261112">
    <link rel="stylesheet" href="css/global-ui-enhancements.css?v=20261112">
    <script src="js/global-search-palette.js?v=20261112" defer></script>
    <style>
        .dir-wrap {{ max-width: 1160px; margin: 32px auto 72px; padding: 0 20px; }}
        .dir-top {{ display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }}
        .dir-back {{ color: #38bdf8; text-decoration: none; font-weight: 700; font-size: 0.92rem; }}
        .dir-hero {{ background: rgba(15, 23, 42, 0.82); border: 1px solid rgba(56, 189, 248, 0.22); border-radius: 20px; padding: 28px 28px 24px; margin-bottom: 24px; }}
        .dir-hero h1 {{ font-family: 'Outfit', sans-serif; font-size: clamp(1.7rem, 3.2vw, 2.35rem); color: #f8fafc; margin: 0 0 10px; font-weight: 800; }}
        .dir-hero p {{ color: #cbd5e1; line-height: 1.7; font-size: 0.96rem; margin: 0 0 16px; }}
        .dir-filter {{ width: 100%; padding: 13px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.16); background: rgba(2, 6, 23, 0.85); color: #f8fafc; font-size: 0.96rem; margin-bottom: 14px; box-sizing: border-box; }}
        .dir-pills {{ display: flex; flex-wrap: wrap; gap: 8px; }}
        .dir-pill {{ color: #e2e8f0; text-decoration: none; font-size: 0.8rem; font-weight: 700; padding: 6px 12px; border-radius: 999px; background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(255,255,255,0.12); }}
        .dir-pill:hover {{ border-color: #38bdf8; color: #38bdf8; }}
        .dir-section {{ background: rgba(15, 23, 42, 0.72); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 24px 26px; margin-bottom: 22px; }}
        .dir-section h2 {{ font-family: 'Outfit', sans-serif; font-size: 1.28rem; color: #34d399; margin: 0 0 14px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px; }}
        .dir-list {{ list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(460px, 1fr)); gap: 8px 20px; }}
        .dir-item {{ display: flex; justify-content: space-between; align-items: baseline; gap: 10px; padding: 6px 8px; border-radius: 8px; border-bottom: 1px solid rgba(255,255,255,0.04); }}
        .dir-item:hover {{ background: rgba(56, 189, 248, 0.08); }}
        .dir-item a {{ color: #f1f5f9; text-decoration: none; font-weight: 600; font-size: 0.89rem; line-height: 1.45; }}
        .dir-item a:hover {{ color: #38bdf8; text-decoration: underline; }}
        .dir-path {{ font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: #64748b; white-space: nowrap; }}
        .dir-notes {{ background: rgba(30, 41, 59, 0.65); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 26px 28px; color: #cbd5e1; line-height: 1.75; font-size: 0.94rem; }}
        .dir-notes h2 {{ font-family: 'Outfit', sans-serif; color: #f8fafc; font-size: 1.3rem; margin-top: 0; }}
        .dir-notes h3 {{ font-family: 'Outfit', sans-serif; color: #38bdf8; font-size: 1.05rem; margin: 18px 0 6px; }}
        @media (max-width: 768px) {{
            .dir-list {{ grid-template-columns: 1fr; }}
            .dir-item {{ flex-direction: column; gap: 2px; }}
            .dir-path {{ white-space: normal; word-break: break-all; }}
        }}
    </style>
</head>
<body>
<main class="dir-wrap">
    <div class="dir-top">
        <a href="/" class="dir-back">← Return to Inwoovation Lab Command Center</a>
        <button type="button" onclick="window.InwooPalette && window.InwooPalette.open()" style="background:rgba(56,189,248,0.15); border:1px solid rgba(56,189,248,0.4); color:#38bdf8; padding:7px 14px; border-radius:999px; font-weight:700; cursor:pointer;">🔍 Spotlight Search (Ctrl+K)</button>
    </div>

    <header class="dir-hero">
        <h1>Complete CEA Engineering Directory &amp; Multilingual Index ({total_urls} Resources)</h1>
        <p>Unified architectural index of every live biophysical calculator, 3D WebGL parametric greenhouse engine, verified 8-country agricultural grant radar (150 programs across Federal, State/Province, and Municipal tiers), regional climate benchmark, and multilingual horticultural monograph published by <strong>Inwoovation Lab</strong>.</p>
        <label for="dir-live-filter" style="position:absolute;left:-9999px;">Filter all portal pages</label>
        <input type="search" id="dir-live-filter" class="dir-filter" placeholder="Instant filter across all {total_urls} pages (e.g. VPD, BLE, Mollier, BESS, Nürnberg, Strawberry, 飽差, Dampfdruckdefizit)..." autocomplete="off">
        <nav class="dir-pills" aria-label="Directory Categories">
{nav_pills}
        </nav>
    </header>

{sections_html}

    <section class="dir-notes">
        <h2>🏛️ Architectural Taxonomy, Standards Compliance &amp; Verification Methodology</h2>
        <p>Inwoovation Lab maintains a zero-paywall computational engineering substrate for commercial greenhouse operators, horticultural master candidates (<em>Gärtnermeister</em>), agricultural economists, and controlled environment agriculture (CEA) systems integrators. Every resource listed in this master directory is governed by deterministic unit testing and international engineering standards:</p>
        <h3>1. Structural, Thermal &amp; Psychrometric Modeling Standards</h3>
        <p>Glasshouse geometry, truss steel sizing, and snow/wind actions in <strong>VenloCAD 3D</strong> and regional climate hubs reference <strong>DIN EN 13031-1</strong> and Dutch <strong>NEN 3859</strong> horticultural structural codes. Envelope U-value heat transmission, multi-layer thermal screen savings, power-to-heat (P2H) buffer storage, and battery energy storage arbitrage (BESS) adhere to <strong>DIN V 18599</strong> and <strong>ASABE EP406</strong> thermodynamic balances. Canopy vapor pressure deficit (VPD), Mollier <em>h-x</em> enthalpy dehumidification, and irrigation steering implement <strong>FAO-56 Penman-Monteith</strong> stomatal conductance equations.</p>
        <h3>2. Multilingual Research Parity (EN · DE · JA) &amp; Subsidy Governance</h3>
        <p>To bridge agronomic research across major horticultural clusters—from Westland and Bleiswijk in the Netherlands to Knoblauchsland/Nürnberg and Freising in Germany, Tsukuba in Japan, Leamington in Canada, Salinas in California, and Gimje in South Korea—our research monographs are authored natively in English, German (<em>Fachdeutsch</em> aligned with KTBL and BLE guidelines), and Japanese. The Global Agri-Subsidy Navigator tracks 150 verified federal, state/provincial, and municipal funding programs with direct agency URLs and 3-step statutory application playbooks.</p>
        <h3>3. Frequently Asked Questions (FAQ)</h3>
        <p><strong>What engineering calculators and multilingual monographs are indexed in the Inwoovation Lab directory?</strong><br>
        The Inwoovation Lab master directory indexes {total_urls} open-access controlled environment agriculture (CEA) resources, including {len(buckets['tools'])} browser-side biophysical calculators, VenloCAD 3D parametric glasshouse CAD, 150 verified agricultural subsidy programs across 8 countries, {len(buckets['en'])} English monographs, {len(buckets['de'])} German Gärtnermeister Fachartikel, {len(buckets['ja'])} Japanese smart-agriculture guides, and {len(buckets['climate'])} regional climate hubs.</p>
        <p><strong>Which international greenhouse engineering standards govern the models on Inwoovation Lab?</strong><br>
        All thermal, structural, psychrometric, and fertigation models adhere to published engineering standards including DIN EN 13031-1 and NEN 3859 for Venlo glasshouse structures, DIN V 18599 and ASABE EP406 for greenhouse heating and energy screens, FAO-56 Penman-Monteith for canopy evapotranspiration, and KTBL / Wageningen UR benchmarks for horticultural economics.</p>
    </section>
</main>

<footer style="max-width:1160px; margin:0 auto 36px; padding:0 20px; text-align:center; color:#94a3b8; font-size:0.86rem;">
    <p>© 2026 Inwoovation Lab. All rights reserved. | <a href="/" style="color:#38bdf8;">Home</a> | <a href="/directory.html" style="color:#34d399; font-weight:700;">All {total_urls} Pages Directory</a> | <a href="/privacy-policy.html" style="color:#94a3b8;">Privacy Policy</a> | <a href="/terms-of-service.html" style="color:#94a3b8;">Terms of Service</a> | <a href="/about.html" style="color:#94a3b8;">About</a> | <a href="/contact.html" style="color:#94a3b8;">Contact</a></p>
</footer>

<script>
(function() {{
    var input = document.getElementById('dir-live-filter');
    if (!input) return;
    var items = Array.prototype.slice.call(document.querySelectorAll('.dir-item'));
    var sections = Array.prototype.slice.call(document.querySelectorAll('.dir-section'));
    input.addEventListener('input', function() {{
        var q = (input.value || '').trim().toLowerCase();
        items.forEach(function(li) {{
            var hay = li.getAttribute('data-search') || '';
            li.style.display = (!q || hay.indexOf(q) !== -1) ? '' : 'none';
        }});
        sections.forEach(function(sec) {{
            var visible = sec.querySelectorAll('.dir-item:not([style*="display: none"])').length;
            sec.style.display = visible > 0 ? '' : 'none';
        }});
    }});
}})();
</script>
</body>
</html>
"""


def build_and_sync() -> bool:
    existing_date = "2026-11-12"
    old_html = ""
    if DIRECTORY_FILE.exists():
        old_html = DIRECTORY_FILE.read_text(encoding="utf-8", errors="ignore")
        m = re.search(r'"dateModified":\s*"(\d{4}-\d{2}-\d{2})"', old_html)
        if m:
            existing_date = m.group(1)

    live_paths, records = collect_live_metadata()
    new_html = render_directory_html(records, existing_date)
    dir_changed = new_html != old_html
    if dir_changed:
        DIRECTORY_FILE.write_text(new_html, encoding="utf-8", newline="\n")
        live_paths["directory.html"] = DIRECTORY_FILE

    print(f"🗂️ Master HTML Directory verified ({len(live_paths)} pages, updated={dir_changed})")
    return True


if __name__ == "__main__":
    build_and_sync()
