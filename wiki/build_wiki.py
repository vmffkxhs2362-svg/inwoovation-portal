import json
import os
import glob
from datetime import datetime

TEMPLATE_PATH = "_wiki_template.html"
CROPS_DIR = "data/crops/"
TOPICS_DIR = "data/topics/"
RESEARCH_DIR = "data/research/"
NEWS_DIR = "data/news/"
OUT_DIR = "./"

def generate_navigation(items, active_id):
    # Sort items alphabetically by title or name
    items_sorted = sorted(items, key=lambda x: x.get('title') or x.get('name') or '')
    nav_html = ""
    for item in items_sorted:
        item_id = item.get('id') or item.get('crop_id') or ''
        item_title = item.get('name') or item.get('title') or ''
        active_class = " active" if item_id == active_id else ""
        nav_html += f'<a href="{item_id}.html" class="nav-link{active_class}">{item_title}</a>\n            '
    return nav_html

def build_page(template, data, crop_nav_html, topic_nav_html):
    content_html = f"""
        <div class="breadcrumb">
            <a href="index.html" style="color: var(--primary); text-decoration: none;">AgriAtlas</a> 
            <span>/</span> <a href="#" style="color: var(--primary); text-decoration: none;">Knowledge Base</a> 
            <span>/</span> <span style="color: var(--text-muted);">{data['title']}</span>
        </div>
        
        <h1 id="overview">{data['title']}</h1>
    """
    
    if "image_url" in data:
        content_html += f"""
        <figure style="margin: 0 0 2rem 0; width: 100%;">
            <img src="{data['image_url']}" alt="{data.get('image_caption', '')}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; border: 1px solid var(--border);">
            <figcaption style="text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-top: 0.5rem;">{data.get('image_caption', '')}</figcaption>
        </figure>
        """
        
    tax = data.get('taxonomy', {})
    content_html += f"""
        <div class="metadata">
            <span>📚 Family/Class: {tax.get('family', 'N/A')}</span>
            <span>🌱 Genus/Sub-category: {tax.get('genus', 'N/A')}</span>
            <span>🧬 Species/Type: {tax.get('species', 'N/A')}</span>
            <span>🌍 Origin: {tax.get('origin', 'N/A')}</span>
        </div>
        
        <p style="font-size: 1.15rem; color: #cbd5e1; margin-bottom: 3rem; line-height: 1.6;">
            {data.get('overview', '')}
        </p>
    """

    # Section 2: Global Climate Strategy / Care Strategy
    if 'climate_strategy' in data:
        strategy_title = "Global Climate Strategy" if data['id'] != "care_farming" else "Operational Strategy"
        content_html += f"""
            <h2 style="color: white; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;" id="climate-strategy">{strategy_title}</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 3rem;">
        """
        for strat in data['climate_strategy']:
            content_html += f"""
                <div class="content-box" style="margin-bottom: 0;">
                    <h3 style="margin-top: 0; color: var(--primary); font-size: 1.2rem;">🌍 {strat.get('region', '')}</h3>
                    <p style="color: #f8fafc; font-size: 0.95rem; line-height: 1.5;">{strat.get('strategy', '')}</p>
                    <span style="font-size: 0.85rem; color: var(--text-muted); background: rgba(0,0,0,0.3); padding: 0.3rem 0.6rem; border-radius: 6px; display: inline-block; margin-top: 1rem;">⚙️ Tech Level: {strat.get('tech_level', '')}</span>
                </div>
            """
        content_html += "</div>"

    # Section 3: Steering
    if 'crop_steering' in data:
        steering_title = "Crop Steering Parameters" if data['id'] != "care_farming" else "Therapeutic Environment Steering"
        cs = data['crop_steering']
        col1_title = "🌱 Vegetative Target (Leaf Growth)" if data['id'] != "care_farming" else "🌱 Comfort Target (User Comfort)"
        col2_title = "🍅 Generative Target (Fruit Growth)" if data['id'] != "care_farming" else "🧩 Sensory Target (User Activity)"
        content_html += f"""
            <h2 style="color: white; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;" id="crop-steering">{steering_title}</h2>
            <p style="color: #cbd5e1; margin-bottom: 2rem;">{cs.get('intro', '')}</p>
            
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
                        <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: #f8fafc;">{cs['vegetative_triggers'].get('temperature_dif', '')}</td>
                        <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: #f8fafc;">{cs['generative_triggers'].get('temperature_dif', '')}</td>
                    </tr>
                    <tr>
                        <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: var(--primary);">VPD (kPa)</td>
                        <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: #f8fafc;">{cs['vegetative_triggers'].get('vpd_target', '')}</td>
                        <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: #f8fafc;">{cs['generative_triggers'].get('vpd_target', '')}</td>
                    </tr>
                    <tr>
                        <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: var(--primary);">Irrigation & Space Strategy</td>
                        <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: #f8fafc;">{cs['vegetative_triggers'].get('irrigation', '')}</td>
                        <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: #f8fafc;">{cs['generative_triggers'].get('irrigation', '')}</td>
                    </tr>
                </tbody>
            </table>
        """

    # Section 4: Fertigation & Substrate
    if 'fertigation' in data:
        fg = data['fertigation']
        phase1_title = "Phase 1: Vegetative Vigor" if data['id'] != "care_farming" else "Phase 1: Safe Vegetative Management"
        phase2_title = "Phase 2: Generative / Brix Steering" if data['id'] != "care_farming" else "Phase 2: Sensory Olfactory Stimulation"
        content_html += f"""
            <h2 style="color: white; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;" id="fertigation">Fertigation Strategy</h2>
            <p style="color: #cbd5e1; margin-bottom: 1.5rem;">{fg.get('intro', '')}</p>
            
            <div style="background: rgba(255,255,255,0.03); border-left: 4px solid var(--primary); padding: 1.5rem; margin-bottom: 1.5rem; border-radius: 0 8px 8px 0;">
                <h4 style="margin-top: 0; color: #86efac;">{phase1_title}</h4>
                <p style="margin-bottom: 0; color: #f8fafc;">{fg.get('vegetative_phase', '')}</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.03); border-left: 4px solid #fca5a5; padding: 1.5rem; margin-bottom: 3rem; border-radius: 0 8px 8px 0;">
                <h4 style="margin-top: 0; color: #fca5a5;">{phase2_title}</h4>
                <p style="margin-bottom: 0; color: #f8fafc;">{fg.get('generative_phase', '')}</p>
            </div>
        """

    # Section 5: Cross-Crop Comparative Benchmarks & Shared Risk Matrix
    if 'cross_crop_benchmarks' in data:
        ccb = data['cross_crop_benchmarks']
        pathogens_str = ", ".join(ccb.get('shared_pathogens', []))
        companions_str = ", ".join(ccb.get('companion_compatibility', []))
        content_html += f"""
            <h2 style="color: white; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;" id="cross-crop-benchmarks">Cross-Crop Benchmarks & Companion Risk Matrix</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 3rem;">
                <div class="content-box" style="margin-bottom: 0;">
                    <h3 style="margin-top: 0; color: var(--primary); font-size: 1.1rem;">📊 Comparative Physiological Demands</h3>
                    <ul style="color: #f8fafc; font-size: 0.95rem; line-height: 1.8; margin-bottom: 0; padding-left: 1.2rem;">
                        <li><strong>DLI Requirement Level:</strong> {ccb.get('dli_requirement_level', '')}</li>
                        <li><strong>EC Tolerance Range:</strong> {ccb.get('ec_tolerance_range', '')}</li>
                        <li><strong>Calcium Demand / Risk:</strong> {ccb.get('calcium_demand', '')}</li>
                    </ul>
                </div>
                <div class="content-box" style="margin-bottom: 0;">
                    <h3 style="margin-top: 0; color: #fca5a5; font-size: 1.1rem;">🛡️ Shared Pathogens & Spatial Companions</h3>
                    <ul style="color: #f8fafc; font-size: 0.95rem; line-height: 1.8; margin-bottom: 0; padding-left: 1.2rem;">
                        <li><strong>Shared Pathogen Risk:</strong> {pathogens_str}</li>
                        <li><strong>Companion CEA Crops:</strong> {companions_str}</li>
                        <li><strong>Encyclopedia Sync Date:</strong> {ccb.get('last_updated', '')}</li>
                    </ul>
                </div>
            </div>
        """

    # Calculators integration CTA
    content_html += f"""
        <div id="calculators" style="background: linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(56,189,248,0.1) 100%); border: 1px solid rgba(16,185,129,0.3); padding: 2.5rem; border-radius: 12px; text-align: center; margin-bottom: 2rem;">
            <h2 style="margin-top: 0; color: white; font-size: 1.8rem;">Ready to steer your crop?</h2>
            <p style="color: #cbd5e1; font-size: 1.1rem; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">
                AgriAtlas provides the theory, but every greenhouse is unique. Use our precise engineering calculators to hit these target VPD and Temperature DIF values based on your specific facility's U-Value and heating capacity.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <a href="https://smartfarm.inwoovation.com/vpd.html" target="_blank" style="display: inline-block; background: var(--primary); color: #0f172a; font-weight: bold; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-size: 1.1rem; transition: transform 0.2s;">Run VPD Calculator</a>
                <a href="https://smartfarm.inwoovation.com/heat_loss.html" target="_blank" style="display: inline-block; background: transparent; border: 2px solid var(--accent-green); color: var(--accent-green); font-weight: bold; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-size: 1.1rem; transition: transform 0.2s;">Calculate Heat Loss</a>
            </div>
        </div>
    """

    sidebar_html = ""
    if 'references' in data and len(data['references']) > 0:
        sidebar_html = """
    <aside class="sidebar-right">
        <div style="background: rgba(0,0,0,0.5); border: 1px dashed var(--border); border-radius: 8px; padding: 1rem; text-align: center; margin-bottom: 2rem; color: var(--text-muted); font-size: 0.85rem;">
            <div style="width: 300px; height: 250px; background: rgba(255,255,255,0.02); display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                Advertisement<br>(300x250)
            </div>
        </div>
        <div class="toc-title" style="margin-bottom: 1rem; color: #cbd5e1; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem;">References & Citations</div>
        <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; padding-right: 0.5rem;">
        """
        for ref in data['references']:
            sidebar_html += f"""
            <div style="margin-bottom: 1.2rem; padding-bottom: 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.05);" id="ref-{ref['id']}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem; gap: 0.5rem;">
                    <span style="font-weight: 600; color: #cbd5e1;"><a href="#cite-{ref['id']}" style="color: var(--primary); text-decoration: none; font-weight: bold; margin-right: 0.3rem;">^</a> [{ref['id']}] {ref['text']}</span>
                    <a href="{ref['link']}" target="_blank" style="color: var(--primary); text-decoration: none; font-size: 0.75rem; background: rgba(56,189,248,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px solid rgba(56,189,248,0.2); white-space: nowrap;">[Link ↗]</a>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.5; padding-left: 0.6rem; border-left: 2px solid var(--border); margin-top: 0.5rem;">
                    <div>📝 Original: <i style="color: #cbd5e1;">{ref.get('original_title', 'N/A')}</i></div>
                    <div>🏢 Publisher: {ref.get('publisher', 'N/A')}</div>
                    <div>🆔 ID: <span style="font-family: monospace; color: var(--primary);">{ref.get('gov_id', 'N/A')}</span></div>
                </div>
            </div>
            """
        sidebar_html += """
        </div>
    </aside>
        """
        
    output = template.replace("{{TITLE}}", f"{data['title']} | AgriAtlas")
    page_id = data['id']
    canonical_tag = f'<link rel="canonical" href="https://wiki.inwoovation.com/{page_id}.html" />'
    output = output.replace("</head>", f"    {canonical_tag}\n</head>")
    output = output.replace("{{DESC}}", data.get('description', ''))
    output = output.replace("{{OG_IMAGE}}", data.get('image_url', ''))
    output = output.replace("{{CONTENT}}", content_html)
    output = output.replace("{{CROP_NAVIGATION}}", crop_nav_html)
    output = output.replace("{{TOPIC_NAVIGATION}}", topic_nav_html)
    output = output.replace("{{RIGHT_SIDEBAR}}", sidebar_html)
    
    with open(os.path.join(OUT_DIR, f"{data['id']}.html"), "w", encoding="utf-8") as f:
        f.write(output)

def build_index_page(template, crops, topics, crop_nav_html, topic_nav_html):
    # Generates the homepage (index.html)
    content_html = f"""
        <div class="breadcrumb">
            <span style="color: var(--text-muted);">AgriAtlas Home</span>
        </div>
        
        <h1 id="overview">Welcome to AgriAtlas</h1>
        <p style="font-size: 1.15rem; color: #cbd5e1; margin-bottom: 3rem; line-height: 1.6;">
            The world's most advanced, data-driven engineering repository for Controlled Environment Agriculture (CEA).
            Select a crop or topic from the navigation menu to explore deep-dive engineering strategies, or browse the grid below.
        </p>
        
        <h2 style="color: white; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;">📚 Crop Encyclopedia</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 4rem;">
    """
    
    crops_sorted = sorted(crops, key=lambda x: x['title'])
    for crop in crops_sorted:
        content_html += f"""
            <a href="{crop['id']}.html" style="text-decoration: none; color: inherit; background: var(--bg-surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; transition: transform 0.2s, border-color 0.2s;">
                <div style="height: 150px; background: #000; overflow: hidden;">
                    <img src="{crop.get('image_url', '')}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8;">
                </div>
                <div style="padding: 1.5rem;">
                    <h3 style="margin: 0 0 0.5rem 0; color: var(--primary);">{crop['title']}</h3>
                    <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem;">{crop.get('description', '')[:100]}...</p>
                </div>
            </a>
        """
        
    content_html += f"""
        </div>
        
        <h2 style="color: white; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;" id="research">🔬 Scientific Research Library</h2>
        <p style="color: #cbd5e1; margin-bottom: 2rem; font-size: 1.05rem;">
            Explore doctoral and peer-reviewed plant physiology, bioenergetics, and climate steering papers, cross-referenced with live datasets from NASA POWER, NCBI PubMed, NIH PubChem, and KEGG.
        </p>

        <div style="background: var(--bg-surface); border: 1px solid var(--border); border-radius: 12px; padding: 2.5rem; text-align: center; margin-bottom: 3rem;">
            <h3 style="margin-top: 0; color: var(--primary); font-size: 1.6rem;">Peer-Reviewed Agricultural Science Papers</h3>
            <p style="color: #cbd5e1; max-width: 650px; margin: 1rem auto 2rem auto; font-size: 1.05rem; line-height: 1.6;">
                Articles are published in chronological order, integrating live meteorological telemetry, enzymatic reaction kinetics, and empirical crop steering matrices.
            </p>
            <a href="research.html" style="display: inline-block; background: var(--primary); color: #0f172a; font-weight: bold; padding: 1rem 2.5rem; border-radius: 8px; text-decoration: none; font-size: 1.1rem;">Explore All Research Papers →</a>
        </div>
    """
    
    output = template.replace("{{TITLE}}", "Home | AgriAtlas")
    output = output.replace("{{DESC}}", "Global Database for CEA Engineering")
    output = output.replace("{{OG_IMAGE}}", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Greenhouse_tomato.jpg/800px-Greenhouse_tomato.jpg")
    output = output.replace("{{CONTENT}}", content_html)
    output = output.replace("{{CROP_NAVIGATION}}", crop_nav_html)
    output = output.replace("{{TOPIC_NAVIGATION}}", topic_nav_html)
    output = output.replace("{{RIGHT_SIDEBAR}}", "")
    
    with open(os.path.join(OUT_DIR, "index.html"), "w", encoding="utf-8") as f:
        f.write(output)

def build_research_page(template, topics, crop_nav_html, topic_nav_html):
    # Sort topics chronologically by published_date descending (newest first)
    topics_sorted = sorted(topics, key=lambda x: x.get('published_date', '2000-01-01'), reverse=True)

    content_html = f"""
        <div class="breadcrumb">
            <a href="index.html" style="color: var(--primary); text-decoration: none;">AgriAtlas</a> 
            <span>/</span> <span style="color: var(--text-muted);">Scientific Research Library</span>
        </div>
        
        <h1 id="overview">🔬 Scientific Research Library</h1>
        <p style="font-size: 1.15rem; color: #cbd5e1; margin-bottom: 2rem; line-height: 1.6;">
            Doctoral and peer-reviewed plant physiology, bioenergetics, and climate steering papers. Articles are published chronologically with complete NCBI PubMed DOIs, PubChem CIDs, and KEGG pathway maps.
        </p>

        <!-- Live Research Search Filter Bar -->
        <div style="margin-bottom: 2.5rem; background: var(--bg-surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 12px;">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <input type="text" id="researchFilterInput" placeholder="🔍 Filter papers by title, keyword, enzyme (EC), or PubMed DOI..." style="flex: 1; min-width: 280px; padding: 0.8rem 1.2rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 8px; color: white; outline: none; font-size: 1rem; font-family: 'Inter';">
            </div>
            <div id="filterCount" style="margin-top: 0.8rem; font-size: 0.85rem; color: var(--primary); font-weight: 600;">Showing all {len(topics_sorted)} research papers</div>
        </div>

        <div id="researchList" style="display: flex; flex-direction: column; gap: 2rem; margin-bottom: 3rem;">
    """

    for item in topics_sorted:
        pub_date = item.get('published_date', 'Recently Published')
        ref_count = len(item.get('references', []))
        tax = item.get('taxonomy', {})
        search_str = f"{item['title']} {item.get('overview', '')} {tax.get('family', '')} {tax.get('genus', '')} {tax.get('species', '')} {tax.get('origin', '')}".lower()

        content_html += f"""
            <div class="research-card" data-search="{search_str}" style="background: var(--bg-surface); border: 1px solid var(--border); border-radius: 12px; padding: 2rem; transition: border-color 0.2s;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; flex-wrap: wrap; gap: 0.5rem;">
                    <span style="font-size: 0.85rem; color: var(--primary); font-weight: 700; background: rgba(56, 189, 248, 0.1); padding: 0.3rem 0.8rem; border-radius: 20px; border: 1px solid rgba(56, 189, 248, 0.3);">🗓️ Published: {pub_date}</span>
                    <span style="font-size: 0.85rem; color: var(--accent-green); font-weight: 600;">📚 {ref_count} Peer-Reviewed Citations</span>
                </div>
                
                <h2 style="margin: 0.5rem 0 1rem 0; font-size: 1.8rem; color: white;">
                    <a href="{item['id']}.html" style="color: white; text-decoration: none;">{item['title']}</a>
                </h2>
                
                <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.2rem; flex-wrap: wrap;">
                    <span>🧬 Family: <strong style="color: #cbd5e1;">{tax.get('family', 'N/A')}</strong></span>
                    <span>🔬 Genus: <strong style="color: #cbd5e1;">{tax.get('genus', 'N/A')}</strong></span>
                    <span>🌍 Dataset: <strong style="color: #cbd5e1;">{tax.get('origin', 'N/A')}</strong></span>
                </div>

                <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 1.5rem; font-size: 1.05rem;">
                    {item.get('overview', '')[:280]}...
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

    output = template.replace("{{TITLE}}", "Scientific Research Library | AgriAtlas")
    output = output.replace("{{DESC}}", "Chronological Index of PhD-Level CEA Plant Physiology and Climate Steering Research Papers.")
    output = output.replace("{{OG_IMAGE}}", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Greenhouse_tomato.jpg/800px-Greenhouse_tomato.jpg")
    output = output.replace("{{CONTENT}}", content_html)
    output = output.replace("{{CROP_NAVIGATION}}", crop_nav_html)
    output = output.replace("{{TOPIC_NAVIGATION}}", topic_nav_html)
    output = output.replace("{{RIGHT_SIDEBAR}}", "")

    with open(os.path.join(OUT_DIR, "research.html"), "w", encoding="utf-8") as f:
        f.write(output)

def generate_search_index(crops, topics, research):
    search_data = []
    for crop in crops:
        search_data.append({
            "title": crop['title'],
            "url": f"{crop['id']}.html",
            "desc": crop.get('description', ''),
            "type": "Crop Encyclopedia",
            "badge": "📚 Crop",
            "keywords": f"{crop.get('taxonomy', {}).get('species', '')} {crop.get('taxonomy', {}).get('family', '')}"
        })
    for topic in topics:
        search_data.append({
            "title": topic['title'],
            "url": f"{topic['id']}.html",
            "desc": topic.get('description', ''),
            "type": "Topic",
            "badge": "🌱 Topic",
            "keywords": f"{topic.get('taxonomy', {}).get('family', '')} {topic.get('taxonomy', {}).get('species', '')}"
        })
    for paper in research:
        search_data.append({
            "title": paper['title'],
            "url": f"{paper['id']}.html",
            "desc": paper.get('overview', paper.get('description', '')),
            "type": "Research Paper",
            "badge": "🔬 Research",
            "published_date": paper.get('published_date', ''),
            "keywords": f"{paper.get('taxonomy', {}).get('family', '')} {paper.get('taxonomy', {}).get('genus', '')} {paper.get('taxonomy', {}).get('species', '')} {paper.get('taxonomy', {}).get('origin', '')}"
        })
    with open(os.path.join(OUT_DIR, "search_index.js"), "w", encoding="utf-8") as f:
        f.write(f"const searchIndex = {json.dumps(search_data, ensure_ascii=False)};")

def generate_sitemap_and_robots(crops, topics, research):
    base_url = "https://wiki.inwoovation.com"
    today_str = datetime.now().strftime("%Y-%m-%d")
    
    urls = [
        f"  <url><loc>{base_url}/</loc><lastmod>{today_str}</lastmod><priority>1.0</priority></url>",
        f"  <url><loc>{base_url}/research.html</loc><lastmod>{today_str}</lastmod><priority>0.9</priority></url>"
    ]
    
    for c in crops:
        cid = c.get('id') or c.get('crop_id')
        urls.append(f"  <url><loc>{base_url}/{cid}.html</loc><lastmod>{today_str}</lastmod><priority>0.8</priority></url>")
        
    for r in research:
        rid = r.get('id')
        urls.append(f"  <url><loc>{base_url}/{rid}.html</loc><lastmod>{today_str}</lastmod><priority>0.8</priority></url>")
        
    sitemap_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(urls)}
</urlset>"""

    robots_txt = f"""User-agent: *
Allow: /

Sitemap: {base_url}/sitemap.xml"""

    with open(os.path.join(OUT_DIR, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write(sitemap_xml)
        
    with open(os.path.join(OUT_DIR, "robots.txt"), "w", encoding="utf-8") as f:
        f.write(robots_txt)

def main():
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        template = f.read()
        
    # Read all crop JSONs
    crop_files = glob.glob(os.path.join(CROPS_DIR, "*.json"))
    crops_data = []
    for cf in crop_files:
        with open(cf, "r", encoding="utf-8") as f:
            crops_data.append(json.load(f))
            
    # Read all topic JSONs
    topic_files = glob.glob(os.path.join(TOPICS_DIR, "*.json"))
    topics_data = []
    for tf in topic_files:
        with open(tf, "r", encoding="utf-8") as f:
            topics_data.append(json.load(f))

    # Read all research JSONs
    research_files = glob.glob(os.path.join(RESEARCH_DIR, "*.json"))
    research_data = []
    for rf in research_files:
        with open(rf, "r", encoding="utf-8") as f:
            research_data.append(json.load(f))
            
    crop_nav_html = generate_navigation(crops_data, active_id=None)
    topic_nav_html = generate_navigation(topics_data, active_id=None)
    
    # Build each crop page
    for data in crops_data:
        crop_id = data.get('id') or data.get('crop_id')
        if 'id' not in data:
            data['id'] = crop_id
        if 'title' not in data:
            data['title'] = data.get('name', crop_id)
        active_crop_nav = generate_navigation(crops_data, active_id=crop_id)
        build_page(template, data, active_crop_nav, topic_nav_html)
        print(f"Built crop: {crop_id}.html")
        
    # Build each topic page
    for data in topics_data:
        active_topic_nav = generate_navigation(topics_data, active_id=data['id'])
        build_page(template, data, crop_nav_html, active_topic_nav)
        print(f"Built topic: {data['id']}.html")

    # Build each research paper page
    for data in research_data:
        build_page(template, data, crop_nav_html, topic_nav_html)
        print(f"Built research paper: {data['id']}.html")
        
    # Build index page
    build_index_page(template, crops_data, topics_data, crop_nav_html, topic_nav_html)
    print("Built: index.html (Homepage)")

    # Build research library page
    build_research_page(template, research_data, crop_nav_html, topic_nav_html)
    print("Built: research.html (Scientific Research Library)")
    
    # Generate search index
    generate_search_index(crops_data, topics_data, research_data)
    print("Generated: search_index.js")
    
    # Generate sitemap and robots.txt
    generate_sitemap_and_robots(crops_data, topics_data, research_data)
    print("Generated: sitemap.xml & robots.txt")

if __name__ == "__main__":
    main()
