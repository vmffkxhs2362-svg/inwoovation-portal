import os
import shutil
import glob
import re
from datetime import datetime

HQ_DIR = r"g:\Meine Ablage\Antigravity\Headquater"
PORTAL_DIR = os.path.join(HQ_DIR, r"Career\Inwoovation_Portal")
SMARTFARM_DIR = os.path.join(HQ_DIR, r"Career\Passive_Income_Hub")
WIKI_DIR = os.path.join(HQ_DIR, r"Career\AgTech_Wiki")
AGRIMASTER_DIR = os.path.join(HQ_DIR, r"Career\AgriMaster_Portal")

TODAY_ISO = datetime.now().strftime("%Y-%m-%d")

def make_redirect_html(dest_url):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Redirecting to Inwoovation Lab...</title>
  <link rel="canonical" href="{dest_url}">
  <meta http-equiv="refresh" content="0; url={dest_url}">
  <script>window.location.replace("{dest_url}" + window.location.search + window.location.hash);</script>
</head>
<body style="background:#0b0f19;color:#f8fafc;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;">
  <p>Redirecting to <a href="{dest_url}" style="color:#38bdf8;">{dest_url}</a>...</p>
</body>
</html>"""

def consolidate_smartfarm():
    print("\n📦 [1/4] Consolidating Smart Farm Engineering Lab -> inwoovation.com/smartfarm/...")
    dest_dir = os.path.join(PORTAL_DIR, "smartfarm")
    os.makedirs(dest_dir, exist_ok=True)
    
    # 1. Copy assets & styles
    for item in ["style.css", "common.js", "cover.png"]:
        src_path = os.path.join(SMARTFARM_DIR, item)
        if os.path.exists(src_path):
            shutil.copy2(src_path, os.path.join(dest_dir, item))
            
    # Copy data and js dirs if present
    for d in ["data", "js"]:
        src_d = os.path.join(SMARTFARM_DIR, d)
        if os.path.exists(src_d):
            dest_d = os.path.join(dest_dir, d)
            if os.path.exists(dest_d):
                shutil.rmtree(dest_d)
            shutil.copytree(src_d, dest_d)

    # 2. Copy and adapt HTML pages
    html_files = [f for f in glob.glob(os.path.join(SMARTFARM_DIR, "*.html")) 
                  if not os.path.basename(f).startswith("old_") and not os.path.basename(f).startswith("naverbce")]
    
    smartfarm_urls = []
    for f in html_files:
        filename = os.path.basename(f)
        with open(f, "r", encoding="utf-8", errors="ignore") as fh:
            content = fh.read()
            
        # Update canonical and OG URLs
        content = content.replace("https://smartfarm.inwoovation.com/", "https://inwoovation.com/smartfarm/")
        content = content.replace("https://smartfarm.inwoovation.com", "https://inwoovation.com/smartfarm")
        
        dest_file = os.path.join(dest_dir, filename)
        with open(dest_file, "w", encoding="utf-8") as fh:
            fh.write(content)
            
        url = "https://inwoovation.com/smartfarm/" if filename == "index.html" else f"https://inwoovation.com/smartfarm/{filename}"
        smartfarm_urls.append(url)
        
    print(f"  ✅ Integrated {len(html_files)} Smart Farm tools into {dest_dir}")
    return smartfarm_urls

def consolidate_wiki():
    print("\n📚 [2/4] Consolidating AgTech Wiki -> inwoovation.com/wiki/...")
    dest_dir = os.path.join(PORTAL_DIR, "wiki")
    os.makedirs(dest_dir, exist_ok=True)
    
    # 1. Copy data, references, scripts
    for d in ["data", "references", "scripts"]:
        src_d = os.path.join(WIKI_DIR, d)
        if os.path.exists(src_d):
            dest_d = os.path.join(dest_dir, d)
            if os.path.exists(dest_d):
                shutil.rmtree(dest_d)
            shutil.copytree(src_d, dest_d)
            
    for item in ["search_index.js", "_wiki_template.html"]:
        src_path = os.path.join(WIKI_DIR, item)
        if os.path.exists(src_path):
            shutil.copy2(src_path, os.path.join(dest_dir, item))

    # 2. Copy and adapt HTML pages
    html_files = [f for f in glob.glob(os.path.join(WIKI_DIR, "*.html")) 
                  if not os.path.basename(f).startswith("_")]
    
    wiki_urls = []
    for f in html_files:
        filename = os.path.basename(f)
        with open(f, "r", encoding="utf-8", errors="ignore") as fh:
            content = fh.read()
            
        # Update canonical and OG URLs
        content = content.replace("https://wiki.inwoovation.com/", "https://inwoovation.com/wiki/")
        content = content.replace("https://wiki.inwoovation.com", "https://inwoovation.com/wiki")
        
        dest_file = os.path.join(dest_dir, filename)
        with open(dest_file, "w", encoding="utf-8") as fh:
            fh.write(content)
            
        url = "https://inwoovation.com/wiki/" if filename == "index.html" else f"https://inwoovation.com/wiki/{filename}"
        wiki_urls.append(url)
        
    print(f"  ✅ Integrated {len(html_files)} Wiki pages into {dest_dir}")
    return wiki_urls

def consolidate_agrimaster():
    print("\n⚙️ [3/4] Consolidating AgriMaster -> inwoovation.com/parts/...")
    dest_dir = os.path.join(PORTAL_DIR, "parts")
    os.makedirs(dest_dir, exist_ok=True)
    
    items = ["ag_parts_data.json", "app.js", "index.html", "privacy.html", "terms.html", 
             "agrimaster_live_audit.png", "agrimaster_preview.png"]
    
    parts_urls = []
    for item in items:
        src_path = os.path.join(AGRIMASTER_DIR, item)
        if os.path.exists(src_path):
            if item.endswith(".html"):
                with open(src_path, "r", encoding="utf-8", errors="ignore") as fh:
                    content = fh.read()
                content = content.replace("https://agrimaster.inwoovation.com/", "https://inwoovation.com/parts/")
                content = content.replace("https://agrimaster.inwoovation.com", "https://inwoovation.com/parts")
                # Add cross link to Inwoovation Lab in header if not present
                if "Inwoovation Lab" not in content:
                    content = content.replace(
                        '</header>',
                        '  <a href="https://inwoovation.com/" style="color:#38bdf8;text-decoration:none;font-weight:700;font-size:0.9rem;margin-left:auto;display:inline-flex;align-items:center;gap:0.4rem;">🌐 Inwoovation Lab Hub</a>\n</header>'
                    )
                with open(os.path.join(dest_dir, item), "w", encoding="utf-8") as fh:
                    fh.write(content)
                url = "https://inwoovation.com/parts/" if item == "index.html" else f"https://inwoovation.com/parts/{item}"
                parts_urls.append(url)
            else:
                shutil.copy2(src_path, os.path.join(dest_dir, item))
                
    print(f"  ✅ Integrated AgriMaster component search into {dest_dir}")
    return parts_urls

def build_legacy_301_redirectors():
    print("\n🔀 [4/4] Deploying 301 Meta-Refresh & Canonical Redirectors to legacy subdomains...")
    
    # 1. Smart Farm legacy redirects
    sf_html_files = [f for f in glob.glob(os.path.join(SMARTFARM_DIR, "*.html")) 
                     if not os.path.basename(f).startswith("old_") and not os.path.basename(f).startswith("naverbce")]
    for f in sf_html_files:
        filename = os.path.basename(f)
        dest_url = "https://inwoovation.com/smartfarm/" if filename == "index.html" else f"https://inwoovation.com/smartfarm/{filename}"
        with open(f, "w", encoding="utf-8") as fh:
            fh.write(make_redirect_html(dest_url))
    print(f"  ✅ Updated {len(sf_html_files)} files in Passive_Income_Hub with 301 redirects")

    # 2. Wiki legacy redirects
    wiki_html_files = [f for f in glob.glob(os.path.join(WIKI_DIR, "*.html")) 
                       if not os.path.basename(f).startswith("_")]
    for f in wiki_html_files:
        filename = os.path.basename(f)
        dest_url = "https://inwoovation.com/wiki/" if filename == "index.html" else f"https://inwoovation.com/wiki/{filename}"
        with open(f, "w", encoding="utf-8") as fh:
            fh.write(make_redirect_html(dest_url))
    print(f"  ✅ Updated {len(wiki_html_files)} files in AgTech_Wiki with 301 redirects")

    # 3. AgriMaster legacy redirects
    for item in ["index.html", "privacy.html", "terms.html"]:
        f = os.path.join(AGRIMASTER_DIR, item)
        if os.path.exists(f):
            dest_url = "https://inwoovation.com/parts/" if item == "index.html" else f"https://inwoovation.com/parts/{item}"
            with open(f, "w", encoding="utf-8") as fh:
                fh.write(make_redirect_html(dest_url))
    print(f"  ✅ Updated AgriMaster_Portal with 301 redirects")

def update_unified_sitemap(new_urls):
    print("\n🗺️ Generating Unified Sitemap for inwoovation.com...")
    sitemap_path = os.path.join(PORTAL_DIR, "sitemap.xml")
    
    # Read existing URLs
    existing_urls = set()
    if os.path.exists(sitemap_path):
        with open(sitemap_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        existing_urls = set(re.findall(r'<loc>([^<]+)</loc>', content))
        
    for u in new_urls:
        existing_urls.add(u)
        
    sorted_urls = sorted(list(existing_urls))
    
    xml = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in sorted_urls:
        priority = "1.0" if u == "https://inwoovation.com/" else "0.8"
        xml.append("  <url>")
        xml.append(f"    <loc>{u}</loc>")
        xml.append(f"    <lastmod>{TODAY_ISO}</lastmod>")
        xml.append("    <changefreq>weekly</changefreq>")
        xml.append(f"    <priority>{priority}</priority>")
        xml.append("  </url>")
    xml.append('</urlset>')
    
    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write("\n".join(xml))
        
    print(f"  ✅ Unified sitemap written with {len(sorted_urls)} URLs to {sitemap_path}")

if __name__ == "__main__":
    print("=" * 60)
    print("🌐 INWOOVATION SUBDOMAIN CONSOLIDATION ENGINE")
    print("=" * 60)
    
    sf_urls = consolidate_smartfarm()
    wiki_urls = consolidate_wiki()
    parts_urls = consolidate_agrimaster()
    
    all_new_urls = sf_urls + wiki_urls + parts_urls
    update_unified_sitemap(all_new_urls)
    
    build_legacy_301_redirectors()
    print("\n🎉 ALL SUBDOMAINS CONSOLIDATED INTO inwoovation.com SUCCESSFULLY!")
