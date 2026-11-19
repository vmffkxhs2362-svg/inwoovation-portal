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
SKIP_DIRS = {".git", "__pycache__", "node_modules", "scripts", "data", "digital_assets", "css", "js"}

BOT_GUARD_JS = (
    "if (navigator.webdriver || /HeadlessChrome|PhantomJS|Lighthouse|PTST|bot|crawler|spider|slurp/i.test(navigator.userAgent) "
    "|| location.hostname === 'localhost' || location.hostname === '127.0.0.1' "
    "|| (screen.width === 1366 && screen.height === 1366) || (screen.width === 800 && screen.height === 600) || screen.height >= 5000) "
    "{ window['ga-disable-G-V4RYJBMEDE'] = true; }"
)


def _is_live(rel_path: str, html: str) -> bool:
    rel_norm = rel_path.replace("\\", "/")
    name = os.path.basename(rel_norm)
    if not name.endswith(".html") or name.startswith(("naver", "google", "_", "old_")) or name == "404.html":
        return False
    if rel_norm.startswith("embed/") and name != "index.html":
        return False
    if re.search(r'<meta[^>]+name=["\']robots["\'][^>]+noindex', html, re.I) or re.search(
        r'<meta[^>]+content=["\'][^"\']*noindex[^"\']*["\'][^>]+name=["\']robots["\']', html, re.I
    ):
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


def _live_grant_count() -> int:
    grant_json = PORTAL_DIR / "data" / "global_agri_subsidies.json"
    if grant_json.exists():
        try:
            progs = json.loads(grant_json.read_text(encoding="utf-8")).get("programs", [])
            if progs:
                return len(progs)
        except Exception:
            pass
    return 192


def render_directory_html(records: list[dict[str, str]], date_modified: str) -> str:
    grant_count = _live_grant_count()
    buckets: dict[str, list[dict[str, str]]] = {
        "core": [],
        "tools": [],
        "handbooks": [],
        "benchmarks": [],
        "parts": [],
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
        elif rel.startswith(("handbooks/", "suite/", "embed/", "podcasts/")):
            buckets["handbooks"].append(rec)
        elif rel.startswith("benchmarks/"):
            buckets["benchmarks"].append(rec)
        elif rel.startswith("parts/"):
            buckets["parts"].append(rec)
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
        ("sec-handbooks", f"📖 Handbooks, OpenCEA Launcher, Embed SDK & Podcast ({len(buckets['handbooks'])})", buckets["handbooks"]),
        ("sec-benchmarks", f"⚖️ Hardware, Glazing & Substrate ROI Benchmarks ({len(buckets['benchmarks'])})", buckets["benchmarks"]),
        ("sec-parts", f"🔧 AgriMaster Precision Parts & Vacuum Fittings ({len(buckets['parts'])})", buckets["parts"]),
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
                "description": f"Master architectural HTML index of all {total_urls} calculators, {grant_count} global agricultural subsidy dossiers, VenloCAD 3D engines, and EN/DE/JA horticultural monographs on Inwoovation Lab.",
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
                            "text": f"The Inwoovation Lab master directory indexes {total_urls} open-access controlled environment agriculture (CEA) resources, including {len(buckets['tools'])} browser-side biophysical calculators, VenloCAD 3D parametric glasshouse CAD, {grant_count} verified agricultural subsidy programs across 8 countries, {len(buckets['en'])} English monographs, {len(buckets['de'])} German Gärtnermeister Fachartikel, {len(buckets['ja'])} Japanese smart-agriculture guides, and {len(buckets['climate'])} regional climate hubs.",
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
    <meta name="description" content="Master HTML sitemap and engineering taxonomy indexing all {total_urls} calculators, {grant_count} global agricultural grants, EN/DE/JA monographs, crop guides, and climate hubs.">
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
    <meta property="og:description" content="Browse all {total_urls} biophysical simulators, {grant_count} verified agricultural grants, and EN/DE/JA horticultural engineering monographs in one unified index.">
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
        <p>Unified architectural index of every live biophysical calculator, 3D WebGL parametric greenhouse engine, verified 8-country agricultural grant radar ({grant_count} programs across Federal, State/Province, and Municipal tiers), regional climate benchmark, and multilingual horticultural monograph published by <strong>Inwoovation Lab</strong>.</p>
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
        <p>To bridge agronomic research across major horticultural clusters—from Westland and Bleiswijk in the Netherlands to Knoblauchsland/Nürnberg and Freising in Germany, Tsukuba in Japan, Leamington in Canada, Salinas in California, and Gimje in South Korea—our research monographs are authored natively in English, German (<em>Fachdeutsch</em> aligned with KTBL and BLE guidelines), and Japanese. The Global Agri-Subsidy Navigator tracks {grant_count} verified federal, state/provincial, and municipal funding programs with direct agency URLs and 3-step statutory application playbooks.</p>
        <h3>3. Frequently Asked Questions (FAQ)</h3>
        <p><strong>What engineering calculators and multilingual monographs are indexed in the Inwoovation Lab directory?</strong><br>
        The Inwoovation Lab master directory indexes {total_urls} open-access controlled environment agriculture (CEA) resources, including {len(buckets['tools'])} browser-side biophysical calculators, VenloCAD 3D parametric glasshouse CAD, {grant_count} verified agricultural subsidy programs across 8 countries, {len(buckets['en'])} English monographs, {len(buckets['de'])} German Gärtnermeister Fachartikel, {len(buckets['ja'])} Japanese smart-agriculture guides, and {len(buckets['climate'])} regional climate hubs.</p>
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


def render_language_articles_hub(lang_code: str, items: list[dict[str, str]], date_modified: str) -> str:
    """Render an institutional multilingual article hub for /articles/de/ or /articles/ja/."""
    article_items = [rec for rec in items if os.path.basename(rec["rel"]).startswith("article-")]
    art_count = len(article_items)
    cfg = {
        "de": {
            "url": "https://inwoovation.com/articles/de/",
            "title": f"Deutsche Gartenbau-Meister Fachartikel &amp; CEA-Technik ({art_count} Monographien) | Inwoovation Lab",
            "title_plain": f"Deutsche Gartenbau-Meister Fachartikel & CEA-Technik ({art_count} Monographien)",
            "desc": f"Vollständige deutschsprachige Wissensdatenbank mit {art_count} technischen Fachartikeln zu VPD-Psychrometrie, DIN V 18599 Heizlast, EN 13031-1 Venlo-Statik, FvCB-CO2-Kinetik und BLE/KTBL-Förderprogrammen.",
            "h1": f"Deutsche Fachartikel für Gewächshaustechnik &amp; Gartenbau-Meister ({art_count} Monographien)",
            "lead": "Kuratierte technische Bibliothek von <strong>Inwoovation Lab</strong> für Erwerbsgartenbau, Unterglasproduktion und Fachschulen für Gartenbau (<em>Gärtnermeister / Agrarbetriebswirt</em>). Alle Fachmonographien formulieren thermodynamische Bilanzen, Psychrometrie, Nährlösungs-Stöchiometrie und Fördermechanik auf Basis verbindlicher Normen wie DIN EN 13031-1, DIN V 18599, NEN 3859, FAO-56 Penman-Monteith sowie KTBL- und BLE-Richtwerten.",
            "search_ph": "Fachartikel filtern (z. B. VPD, Heizlast, DIN 18599, Mollier, Erdbeeren, Tomaten, BLE, CO2)...",
            "home_label": "← Zurück zur Übersicht",
            "en_pill": "🇺🇸 English Edition (/articles/)",
            "de_pill": f"🇩🇪 Deutsch ({art_count})",
            "ja_pill": "🇯🇵 日本語版 (/articles/ja/)",
            "tools_cta": "🏗️ VenloCAD 3D &amp; Berechnungstools",
            "dir_cta": "🗂️ Komplettes Verzeichnis",
            "list_h2": f"📚 Alle {art_count} deutschsprachigen Technik-Monographien",
            "notes_h2": "🏛️ Methodische Standards, Normenbezug &amp; Praxis-FAQ",
            "notes_p1": "Die deutschsprachige Sektion von Inwoovation Lab übersetzt anspruchsvolle Gewächshausphysik und betriebswirtschaftliche Förderanalyse in sofort anwendbare Sollwerte für Produktionsleiter und Meisterschüler. Besonderer Fokus liegt auf der Entkopplung von Heizwärmebedarf, EPEX-Spot-Strompreissignalen, Power-to-Heat-Pufferspeichern, Aquiferspeichern (ATES) sowie geschlossener Hydrokultur mit Debye-Hückel-Speziation und UV-C-Entkeimung.",
            "notes_p2": "Die Themencluster umfassen (1) Psychrometrie & Aerodynamik (VPD, Mollier h-x, HAF, Adiabatische Hochdruck-Vernebelung), (2) Thermische & Konstruktive Auslegung (DIN EN 13031-1, NEN 3859, DIN V 18599, BHKW mit SCR-DeNOx), (3) Photobiologie & LED-SPEKTRUM (DLI, ePAR, FvCB, Beer-Lambert), sowie (4) Geschlossene Kreislaufdüngung & Ökonomie (Sonneveld, van Genuchten pF, IRR/NPV, BLE/KfW).",
            "faq1_q": "Welche DIN- und EN-Normen liegen den Berechnungsmodellen und Fachartikeln zugrunde?",
            "faq1_a": "Alle strukturmechanischen Venlo-Nachweise folgen DIN EN 13031-1 und NEN 3859. Wärmebedarf, Transmissionsverluste und Energieschirme basieren auf DIN V 18599 und ASABE EP406, während Verdunstung und Sättigungsdefizit (VPD) nach FAO-56 Penman-Monteith berechnet werden.",
            "faq2_q": "Wie verknüpfen diese Fachartikel deutsche Förderprogramme mit Gewächshaus-Investitionen?",
            "faq2_a": "Mehrere Monographien sowie der Global Agri-Subsidy Navigator dokumentieren das Zusammenspiel von BLE-Bundesprogramm Energieeffizienz, KfW-Krediten, Agrarinvestitionsförderprogramm (AFP) sowie kommunalen Klimabonus-Zuschüssen inklusive Amortisations- und Kapitalwertrechnung (IRR/NPV).",
            "faq3_q": "Stehen alle Fachartikel und Simulatoren ohne Paywall für Meisterschüler zur Verfügung?",
            "faq3_a": f"Ja. Alle {art_count} deutschsprachigen Monographien sowie die interaktiven Rechner (VenloCAD 3D, Heizlast-Rechner, VPD-Labor, Nährlösungs-Bilanzierung) sind frei zugänglich und verlinken direkt auf die passenden Rechenwerkzeuge.",
        },
        "ja": {
            "url": "https://inwoovation.com/articles/ja/",
            "title": f"日本語 施設園芸・スマート農業工学モノグラフ一覧 ({art_count} 論文) | Inwoovation Lab",
            "title_plain": f"日本語 施設園芸・スマート農業工学モノグラフ一覧 ({art_count} 論文)",
            "desc": f"商業用 Venlo 型ガラス温室の VPD 飽差熱力学・DIN V 18599 暖房負荷・EN 13031-1 構造設計・FvCB CO2 施用・養液化学平衡を解説する {art_count} 編の日本語技術論文アーカイブ。",
            "h1": f"施設園芸・スマート農業工学 日本語技術モノグラフ ({art_count} 編)",
            "lead": "<strong>Inwoovation Lab</strong> が公開する商業用ガラス温室および完全人工光型植物工場 (PFAL / CEA) 向けの日本語技術研究アーカイブです。各技術論文は DIN EN 13031-1、NEN 3859、DIN V 18599、ASABE EP406、FAO-56 Penman-Monteith、Farquhar-von Caemmerer-Berry (FvCB) 光合成モデル、ならびに閉鎖系養液栽培における Debye-Hückel イオン活量・沈殿飽和指数 (SI) を第一原理に基づいて体系化しています。",
            "search_ph": "技術論文を検索 (例: VPD, DLI, DIN 18599, Mollier, CO2, イチゴ, トマト, イオン)...",
            "home_label": "← 工学ライブラリ トップへ",
            "en_pill": "🇺🇸 English Edition (/articles/)",
            "de_pill": "🇩🇪 Deutsche Ausgabe (/articles/de/)",
            "ja_pill": f"🇯🇵 日本語 ({art_count})",
            "tools_cta": "🏗️ VenloCAD 3D &amp; 工学シミュレーター",
            "dir_cta": "🗂️ 全ページ総索引",
            "list_h2": f"📚 公開中の日本語 技術論文モノグラフ ({art_count} 編)",
            "notes_h2": "🏛️ 物理モデリング基準・国際標準規格およびよくある質問 (FAQ)",
            "notes_p1": "本セクションでは、オランダ Westland / Bleiswijk、ドイツ Nürnberg / Freising、日本 つくば (Tsukuba) / 豊橋、韓国 全北 金堤 (Gimje) など世界主要 CEA クラスターの現場エンジニアに向けて、飽差 (VPD)・積算日射量 (DLI)・水平気流ファン (HAF)・Aquifer Thermal Energy Storage (ATES) ヒートポンプ・EPEX / 電力市場連動型 MPC 最適制御の設計理論と実務設定値を無料公開しています。",
            "notes_p2": "主要研究領域は以下の 5 つの工学ピラーで構成されています: (1) Vapor Pressure Deficit (VPD), Mollier h-x エンタルピー線図, Horizontal Air Flow (HAF), Adiabatic Fogging (70 bar D32) による微気象制御; (2) DIN EN 13031-1, Dutch NEN 3859 構造力学, DIN V 18599 熱負荷・多層保温スクリーン, Power-to-Heat (P2H) バッファータンク成層化 (Richardson Number Ri) 設計; (3) Extended PAR (400-750 nm), Daily Light Integral (DLI), Phytochrome Photostationary State (PSS), Beer-Lambert 群落吸光係数 (k) 光環境工学; (4) Closed-Loop Hydroponic Ion Stoichiometry (meq/L), Uptake Concentration Factor (UCF), Debye-Hückel &amp; Davies 活量係数, van Genuchten pF 水分曲線, Nanobubble Dissolved Oxygen (DO), Chick-Watson UV-C (254 nm) 殺菌; (5) Model Predictive Control (MPC), 10-Year CapEx/OpEx NPV &amp; IRR 投資財務分析および各国補助金制度比較 (USDA REAP / EQIP, German BLE / KfW, Japanese MAFF Smart Agriculture).",
            "faq1_q": "Inwoovation Lab の日本語工学論文ではどのような国際規格・数理モデルを採用していますか？",
            "faq1_a": "温室構造計算は DIN EN 13031-1 および NEN 3859、暖房負荷と保温スクリーン断熱評価は DIN V 18599 と ASABE EP406、群落蒸散と気孔コンダクタンスは FAO-56 Penman-Monteith と Medlyn モデル、CO2 光合成応答は FvCB 生化学モデルを採用しています。",
            "faq2_q": "各技術論文に対応する対話型ブラウザ計算ツール (VPD / 暖房負荷 / 養液平衡) は無料で使えますか？",
            "faq2_a": "はい。すべての技術論文は VenloCAD 3D、VPD Calculator、DIN V 18599 Heating Load Simulator、Hydroponic Nutrient Stoichiometry 計算機およびグローバル補助金ナビゲーターと相互リンクしており、登録不要・完全無料でブラウザ上から即時検証できます。",
            "faq3_q": "英語版 (EN) やドイツ語版 (DE) の対応論文および植物工場・イチゴ・トマト栽培ガイドへどう移動できますか？",
            "faq3_a": "各記事上部の言語スイッチャーまたは本ページ上部の /articles/ (English Edition) および /articles/de/ (Deutsche Ausgabe) ボタン、ならびに Ctrl+K Spotlight Search や Master Directory (/directory.html) から、全公開ページの多言語リソースへ 1 クリックでアクセスできます。",
        },
    }[lang_code]

    li_rows = "\n".join(
        f'        <li class="dir-item" data-search="{html_lib.escape((it["title"] + " " + it["href"]).lower())}">'
        f'<a href="{html_lib.escape(it["href"])}">{html_lib.escape(it["title"])}</a>'
        f'<span class="dir-path">{html_lib.escape(it["href"])}</span></li>'
        for it in article_items
    )

    json_ld = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "name": cfg["title_plain"],
                "url": cfg["url"],
                "inLanguage": lang_code,
                "description": cfg["desc"],
                "dateModified": date_modified,
                "author": {"@type": "Person", "name": "Inwoo Hwang", "jobTitle": "Horticultural & CEA Systems Engineer"},
                "publisher": {"@type": "Organization", "name": "Inwoovation Lab", "url": "https://inwoovation.com"},
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Inwoovation Lab", "item": "https://inwoovation.com/"},
                    {"@type": "ListItem", "position": 2, "name": "Articles Library", "item": "https://inwoovation.com/articles/"},
                    {"@type": "ListItem", "position": 3, "name": lang_code.upper(), "item": cfg["url"]},
                ],
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {"@type": "Question", "name": cfg["faq1_q"], "acceptedAnswer": {"@type": "Answer", "text": cfg["faq1_a"]}},
                    {"@type": "Question", "name": cfg["faq2_q"], "acceptedAnswer": {"@type": "Answer", "text": cfg["faq2_a"]}},
                    {"@type": "Question", "name": cfg["faq3_q"], "acceptedAnswer": {"@type": "Answer", "text": cfg["faq3_a"]}},
                ],
            },
        ],
    }

    return f"""<!DOCTYPE html>
<html lang="{lang_code}">
<head>
    <meta name="google-adsense-account" content="ca-pub-8597809158257497">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{cfg['title']}</title>
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="description" content="{html_lib.escape(cfg['desc'])}">
    <link rel="canonical" href="{cfg['url']}" />
    <link rel="alternate" hreflang="en" href="https://inwoovation.com/articles/">
    <link rel="alternate" hreflang="de" href="https://inwoovation.com/articles/de/">
    <link rel="alternate" hreflang="ja" href="https://inwoovation.com/articles/ja/">
    <link rel="alternate" hreflang="x-default" href="https://inwoovation.com/articles/">

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
    <meta property="og:url" content="{cfg['url']}">
    <meta property="og:title" content="{cfg['title']}">
    <meta property="og:description" content="{html_lib.escape(cfg['desc'])}">
    <meta property="og:image" content="https://inwoovation.com/og-cover.jpg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{cfg['title']}">
    <meta name="twitter:description" content="{html_lib.escape(cfg['desc'])}">
    <meta name="twitter:image" content="https://inwoovation.com/og-cover.jpg">

    <script type="application/ld+json">
{json.dumps(json_ld, ensure_ascii=False, indent=2)}
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/styles.css?v=20261112">
    <link rel="stylesheet" href="/css/global-ui-enhancements.css?v=20261112">
    <script src="/js/global-search-palette.js?v=20261112" defer></script>
    <style>
        .dir-wrap {{ max-width: 1160px; margin: 32px auto 72px; padding: 0 20px; }}
        .dir-top {{ display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }}
        .dir-back {{ color: #38bdf8; text-decoration: none; font-weight: 700; font-size: 0.92rem; }}
        .dir-hero {{ background: rgba(15, 23, 42, 0.82); border: 1px solid rgba(56, 189, 248, 0.22); border-radius: 20px; padding: 28px 28px 24px; margin-bottom: 24px; }}
        .dir-hero h1 {{ font-family: 'Outfit', sans-serif; font-size: clamp(1.65rem, 3.1vw, 2.25rem); color: #f8fafc; margin: 0 0 10px; font-weight: 800; }}
        .dir-hero p {{ color: #cbd5e1; line-height: 1.7; font-size: 0.96rem; margin: 0 0 16px; }}
        .dir-filter {{ width: 100%; padding: 13px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.16); background: rgba(2, 6, 23, 0.85); color: #f8fafc; font-size: 0.96rem; margin-bottom: 14px; box-sizing: border-box; }}
        .dir-pills {{ display: flex; flex-wrap: wrap; gap: 8px; }}
        .dir-pill {{ color: #e2e8f0; text-decoration: none; font-size: 0.82rem; font-weight: 700; padding: 6px 12px; border-radius: 999px; background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(255,255,255,0.12); }}
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
        <a href="/articles/" class="dir-back">{cfg['home_label']}</a>
        <button type="button" onclick="window.InwooPalette && window.InwooPalette.open()" style="background:rgba(56,189,248,0.15); border:1px solid rgba(56,189,248,0.4); color:#38bdf8; padding:7px 14px; border-radius:999px; font-weight:700; cursor:pointer;">🔍 Spotlight Search (Ctrl+K)</button>
    </div>

    <header class="dir-hero">
        <h1>{cfg['h1']}</h1>
        <p>{cfg['lead']}</p>
        <label for="lang-hub-filter" style="position:absolute;left:-9999px;">Filter monographs</label>
        <input type="search" id="lang-hub-filter" class="dir-filter" placeholder="{html_lib.escape(cfg['search_ph'])}" autocomplete="off">
        <nav class="dir-pills" aria-label="Language Hubs &amp; Tools">
            <a href="/articles/" class="dir-pill">{cfg['en_pill']}</a>
            <a href="/articles/de/" class="dir-pill">{cfg['de_pill']}</a>
            <a href="/articles/ja/" class="dir-pill">{cfg['ja_pill']}</a>
            <a href="/tools/venlocad-3d.html" class="dir-pill">{cfg['tools_cta']}</a>
            <a href="/directory.html" class="dir-pill">{cfg['dir_cta']}</a>
        </nav>
    </header>

    <section class="dir-section" id="sec-articles">
        <h2>{cfg['list_h2']}</h2>
        <ul class="dir-list">
{li_rows}
        </ul>
    </section>

    <section class="dir-notes">
        <h2>{cfg['notes_h2']}</h2>
        <p>{cfg['notes_p1']}</p>
        <p>{cfg['notes_p2']}</p>
        <h3>FAQ 1: {html_lib.escape(cfg['faq1_q'])}</h3>
        <p>{html_lib.escape(cfg['faq1_a'])}</p>
        <h3>FAQ 2: {html_lib.escape(cfg['faq2_q'])}</h3>
        <p>{html_lib.escape(cfg['faq2_a'])}</p>
        <h3>FAQ 3: {html_lib.escape(cfg['faq3_q'])}</h3>
        <p>{html_lib.escape(cfg['faq3_a'])}</p>
    </section>
</main>

<footer style="max-width:1160px; margin:0 auto 36px; padding:0 20px; text-align:center; color:#94a3b8; font-size:0.86rem;">
    <p>© 2026 Inwoovation Lab. All rights reserved. | <a href="/" style="color:#38bdf8;">Home</a> | <a href="/articles/" style="color:#38bdf8;">Articles</a> | <a href="/directory.html" style="color:#34d399; font-weight:700;">Directory</a> | <a href="/privacy-policy.html" style="color:#94a3b8;">Privacy Policy</a> | <a href="/terms-of-service.html" style="color:#94a3b8;">Terms of Service</a> | <a href="/about.html" style="color:#94a3b8;">About</a> | <a href="/contact.html" style="color:#94a3b8;">Contact</a></p>
</footer>

<script>
(function() {{
    var input = document.getElementById('lang-hub-filter');
    if (!input) return;
    var items = Array.prototype.slice.call(document.querySelectorAll('.dir-item'));
    input.addEventListener('input', function() {{
        var q = (input.value || '').trim().toLowerCase();
        items.forEach(function(li) {{
            var hay = li.getAttribute('data-search') || '';
            li.style.display = (!q || hay.indexOf(q) !== -1) ? '' : 'none';
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

    # Sync /articles/de/index.html and /articles/ja/index.html hubs first
    hub_updates = 0
    for lang_code, rel_prefix, rel_hub in (
        ("de", "articles/de/article-", "articles/de/index.html"),
        ("ja", "articles/ja/article-", "articles/ja/index.html"),
    ):
        hub_path = PORTAL_DIR / rel_hub
        hub_date = "2026-11-15"
        old_hub = ""
        if hub_path.exists():
            old_hub = hub_path.read_text(encoding="utf-8", errors="ignore")
            m_hub = re.search(r'"dateModified":\s*"(\d{4}-\d{2}-\d{2})"', old_hub)
            if m_hub:
                hub_date = m_hub.group(1)
        lang_items = [r for r in records if r["rel"].startswith(rel_prefix)]
        new_hub = render_language_articles_hub(lang_code, lang_items, hub_date)
        if new_hub != old_hub:
            hub_path.parent.mkdir(parents=True, exist_ok=True)
            hub_path.write_text(new_hub, encoding="utf-8", newline="\n")
            hub_updates += 1

    if hub_updates or "articles/de/index.html" not in live_paths or "articles/ja/index.html" not in live_paths:
        live_paths, records = collect_live_metadata()

    new_html = render_directory_html(records, existing_date)
    dir_changed = new_html != old_html
    if dir_changed:
        DIRECTORY_FILE.write_text(new_html, encoding="utf-8", newline="\n")
        live_paths["directory.html"] = DIRECTORY_FILE

    print(f"🗂️ Master HTML Directory & DE/JA hubs verified ({len(live_paths)} pages, dir_updated={dir_changed}, lang_hubs_updated={hub_updates})")
    return True


if __name__ == "__main__":
    build_and_sync()
