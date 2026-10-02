import os
import glob
import re

portal_dir = os.path.dirname(os.path.abspath(__file__))
html_files = glob.glob(os.path.join(portal_dir, "**", "*.html"), recursive=True)

print(f"Total HTML files found: {len(html_files)}")

# Pre-index existing files and directories for O(1) in-memory link validation
existing_files = set()
existing_dirs = set()
for root, dirs, files in os.walk(portal_dir):
    if '.git' in root:
        continue
    for f in files:
        existing_files.add(os.path.normpath(os.path.join(root, f)).lower())
    for d in dirs:
        existing_dirs.add(os.path.normpath(os.path.join(root, d)).lower())

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

    # Skip search engine verification files and template definitions
    if (
        os.path.basename(file_path).startswith("naver")
        or os.path.basename(file_path).startswith("google")
        or os.path.basename(file_path).startswith("_")
    ):
        continue

    # Skip embed widgets and pure redirect stubs from top-level SEO schema checks
    is_embed = "embed" in rel_path.replace("\\", "/")
    is_redirect = 'http-equiv="refresh"' in content or "http-equiv='refresh'" in content

    # 1. Viewport Check
    has_viewport = bool(re.search(r'<meta[^>]+(?:name=["\']viewport["\']|content=["\'][^"\']*width=device-width)', content, re.I))
    if not has_viewport and not is_embed and not is_redirect:
        issues.append((rel_path, "Missing viewport meta tag"))

    # 2. Title & Meta Description
    if ("<title>" not in content or "</title>" not in content) and not is_embed:
        issues.append((rel_path, "Missing <title> tag"))
    
    has_desc = bool(re.search(r'<meta[^>]+name=["\']description["\']', content, re.I)) or bool(re.search(r'<meta[^>]+content=["\'][^"\']+["\'][^>]+name=["\']description["\']', content, re.I))
    if not has_desc and not is_embed and not is_redirect:
        issues.append((rel_path, "Missing meta description"))

    # 3. JSON-LD Structured data
    if '<script type="application/ld+json">' not in content and not is_embed and not is_redirect:
        issues.append((rel_path, "Missing JSON-LD schema"))

    # 4. Check for broken internal links
    hrefs = re.findall(r'href=[\"\'](.*?)[\"\']', content)
    for href in hrefs:
        if (
            href.startswith("http")
            or href.startswith("#")
            or href.startswith("mailto:")
            or href.startswith("tel:")
            or href.startswith("javascript:")
            or "${" in href
            or href.startswith("data:")
        ):
            continue
        clean_href = href.split("?")[0].split("#")[0]
        if not clean_href:
            continue
        if clean_href.startswith("/"):
            target = os.path.normpath(os.path.join(portal_dir, clean_href.lstrip("/\\")))
        else:
            target = os.path.normpath(os.path.join(os.path.dirname(file_path), clean_href))
        
        norm_target = target.lower()
        if norm_target in existing_files:
            continue
        if norm_target in existing_dirs:
            if os.path.normpath(os.path.join(target, "index.html")).lower() in existing_files:
                continue
            issues.append((rel_path, f"Directory link missing index.html: {href}"))
            continue
        if (norm_target + ".html") in existing_files:
            continue
        
        # Fallback check
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

