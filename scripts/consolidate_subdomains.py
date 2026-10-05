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
    sf_sitemap = os.path.join(SMARTFARM_DIR, "sitemap.xml")
    if os.path.exists(sf_sitemap):
        with open(sf_sitemap, "r", encoding="utf-8", errors="ignore") as f:
            s_content = f.read()
        new_s_content = re.sub(r'<lastmod>[^<]+</lastmod>', f'<lastmod>{TODAY_ISO}</lastmod>', s_content)
        if new_s_content != s_content:
            with open(sf_sitemap, "w", encoding="utf-8") as f:
                f.write(new_s_content)
        print(f"  ✅ Synchronized Passive_Income_Hub sitemap.xml to {TODAY_ISO}")

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

SITEMAP_SKIP_DIRS = {".git", "__pycache__", "node_modules", "embed", "scripts", "data",
                     "digital_assets", "handbooks", "css", "js"}
DATE_MODIFIED_RE = re.compile(r'"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})')


def _is_publishable(rel_path, html):
    """A page belongs in the sitemap if it is real content, not a template/verification/redirect stub."""
    name = os.path.basename(rel_path)
    if name.startswith(("_", "old_", "naver", "google")):
        return False
    return not re.search(r'http-equiv=["\']refresh', html, re.I)


def collect_sitemap_entries(portal_dir=PORTAL_DIR):
    """Walk the portal and return sorted [(url, lastmod)] derived purely from files on disk."""
    entries = []
    for root, dirs, files in os.walk(portal_dir):
        dirs[:] = [d for d in dirs if d not in SITEMAP_SKIP_DIRS]
        for name in files:
            if not name.endswith(".html"):
                continue
            path = os.path.join(root, name)
            rel_path = os.path.relpath(path, portal_dir).replace("\\", "/")
            with open(path, "r", encoding="utf-8", errors="ignore") as fh:
                html = fh.read()
            if not _is_publishable(rel_path, html):
                continue
            url_path = rel_path[:-len("index.html")] if name == "index.html" else rel_path
            match = DATE_MODIFIED_RE.search(html)
            entries.append((f"https://inwoovation.com/{url_path}", match.group(1) if match else TODAY_ISO))
    return sorted(entries)


def _priority_for(url):
    if url in ("https://inwoovation.com/", "https://inwoovation.com/tools/venlocad-3d.html",
               "https://inwoovation.com/tools/global-agri-subsidy-grant-navigator.html"):
        return "1.0"
    if "/tools/" in url:
        return "0.9"
    if any(k in url for k in ("/crops/", "/climate/", "/benchmarks/", "/articles/")):
        return "0.8"
    return "0.7"


def update_unified_sitemap():
    print("\n🗺️ Generating Unified Sitemap for inwoovation.com (filesystem-derived)...")
    sitemap_path = os.path.join(PORTAL_DIR, "sitemap.xml")
    entries = collect_sitemap_entries()
    xml = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for url, lastmod in entries:
        xml += ["  <url>", f"    <loc>{url}</loc>", f"    <lastmod>{lastmod}</lastmod>",
                "    <changefreq>weekly</changefreq>", f"    <priority>{_priority_for(url)}</priority>",
                "  </url>"]
    xml.append('</urlset>')
    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write("\n".join(xml))
    print(f"  ✅ Unified sitemap written with {len(entries)} URLs to {sitemap_path}")

if __name__ == "__main__":
    print("=" * 60)
    print("🌐 INWOOVATION SUBDOMAIN CONSOLIDATION ENGINE (SSOT: inwoovation.com)")
    print("=" * 60)
    
    update_unified_sitemap()
    
    ensure_legacy_301_redirectors()
    print("\n🎉 ALL SUBDOMAINS SECURE & SSOT MAINTAINED UNDER inwoovation.com!")
