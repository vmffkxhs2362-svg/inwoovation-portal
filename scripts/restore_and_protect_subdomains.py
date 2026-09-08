import os
import io
import subprocess
import tarfile
import glob
import re

HQ_DIR = r"g:\Meine Ablage\Antigravity\Headquater"
PORTAL_DIR = os.path.join(HQ_DIR, r"Career\Inwoovation_Portal")
SMARTFARM_DIR = os.path.join(HQ_DIR, r"Career\Passive_Income_Hub")
WIKI_DIR = os.path.join(HQ_DIR, r"Career\AgTech_Wiki")
AGRIMASTER_DIR = os.path.join(HQ_DIR, r"Career\AgriMaster_Portal")

GA4_SNIPPET = """    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-V4RYJBMEDE"></script>
    <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'G-V4RYJBMEDE');
    </script>
    <!-- Google AdSense Script -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8597809158257497" crossorigin="anonymous"></script>
"""

def extract_repo_commit(repo_dir, commit_hash, dest_dir):
    print(f"📦 Extracting commit {commit_hash} from {os.path.basename(repo_dir)} -> {dest_dir}...")
    os.makedirs(dest_dir, exist_ok=True)
    proc = subprocess.run(
        ["git", "archive", commit_hash],
        cwd=repo_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=True
    )
    with tarfile.open(fileobj=io.BytesIO(proc.stdout)) as tar:
        tar.extractall(path=dest_dir)
    print(f"  ✅ Extracted successfully to {dest_dir}")

def postprocess_smartfarm(dest_dir):
    print("🔧 Post-processing Smart Farm files for inwoovation.com/smartfarm/...")
    html_files = glob.glob(os.path.join(dest_dir, "*.html"))
    for f in html_files:
        with open(f, "r", encoding="utf-8", errors="ignore") as fh:
            content = fh.read()

        # Update URLs
        content = content.replace("https://smartfarm.inwoovation.com/", "https://inwoovation.com/smartfarm/")
        content = content.replace("https://smartfarm.inwoovation.com", "https://inwoovation.com/smartfarm")

        # Inject GA4 / AdSense if not present
        if "G-V4RYJBMEDE" not in content and "<head>" in content:
            content = content.replace("<head>", f"<head>\n{GA4_SNIPPET}", 1)

        with open(f, "w", encoding="utf-8") as fh:
            fh.write(content)
    print(f"  ✅ Updated {len(html_files)} Smart Farm HTML pages.")

def postprocess_wiki(dest_dir):
    print("🔧 Post-processing AgTech Wiki files for inwoovation.com/wiki/...")
    html_files = glob.glob(os.path.join(dest_dir, "*.html"))
    for f in html_files:
        with open(f, "r", encoding="utf-8", errors="ignore") as fh:
            content = fh.read()

        # Update URLs
        content = content.replace("https://wiki.inwoovation.com/", "https://inwoovation.com/wiki/")
        content = content.replace("https://wiki.inwoovation.com", "https://inwoovation.com/wiki")

        # Inject GA4 / AdSense if not present
        if "G-V4RYJBMEDE" not in content and "<head>" in content:
            content = content.replace("<head>", f"<head>\n{GA4_SNIPPET}", 1)

        with open(f, "w", encoding="utf-8") as fh:
            fh.write(content)
            
    # Update search_index.js if needed
    search_idx = os.path.join(dest_dir, "search_index.js")
    if os.path.exists(search_idx):
        with open(search_idx, "r", encoding="utf-8", errors="ignore") as fh:
            c = fh.read()
        c = c.replace("https://wiki.inwoovation.com/", "https://inwoovation.com/wiki/")
        with open(search_idx, "w", encoding="utf-8") as fh:
            fh.write(c)
            
    print(f"  ✅ Updated {len(html_files)} Wiki HTML pages and search index.")

def postprocess_parts(dest_dir):
    print("🔧 Post-processing AgriMaster parts files for inwoovation.com/parts/...")
    html_files = glob.glob(os.path.join(dest_dir, "*.html"))
    for f in html_files:
        with open(f, "r", encoding="utf-8", errors="ignore") as fh:
            content = fh.read()

        # Update URLs
        content = content.replace("https://agrimaster.inwoovation.com/", "https://inwoovation.com/parts/")
        content = content.replace("https://agrimaster.inwoovation.com", "https://inwoovation.com/parts")

        # Inject GA4 if not present
        if "G-V4RYJBMEDE" not in content and "<head>" in content:
            content = content.replace("<head>", f"<head>\n{GA4_SNIPPET}", 1)

        # Cross link to Inwoovation Lab Hub
        if "Inwoovation Lab" not in content and "</header>" in content:
            content = content.replace(
                '</header>',
                '  <a href="https://inwoovation.com/" style="color:#38bdf8;text-decoration:none;font-weight:700;font-size:0.9rem;margin-left:auto;display:inline-flex;align-items:center;gap:0.4rem;">🌐 Inwoovation Lab Hub</a>\n</header>'
            )

        with open(f, "w", encoding="utf-8") as fh:
            fh.write(content)
    print(f"  ✅ Updated {len(html_files)} Parts HTML pages.")

if __name__ == "__main__":
    sf_dest = os.path.join(PORTAL_DIR, "smartfarm")
    wiki_dest = os.path.join(PORTAL_DIR, "wiki")
    parts_dest = os.path.join(PORTAL_DIR, "parts")

    extract_repo_commit(SMARTFARM_DIR, "d1ea76f", sf_dest)
    extract_repo_commit(WIKI_DIR, "8d9ce52", wiki_dest)
    extract_repo_commit(AGRIMASTER_DIR, "193fb27", parts_dest)

    postprocess_smartfarm(sf_dest)
    postprocess_wiki(wiki_dest)
    postprocess_parts(parts_dest)

    print("\n🎉 ALL REAL APPLICATION FILES FULLY RESTORED & ADAPTED UNDER inwoovation.com!")
