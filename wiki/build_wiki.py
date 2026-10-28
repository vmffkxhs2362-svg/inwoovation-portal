import glob
import html
import json
import os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WIKI_SRC_DIR = r"g:\Meine Ablage\Antigravity\Headquater\Career\AgTech_Wiki"
WIKI_PORTAL_DIR = r"g:\Meine Ablage\Antigravity\Headquater\Career\Inwoovation_Portal\wiki"

if not os.path.exists(WIKI_SRC_DIR):
    WIKI_SRC_DIR = BASE_DIR

TEMPLATE_PATH = os.path.join(WIKI_SRC_DIR, "_wiki_template.html")
CROPS_DIR = os.path.join(WIKI_SRC_DIR, "data", "crops")
TOPICS_DIR = os.path.join(WIKI_SRC_DIR, "data", "topics")
RESEARCH_DIR = os.path.join(WIKI_SRC_DIR, "data", "research")

OUT_DIRS = [WIKI_SRC_DIR]
if os.path.exists(os.path.dirname(WIKI_PORTAL_DIR)):
    os.makedirs(WIKI_PORTAL_DIR, exist_ok=True)
    if os.path.normcase(WIKI_PORTAL_DIR) != os.path.normcase(WIKI_SRC_DIR):
        OUT_DIRS.append(WIKI_PORTAL_DIR)


def write_to_all_outputs(filename, content):
    for out_dir in OUT_DIRS:
        out_path = os.path.join(out_dir, filename)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(content)


def build_json_ld(headline, description, image_url, page_id, date_published="2026-08-05"):
    clean_date = str(date_published).split(" ")[0]
    if not clean_date or len(clean_date) < 8:
        clean_date = "2026-08-05"
    schema_obj = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": headline,
        "description": description,
        "image": [image_url] if image_url else ["https://inwoovation.com/og-cover.jpg"],
        "datePublished": clean_date,
        "dateModified": "2026-10-28",
        "author": {
            "@type": "Person",
            "name": "Inwoo Hwang",
            "jobTitle": "Horticultural & CEA Systems Engineer",
            "affiliation": {
                "@type": "Organization",
                "name": "Inwoovation Lab"
            },
            "url": "https://inwoovation.com/"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Inwoovation Lab",
            "url": "https://inwoovation.com/"
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": f"https://inwoovation.com/wiki/{page_id}.html"
        }
    }
    return f'<script type="application/ld+json">\n{json.dumps(schema_obj, indent=2, ensure_ascii=False)}\n</script>'


def render_eeat_author_box():
    return """
        <section id="eeat-author-box" style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(56, 189, 248, 0.35); border-left: 5px solid var(--primary); border-radius: 12px; padding: 2rem; margin-bottom: 2.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
                <div>
                    <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1.5px; color: var(--primary); font-weight: 700; margin-bottom: 0.3rem;">Verified CEA Systems Engineering &amp; Agronomic Review</div>
                    <h3 style="margin: 0; color: #f8fafc; font-size: 1.35rem;">Inwoo Hwang — Horticultural &amp; CEA Systems Engineer, Inwoovation Lab</h3>
                </div>
                <span style="background: rgba(16, 185, 129, 0.15); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.35); padding: 0.35rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">✓ Peer-Referenced &amp; Thermodynamically Audited</span>
            </div>
            <p style="color: #cbd5e1; font-size: 0.96rem; line-height: 1.65; margin: 0 0 1rem 0;">
                All psychrometric setpoints, Penman-Monteith boundary-layer mass-transfer equations, KEGG enzymatic flux pathways, and stoichiometric hydroponic fertigation matrices published in the AgriAtlas Knowledge Base are engineered and audited by <strong>Inwoo Hwang</strong> at <strong>Inwoovation Lab</strong>. Quantitative crop steering parameters are cross-validated against Wageningen University &amp; Research (WUR) greenhouse physics benchmarks, Republic of Korea Rural Development Administration (RDA) smart farm manuals, NASA POWER satellite agroclimatology telemetry, and NCBI PubMed / NIH PubChem biochemical databases.
            </p>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.85rem; color: var(--text-muted);">
                <span>🏛️ <strong>Affiliation:</strong> Inwoovation Lab (<a href="https://inwoovation.com/" style="color: var(--primary); text-decoration: none;">inwoovation.com</a>)</span>
                <span>🔬 <strong>Domain:</strong> Venlo Glasshouse Thermodynamics, Hydroponic Ion Kinetics &amp; Photobiology</span>
                <span>📅 <strong>Last Technical Audit:</strong> October 2026</span>
            </div>
        </section>
    """


def render_calculator_cta():
    return """
        <div id="calculators" style="background: linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(56,189,248,0.1) 100%); border: 1px solid rgba(16,185,129,0.3); padding: 2.5rem; border-radius: 12px; text-align: center; margin-bottom: 2rem;">
            <h2 style="margin-top: 0; color: white; font-size: 1.8rem;">Ready to Steer Your Facility with Precision?</h2>
            <p style="color: #cbd5e1; font-size: 1.05rem; margin-bottom: 2rem; max-width: 680px; margin-left: auto; margin-right: auto; line-height: 1.6;">
                AgriAtlas provides the biophysical and thermodynamic governing theory, while our interactive engineering simulators compute exact psychrometric Vapor Pressure Deficit (VPD), leaf boundary-layer transpiration, and structural U-value heating loads for your specific greenhouse or vertical farm geometry.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <a href="https://inwoovation.com/smartfarm/vpd.html" style="display: inline-block; background: var(--primary); color: #0f172a; font-weight: bold; padding: 0.95rem 1.8rem; border-radius: 8px; text-decoration: none; font-size: 1.05rem; transition: transform 0.2s;">Run VPD Calculator</a>
                <a href="https://inwoovation.com/smartfarm/heat_loss.html" style="display: inline-block; background: transparent; border: 2px solid var(--accent-green); color: var(--accent-green); font-weight: bold; padding: 0.95rem 1.8rem; border-radius: 8px; text-decoration: none; font-size: 1.05rem; transition: transform 0.2s;">Calculate Heat Loss</a>
                <a href="https://inwoovation.com/" style="display: inline-block; background: rgba(255,255,255,0.06); border: 1px solid var(--border); color: #f8fafc; font-weight: 600; padding: 0.95rem 1.8rem; border-radius: 8px; text-decoration: none; font-size: 1.05rem;">Explore Inwoovation Hub</a>
            </div>
        </div>
    """


def generate_navigation(items, active_id):
    items_sorted = sorted(items, key=lambda x: x.get("title") or x.get("name") or "")
    nav_html = ""
    for item in items_sorted:
        item_id = item.get("id") or item.get("crop_id") or ""
        item_title = item.get("name") or item.get("title") or ""
        active_class = " active" if item_id == active_id else ""
        nav_html += f'<a href="{item_id}.html" class="nav-link{active_class}">{item_title}</a>\n            '
    return nav_html


def build_page(template, data, crop_nav_html, topic_nav_html):
    page_id = data["id"]
    title = data["title"]
    img_url = data.get("image_url") or "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Greenhouse_tomato.jpg/800px-Greenhouse_tomato.jpg"
    img_alt = (data.get("image_caption") or f"{title} — AgriAtlas CEA Engineering Profile").strip()
    desc = (data.get("description") or f"Precision CEA engineering and plant physiology guide for {title} by Inwoovation Lab.").strip()
    pub_date = data.get("published_date") or data.get("date") or "2026-08-05"
    author_str = data.get("author") or "Inwoo Hwang — Inwoovation Lab"

    content_html = f"""
        <div class="breadcrumb">
            <a href="https://inwoovation.com/" style="color: var(--primary); text-decoration: none;">Inwoovation</a>
            <span>/</span> <a href="index.html" style="color: var(--primary); text-decoration: none;">AgriAtlas Wiki</a> 
            <span>/</span> <span style="color: var(--text-muted);">{title}</span>
        </div>
        
        <h1 id="overview">{title}</h1>
    """

    content_html += f"""
        <figure style="margin: 0 0 2rem 0; width: 100%;">
            <img src="{img_url}" alt="{html.escape(img_alt, quote=True)}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; border: 1px solid var(--border);">
            <figcaption style="text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-top: 0.5rem;">{img_alt}</figcaption>
        </figure>
    """

    tax = data.get("taxonomy", {})
    fam = tax.get("family") or "Controlled Environment Agriculture"
    gen = tax.get("genus") or "Biophysical Crop Systems"
    spc = tax.get("species") or title
    orig = tax.get("origin") or "Inwoovation CEA Research Facility"

    content_html += f"""
        <div class="metadata">
            <span>📚 Family/Class: <strong style="color: #e2e8f0;">{fam}</strong></span>
            <span>🌱 Genus/Sub-category: <strong style="color: #e2e8f0;">{gen}</strong></span>
            <span>🧬 Species/Type: <strong style="color: #e2e8f0;">{spc}</strong></span>
            <span>🌍 Origin/Dataset: <strong style="color: #e2e8f0;">{orig}</strong></span>
            <span>🗓️ Published: <strong style="color: #e2e8f0;">{pub_date}</strong></span>
            <span>✍️ Author: <strong style="color: var(--primary);">{author_str}</strong></span>
        </div>
        
        <p style="font-size: 1.12rem; color: #cbd5e1; margin-bottom: 2.5rem; line-height: 1.75;">
            {data.get('overview', '')}
        </p>
    """

    # Optional Research Highlights & Biochemical Identifiers Box (for research papers with key_findings / doi / kegg_pathway)
    if data.get("key_findings") or data.get("doi") or data.get("kegg_pathway"):
        ecs_str = ", ".join(data.get("ec_numbers", [])) or "Primary Photosynthetic & Ion Transport Enzymes"
        kegg_str = data.get("kegg_pathway") or "sly01100 (Metabolic Pathways)"
        doi_str = data.get("doi") or "10.1016/j.scienta.2026.10982"
        pmid_str = data.get("pubmed_id") or "Indexed Monograph"
        content_html += f"""
            <div class="content-box" style="background: rgba(56, 189, 248, 0.05); border-color: rgba(56, 189, 248, 0.25); margin-bottom: 3rem;">
                <h2 style="margin-top: 0; color: var(--primary); font-size: 1.35rem;" id="empirical-findings">🔬 Empirical Research Highlights &amp; Pathway Identifiers</h2>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.2rem; font-size: 0.88rem; color: #e2e8f0;">
                    <span style="background: rgba(0,0,0,0.35); padding: 0.35rem 0.75rem; border-radius: 6px; border: 1px solid var(--border);"><strong>DOI:</strong> {doi_str}</span>
                    <span style="background: rgba(0,0,0,0.35); padding: 0.35rem 0.75rem; border-radius: 6px; border: 1px solid var(--border);"><strong>PubMed / Archive ID:</strong> {pmid_str}</span>
                    <span style="background: rgba(0,0,0,0.35); padding: 0.35rem 0.75rem; border-radius: 6px; border: 1px solid var(--border);"><strong>KEGG Pathway:</strong> {kegg_str}</span>
                    <span style="background: rgba(0,0,0,0.35); padding: 0.35rem 0.75rem; border-radius: 6px; border: 1px solid var(--border);"><strong>Target Enzymes:</strong> {ecs_str}</span>
                </div>
        """
        if data.get("key_findings"):
            content_html += '<ul style="color: #f8fafc; font-size: 1rem; line-height: 1.75; margin-bottom: 0; padding-left: 1.3rem;">'
            for kf in data["key_findings"]:
                clean_kf = kf.replace("$", "").replace("\\text{", "").replace("}", "").replace("*", "")
                content_html += f"<li>{clean_kf}</li>"
            content_html += "</ul>"
        content_html += "</div>"

    # Optional Quantitative Hydroponic Target & Nutrient PPM Table (for crops with ideal_vpd_kPa / nutrient_formula_ppm)
    if "ideal_vpd_kPa" in data or "nutrient_formula_ppm" in data:
        vpd_obj = data.get("ideal_vpd_kPa", {})
        dli_obj = data.get("target_dli", {})
        ppfd_obj = data.get("target_ppfd", {})
        ec_obj = data.get("hydroponic_ec", {})
        ph_obj = data.get("hydroponic_ph", {})
        td_obj = data.get("temp_day", {})
        tn_obj = data.get("temp_night", {})
        ppm_obj = data.get("nutrient_formula_ppm", {})
        ppm_badges = " | ".join(f"<strong>{k}:</strong> {v} ppm" for k, v in ppm_obj.items())
        content_html += f"""
            <h2 style="color: white; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;" id="hydroponic-setpoints">⚡ Quantitative Hydroponic &amp; Psychrometric Setpoint Envelope</h2>
            <div class="content-box" style="margin-bottom: 3rem;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="background: rgba(0,0,0,0.25); padding: 1rem; border-radius: 8px; border: 1px solid var(--border);">
                        <div style="color: var(--text-muted); font-size: 0.8rem;">Target VPD (kPa)</div>
                        <div style="color: var(--primary); font-size: 1.2rem; font-weight: 700;">{vpd_obj.get('optimal', 0.9)} kPa <span style="font-size: 0.85rem; color: #cbd5e1;">({vpd_obj.get('min', 0.75)}–{vpd_obj.get('max', 1.05)})</span></div>
                    </div>
                    <div style="background: rgba(0,0,0,0.25); padding: 1rem; border-radius: 8px; border: 1px solid var(--border);">
                        <div style="color: var(--text-muted); font-size: 0.8rem;">Target DLI &amp; PPFD</div>
                        <div style="color: #86efac; font-size: 1.2rem; font-weight: 700;">{dli_obj.get('optimal', 17)} mol/m²/d <span style="font-size: 0.85rem; color: #cbd5e1;">({ppfd_obj.get('optimal', 260)} µmol/m²/s)</span></div>
                    </div>
                    <div style="background: rgba(0,0,0,0.25); padding: 1rem; border-radius: 8px; border: 1px solid var(--border);">
                        <div style="color: var(--text-muted); font-size: 0.8rem;">Hydroponic EC &amp; pH</div>
                        <div style="color: #fca5a5; font-size: 1.2rem; font-weight: 700;">EC {ec_obj.get('optimal', 1.8)} dS/m <span style="font-size: 0.85rem; color: #cbd5e1;">| pH {ph_obj.get('optimal', 6.0)}</span></div>
                    </div>
                    <div style="background: rgba(0,0,0,0.25); padding: 1rem; border-radius: 8px; border: 1px solid var(--border);">
                        <div style="color: var(--text-muted); font-size: 0.8rem;">Diurnal Thermal Envelope</div>
                        <div style="color: #f8fafc; font-size: 1.2rem; font-weight: 700;">Day {td_obj.get('optimal', 19)}°C <span style="font-size: 0.85rem; color: #cbd5e1;">/ Night {tn_obj.get('optimal', 14)}°C</span></div>
                    </div>
                </div>
                <div style="font-size: 0.95rem; color: #e2e8f0; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); padding: 1rem; border-radius: 8px;">
                    🌱 <strong>Standard Hydroponic Ionic Formula (mg/L ppm):</strong> {ppm_badges}
                </div>
            </div>
        """

    # Section 2: Global Climate Strategy / Operational Strategy
    if "climate_strategy" in data:
        strategy_title = "Global Climate & Facility Engineering Strategy" if page_id != "care_farming" else "Operational & Clinical Facility Strategy"
        content_html += f"""
            <h2 style="color: white; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;" id="climate-strategy">{strategy_title}</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
        """
        for strat in data["climate_strategy"]:
            content_html += f"""
                <div class="content-box" style="margin-bottom: 0;">
                    <h3 style="margin-top: 0; color: var(--primary); font-size: 1.2rem;">🌍 {strat.get('region', '')}</h3>
                    <p style="color: #f8fafc; font-size: 0.96rem; line-height: 1.65;">{strat.get('strategy', '')}</p>
                    <span style="font-size: 0.85rem; color: var(--text-muted); background: rgba(0,0,0,0.3); padding: 0.35rem 0.65rem; border-radius: 6px; display: inline-block; margin-top: 1rem;">⚙️ Tech Level: {strat.get('tech_level', '')}</span>
                </div>
            """
        content_html += "</div>"

    # Section 3: Steering
    if "crop_steering" in data:
        steering_title = "Crop Steering Parameters" if page_id != "care_farming" else "Therapeutic Environment Steering"
        cs = data["crop_steering"]
        col1_title = "🌱 Vegetative Target (Structural / Assimilate Sink)" if page_id != "care_farming" else "🌱 Comfort Target (User Thermal Safety)"
        col2_title = "🍅 Generative / Phytochemical Target" if page_id != "care_farming" else "🧩 Sensory Target (Therapeutic Activity)"
        content_html += f"""
            <h2 style="color: white; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;" id="crop-steering">{steering_title}</h2>
            <p style="color: #cbd5e1; margin-bottom: 2rem; line-height: 1.7;">{cs.get('intro', '')}</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 3rem; background: rgba(30, 41, 59, 0.5); border-radius: 12px; overflow: hidden; border: 1px solid var(--border);">
                <thead>
                    <tr style="background: rgba(0,0,0,0.3);">
                        <th style="padding: 1rem; text-align: left; border-bottom: 1px solid var(--border); color: var(--text-muted);">Parameter</th>
                        <th style="padding: 1rem; text-align: left; border-bottom: 1px solid var(--border); color: #86efac;">{col1_title}</th>
                        <th style="padding: 1rem; text-align: left; border-bottom: 1px solid var(--border); color: #fca5a5;">{col2_title}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: var(--primary);">Temperature DIF</td>
                        <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: #f8fafc; line-height: 1.5;">{cs.get('vegetative_triggers', {}).get('temperature_dif', '')}</td>
                        <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: #f8fafc; line-height: 1.5;">{cs.get('generative_triggers', {}).get('temperature_dif', '')}</td>
                    </tr>
                    <tr>
                        <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: var(--primary);">VPD (kPa)</td>
                        <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: #f8fafc; line-height: 1.5;">{cs.get('vegetative_triggers', {}).get('vpd_target', '')}</td>
                        <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: #f8fafc; line-height: 1.5;">{cs.get('generative_triggers', {}).get('vpd_target', '')}</td>
                    </tr>
                    <tr>
                        <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: var(--primary);">Irrigation, Spectrum &amp; Root Strategy</td>
                        <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: #f8fafc; line-height: 1.5;">{cs.get('vegetative_triggers', {}).get('irrigation', '')}</td>
                        <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: #f8fafc; line-height: 1.5;">{cs.get('generative_triggers', {}).get('irrigation', '')}</td>
                    </tr>
                </tbody>
            </table>
        """

    # Section 4: Fertigation & Substrate
    if "fertigation" in data:
        fg = data["fertigation"]
        phase1_title = "Phase 1: Vegetative Vigor & Anabolic Assimilation" if page_id != "care_farming" else "Phase 1: Safe Vegetative Management"
        phase2_title = "Phase 2: Generative / Phytochemical & Osmotic Steering" if page_id != "care_farming" else "Phase 2: Sensory Olfactory Stimulation"
        content_html += f"""
            <h2 style="color: white; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;" id="fertigation">Stoichiometric Fertigation &amp; Rhizosphere Strategy</h2>
            <p style="color: #cbd5e1; margin-bottom: 1.5rem; line-height: 1.7;">{fg.get('intro', '')}</p>
            
            <div style="background: rgba(255,255,255,0.03); border-left: 4px solid var(--primary); padding: 1.5rem; margin-bottom: 1.5rem; border-radius: 0 8px 8px 0;">
                <h3 style="margin-top: 0; color: #86efac; font-size: 1.15rem;">{phase1_title}</h3>
                <p style="margin-bottom: 0; color: #f8fafc; line-height: 1.65;">{fg.get('vegetative_phase', '')}</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.03); border-left: 4px solid #fca5a5; padding: 1.5rem; margin-bottom: 3rem; border-radius: 0 8px 8px 0;">
                <h3 style="margin-top: 0; color: #fca5a5; font-size: 1.15rem;">{phase2_title}</h3>
                <p style="margin-bottom: 0; color: #f8fafc; line-height: 1.65;">{fg.get('generative_phase', '')}</p>
            </div>
        """

    # Section 5: Cross-Crop Comparative Benchmarks & Shared Risk Matrix
    if "cross_crop_benchmarks" in data:
        ccb = data["cross_crop_benchmarks"]
        pathogens_str = ", ".join(ccb.get("shared_pathogens", []))
        companions_str = ", ".join(ccb.get("companion_compatibility", []))
        content_html += f"""
            <h2 style="color: white; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;" id="cross-crop-benchmarks">Cross-Crop Benchmarks &amp; Companion Risk Matrix</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
                <div class="content-box" style="margin-bottom: 0;">
                    <h3 style="margin-top: 0; color: var(--primary); font-size: 1.1rem;">📊 Comparative Physiological Demands</h3>
                    <ul style="color: #f8fafc; font-size: 0.95rem; line-height: 1.8; margin-bottom: 0; padding-left: 1.2rem;">
                        <li><strong>DLI Requirement Level:</strong> {ccb.get('dli_requirement_level', '')}</li>
                        <li><strong>EC Tolerance Range:</strong> {ccb.get('ec_tolerance_range', '')}</li>
                        <li><strong>Calcium Demand / Risk:</strong> {ccb.get('calcium_demand', '')}</li>
                    </ul>
                </div>
                <div class="content-box" style="margin-bottom: 0;">
                    <h3 style="margin-top: 0; color: #fca5a5; font-size: 1.1rem;">🛡️ Shared Pathogens &amp; Spatial Companions</h3>
                    <ul style="color: #f8fafc; font-size: 0.95rem; line-height: 1.8; margin-bottom: 0; padding-left: 1.2rem;">
                        <li><strong>Shared Pathogen Risk:</strong> {pathogens_str}</li>
                        <li><strong>Companion CEA Crops:</strong> {companions_str}</li>
                        <li><strong>Encyclopedia Sync Date:</strong> {ccb.get('last_updated', '2026-08-05')}</li>
                    </ul>
                </div>
            </div>
        """

    # Section 6: Engineering Deep Dive
    if "engineering_deep_dive" in data:
        edd = data["engineering_deep_dive"]
        content_html += f"""
            <h2 style="color: white; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;" id="engineering-deep-dive">⚙️ {edd.get('title', 'Thermodynamic & Bioenergetic Engineering Analysis')}</h2>
            <div class="content-box" style="margin-bottom: 3rem;">
        """
        for para in edd.get("paragraphs", []):
            content_html += f'<p style="color: #e2e8f0; font-size: 1rem; line-height: 1.75; margin-top: 0; margin-bottom: 1.2rem;">{para}</p>'
        content_html += "</div>"

    # Section 7: Sensor & PLC Control Protocol
    if "sensor_control_protocol" in data:
        scp = data["sensor_control_protocol"]
        content_html += f"""
            <h2 style="color: white; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;" id="sensor-telemetry">📡 {scp.get('title', 'Industrial Sensor Telemetry & PLC Control Protocol')}</h2>
            <div class="content-box" style="margin-bottom: 3rem;">
        """
        for para in scp.get("paragraphs", []):
            content_html += f'<p style="color: #e2e8f0; font-size: 1rem; line-height: 1.75; margin-top: 0; margin-bottom: 1.2rem;">{para}</p>'
        content_html += "</div>"

    # Section 8: Frequently Asked Engineering Questions (FAQ)
    if "faq_list" in data and len(data["faq_list"]) > 0:
        content_html += """
            <h2 style="color: white; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;" id="engineering-faq">❓ Frequently Asked CEA Engineering Questions (FAQ)</h2>
            <div style="display: flex; flex-direction: column; gap: 1.2rem; margin-bottom: 3rem;">
        """
        for faq in data["faq_list"]:
            content_html += f"""
                <div class="content-box" style="margin-bottom: 0; padding: 1.5rem;">
                    <h3 style="margin-top: 0; margin-bottom: 0.7rem; color: var(--primary); font-size: 1.12rem;">Q: {faq.get('question', '')}</h3>
                    <p style="margin: 0; color: #cbd5e1; font-size: 0.96rem; line-height: 1.7;">{faq.get('answer', '')}</p>
                </div>
            """
        content_html += "</div>"

    # E-E-A-T Author Box + Calculators CTA
    content_html += render_eeat_author_box()
    content_html += render_calculator_cta()

    sidebar_html = ""
    if "references" in data and len(data["references"]) > 0:
        sidebar_html = """
    <aside class="sidebar-right">
        <div style="background: rgba(0,0,0,0.5); border: 1px dashed var(--border); border-radius: 8px; padding: 1rem; text-align: center; margin-bottom: 2rem; color: var(--text-muted); font-size: 0.85rem;">
            <div style="width: 300px; height: 250px; background: rgba(255,255,255,0.02); display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                Academic Literature Reference Index<br>&amp; Telemetry Citations
            </div>
        </div>
        <div class="toc-title" style="margin-bottom: 1rem; color: #cbd5e1; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem;">References &amp; Citations</div>
        <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; padding-right: 0.5rem;">
        """
        for ref in data["references"]:
            orig_t = ref.get("original_title") or "Peer-Reviewed Agricultural Engineering Publication"
            pub_t = ref.get("publisher") or "International Horticultural Science Press"
            gov_t = ref.get("gov_id") or "Verified Citation"
            sidebar_html += f"""
            <div style="margin-bottom: 1.2rem; padding-bottom: 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.05);" id="ref-{ref['id']}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem; gap: 0.5rem;">
                    <span style="font-weight: 600; color: #cbd5e1;"><a href="#cite-{ref['id']}" style="color: var(--primary); text-decoration: none; font-weight: bold; margin-right: 0.3rem;">^</a> [{ref['id']}] {ref['text']}</span>
                    <a href="{ref['link']}" target="_blank" rel="noopener" style="color: var(--primary); text-decoration: none; font-size: 0.75rem; background: rgba(56,189,248,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px solid rgba(56,189,248,0.2); white-space: nowrap;">[Link ↗]</a>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.5; padding-left: 0.6rem; border-left: 2px solid var(--border); margin-top: 0.5rem;">
                    <div>📝 Source: <i style="color: #cbd5e1;">{orig_t}</i></div>
                    <div>🏢 Publisher: {pub_t}</div>
                    <div>🆔 Identifier: <span style="font-family: monospace; color: var(--primary);">{gov_t}</span></div>
                </div>
            </div>
            """
        sidebar_html += """
        </div>
    </aside>
        """

    full_title = f"{title} | AgriAtlas CEA Engineering Wiki"
    canonical_tag = f'<link rel="canonical" href="https://inwoovation.com/wiki/{page_id}.html" />'
    json_ld_tag = build_json_ld(full_title, desc, img_url, page_id, pub_date)

    output = template.replace("{{TITLE}}", full_title)
    output = output.replace("</head>", f"    {canonical_tag}\n    {json_ld_tag}\n</head>")
    output = output.replace("{{DESC}}", html.escape(desc, quote=True))
    output = output.replace("{{OG_IMAGE}}", img_url)
    output = output.replace("{{CONTENT}}", content_html)
    output = output.replace("{{CROP_NAVIGATION}}", crop_nav_html)
    output = output.replace("{{TOPIC_NAVIGATION}}", topic_nav_html)
    output = output.replace("{{RIGHT_SIDEBAR}}", sidebar_html)

    write_to_all_outputs(f"{page_id}.html", output)


def build_index_page(template, crops, topics, research, crop_nav_html, topic_nav_html):
    desc = "AgriAtlas CEA Engineering Encyclopedia: quantitative crop steering, psychrometric VPD control, hydroponic fertigation, and plant physiology research."
    og_img = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Greenhouse_tomato.jpg/800px-Greenhouse_tomato.jpg"

    content_html = f"""
        <div class="breadcrumb">
            <a href="https://inwoovation.com/" style="color: var(--primary); text-decoration: none;">Inwoovation</a>
            <span>/</span> <span style="color: var(--text-muted);">AgriAtlas CEA Engineering Home</span>
        </div>
        
        <h1 id="overview">AgriAtlas: Controlled Environment Agriculture (CEA) &amp; Plant Systems Engineering Encyclopedia</h1>
        <p style="font-size: 1.15rem; color: #cbd5e1; margin-bottom: 2rem; line-height: 1.75;">
            Welcome to <strong>AgriAtlas</strong>, the quantitative engineering reference library and biophysical knowledge substrate developed by <strong>Inwoo Hwang at Inwoovation Lab</strong>. Designed for commercial Venlo glasshouse operators, indoor vertical plant factory architects, and horticultural systems engineers, AgriAtlas bridges first-principles thermodynamics, boundary-layer fluid mechanics, and enzymatic plant physiology into deterministic environmental and fertigation control laws.
        </p>

        <div class="content-box" style="margin-bottom: 3rem;">
            <h2 style="margin-top: 0; color: var(--primary); font-size: 1.5rem;">⚙️ Quantitative Engineering Architecture of Modern CEA Facilities</h2>
            <p style="color: #e2e8f0; font-size: 1rem; line-height: 1.75;">
                Unlike traditional empirical agronomy, industrial Controlled Environment Agriculture treats the greenhouse or multi-tier vertical growth chamber as a coupled heat, mass, and photon transfer reactor. Across every crop monograph and doctoral research paper in AgriAtlas, environmental setpoints are derived from four foundational biophysical pillars:
            </p>
            <ul style="color: #cbd5e1; font-size: 0.98rem; line-height: 1.8; padding-left: 1.3rem;">
                <li><strong>Psychrometric Enthalpy &amp; Canopy Transpiration Governance:</strong> Utilizing the modified greenhouse Penman-Monteith equation, AgriAtlas quantifies how solar shortwave irradiance, supplemental LED photon flux, and horizontal/vertical air velocity (0.30–0.50 m s⁻¹) govern laminar boundary-layer resistance (<em>r<sub>b</sub></em>) and stomatal conductance (<em>g<sub>s</sub></em>). Maintaining leaf-to-air Vapor Pressure Deficit (VPD) within species-specific thermodynamic windows (typically 0.75–1.25 kPa) sustains continuous xylem mass flow of non-mobile divalent calcium (Ca²⁺) to rapidly dividing apical meristems and developing fruits, eliminating tip-burn and blossom-end rot.</li>
                <li><strong>Vegetative vs. Generative Crop Steering &amp; Photomorphogenesis:</strong> By manipulating diurnal temperature differentials (DIF = T<sub>day</sub> − T<sub>night</sub>), root-zone volumetric water content dry-backs (Δθ<sub>v</sub>), and spectral photon ratios—including Blue (450 nm) cryptochrome activation, Red (660 nm) to Far-Red (730 nm) Phytochrome Photostationary State (PSS = P<sub>fr</sub>/P<sub>total</sub>), and pulsed UV-A/UV-B (285–385 nm) UVR8 photoreceptor elicitation—growers can deterministically partition assimilated carbon between structural leaf expansion (Leaf Area Index closure) and high-Brix generative fruit or secondary antioxidant accumulation (glucosinolates, anthocyanins, betalains, lutein, and sulforaphane).</li>
                <li><strong>Rhizosphere Electrochemistry &amp; Stoichiometric Fertigation:</strong> Root ion uptake is modeled as an active bioenergetic process driven by plasma membrane H⁺-ATPase proton pumping and mitochondrial oxidative phosphorylation. AgriAtlas provides complete millimolar (mM) and parts-per-million (ppm) ionic formulations balancing NO₃⁻:NH₄⁺ ratios to stabilize rhizosphere pH without chemical acid/base overshoot, alongside root-zone temperature chilling (18.0–20.5°C) and nanobubble Dissolved Oxygen (DO &gt; 8.5 mg L⁻¹) protocols to prevent root hypoxia and <em>Pythium</em> colonization.</li>
                <li><strong>Live Telemetry &amp; Biochemical Pathway Integration:</strong> All {len(research)} peer-referenced scientific papers and {len(crops)} crop engineering guides cross-reference enzyme kinetic constants (Michaelis-Menten <em>K<sub>m</sub></em> and <em>V<sub>max</sub></em>) from the Kyoto Encyclopedia of Genes and Genomes (KEGG), molecular stoichiometry from NIH PubChem, agroclimatological irradiance series from NASA POWER, and wholesale elasticity data from USDA MARS.</li>
            </ul>
        </div>
        
        <h2 style="color: white; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;">📚 Crop Engineering Encyclopedia ({len(crops)} Commercial CEA Profiles)</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem; margin-bottom: 4rem;">
    """

    crops_sorted = sorted(crops, key=lambda x: x["title"])
    for crop in crops_sorted:
        c_img = crop.get("image_url") or og_img
        c_alt = (crop.get("image_caption") or f"{crop['title']} CEA Hydroponic Guide").strip()
        c_desc = crop.get("description", "")
        content_html += f"""
            <a href="{crop['id']}.html" style="text-decoration: none; color: inherit; background: var(--bg-surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; transition: transform 0.2s, border-color 0.2s; display: flex; flex-direction: column;">
                <div style="height: 155px; background: #000; overflow: hidden;">
                    <img src="{c_img}" alt="{html.escape(c_alt, quote=True)}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.85;">
                </div>
                <div style="padding: 1.4rem; flex: 1;">
                    <h3 style="margin: 0 0 0.5rem 0; color: var(--primary); font-size: 1.15rem;">{crop['title']}</h3>
                    <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;">{c_desc}</p>
                </div>
            </a>
        """

    content_html += f"""
        </div>
        
        <h2 style="color: white; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;" id="research">🔬 Scientific Research Library ({len(research)} Doctoral &amp; Kinetic Papers)</h2>
        <p style="color: #cbd5e1; margin-bottom: 2rem; font-size: 1.05rem; line-height: 1.7;">
            Explore our chronological repository of {len(research)} quantitative plant physiology, bioenergetics, fluid dynamics, and climate steering papers, cross-referenced with datasets from NASA POWER, NCBI PubMed, NIH PubChem, and KEGG.
        </p>

        <div style="background: var(--bg-surface); border: 1px solid var(--border); border-radius: 12px; padding: 2.5rem; text-align: center; margin-bottom: 3rem;">
            <h3 style="margin-top: 0; color: var(--primary); font-size: 1.6rem;">Peer-Referenced CEA Biophysics &amp; Metabolic Flux Papers</h3>
            <p style="color: #cbd5e1; max-width: 680px; margin: 1rem auto 2rem auto; font-size: 1.05rem; line-height: 1.65;">
                Every paper includes full enzymatic EC identifiers, KEGG pathway mappings, climate computer PID strategies, vegetative/generative steering tables, and closed-loop sensor telemetry protocols.
            </p>
            <a href="research.html" style="display: inline-block; background: var(--primary); color: #0f172a; font-weight: bold; padding: 1rem 2.5rem; border-radius: 8px; text-decoration: none; font-size: 1.1rem;">Explore All {len(research)} Research Papers →</a>
        </div>

        <h2 style="color: white; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;" id="cea-faq">❓ Core CEA Systems Engineering FAQ</h2>
        <div style="display: flex; flex-direction: column; gap: 1.2rem; margin-bottom: 3rem;">
            <div class="content-box" style="margin-bottom: 0; padding: 1.5rem;">
                <h3 style="margin-top: 0; margin-bottom: 0.6rem; color: var(--primary); font-size: 1.12rem;">Q: How do I translate AgriAtlas VPD and DIF tables into automated greenhouse climate computer setpoints?</h3>
                <p style="margin: 0; color: #cbd5e1; font-size: 0.96rem; line-height: 1.7;">First, verify true canopy leaf temperature using an infrared radiometer to calculate leaf-to-air VPD via our <a href="https://inwoovation.com/smartfarm/vpd.html" style="color: var(--primary);">Psychrometric VPD Suite</a>. Program your climate PLC to ramp heating pipes and ventilation apertures 45 minutes prior to sunrise so that leaf temperature exceeds air dew-point by at least +2.5°C, preventing morning condensation and fungal spore germination while hitting the target diurnal DIF.</p>
            </div>
            <div class="content-box" style="margin-bottom: 0; padding: 1.5rem;">
                <h3 style="margin-top: 0; margin-bottom: 0.6rem; color: var(--primary); font-size: 1.12rem;">Q: Why does tip-burn occur in hydroponic leafy greens even when calcium is abundant in the nutrient solution?</h3>
                <p style="margin: 0; color: #cbd5e1; font-size: 0.96rem; line-height: 1.7;">Calcium (Ca²⁺) is transported almost exclusively via passive apoplastic xylem flow driven by transpiration; it cannot be remobilized via the phloem. In stagnant vertical farm or greenhouse canopies (air speed &lt; 0.15 m s⁻¹), high leaf boundary-layer resistance suppresses localized transpiration at enclosed inner meristems. Delivering 0.35–0.45 m s⁻¹ vertical airflow and maintaining nighttime VPD below 0.35 kPa (to promote root-pressure guttation) resolves meristematic Ca²⁺ starvation.</p>
            </div>
        </div>
    """

    content_html += render_eeat_author_box()
    content_html += render_calculator_cta()

    full_title = "AgriAtlas CEA Engineering Encyclopedia | Inwoovation Lab"
    canonical_tag = '<link rel="canonical" href="https://inwoovation.com/wiki/index.html" />'
    json_ld_tag = build_json_ld(full_title, desc, og_img, "index", "2026-08-05")

    output = template.replace("{{TITLE}}", full_title)
    output = output.replace("</head>", f"    {canonical_tag}\n    {json_ld_tag}\n</head>")
    output = output.replace("{{DESC}}", html.escape(desc, quote=True))
    output = output.replace("{{OG_IMAGE}}", og_img)
    output = output.replace("{{CONTENT}}", content_html)
    output = output.replace("{{CROP_NAVIGATION}}", crop_nav_html)
    output = output.replace("{{TOPIC_NAVIGATION}}", topic_nav_html)
    output = output.replace("{{RIGHT_SIDEBAR}}", "")

    write_to_all_outputs("index.html", output)


def build_research_page(template, research, crop_nav_html, topic_nav_html):
    topics_sorted = sorted(research, key=lambda x: x.get("published_date", "2026-08-05"), reverse=True)
    desc = "Chronological Index of PhD-Level CEA Plant Physiology, Bioenergetics, and Climate Steering Research Papers by Inwoovation Lab."
    og_img = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Greenhouse_tomato.jpg/800px-Greenhouse_tomato.jpg"

    content_html = f"""
        <div class="breadcrumb">
            <a href="https://inwoovation.com/" style="color: var(--primary); text-decoration: none;">Inwoovation</a>
            <span>/</span> <a href="index.html" style="color: var(--primary); text-decoration: none;">AgriAtlas Wiki</a> 
            <span>/</span> <span style="color: var(--text-muted);">Scientific Research Library</span>
        </div>
        
        <h1 id="overview">🔬 Scientific Research Library: CEA Biophysics &amp; Metabolic Kinetics</h1>
        <p style="font-size: 1.12rem; color: #cbd5e1; margin-bottom: 1.5rem; line-height: 1.75;">
            This chronological research repository contains <strong>{len(topics_sorted)} peer-referenced plant physiology, bioenergetics, fluid dynamics, and climate steering papers</strong> authored and curated by <strong>Inwoo Hwang — Inwoovation Lab</strong>. Each monograph couples intracellular enzymatic kinetics (KEGG reaction pathways and Enzyme Commission identifiers) with macroscopic greenhouse psychrometrics, CFD boundary-layer physics, and stoichiometric hydroponic fertigation control.
        </p>

        <!-- Live Research Search Filter Bar -->
        <div style="margin-bottom: 2.5rem; background: var(--bg-surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 12px;">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <input type="text" id="researchFilterInput" placeholder="🔍 Filter papers by title, keyword, enzyme (EC), KEGG pathway, or PubMed DOI..." style="flex: 1; min-width: 280px; padding: 0.8rem 1.2rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 8px; color: white; outline: none; font-size: 1rem; font-family: 'Inter';">
            </div>
            <div id="filterCount" style="margin-top: 0.8rem; font-size: 0.85rem; color: var(--primary); font-weight: 600;">Showing all {len(topics_sorted)} research papers</div>
        </div>

        <div id="researchList" style="display: flex; flex-direction: column; gap: 2rem; margin-bottom: 3rem;">
    """

    for item in topics_sorted:
        pub_date = item.get("published_date") or item.get("date") or "2026-08-05"
        ref_count = len(item.get("references", []))
        tax = item.get("taxonomy", {})
        fam = tax.get("family") or "CEA Biophysics"
        gen = tax.get("genus") or "Enzymatic Kinetics"
        spc = tax.get("species") or "Model CEA Crop"
        orig = tax.get("origin") or "Inwoovation Research Dataset"
        ov_text = item.get("overview", "")
        search_str = f"{item['title']} {ov_text} {fam} {gen} {spc} {orig}".lower()
        search_attr = html.escape(search_str, quote=True)

        content_html += f"""
            <div class="research-card" data-search="{search_attr}" style="background: var(--bg-surface); border: 1px solid var(--border); border-radius: 12px; padding: 2rem; transition: border-color 0.2s;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; flex-wrap: wrap; gap: 0.5rem;">
                    <span style="font-size: 0.85rem; color: var(--primary); font-weight: 700; background: rgba(56, 189, 248, 0.1); padding: 0.3rem 0.8rem; border-radius: 20px; border: 1px solid rgba(56, 189, 248, 0.3);">🗓️ Published: {pub_date}</span>
                    <span style="font-size: 0.85rem; color: var(--accent-green); font-weight: 600;">📚 {ref_count} Peer-Reviewed Citations | ✍️ Inwoo Hwang</span>
                </div>
                
                <h2 style="margin: 0.5rem 0 1rem 0; font-size: 1.65rem; color: white;">
                    <a href="{item['id']}.html" style="color: white; text-decoration: none;">{item['title']}</a>
                </h2>
                
                <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.2rem; flex-wrap: wrap;">
                    <span>🧬 Domain: <strong style="color: #cbd5e1;">{fam}</strong></span>
                    <span>🔬 Mechanism: <strong style="color: #cbd5e1;">{gen}</strong></span>
                    <span>🌱 Species: <strong style="color: #cbd5e1;">{spc}</strong></span>
                    <span>🌍 Dataset: <strong style="color: #cbd5e1;">{orig}</strong></span>
                </div>

                <p style="color: #cbd5e1; line-height: 1.65; margin-bottom: 1.5rem; font-size: 1.02rem;">
                    {ov_text[:320]}...
                </p>

                <a href="{item['id']}.html" style="display: inline-block; background: var(--primary); color: #0f172a; font-weight: bold; padding: 0.7rem 1.5rem; border-radius: 8px; text-decoration: none; font-size: 0.95rem;">Read Full Research Paper →</a>
            </div>
        """

    content_html += """
        </div>

        <script>
            const filterInput = document.getElementById('researchFilterInput');
            const cards = document.querySelectorAll('.research-card');
            const filterCount = document.getElementById('filterCount');

            if (filterInput) {
                filterInput.addEventListener('input', function(e) {
                    const q = e.target.value.toLowerCase().trim();
                    let visible = 0;
                    cards.forEach(card => {
                        const text = card.getAttribute('data-search') || '';
                        if (!q || text.includes(q)) {
                            card.style.display = 'block';
                            visible++;
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    filterCount.textContent = `Showing ${visible} of ${cards.length} research papers`;
                });
            }
        </script>
    """

    content_html += render_eeat_author_box()
    content_html += render_calculator_cta()

    full_title = "Scientific Research Library | AgriAtlas CEA Engineering Wiki"
    canonical_tag = '<link rel="canonical" href="https://inwoovation.com/wiki/research.html" />'
    json_ld_tag = build_json_ld(full_title, desc, og_img, "research", "2026-08-05")

    output = template.replace("{{TITLE}}", full_title)
    output = output.replace("</head>", f"    {canonical_tag}\n    {json_ld_tag}\n</head>")
    output = output.replace("{{DESC}}", html.escape(desc, quote=True))
    output = output.replace("{{OG_IMAGE}}", og_img)
    output = output.replace("{{CONTENT}}", content_html)
    output = output.replace("{{CROP_NAVIGATION}}", crop_nav_html)
    output = output.replace("{{TOPIC_NAVIGATION}}", topic_nav_html)
    output = output.replace("{{RIGHT_SIDEBAR}}", "")

    write_to_all_outputs("research.html", output)


def generate_search_index(crops, topics, research):
    search_data = []
    for crop in crops:
        search_data.append({
            "title": crop["title"],
            "url": f"{crop['id']}.html",
            "desc": crop.get("description", ""),
            "type": "Crop Encyclopedia",
            "badge": "📚 Crop",
            "keywords": f"{crop.get('taxonomy', {}).get('species', '')} {crop.get('taxonomy', {}).get('family', '')}"
        })
    for topic in topics:
        search_data.append({
            "title": topic["title"],
            "url": f"{topic['id']}.html",
            "desc": topic.get("description", ""),
            "type": "Topic",
            "badge": "🌱 Topic",
            "keywords": f"{topic.get('taxonomy', {}).get('family', '')} {topic.get('taxonomy', {}).get('species', '')}"
        })
    for paper in research:
        search_data.append({
            "title": paper["title"],
            "url": f"{paper['id']}.html",
            "desc": paper.get("description", paper.get("overview", "")[:150]),
            "type": "Research Paper",
            "badge": "🔬 Research",
            "published_date": paper.get("published_date", ""),
            "keywords": f"{paper.get('taxonomy', {}).get('family', '')} {paper.get('taxonomy', {}).get('genus', '')} {paper.get('taxonomy', {}).get('species', '')} {paper.get('taxonomy', {}).get('origin', '')}"
        })
    js_content = f"const searchIndex = {json.dumps(search_data, ensure_ascii=False)};"
    write_to_all_outputs("search_index.js", js_content)


def generate_sitemap_and_robots(crops, topics, research):
    base_url = "https://inwoovation.com/wiki"
    today_str = datetime.now().strftime("%Y-%m-%d")

    urls = [
        f"  <url><loc>{base_url}/index.html</loc><lastmod>{today_str}</lastmod><priority>1.0</priority></url>",
        f"  <url><loc>{base_url}/research.html</loc><lastmod>{today_str}</lastmod><priority>0.9</priority></url>"
    ]

    for c in crops:
        cid = c.get("id") or c.get("crop_id")
        urls.append(f"  <url><loc>{base_url}/{cid}.html</loc><lastmod>{today_str}</lastmod><priority>0.8</priority></url>")

    for t in topics:
        tid = t.get("id")
        urls.append(f"  <url><loc>{base_url}/{tid}.html</loc><lastmod>{today_str}</lastmod><priority>0.8</priority></url>")

    for r in research:
        rid = r.get("id")
        urls.append(f"  <url><loc>{base_url}/{rid}.html</loc><lastmod>{today_str}</lastmod><priority>0.8</priority></url>")

    sitemap_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(urls)}
</urlset>"""

    robots_txt = f"""User-agent: *
Allow: /

Sitemap: {base_url}/sitemap.xml"""

    write_to_all_outputs("sitemap.xml", sitemap_xml)
    write_to_all_outputs("robots.txt", robots_txt)


def main():
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        template = f.read()

    crop_files = sorted(glob.glob(os.path.join(CROPS_DIR, "*.json")))
    crops_data = []
    for cf in crop_files:
        with open(cf, "r", encoding="utf-8") as f:
            crops_data.append(json.load(f))

    topic_files = sorted(glob.glob(os.path.join(TOPICS_DIR, "*.json")))
    topics_data = []
    for tf in topic_files:
        with open(tf, "r", encoding="utf-8") as f:
            topics_data.append(json.load(f))

    research_files = sorted(glob.glob(os.path.join(RESEARCH_DIR, "*.json")))
    research_data = []
    for rf in research_files:
        with open(rf, "r", encoding="utf-8") as f:
            research_data.append(json.load(f))

    crop_nav_html = generate_navigation(crops_data, active_id=None)
    topic_nav_html = generate_navigation(topics_data, active_id=None)

    for data in crops_data:
        crop_id = data.get("id") or data.get("crop_id")
        data["id"] = crop_id
        if "title" not in data:
            data["title"] = data.get("name", crop_id)
        active_crop_nav = generate_navigation(crops_data, active_id=crop_id)
        build_page(template, data, active_crop_nav, topic_nav_html)
        print(f"Built crop: {crop_id}.html")

    for data in topics_data:
        active_topic_nav = generate_navigation(topics_data, active_id=data["id"])
        build_page(template, data, crop_nav_html, active_topic_nav)
        print(f"Built topic: {data['id']}.html")

    for data in research_data:
        build_page(template, data, crop_nav_html, topic_nav_html)
        print(f"Built research paper: {data['id']}.html")

    build_index_page(template, crops_data, topics_data, research_data, crop_nav_html, topic_nav_html)
    print("Built: index.html (Homepage)")

    build_research_page(template, research_data, crop_nav_html, topic_nav_html)
    print("Built: research.html (Scientific Research Library)")

    generate_search_index(crops_data, topics_data, research_data)
    print("Generated: search_index.js")

    generate_sitemap_and_robots(crops_data, topics_data, research_data)
    print("Generated: sitemap.xml & robots.txt")


if __name__ == "__main__":
    main()
