"""
Idempotent integrity fixer for inwoovation.com (pairs with Engine/Gates/verify_site_integrity.py).

Each fixer is a pure html -> html transform; run_all() applies them to every page and
writes only files that changed. Safe to re-run: a second run must report 0 changes.

Usage:  python apply_integrity_fixes.py [--dry-run]
"""
import math
import os
import re
import sys

PORTAL_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://inwoovation.com/"
GA4_ID = "G-V4RYJBMEDE"
WORDS_PER_MINUTE = 200
SKIP_DIRS = {".git", "__pycache__", "node_modules"}

GA4_SNIPPET = f"""
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id={GA4_ID}"></script>
    <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){{dataLayer.push(arguments);}}
       gtag('js', new Date());
       gtag('config', '{GA4_ID}');
    </script>"""

# Self-applied authority claims -> truthful wording. External-literature citations
# ("grounded in peer-reviewed engineering standards") are intentionally left untouched.
CLAIM_REWRITES = [
    (r"(\d+)-volume peer-reviewed", r"\1-volume open-access"),
    (r"(\d+) peer-reviewed monographs", r"\1 technical monographs"),
    (r"Peer-Reviewed (?:SOTA|Agronomy) Monograph", "Engineering Monograph"),
    (r"Peer-Reviewed Whitepaper", "Engineering Whitepaper"),
    (r"(>\s*)Peer-Reviewed(\s*</span>)", r"\1Technical Note\2"),
    (r"Peer-Reviewed Engineering Standards\.", "Grounded in Published Engineering Standards."),
    (r"Peer-reviewed computational formulations strictly adhere to", "Computational formulations follow"),
    (r"Peer-Reviewed Citations", "Cited References"),
    (r"Peer-Reviewed Agricultural Science Papers", "Agricultural Science Research Notes"),
    (r"(?i)doctoral and peer-reviewed plant physiology", "In-depth plant physiology"),
    (r"peer-reviewed botanical science papers", "botanical science research notes"),
    (r"Peer-Reviewed Vacuum Systems Engineering Guides", "Vacuum Systems Engineering Guides"),
    (r"read our peer-reviewed guide", "read our technical guide"),
    (r"free, peer-reviewed precision", "free, literature-grounded precision"),
]
EXPLORE_FIX = (r"Explore In-depth plant physiology", "Explore in-depth plant physiology")


def visible_words(html):
    body = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", html, flags=re.S | re.I)
    return len(re.sub(r"<[^>]+>", " ", body).split())


def fix_dead_host(html):
    """smartfarm.inwoovation.com is a dead legacy host; its pages live at /smartfarm/."""
    html = re.sub(r"https?://smartfarm\.inwoovation\.com/?", SITE + "smartfarm/", html)
    return html.replace("smartfarm.inwoovation.com", "inwoovation.com/smartfarm")


def fix_claims(html):
    for pattern, replacement in CLAIM_REWRITES + [EXPLORE_FIX]:
        html = re.sub(pattern, replacement, html)
    return html


def fix_reading_time(html):
    minutes = max(1, math.ceil(visible_words(html) / WORDS_PER_MINUTE))
    return re.sub(r"((?:Reading|Read)\s*Time:?\s*)\d+(\s*min)", rf"\g<1>{minutes}\g<2>", html)


def fix_ga4(html):
    if GA4_ID in html or not re.search(r"<head[^>]*>", html, re.I):
        return html
    return re.sub(r"(<head[^>]*>)", lambda m: m.group(1) + GA4_SNIPPET, html, count=1, flags=re.I)


def self_url(rel_path):
    is_index = os.path.basename(rel_path) == "index.html"
    return SITE + (rel_path[:-len("index.html")] if is_index else rel_path)


def fix_canonical(html, rel_path):
    if re.search(r'rel=["\']canonical["\']', html, re.I):
        return html
    tag = f'\n    <link rel="canonical" href="{self_url(rel_path)}" />'
    return re.sub(r"(</title>)", lambda m: m.group(1) + tag, html, count=1, flags=re.I)


def _url_key(url):
    """Form-insensitive identity: '/x', '/x.html', '/x/index.html' and '/x/' style variants compare equal."""
    url = re.sub(r"(?:/index)?\.html$", "", url)
    return url.rstrip("/")


def fix_canonical_self(html, rel_path):
    """Normalise a canonical that names this same page in another URL form (e.g. extensionless)."""
    match = re.search(r'<link[^>]*rel=["\']canonical["\'][^>]*>', html, re.I)
    href = re.search(r'href=["\']([^"\']+)', match.group(0)) if match else None
    target = self_url(rel_path)
    if not href or href.group(1) == target or _url_key(href.group(1)) != _url_key(target):
        return html
    return html.replace(f'"{href.group(1)}"', f'"{target}"')


SOCIAL_IMAGE_RE = re.compile(r'(<meta[^>]*(?:og|twitter):image"[^>]*>|<meta[^>]*content="https://inwoovation\.com/'
                             r'[^"]+"[^>]*(?:og|twitter):image"[^>]*>)')


def fix_social_image(html):
    """og:image/twitter:image pointing at a file that does not exist -> site-wide cover image."""
    def repair(tag_match):
        tag = tag_match.group(0)
        url = re.search(r'content="(https://inwoovation\.com/[^"]+)"', tag)
        if url and not os.path.isfile(os.path.join(PORTAL_DIR, url.group(1)[len(SITE):].split("?")[0])):
            return tag.replace(url.group(1), SITE + "og-cover.jpg")
        return tag
    return SOCIAL_IMAGE_RE.sub(repair, html)


def fix_home_schema(html, rel_path):
    """Homepage ResearchOrganization: logo pointed at a non-existent file; sameAs listed own dead host."""
    if rel_path != "index.html":
        return html
    html = html.replace('"logo": "https://inwoovation.com/cover.png"', '"logo": "https://inwoovation.com/og-cover.jpg"')
    return re.sub(r',\s*"sameAs":\s*\[[^\]]*\]', "", html, count=1)


def is_live(rel_path, html):
    return not rel_path.startswith("embed/") and not re.search(r'http-equiv=["\']refresh', html, re.I)


def transform(rel_path, html):
    html = fix_dead_host(html)
    if not is_live(rel_path, html):
        return html
    html = fix_claims(html)
    html = fix_reading_time(html)
    html = fix_ga4(html)
    html = fix_canonical(html, rel_path)
    html = fix_canonical_self(html, rel_path)
    html = fix_social_image(html)
    return fix_home_schema(html, rel_path)


def iter_targets():
    for root, dirs, files in os.walk(PORTAL_DIR):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for name in files:
            is_page = name.endswith(".html") and not name.startswith(("naver", "google", "_"))
            if is_page or name.endswith(".js"):
                path = os.path.join(root, name)
                yield path, os.path.relpath(path, PORTAL_DIR).replace("\\", "/")


def run_all(dry_run=False):
    changed = []
    for path, rel_path in iter_targets():
        with open(path, encoding="utf-8", newline="") as fh:
            original = fh.read()
        updated = fix_dead_host(original) if rel_path.endswith(".js") else transform(rel_path, original)
        if updated != original:
            changed.append(rel_path)
            if not dry_run:
                with open(path, "w", encoding="utf-8", newline="") as fh:
                    fh.write(updated)
    print(f"{'[DRY-RUN] ' if dry_run else ''}Integrity fixes changed {len(changed)} file(s)")
    for rel_path in changed[:15]:
        print(f"  ~ {rel_path}")
    return changed


if __name__ == "__main__":
    run_all(dry_run="--dry-run" in sys.argv)
