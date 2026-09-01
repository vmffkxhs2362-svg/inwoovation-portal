import os
import glob
import re

portal_dir = r"g:\Meine Ablage\Antigravity\Headquater\Career\Inwoovation_Portal"
html_files = glob.glob(os.path.join(portal_dir, "**", "*.html"), recursive=True)

print(f"Total HTML files found: {len(html_files)}")

issues = []
tools_count = 0
articles_count = 0

for file_path in html_files:
    rel_path = os.path.relpath(file_path, portal_dir)
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    if "tools" in rel_path:
        tools_count += 1
    elif "articles" in rel_path:
        articles_count += 1

    # 1. Viewport Check
    if '<meta name="viewport"' not in content:
        issues.append((rel_path, "Missing viewport meta tag"))

    # 2. Title & Meta Description
    if "<title>" not in content or "</title>" not in content:
        issues.append((rel_path, "Missing <title> tag"))
    if '<meta name="description"' not in content:
        issues.append((rel_path, "Missing meta description"))

    # 3. JSON-LD Structured data
    if '<script type="application/ld+json">' not in content:
        issues.append((rel_path, "Missing JSON-LD schema"))

    # 4. Check for broken internal links
    hrefs = re.findall(r'href=[\"\'](.*?)[\"\']', content)
    for href in hrefs:
        if href.startswith("http") or href.startswith("#") or href.startswith("mailto:"):
            continue
        clean_href = href.split("?")[0].split("#")[0]
        if not clean_href:
            continue
        target = os.path.normpath(os.path.join(os.path.dirname(file_path), clean_href))
        if not os.path.exists(target):
            issues.append((rel_path, f"Broken link: {href} -> target not found: {target}"))

print(f"Audited Tools: {tools_count}")
print(f"Audited Articles: {articles_count}")
print(f"Total Issues Detected: {len(issues)}")
if issues:
    for f, msg in issues[:30]:
        print(f"  [ISSUE] {f}: {msg}")
else:
    print(">>> 100% CLEAN! Zero broken links, zero missing meta tags, zero schema errors! <<<")
