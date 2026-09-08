import json
import os

data_path = os.path.join("data", "library_papers.json")
out_dir = "src_pages"

def build_library():
    if not os.path.exists(data_path):
        print("No library data found.")
        return
        
    with open(data_path, "r", encoding="utf-8") as f:
        papers = json.load(f)
        
    # 1. Generate individual paper pages
    for p in papers:
        html = f"""<!-- TITLE: {p['title']} | AgTech Research Library -->
<!-- DESC: {p['abstract'][:150]}... -->
<!-- KEYWORDS: {p['keywords']} -->
<!-- ACTIVE_TAB: btn-tab-library -->
<!-- ACTIVE_CHIP: chip-library -->

<div class="calc-wrapper active" id="section-library-paper" style="grid-template-columns: 1fr; background: transparent; border: none; box-shadow: none; padding: 0;">
    <div style="margin-bottom: 2rem;">
        <a href="library.html" style="color: var(--primary); text-decoration: none; font-weight: bold;">← Back to Library</a>
    </div>
    
    <h1 style="font-size: 1.8rem; margin-bottom: 1rem; color: #f8fafc;">{p['title']}</h1>
    <div style="color: #94a3b8; margin-bottom: 2rem; font-size: 1.1rem;">
        <strong>Authors:</strong> {p['authors']} | <strong>Year:</strong> {p['year']} | <strong>Journal:</strong> {p['journal']}
    </div>
    
    <div style="background: rgba(30,41,59,0.9); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 2rem;">
        <h2 style="color: #38bdf8; margin-top: 0; margin-bottom: 1rem; font-size: 1.4rem;">Abstract</h2>
        <p style="color: #e2e8f0; line-height: 1.7; font-size: 1.1rem;">{p['abstract']}</p>
    </div>
    
    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 2rem; border-radius: 12px; margin-bottom: 2rem;">
        <h2 style="color: #10b981; margin-top: 0; margin-bottom: 1rem; font-size: 1.4rem;">💡 Engineering Application</h2>
        <p style="color: #e2e8f0; line-height: 1.6; font-size: 1.1rem;">{p['application_text']}</p>
        <div style="margin-top: 1.5rem;">
            <a href="{p['calculator_link']}" style="display: inline-block; background: #10b981; color: white; padding: 0.8rem 1.5rem; text-decoration: none; border-radius: 8px; font-weight: bold;">Launch {p['calculator_name']} →</a>
        </div>
    </div>
    
    <div style="margin-top: 3rem; text-align: center;">
        <a href="{p['url']}" target="_blank" style="color: #94a3b8; text-decoration: underline;">Read Original Open-Access Paper</a>
    </div>
</div>
"""
        with open(os.path.join(out_dir, f"library_{p['id']}.html"), "w", encoding="utf-8") as f:
            f.write(html)
            
    # 2. Generate the Library Index page
    index_html = """<!-- TITLE: AgTech Research Library | Open Access Papers & Formulas -->
<!-- DESC: A curated library of open-access agricultural engineering and greenhouse research papers, complete with direct applications to our online calculators. -->
<!-- KEYWORDS: AgTech research, greenhouse papers, VPD research, Penman-Monteith, greenhouse heat loss, open access -->
<!-- ACTIVE_TAB: btn-tab-library -->
<!-- ACTIVE_CHIP: chip-library -->

<div class="calc-wrapper active" id="section-library-index" style="grid-template-columns: 1fr; background: transparent; border: none; box-shadow: none; padding: 0;">
    <h1 style="margin-bottom: 1rem; font-size: 1.8rem;">📚 AgTech Research Library</h1>
    <p style="color: #94a3b8; margin-bottom: 2.5rem; font-size: 1.1rem; max-width: 800px;">
        Explore our curated collection of open-access academic papers and public domain engineering manuals. 
        Each paper is mapped to a specific calculator in our suite, bridging the gap between theoretical research and practical greenhouse application.
    </p>
    
    <div class="dashboard-grid" style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
"""
    
    for p in papers:
        index_html += f"""
        <div class="dashboard-card" style="border: 1px solid rgba(255,255,255,0.1); background: rgba(30,41,59,0.7); text-align: left; cursor: pointer;" onclick="window.location.href='library_{p['id']}.html'">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <h3 style="margin: 0; color: #38bdf8; font-size: 1.3rem;">{p['title']}</h3>
                <span style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; white-space: nowrap; margin-left: 1rem;">{p['calculator_name']}</span>
            </div>
            <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 1rem;">{p['authors']} ({p['year']}) | {p['journal']}</p>
            <p style="color: #cbd5e1; font-size: 1rem; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{p['abstract']}</p>
            <div style="margin-top: 1rem;">
                <a href="library_{p['id']}.html" style="color: #38bdf8; text-decoration: none; font-weight: bold; font-size: 0.95rem;">Read Analysis & Application →</a>
            </div>
        </div>
"""
    
    index_html += """
    </div>
</div>
"""
    with open(os.path.join(out_dir, "library.html"), "w", encoding="utf-8") as f:
        f.write(index_html)
        
    print(f"Generated library.html and {len(papers)} paper pages.")

if __name__ == "__main__":
    build_library()
