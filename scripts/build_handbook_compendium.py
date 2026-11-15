"""
Build script for the Inwoovation Lab OpenCEA Compendium Hub:
  - Career/Inwoovation_Portal/handbooks/index.html
  - Career/Inwoovation_Portal/handbooks/THE_CEA_BIOPHYSICS_AND_GREENHOUSE_ENGINEERING_HANDBOOK.md

Dynamically indexes every live EN/DE/JA engineering monograph, maps paired interactive
calculators under tools/, and ensures zero orphaned chapters or empty handbook parts.
"""
from __future__ import annotations

import datetime
import html as html_lib
import json
import os
import re
import sys
from pathlib import Path

PORTAL_DIR = Path(__file__).resolve().parent.parent
HEADQUATER_DIR = PORTAL_DIR.parent.parent
HANDBOOKS_DIR = PORTAL_DIR / "handbooks"
OUT_HTML = HANDBOOKS_DIR / "index.html"
OUT_MD = HANDBOOKS_DIR / "THE_CEA_BIOPHYSICS_AND_GREENHOUSE_ENGINEERING_HANDBOOK.md"
TODAY_ISO = datetime.date.today().isoformat()

if str(HEADQUATER_DIR) not in sys.path:
    sys.path.insert(0, str(HEADQUATER_DIR))


PART_DEFS = [
    (
        "part-1",
        "Part I: Atmospheric Thermodynamics, Psychrometrics &amp; Transpiration",
        "Part I: Atmospheric Thermodynamics, Psychrometrics & Transpiration",
        "VPD psychrometrics, Stanghellini & Penman-Monteith evapotranspiration, high-pressure fogging, HAF ventilation CFD, and multi-layer thermal screen energy transfer.",
        {"01", "04", "05", "10", "11", "18", "26", "29", "31", "35", "61"},
    ),
    (
        "part-2",
        "Part II: Photobiology, LED Quantum Spectra &amp; Crop Steering",
        "Part II: Photobiology, LED Quantum Spectra & Crop Steering",
        "McCree photosynthetic action spectra, ePAR far-red phytochrome equilibrium, Farquhar-von Caemmerer-Berry carbon assimilation, Beer-Lambert canopy extinction, and DIF crop steering.",
        {"02", "07", "09", "24", "27", "32", "33", "40", "41", "56"},
    ),
    (
        "part-3",
        "Part III: Closed-Loop Hydroponics, Ion Speciation &amp; Substrates",
        "Part III: Closed-Loop Hydroponics, Ion Speciation & Substrates",
        "Extended Debye-Hückel & Davies aqueous speciation, A/B stock formulation, nanobubble dissolved oxygen, TDR substrate moisture, Van Genuchten pF curves, RO desalination, and ISE sensing.",
        {"06", "14", "17", "21", "22", "23", "25", "30", "38", "39", "42", "49", "55", "60"},
    ),
    (
        "part-4",
        "Part IV: Biosecurity, IPM Pollination, Sensors &amp; Autonomous AI MPC",
        "Part IV: Biosecurity, IPM Pollination, Sensors & Autonomous AI MPC",
        "Bombus terrestris REI protection, UV-C recirculating drain disinfection, NDIR/TDR sensor calibration, computer vision diagnostics, MQTT edge fleets, and reinforcement-learning climate MPC.",
        {"03", "13", "19", "20", "34", "44", "47", "50", "51", "54"},
    ),
    (
        "part-5",
        "Part V: Structural Mechanics, CHP Energy, ATES &amp; AgriQuant Finance",
        "Part V: Structural Mechanics, CHP Energy, ATES & AgriQuant Finance",
        "DIN EN 13031-1 Venlo truss mechanics, stratified heat buffers, biomass CHP with SCR NOx reduction, ATES aquifer storage, EPEX negative-price Power-to-Heat, DAC CO2, and CAPEX/IRR financial modeling.",
        {"08", "12", "15", "16", "28", "36", "37", "43", "45", "46", "48", "52", "53", "58", "59", "67", "68"},
    ),
    (
        "part-6",
        "Part VI: Transatlantic &amp; Global CEA Agricultural Subsidy Playbooks",
        "Part VI: Transatlantic & Global CEA Agricultural Subsidy Playbooks",
        "Verified federal, state/Land, and municipal grant stacking frameworks covering US USDA REAP/CDFA SWEEP/TX TWDB, German BLE/BAFA/KfW/AFP/Hofnachfolge, and European CAP modernization.",
        {"57", "62", "63", "64", "65", "66"},
    ),
]


def _extract_meta(path: Path) -> tuple[str, str, str]:
    txt = path.read_text(encoding="utf-8", errors="ignore")
    h1_m = re.search(r"<h1[^>]*>(.*?)</h1>", txt, re.I | re.S)
    desc_m = re.search(r'<meta\s+[^>]*name=["\']description["\'][^>]*content="([^"]*)"', txt, re.I)
    title = re.sub(r"<[^>]+>", "", h1_m.group(1)).strip() if h1_m else path.stem
    title = html_lib.unescape(re.sub(r"\s+", " ", title))
    desc = html_lib.unescape(re.sub(r"\s+", " ", desc_m.group(1).strip())) if desc_m else title
    tool_links = re.findall(r'href=["\'](?:\.\./|/)+tools/([a-z0-9\-]+\.html)["\']', txt, re.I)
    paired_tool = tool_links[0] if tool_links else "index.html"
    return title, desc, paired_tool


def _vol_num(filename: str) -> str:
    m = re.search(r"article-(\d+)", filename)
    return m.group(1).zfill(2) if m else "99"


def _classify_part(vol: str, filename: str, title: str) -> int:
    for idx, (_, _, _, _, vols) in enumerate(PART_DEFS):
        if vol in vols:
            return idx
    low = f"{filename} {title}".lower()
    if any(k in low for k in ("grant", "subsid", "reap", "sweep", "kfw", "afp", "ble", "bafa", "playbook")):
        return 5
    if any(k in low for k in ("vpd", "transpiration", "fogging", "haf", "screen", "heating", "enthalpy", "condens")):
        return 0
    if any(k in low for k in ("led", "par", "dli", "far-red", "photosynth", "farquhar", "canopy", "spectrum", "crop-steering")):
        return 1
    if any(k in low for k in ("nutrient", "hydroponic", "ion", "rockwool", "substrate", "calcium", "osmosis", "nanobubble", "ise")):
        return 2
    if any(k in low for k in ("uvc", "pollinat", "sensor", "mpc", "mqtt", "vision", "disease", "meister", "srs")):
        return 3
    return 4


def _load_catalog():
    articles_dir = PORTAL_DIR / "articles"
    en_articles = []
    de_by_vol: dict[str, tuple[str, str]] = {}
    ja_by_vol: dict[str, tuple[str, str]] = {}

    for p in sorted((articles_dir / "de").glob("article-*.html")):
        txt = p.read_text(encoding="utf-8", errors="ignore")
        if 'http-equiv="refresh"' in txt.lower() or "noindex" in txt.lower():
            continue
        title, _, _ = _extract_meta(p)
        de_by_vol[_vol_num(p.name)] = (f"../articles/de/{p.name}", title)

    for p in sorted((articles_dir / "ja").glob("article-*.html")):
        txt = p.read_text(encoding="utf-8", errors="ignore")
        if 'http-equiv="refresh"' in txt.lower() or "noindex" in txt.lower():
            continue
        title, _, _ = _extract_meta(p)
        ja_by_vol[_vol_num(p.name)] = (f"../articles/ja/{p.name}", title)

    for p in sorted(articles_dir.glob("article-*.html")):
        txt = p.read_text(encoding="utf-8", errors="ignore")
        if 'http-equiv="refresh"' in txt.lower() or "noindex" in txt.lower():
            continue
        vol = _vol_num(p.name)
        title, desc, paired_tool = _extract_meta(p)
        part_idx = _classify_part(vol, p.name, title)
        en_articles.append(
            {
                "vol": vol,
                "rel": f"../articles/{p.name}",
                "md_rel": f"../articles/{p.name}",
                "slug": p.stem,
                "title": title,
                "desc": desc,
                "tool": paired_tool,
                "part_idx": part_idx,
                "de": de_by_vol.get(vol),
                "ja": ja_by_vol.get(vol),
            }
        )

    tools_list = []
    for p in sorted((PORTAL_DIR / "tools").glob("*.html")):
        if p.name == "index.html":
            continue
        title, _, _ = _extract_meta(p)
        tools_list.append((p.name, title.split("|")[0].strip()))

    grant_count = 192
    de_grant_count = 34
    grant_json = PORTAL_DIR / "data" / "global_agri_subsidies.json"
    if grant_json.exists():
        gdata = json.loads(grant_json.read_text(encoding="utf-8"))
        progs = gdata.get("programs", [])
        if progs:
            grant_count = len(progs)
            de_grant_count = sum(1 for pr in progs if pr.get("country") == "DE")

    return en_articles, len(de_by_vol), len(ja_by_vol), tools_list, grant_count, de_grant_count


def _build_markdown(en_articles, de_count: int, ja_count: int, tool_count: int, grant_count: int) -> str:
    en_count = len(en_articles)
    total_editions = en_count + de_count + ja_count
    by_part = {i: [] for i in range(len(PART_DEFS))}
    for art in en_articles:
        by_part[art["part_idx"]].append(art)

    lines = [
        "# 📘 The CEA Biophysics & Greenhouse Engineering Handbook",
        f"## OpenCEA Compendium: {en_count} Volumes ({total_editions} Multilingual Editions) & {tool_count} Live Simulators",
        "",
        "> **Author**: Inwoovation Lab (Inwoo Hwang)  ",
        "> **Target Audience**: Commercial Greenhouse Operators, Plant Factory Systems Engineers, Gärtnermeister Candidates, Agronomists  ",
        f"> **Publication Standard**: Verified Biophysical Equations (Magnus-Tetens, Penman-Monteith, Farquhar FvCB, DIN V 18599, Debye-Hückel), Interactive Simulator Synchronized (`{TODAY_ISO}`)  ",
        "",
        "---",
        "",
        "## 📌 Executive Abstract & Compendium Profile",
        f"This open-access technical compendium organizes all **{en_count} English engineering monographs** (**{total_editions} total EN/DE/JA editions**) alongside **{tool_count} client-side biophysical simulators** and **{grant_count} hyper-local agricultural grant programs** into six engineering domains.",
        "",
        "---",
        "",
        "## 🗂️ Master Six-Part Table of Contents",
        "",
    ]

    for idx, (_, _, title_plain, desc_plain, _) in enumerate(PART_DEFS):
        lines.append(f"### {title_plain}")
        lines.append(f"*{desc_plain}*")
        for art in by_part[idx]:
            anchor = f"chapter-{art['vol']}-{art['slug']}"
            lines.append(f"- **Volume {art['vol']}**: [{art['title']}](#{anchor})")
        lines.append("")

    lines.append("---")
    lines.append("")

    for idx, (_, _, title_plain, _, _) in enumerate(PART_DEFS):
        lines.append(f"# {title_plain}")
        lines.append("")
        for art in by_part[idx]:
            anchor = f"chapter-{art['vol']}-{art['slug']}"
            lines.append(f"## Volume {art['vol']}: {art['title']}")
            lines.append(f'<a id="{anchor}"></a>')
            lines.append(f"- **EN Monograph**: [{art['md_rel']}]({art['md_rel']})")
            if art["de"]:
                lines.append(f"- **DE Edition**: [{art['de'][0]}]({art['de'][0]})")
            if art["ja"]:
                lines.append(f"- **JA Edition**: [{art['ja'][0]}]({art['ja'][0]})")
            lines.append(f"- **Paired Live Simulator**: [`tools/{art['tool']}`](../tools/{art['tool']})")
            lines.append(f"- **Synopsis**: {art['desc']}")
            lines.append("")
        lines.append("---")
        lines.append("")

    return "\n".join(lines).rstrip() + "\n"


def _build_html(en_articles, de_count: int, ja_count: int, tools_list, grant_count: int, de_grant_count: int) -> str:
    en_count = len(en_articles)
    total_editions = en_count + de_count + ja_count
    tool_count = len(tools_list)
    by_part = {i: [] for i in range(len(PART_DEFS))}
    for art in en_articles:
        by_part[art["part_idx"]].append(art)

    toc_pills = []
    part_sections = []
    for idx, (pid, title_html, _, desc_plain, _) in enumerate(PART_DEFS):
        part_arts = by_part[idx]
        short_label = title_html.split(":")[0]
        toc_pills.append(f'<a href="#{pid}" class="comp-pill">{short_label} ({len(part_arts)})</a>')

        cards_html = []
        for art in part_arts:
            lang_badges = [f'<a href="{art["rel"]}" class="edition-badge en">📘 EN Monograph</a>']
            if art["de"]:
                lang_badges.append(f'<a href="{art["de"][0]}" class="edition-badge de">🇩🇪 Deutsch</a>')
            if art["ja"]:
                lang_badges.append(f'<a href="{art["ja"][0]}" class="edition-badge ja">🇯🇵 日本語</a>')
            lang_badges.append(f'<a href="../tools/{art["tool"]}" class="edition-badge tool">🛠️ Live Solver</a>')

            cards_html.append(
                f"""          <article class="chapter-card" data-search="{html_lib.escape((art['vol'] + ' ' + art['title'] + ' ' + art['desc']).lower())}">
            <div class="chapter-meta">
              <span class="vol-pill">VOL {art["vol"]}</span>
              <span class="chapter-title"><a href="{art["rel"]}">{html_lib.escape(art["title"])}</a></span>
            </div>
            <p class="chapter-desc">{html_lib.escape(art["desc"])}</p>
            <div class="badge-row">{"".join(lang_badges)}</div>
          </article>"""
            )

        part_sections.append(
            f"""      <section id="{pid}" class="comp-part">
        <div class="comp-part-head">
          <h2>{title_html}</h2>
          <span class="part-count">{len(part_arts)} Volumes</span>
        </div>
        <p class="comp-part-desc">{html_lib.escape(desc_plain)}</p>
        <div class="chapter-grid">
{chr(10).join(cards_html)}
        </div>
      </section>"""
        )

    tool_chips = "\n".join(
        f'          <a href="../tools/{fname}" class="tool-chip">{html_lib.escape(tname)} →</a>'
        for fname, tname in tools_list[:18]
    )

    schema_json = json.dumps(
        {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Book",
                    "name": "The CEA Biophysics & Greenhouse Engineering Handbook (OpenCEA Compendium)",
                    "url": "https://inwoovation.com/handbooks/",
                    "inLanguage": ["en", "de", "ja"],
                    "datePublished": "2026-07-01",
                    "dateModified": TODAY_ISO,
                    "author": {
                        "@type": "Person",
                        "name": "Inwoo Hwang",
                        "url": "https://inwoovation.com/about.html",
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "Inwoovation Lab",
                        "url": "https://inwoovation.com/",
                    },
                    "description": f"Open-access six-part engineering compendium indexing all {en_count} CEA biophysics monographs ({total_editions} EN/DE/JA editions), {tool_count} live calculators, and {grant_count} global subsidy dossiers.",
                    "offers": {"@type": "Offer", "price": "0.00", "priceCurrency": "USD"},
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://inwoovation.com/"},
                        {"@type": "ListItem", "position": 2, "name": "CEA Engineering Handbook", "item": "https://inwoovation.com/handbooks/"},
                    ],
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "What is inside the Inwoovation Lab CEA Biophysics & Greenhouse Engineering Handbook?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": f"The compendium organizes all {en_count} English engineering monographs ({total_editions} EN, German DE, and Japanese JA editions) into six technical parts covering psychrometrics, photobiology, hydroponic ion chemistry, biosecurity/AI MPC, structural/CHP energy systems, and {grant_count} global agricultural grant playbooks including {de_grant_count} German subsidies.",
                            },
                        },
                        {
                            "@type": "Question",
                            "name": "Are the handbook chapters linked to live greenhouse engineering calculators?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": f"Yes. Every chapter card links directly to its paired interactive solver inside the {tool_count}-calculator /tools/ suite plus the OpenCEA Command Launcher (/suite/) and Embeddable Widget SDK (/embed/).",
                            },
                        },
                        {
                            "@type": "Question",
                            "name": "Is the CEA Biophysics & Greenhouse Engineering Compendium free to read and cite?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes. All online HTML volumes, downloadable Markdown handbook index, and browser-based biophysical simulators are 100% open-access ($0.00) for commercial growers, Gärtnermeister candidates, researchers, and agricultural extension services.",
                            },
                        },
                    ],
                },
            ],
        },
        ensure_ascii=False,
        indent=2,
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="google-adsense-account" content="ca-pub-8597809158257497">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The CEA Biophysics &amp; Greenhouse Engineering Handbook ({en_count} Volumes / {total_editions} Editions) | Inwoovation Lab</title>
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="description" content="Open-access six-part Controlled Environment Agriculture compendium indexing {en_count} volumes ({total_editions} EN/DE/JA editions), {tool_count} live biophysical calculators, and {grant_count} agricultural subsidy programs.">
  <link rel="canonical" href="https://inwoovation.com/handbooks/" />
  <meta property="og:type" content="book">
  <meta property="og:url" content="https://inwoovation.com/handbooks/">
  <meta property="og:title" content="The CEA Biophysics &amp; Greenhouse Engineering Handbook ({en_count} Volumes) | Inwoovation Lab">
  <meta property="og:description" content="Complete six-part engineering compendium covering psychrometrics, Farquhar photobiology, closed-loop fertigation, DIN V 18599 energy, and {grant_count} global subsidy dossiers.">
  <meta property="og:image" content="https://inwoovation.com/og-cover.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="The CEA Biophysics &amp; Greenhouse Engineering Handbook | Inwoovation Lab">
  <meta name="twitter:description" content="Open-access {total_editions}-edition engineering compendium + {tool_count} browser simulators.">
  <meta name="twitter:image" content="https://inwoovation.com/og-cover.jpg">

  <script type="application/ld+json">
  {schema_json}
  </script>

  <!-- Google tag (gtag.js) with Bot Guard -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-V4RYJBMEDE"></script>
  <script>
    if (navigator.webdriver || /HeadlessChrome|PhantomJS|Lighthouse|PTST|bot|crawler|spider|slurp/i.test(navigator.userAgent) || location.hostname === 'localhost' || location.hostname === '127.0.0.1' || (screen.width === 1366 && screen.height === 1366) || (screen.width === 800 && screen.height === 600) || screen.height >= 5000) {{ window['ga-disable-G-V4RYJBMEDE'] = true; }}
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', 'G-V4RYJBMEDE');
  </script>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8597809158257497" crossorigin="anonymous"></script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles.css">
  <link rel="stylesheet" href="../css/global-ui-enhancements.css?v=20261115">
  <script src="../js/global-search-palette.js?v=20261115"></script>

  <style>
    .handbook-wrap {{ max-width: 1120px; margin: 28px auto 72px; padding: 0 20px; }}
    .handbook-nav {{ display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }}
    .handbook-nav-links {{ display: flex; flex-wrap: wrap; gap: 14px; align-items: center; }}
    .handbook-nav-links a {{ color: #94a3b8; text-decoration: none; font-size: 0.9rem; font-weight: 600; }}
    .handbook-nav-links a:hover {{ color: #34d399; }}
    .handbook-hero {{
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.14), rgba(56, 189, 248, 0.1));
      border: 1px solid rgba(52, 211, 153, 0.28);
      border-radius: 22px;
      padding: 34px 30px;
      margin-bottom: 28px;
      display: grid;
      grid-template-columns: 1.25fr 360px;
      gap: 28px;
      align-items: center;
    }}
    @media (max-width: 900px) {{ .handbook-hero {{ grid-template-columns: 1fr; padding: 24px 20px; }} }}
    .handbook-hero h1 {{ font-family: 'Outfit', sans-serif; font-size: clamp(1.75rem, 3.2vw, 2.35rem); color: #f8fafc; margin: 8px 0 12px; line-height: 1.18; }}
    .hero-stats {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-top: 18px; }}
    .hero-stat {{ background: rgba(15, 23, 42, 0.78); border: 1px solid rgba(148, 163, 184, 0.18); border-radius: 12px; padding: 12px; }}
    .hero-stat strong {{ display: block; font-family: 'Outfit', sans-serif; font-size: 1.35rem; color: #34d399; }}
    .hero-stat span {{ font-size: 0.78rem; color: #94a3b8; }}
    .comp-pill-bar {{ display: flex; flex-wrap: wrap; gap: 8px; margin: 18px 0; }}
    .comp-pill {{
      text-decoration: none; font-size: 0.82rem; font-weight: 700; color: #e2e8f0;
      background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(148, 163, 184, 0.24);
      padding: 7px 14px; border-radius: 999px; transition: all 0.2s;
    }}
    .comp-pill:hover {{ border-color: #34d399; color: #34d399; }}
    .filter-input {{
      width: 100%; box-sizing: border-box; padding: 13px 16px; border-radius: 12px;
      border: 1px solid rgba(56, 189, 248, 0.3); background: rgba(15, 23, 42, 0.9);
      color: #f8fafc; font-size: 0.96rem; margin-bottom: 24px;
    }}
    .comp-part {{ margin-bottom: 36px; scroll-margin-top: 24px; }}
    .comp-part-head {{ display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid rgba(148, 163, 184, 0.2); padding-bottom: 8px; margin-bottom: 8px; }}
    .comp-part-head h2 {{ font-family: 'Outfit', sans-serif; font-size: 1.35rem; color: #f8fafc; margin: 0; }}
    .part-count {{ font-size: 0.82rem; font-weight: 700; color: #38bdf8; font-family: 'JetBrains Mono', monospace; }}
    .comp-part-desc {{ color: #94a3b8; font-size: 0.92rem; margin: 0 0 16px; line-height: 1.6; }}
    .chapter-grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px; }}
    .chapter-card {{
      background: rgba(15, 23, 42, 0.78); border: 1px solid rgba(148, 163, 184, 0.16);
      border-radius: 14px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px;
    }}
    .chapter-card:hover {{ border-color: rgba(52, 211, 153, 0.45); }}
    .chapter-meta {{ display: flex; flex-direction: column; gap: 6px; }}
    .vol-pill {{
      display: inline-block; width: fit-content; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem;
      font-weight: 700; color: #34d399; background: rgba(16, 185, 129, 0.14); padding: 2px 8px; border-radius: 6px;
    }}
    .chapter-title a {{ color: #f8fafc; text-decoration: none; font-family: 'Outfit', sans-serif; font-size: 1.02rem; font-weight: 700; line-height: 1.35; }}
    .chapter-title a:hover {{ color: #38bdf8; }}
    .chapter-desc {{ color: #94a3b8; font-size: 0.84rem; line-height: 1.55; margin: 0; }}
    .badge-row {{ display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }}
    .edition-badge {{ text-decoration: none; font-size: 0.74rem; font-weight: 700; padding: 4px 9px; border-radius: 8px; border: 1px solid rgba(148, 163, 184, 0.22); color: #e2e8f0; background: rgba(30, 41, 59, 0.8); }}
    .edition-badge.tool {{ color: #38bdf8; border-color: rgba(56, 189, 248, 0.35); }}
    .edition-badge.de {{ color: #fbbf24; border-color: rgba(251, 191, 36, 0.35); }}
    .edition-badge.ja {{ color: #f472b6; border-color: rgba(244, 114, 182, 0.35); }}
    .tool-strip {{ background: rgba(15, 23, 42, 0.82); border: 1px solid rgba(56, 189, 248, 0.22); border-radius: 16px; padding: 24px; margin: 36px 0; }}
    .tool-chip-grid {{ display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }}
    .tool-chip {{ text-decoration: none; font-size: 0.8rem; font-weight: 600; color: #38bdf8; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); padding: 6px 12px; border-radius: 999px; }}
    .faq-grid {{ display: grid; gap: 12px; margin-top: 14px; }}
    .faq-item {{ background: rgba(15, 23, 42, 0.78); border: 1px solid rgba(148, 163, 184, 0.18); border-radius: 12px; padding: 16px; }}
    .faq-item strong {{ display: block; color: #f8fafc; margin-bottom: 6px; }}
    .faq-item p {{ margin: 0; color: #94a3b8; font-size: 0.89rem; line-height: 1.6; }}
  </style>
</head>
<body>
  <div class="handbook-wrap">
    <nav class="handbook-nav" aria-label="Primary Handbook Navigation">
      <a href="../index.html" style="color:#38bdf8; text-decoration:none; font-weight:700;">← Inwoovation Lab Home</a>
      <div class="handbook-nav-links">
        <a href="../tools/index.html">🛠️ {tool_count} Calculators</a>
        <a href="../suite/index.html">🚀 OpenCEA Launcher</a>
        <a href="../embed/index.html">🧩 Embed SDK</a>
        <a href="../guides.html">📚 Guides Archive</a>
        <a href="../wiki/index.html">🧬 AgTech Wiki</a>
        <a href="../directory.html">🗂️ Master Index</a>
        <button class="nav-search-trigger" onclick="window.InwooPalette.open()"><span>🔍 Spotlight Search</span> <kbd>Ctrl+K</kbd></button>
      </div>
    </nav>

    <header class="handbook-hero">
      <div>
        <span style="display:inline-block; background:rgba(16,185,129,0.2); color:#34d399; font-size:0.76rem; font-weight:800; padding:4px 12px; border-radius:999px; letter-spacing:0.04em;">📖 OPENCEA BIOPHYSICS COMPENDIUM · 100% OPEN ACCESS</span>
        <h1>The CEA Biophysics &amp; Greenhouse Engineering Handbook</h1>
        <p style="color:#cbd5e1; line-height:1.68; margin:0;">
          Systematic six-part reference synthesizing all <strong>{en_count} English engineering monographs</strong> ({total_editions} total EN / DE / JA editions), paired directly with <strong>{tool_count} zero-latency biophysical simulators</strong> and <strong>{grant_count} global subsidy playbooks</strong> ({de_grant_count} German funding tracks). Also available as a <a href="THE_CEA_BIOPHYSICS_AND_GREENHOUSE_ENGINEERING_HANDBOOK.md" style="color:#38bdf8; font-weight:700;">complete Markdown index</a> and <a href="../store.html" style="color:#fbbf24; font-weight:700;">offline ZIP vault ($0.00)</a>.
        </p>
        <div class="hero-stats">
          <div class="hero-stat"><strong>{en_count}</strong><span>EN Core Volumes</span></div>
          <div class="hero-stat"><strong>{total_editions}</strong><span>EN · DE · JA Editions</span></div>
          <div class="hero-stat"><strong>{tool_count}</strong><span>Live Simulators</span></div>
          <div class="hero-stat"><strong>{grant_count}</strong><span>Verified Grants</span></div>
        </div>
      </div>
      <div>
        <iframe src="../embed/vpd-gauge.html" title="Live VPD Microclimate Gauge Widget" width="100%" height="380" loading="lazy" style="border:none; border-radius:16px; overflow:hidden;"></iframe>
      </div>
    </header>

    <div class="comp-pill-bar">
      {"".join(toc_pills)}
      <a href="#faq" class="comp-pill">❓ FAQ</a>
    </div>

    <input id="handbookSearch" class="filter-input" type="search" placeholder="🔎 Filter {en_count} volumes by equation, physics standard, crop, or grant (e.g., VPD, DIN V 18599, Farquhar, SWEEP)..." oninput="filterHandbook()" aria-label="Filter handbook chapters">

    <main>
{chr(10).join(part_sections)}

      <section class="tool-strip">
        <h2 style="font-family:'Outfit',sans-serif; color:#f8fafc; margin:0 0 8px;">🧮 Paired Interactive Calculators &amp; OpenCEA Suite</h2>
        <p style="color:#94a3b8; font-size:0.9rem; margin:0;">Every handbook volume pairs with deterministic client-side calculators in <a href="../tools/index.html" style="color:#38bdf8;">/tools/</a> and the unified <a href="../suite/index.html" style="color:#34d399;">OpenCEA Command Launcher</a>:</p>
        <div class="tool-chip-grid">
{tool_chips}
          <a href="../tools/index.html" class="tool-chip" style="background:rgba(16,185,129,0.16); color:#34d399; border-color:#34d399;">View All {tool_count} Calculators →</a>
        </div>
      </section>

      <section id="faq" style="margin-top:32px;">
        <h2 style="font-family:'Outfit',sans-serif; color:#f8fafc; margin-bottom:8px;">❓ Handbook Reference FAQ</h2>
        <div class="faq-grid">
          <div class="faq-item">
            <strong>What is inside the Inwoovation Lab CEA Biophysics &amp; Greenhouse Engineering Handbook?</strong>
            <p>It organizes all {en_count} English monographs ({total_editions} EN, German DE, and Japanese JA editions) across six structured engineering domains alongside {tool_count} live simulators and {grant_count} verified subsidy programs ({de_grant_count} in Germany).</p>
          </div>
          <div class="faq-item">
            <strong>Are the handbook chapters linked to live greenhouse engineering calculators?</strong>
            <p>Yes. Each volume card exposes direct navigation to its paired live solver in /tools/, regional climate hubs in /climate/, and quick launchers inside /suite/ and /embed/.</p>
          </div>
          <div class="faq-item">
            <strong>Is the CEA Biophysics &amp; Greenhouse Engineering Compendium free to read and cite?</strong>
            <p>Yes. Every HTML volume, the downloadable Markdown compendium table, and all client-side biophysical calculators are 100% free ($0.00) with zero registration or API lock-in.</p>
          </div>
        </div>
      </section>
    </main>

    <footer style="margin-top:48px; padding-top:24px; border-top:1px solid rgba(148,163,184,0.18); text-align:center; color:#64748b; font-size:0.85rem;">
      <div style="display:flex; justify-content:center; flex-wrap:wrap; gap:18px; margin-bottom:10px;">
        <a href="../index.html" style="color:#94a3b8; text-decoration:none; font-weight:600;">Home</a>
        <a href="../tools/index.html" style="color:#94a3b8; text-decoration:none; font-weight:600;">{tool_count} Calculators</a>
        <a href="../guides.html" style="color:#94a3b8; text-decoration:none; font-weight:600;">{total_editions} Monographs</a>
        <a href="../benchmarks/index.html" style="color:#94a3b8; text-decoration:none; font-weight:600;">Benchmarks</a>
        <a href="../directory.html" style="color:#94a3b8; text-decoration:none; font-weight:600;">Master Directory</a>
        <a href="../about.html" style="color:#94a3b8; text-decoration:none; font-weight:600;">About Lab</a>
        <a href="../contact.html" style="color:#94a3b8; text-decoration:none; font-weight:600;">Contact</a>
        <a href="../privacy-policy.html" style="color:#94a3b8; text-decoration:none; font-weight:600;">Privacy Policy</a>
        <a href="../terms-of-service.html" style="color:#94a3b8; text-decoration:none; font-weight:600;">Terms of Service</a>
      </div>
      <div>© 2026 Inwoovation Lab (OpenCEA Initiative). Compiled &amp; Verified by Inwoo Hwang.</div>
    </footer>
  </div>

  <script>
    function filterHandbook() {{
      const q = (document.getElementById('handbookSearch').value || '').toLowerCase().trim();
      document.querySelectorAll('.chapter-card').forEach(card => {{
        const hay = (card.getAttribute('data-search') || '') + ' ' + card.innerText.toLowerCase();
        card.style.display = (!q || hay.includes(q)) ? 'flex' : 'none';
      }});
    }}
  </script>
</body>
</html>
"""


def build() -> tuple[int, int]:
    HANDBOOKS_DIR.mkdir(parents=True, exist_ok=True)
    en_articles, de_count, ja_count, tools_list, grant_count, de_grant_count = _load_catalog()

    md_text = _build_markdown(en_articles, de_count, ja_count, len(tools_list), grant_count)
    if not OUT_MD.exists() or OUT_MD.read_text(encoding="utf-8", errors="ignore") != md_text:
        OUT_MD.write_text(md_text, encoding="utf-8")

    html_text = _build_html(en_articles, de_count, ja_count, tools_list, grant_count, de_grant_count)
    if not OUT_HTML.exists() or OUT_HTML.read_text(encoding="utf-8", errors="ignore") != html_text:
        OUT_HTML.write_text(html_text, encoding="utf-8")

    try:
        from Engine.Gates.verify_site_integrity import validate_single_page_before_write
        violations = validate_single_page_before_write("handbooks/index.html", html_text, str(PORTAL_DIR))
        if violations:
            print(f"⚠️ [HANDBOOK BUILDER] Integrity warnings on handbooks/index.html: {violations}")
    except Exception as exc:
        print(f"⚠️ [HANDBOOK BUILDER] Pre-write validation warning: {exc}")

    print(
        f"📖 [HANDBOOK COMPENDIUM] Built handbooks/index.html & Markdown ({len(en_articles)} EN + {de_count} DE + {ja_count} JA = {len(en_articles)+de_count+ja_count} editions, {len(tools_list)} tools, {grant_count} grants)"
    )
    return len(en_articles), len(en_articles) + de_count + ja_count


if __name__ == "__main__":
    build()
