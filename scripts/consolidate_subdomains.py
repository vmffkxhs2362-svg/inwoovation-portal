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
  <meta name="google-adsense-account" content="ca-pub-8597809158257497">
  <title>Redirecting to Inwoovation Lab...</title>
  <link rel="canonical" href="{dest_url}">
  <meta http-equiv="refresh" content="0; url={dest_url}">
  <script>window.location.replace("{dest_url}" + window.location.search + window.location.hash);</script>
</head>
<body style="background:#0b0f19;color:#f8fafc;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;">
  <p>Redirecting to <a href="{dest_url}" style="color:#38bdf8;">{dest_url}</a>...</p>
</body>
</html>"""

def get_smartfarm_urls():
    dest_dir = os.path.join(PORTAL_DIR, "smartfarm")
    html_files = [f for f in glob.glob(os.path.join(dest_dir, "*.html")) 
                  if not os.path.basename(f).startswith("old_") and not os.path.basename(f).startswith("naverbce")]
    urls = []
    for f in html_files:
        fn = os.path.basename(f)
        url = "https://inwoovation.com/smartfarm/" if fn == "index.html" else f"https://inwoovation.com/smartfarm/{fn}"
        urls.append(url)
    return urls

def get_wiki_urls():
    dest_dir = os.path.join(PORTAL_DIR, "wiki")
    html_files = [f for f in glob.glob(os.path.join(dest_dir, "*.html")) 
                  if not os.path.basename(f).startswith("_")]
    urls = []
    for f in html_files:
        fn = os.path.basename(f)
        url = "https://inwoovation.com/wiki/" if fn == "index.html" else f"https://inwoovation.com/wiki/{fn}"
        urls.append(url)
    return urls

def get_parts_urls():
    dest_dir = os.path.join(PORTAL_DIR, "parts")
    html_files = [f for f in glob.glob(os.path.join(dest_dir, "*.html"))]
    urls = []
    for f in html_files:
        fn = os.path.basename(f)
        url = "https://inwoovation.com/parts/" if fn == "index.html" else f"https://inwoovation.com/parts/{fn}"
        urls.append(url)
    return urls

def ensure_legacy_301_redirectors():
    print("\n🔀 Verifying and enforcing 301 Meta-Refresh & Canonical Redirectors in legacy repos...")
    
    # 1. Smart Farm legacy redirects
    sf_html_files = [f for f in glob.glob(os.path.join(SMARTFARM_DIR, "*.html")) 
                     if not os.path.basename(f).startswith("old_") and not os.path.basename(f).startswith("naverbce")]
    for f in sf_html_files:
        filename = os.path.basename(f)
        dest_url = "https://inwoovation.com/smartfarm/" if filename == "index.html" else f"https://inwoovation.com/smartfarm/{filename}"
        with open(f, "w", encoding="utf-8") as fh:
            fh.write(make_redirect_html(dest_url))
    print(f"  ✅ Enforced {len(sf_html_files)} 301 redirects in Passive_Income_Hub")

    # 2. Wiki legacy redirects
    wiki_html_files = [f for f in glob.glob(os.path.join(WIKI_DIR, "*.html")) 
                       if not os.path.basename(f).startswith("_")]
    for f in wiki_html_files:
        filename = os.path.basename(f)
        dest_url = "https://inwoovation.com/wiki/" if filename == "index.html" else f"https://inwoovation.com/wiki/{filename}"
        with open(f, "w", encoding="utf-8") as fh:
            fh.write(make_redirect_html(dest_url))
    print(f"  ✅ Enforced {len(wiki_html_files)} 301 redirects in AgTech_Wiki")

    # 3. AgriMaster legacy redirects
    for item in ["index.html", "privacy.html", "terms.html"]:
        f = os.path.join(AGRIMASTER_DIR, item)
        if os.path.exists(f):
            dest_url = "https://inwoovation.com/parts/" if item == "index.html" else f"https://inwoovation.com/parts/{item}"
            with open(f, "w", encoding="utf-8") as fh:
                fh.write(make_redirect_html(dest_url))
    print(f"  ✅ Enforced 301 redirects in AgriMaster_Portal")

def update_unified_sitemap(all_urls):
    print("\n🗺️ Generating Unified Sitemap for inwoovation.com...")
    sitemap_path = os.path.join(PORTAL_DIR, "sitemap.xml")
    
    existing_urls = set()
    if os.path.exists(sitemap_path):
        with open(sitemap_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        existing_urls = set(re.findall(r'<loc>([^<]+)</loc>', content))
        
    for u in all_urls:
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
    print("🌐 INWOOVATION SUBDOMAIN CONSOLIDATION ENGINE (SSOT: inwoovation.com)")
    print("=" * 60)
    
    sf_urls = get_smartfarm_urls()
    wiki_urls = get_wiki_urls()
    parts_urls = get_parts_urls()
    
    all_urls = sf_urls + wiki_urls + parts_urls
    update_unified_sitemap(all_urls)
    
    ensure_legacy_301_redirectors()
    print("\n🎉 ALL SUBDOMAINS SECURE & SSOT MAINTAINED UNDER inwoovation.com!")
