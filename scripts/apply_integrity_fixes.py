"""
Idempotent integrity & SEO/AdSense fixer for inwoovation.com (pairs with Engine/Gates/verify_site_integrity.py).

Each fixer is a pure html -> html transform; run_all() applies them to every page and
writes only files that changed. Safe to re-run: a second run must report 0 changes.

Usage:  python apply_integrity_fixes.py [--dry-run]
"""
import html as html_lib
import math
import os
import re
import sys

PORTAL_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://inwoovation.com/"
GA4_ID = "G-V4RYJBMEDE"
ADSENSE_CLIENT = "ca-pub-8597809158257497"
DEFAULT_OG_IMAGE = SITE + "og-cover.jpg"
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

ADSENSE_META_SNIPPET = f'\n    <meta name="google-adsense-account" content="{ADSENSE_CLIENT}">'
ADSENSE_SCRIPT_SNIPPET = f'\n    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={ADSENSE_CLIENT}" crossorigin="anonymous"></script>'

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
    (r"Peer-Reviewed Reference Index", "Academic Literature Reference Index"),
    (r"read our peer-reviewed guide", "read our technical guide"),
    (r"free, peer-reviewed precision", "free, literature-grounded precision"),
]
EXPLORE_FIX = (r"Explore In-depth plant physiology", "Explore in-depth plant physiology")

CTRL_FIXES = [
    ("\x09ext{", r"\text{"),
    ("\x09imes", r"\times"),
    ("\x09au", r"\tau"),
    ("\x09heta", r"\theta"),
    ("\x07pprox", r"\approx"),
    ("\x07lpha", r"\alpha"),
    ("\x08eta", r"\beta"),
    ("\x0barepsilon", r"\varepsilon"),
    ("\x0crac{", r"\frac{"),
]

GREEK_AND_SYMBOLS = [
    (r"\\Delta(?![a-zA-Z])", "Δ"),
    (r"\\Gamma(?![a-zA-Z])", "Γ"),
    (r"\\Theta(?![a-zA-Z])", "Θ"),
    (r"\\Lambda(?![a-zA-Z])", "Λ"),
    (r"\\Phi(?![a-zA-Z])", "Φ"),
    (r"\\Psi(?![a-zA-Z])", "Ψ"),
    (r"\\Omega(?![a-zA-Z])", "Ω"),
    (r"\\alpha(?![a-zA-Z])", "α"),
    (r"\\beta(?![a-zA-Z])", "β"),
    (r"\\gamma(?![a-zA-Z])", "γ"),
    (r"\\delta(?![a-zA-Z])", "δ"),
    (r"\\varepsilon(?![a-zA-Z])", "ε"),
    (r"\\epsilon(?![a-zA-Z])", "ε"),
    (r"\\zeta(?![a-zA-Z])", "ζ"),
    (r"\\eta(?![a-zA-Z])", "η"),
    (r"\\theta(?![a-zA-Z])", "θ"),
    (r"\\kappa(?![a-zA-Z])", "κ"),
    (r"\\lambda(?![a-zA-Z])", "λ"),
    (r"\\mu(?![a-zA-Z])", "μ"),
    (r"\\nu(?![a-zA-Z])", "ν"),
    (r"\\xi(?![a-zA-Z])", "ξ"),
    (r"\\pi(?![a-zA-Z])", "π"),
    (r"\\rho(?![a-zA-Z])", "ρ"),
    (r"\\sigma(?![a-zA-Z])", "σ"),
    (r"\\tau(?![a-zA-Z])", "τ"),
    (r"\\phi(?![a-zA-Z])", "φ"),
    (r"\\chi(?![a-zA-Z])", "χ"),
    (r"\\psi(?![a-zA-Z])", "ψ"),
    (r"\\omega(?![a-zA-Z])", "ω"),
    (r"\\cdot(?![a-zA-Z])", "·"),
    (r"\\times(?![a-zA-Z])", "×"),
    (r"\\pm(?![a-zA-Z])", "±"),
    (r"\\mp(?![a-zA-Z])", "∓"),
    (r"\\ge(?![a-zA-Z])", "≥"),
    (r"\\geq(?![a-zA-Z])", "≥"),
    (r"\\le(?![a-zA-Z])", "≤"),
    (r"\\leq(?![a-zA-Z])", "≤"),
    (r"\\ne(?![a-zA-Z])", "≠"),
    (r"\\neq(?![a-zA-Z])", "≠"),
    (r"\\approx(?![a-zA-Z])", "≈"),
    (r"\\sim(?![a-zA-Z])", "∼"),
    (r"\\propto(?![a-zA-Z])", "∝"),
    (r"\\infty(?![a-zA-Z])", "∞"),
    (r"\\partial(?![a-zA-Z])", "∂"),
    (r"\\nabla(?![a-zA-Z])", "∇"),
    (r"\\int(?![a-zA-Z])", "∫"),
    (r"\\sum(?![a-zA-Z])", "∑"),
    (r"\\prod(?![a-zA-Z])", "∏"),
    (r"\\xrightarrow\{([^}]*)\}", r"→(\1)"),
    (r"\\rightarrow(?![a-zA-Z])", "→"),
    (r"\\to(?![a-zA-Z])", "→"),
    (r"\\leftarrow(?![a-zA-Z])", "←"),
    (r"\\downarrow(?![a-zA-Z])", "↓"),
    (r"\\uparrow(?![a-zA-Z])", "↑"),
    (r"\\implies(?![a-zA-Z])", "⇒"),
    (r"\\Rightarrow(?![a-zA-Z])", "⇒"),
    (r"\\in(?![a-zA-Z])", "∈"),
    (r"\\ll(?![a-zA-Z])", "≪"),
    (r"\\gg(?![a-zA-Z])", "≫"),
    (r"\\circ(?![a-zA-Z])", "°"),
    (r"\^\{\\circ\}", "°"),
    (r"\^°", "°"),
    (r"\\%", "%"),
    (r"\\quad(?![a-zA-Z])", " "),
    (r"\\,", " "),
    (r"\\;", " "),
    (r"\\left\s*([(\[\{|])", r"\1"),
    (r"\\right\s*([)\]\}|])", r"\1"),
    (r"\\exp(?![a-zA-Z])", "exp"),
    (r"\\ln(?![a-zA-Z])", "ln"),
    (r"\\log(?![a-zA-Z])", "log"),
    (r"\\min(?![a-zA-Z])", "min"),
    (r"\\max(?![a-zA-Z])", "max"),
    (r"\\sin(?![a-zA-Z])", "sin"),
    (r"\\cos(?![a-zA-Z])", "cos"),
    (r"\\tan(?![a-zA-Z])", "tan"),
]

LATEX_DOLLAR_RE = re.compile(
    r"\$(?!\d[\d,]*\.?\d*\s+(?:to|and|or|per|in|for|of|million|billion|thousand|USD|k|M|B)\b)"
    r"([^$\n]{1,160})\$"
)


def _convert_math_inner(expr):
    s = expr.strip()
    for bad, good in CTRL_FIXES:
        s = s.replace(bad, good)
    s = s.replace("{,}", ",")
    s = s.replace(r"\_", "_")
    for pat, rep in GREEK_AND_SYMBOLS:
        s = re.sub(pat, rep, s)
    for _ in range(5):
        s = re.sub(r"\\(?:text|mathrm|textit|mathcal)\{([^{}]*)\}", r"\1", s)
        s = re.sub(r"\\mathbf\{([^{}]*)\}", r"<strong>\1</strong>", s)
        s = re.sub(r"\\dot\{([^{}]*)\}", r"\1&#775;", s)
        s = re.sub(r"\\vec\{([^{}]*)\}", r"\1&#8407;", s)
        s = re.sub(r"_\{([^{}]+)\}", r"<sub>\1</sub>", s)
        s = re.sub(r"\^\{([^{}]+)\}", r"<sup>\1</sup>", s)
        s = re.sub(r"\\sqrt\{([^{}]*)\}", r"√(\1)", s)
        s = re.sub(r"\\frac\{([^{}]*)\}\{([^{}]*)\}", r"(\1)/(\2)", s)
    s = re.sub(r"_([a-zA-Z0-9+\-]+)", r"<sub>\1</sub>", s)
    s = re.sub(r"\^([a-zA-Z0-9+\-]+)", r"<sup>\1</sup>", s)
    s = s.replace("{", "").replace("}", "")
    s = re.sub(r"\s{2,}", " ", s)
    return s


def fix_html_math_and_escapes(html):
    """Heal control-character escape corruptions and render raw LaTeX ($...$, \\(...\\)) into semantic HTML."""
    parts = re.split(r"(<(?:script|style)\b[^>]*>.*?</(?:script|style)>)", html, flags=re.S | re.I)
    for i in range(0, len(parts), 2):
        chunk = parts[i]
        for bad, good in CTRL_FIXES:
            chunk = chunk.replace(bad, good)
        chunk = re.sub(r"\\\[(.*?)\\\]", lambda m: _convert_math_inner(m.group(1)), chunk, flags=re.S)
        chunk = re.sub(r"\$\$(.*?)\$\$", lambda m: _convert_math_inner(m.group(1)), chunk, flags=re.S)
        chunk = re.sub(r"\\\(([^)\n]{1,160})\\\)", lambda m: _convert_math_inner(m.group(1)), chunk)

        def _replace_dollar(m):
            inner = m.group(1)
            if re.search(r"</?[a-zA-Z]", inner):
                return m.group(0)
            if re.search(r"\\|[_^%]|[=<>±×·Δσλτμρηαβγθ]", inner) or re.fullmatch(r"[A-Za-z0-9_+\-]+", inner):
                return _convert_math_inner(inner)
            return m.group(0)

        chunk = LATEX_DOLLAR_RE.sub(_replace_dollar, chunk)
        # Convert any residual bare LaTeX commands (\frac, \sqrt, \dot, \text, \cdot, etc.) outside $...$
        if any(tok in chunk for tok in ("\\frac{", "\\sqrt{", "\\dot{", "\\text{", "\\cdot", "\\times", "\\approx", "\\pm", "\\Delta", "_{", "^{")):
            chunk = chunk.replace("{,}", ",")
            chunk = chunk.replace(r"\_", "_")
            for pat, rep in GREEK_AND_SYMBOLS:
                chunk = re.sub(pat, rep, chunk)
            for _ in range(5):
                chunk = re.sub(r"\\(?:text|mathrm|textit|mathcal)\{([^{}]*)\}", r"\1", chunk)
                chunk = re.sub(r"\\mathbf\{([^{}]*)\}", r"<strong>\1</strong>", chunk)
                chunk = re.sub(r"\\dot\{([^{}]*)\}", r"\1&#775;", chunk)
                chunk = re.sub(r"\\vec\{([^{}]*)\}", r"\1&#8407;", chunk)
                chunk = re.sub(r"_\{([^{}]+)\}", r"<sub>\1</sub>", chunk)
                chunk = re.sub(r"\^\{([^{}]+)\}", r"<sup>\1</sup>", chunk)
                chunk = re.sub(r"\\sqrt\{([^{}]*)\}", r"√(\1)", chunk)
                chunk = re.sub(r"\\frac\{([^{}]*)\}\{([^{}]*)\}", r"(\1)/(\2)", chunk)
        parts[i] = chunk
    return "".join(parts)


def visible_words(html):
    body = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", html, flags=re.S | re.I)
    return len(re.sub(r"<[^>]+>", " ", body).split())


def fix_dead_host(html):
    """smartfarm.inwoovation.com is a dead legacy host; also heal legacy broken internal tool links."""
    html = re.sub(r"https?://smartfarm\.inwoovation\.com/?", SITE + "smartfarm/", html)
    html = html.replace("smartfarm.inwoovation.com", "inwoovation.com/smartfarm")
    html = re.sub(r"https?://wiki\.inwoovation\.com/?", SITE + "wiki/", html)
    # Heal legacy internal tool links & protocol-relative scripts
    html = html.replace('href="/smartfarm/nutrient.html"', 'href="/tools/hydroponic-nutrient-solution-calculator.html"')
    html = html.replace('href="/tools/psychrometric-chart.html"', 'href="/tools/psychrometric-mollier-greenhouse-dehumidifier.html"')
    html = html.replace('src="//translate.google.com/translate_a/element.js', 'src="https://translate.google.com/translate_a/element.js')
    return html


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


def fix_adsense(html, rel_path):
    """Ensure every live content page (except 404.html) carries AdSense account meta & script."""
    if os.path.basename(rel_path) == "404.html" or not re.search(r"<head[^>]*>", html, re.I):
        return html
    if not re.search(r'name=["\']google-adsense-account["\']', html, re.I):
        html = re.sub(r"(<head[^>]*>)", lambda m: m.group(1) + ADSENSE_META_SNIPPET, html, count=1, flags=re.I)
    if "adsbygoogle.js" not in html:
        html = re.sub(r"(</head>)", lambda m: ADSENSE_SCRIPT_SNIPPET + "\n" + m.group(1), html, count=1, flags=re.I)
    return html


def _extract_title(html):
    m = re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S)
    if not m:
        return "Inwoovation Lab — Controlled Environment Agriculture Engineering"
    clean = re.sub(r"\s+", " ", html_lib.unescape(m.group(1))).strip()
    return clean.replace('"', "&quot;")


def _extract_meta_desc(html):
    m = re.search(r'<meta\s+[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\']', html, re.I)
    if not m:
        m = re.search(r'<meta\s+[^>]*content=["\']([^"\']*)["\'][^>]*name=["\']description["\']', html, re.I)
    if m and len(m.group(1).strip()) >= 30:
        return m.group(1).strip()
    title = _extract_title(html)
    body_p = re.search(r"<p[^>]*>(.*?)</p>", html, re.I | re.S)
    if body_p:
        p_txt = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html_lib.unescape(body_p.group(1)))).strip()
        if len(p_txt) >= 50:
            return p_txt[:152].replace('"', "&quot;").rstrip() + "..."
    return f"{title} — Quantitative thermodynamic models, crop steering parameters, and CEA systems engineering by Inwoovation Lab."[:155]


def fix_meta_description(html):
    """Ensure a non-empty <meta name="description" content="..."> is present in <head>."""
    if not re.search(r"</title>", html, re.I):
        return html
    desc = _extract_meta_desc(html)
    html = re.sub(
        r'<meta\s+[^>]*name=["\']description["\'][^>]*content=["\']\s*["\'][^>]*>',
        f'<meta name="description" content="{desc}">',
        html,
        flags=re.I,
    )
    html = re.sub(
        r'<meta\s+content=["\']([^"\']+)["\']\s+name=["\']description["\']\s*/?>',
        r'<meta name="description" content="\1">',
        html,
        flags=re.I,
    )
    if not re.search(r'<meta\s+[^>]*name=["\']description["\']', html, re.I):
        tag = f'\n    <meta name="description" content="{desc}">'
        html = re.sub(r"(</title>)", lambda m: m.group(1) + tag, html, count=1, flags=re.I)
    return html


def fix_opengraph(html, rel_path):
    """Ensure complete OpenGraph and Twitter Card metadata on every live page."""
    if not re.search(r"</head>", html, re.I):
        return html
    title = _extract_title(html)
    desc = _extract_meta_desc(html)
    url = self_url(rel_path)
    og_type = "article" if rel_path.startswith(("articles/", "wiki/", "crops/", "climate/", "benchmarks/")) else "website"

    html = re.sub(
        r'<meta\s+[^>]*property=["\']og:description["\'][^>]*content=["\']\s*["\'][^>]*>',
        f'<meta property="og:description" content="{desc}">',
        html,
        flags=re.I,
    )
    html = re.sub(
        r'<meta\s+[^>]*property=["\']og:image["\'][^>]*content=["\']\s*["\'][^>]*>',
        f'<meta property="og:image" content="{DEFAULT_OG_IMAGE}">',
        html,
        flags=re.I,
    )

    additions = []
    if not re.search(r'property=["\']og:type["\']', html, re.I):
        additions.append(f'    <meta property="og:type" content="{og_type}">')
    if not re.search(r'property=["\']og:title["\']', html, re.I):
        additions.append(f'    <meta property="og:title" content="{title}">')
    if not re.search(r'property=["\']og:description["\']', html, re.I):
        additions.append(f'    <meta property="og:description" content="{desc}">')
    if not re.search(r'property=["\']og:url["\']', html, re.I):
        additions.append(f'    <meta property="og:url" content="{url}">')
    if not re.search(r'property=["\']og:image["\']', html, re.I):
        additions.append(f'    <meta property="og:image" content="{DEFAULT_OG_IMAGE}">')
    if not re.search(r'name=["\']twitter:card["\']', html, re.I):
        additions.append('    <meta name="twitter:card" content="summary_large_image">')

    if additions:
        block = "\n" + "\n".join(additions) + "\n"
        html = re.sub(r"(</head>)", lambda m: block + m.group(1), html, count=1, flags=re.I)
    return html


def fix_img_alt(html):
    """Ensure every <img> tag has a non-empty alt attribute."""
    title = _extract_title(html).split("|")[0].strip() or "CEA Engineering Visual"
    html = re.sub(r'(<img\b[^>]*?)\balt=["\']\s*["\']', rf'\1alt="{title}"', html, flags=re.I)

    def _ensure_alt(match):
        tag = match.group(0)
        if re.search(r'\balt\s*=', tag, re.I):
            return tag
        return tag[:-1] + f' alt="{title}">'

    return re.sub(r"<img\b[^>]*>", _ensure_alt, html, flags=re.I)


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
            return tag.replace(url.group(1), DEFAULT_OG_IMAGE)
        return tag
    return SOCIAL_IMAGE_RE.sub(repair, html)


def fix_home_schema(html, rel_path):
    """Homepage ResearchOrganization: logo pointed at a non-existent file; sameAs listed own dead host."""
    if rel_path == "about.html":
        html = html.replace('<div class="stat-number">42</div>\r\n                    <div class="stat-label">Engineering Tools</div>',
                            '<div class="stat-number">330+</div>\r\n                    <div class="stat-label">Live Engineering Pages</div>')
        html = html.replace('<div class="stat-number">74</div>\r\n                    <div class="stat-label">Technical Articles</div>',
                            '<div class="stat-number">79</div>\r\n                    <div class="stat-label">Monographs (95 EN/DE/JA Editions)</div>')
        return html
    if rel_path != "index.html":
        return html
    html = html.replace('"logo": "https://inwoovation.com/cover.png"', '"logo": "https://inwoovation.com/og-cover.jpg"')
    return re.sub(r',\s*"sameAs":\s*\[[^\]]*\]', "", html, count=1)


def fix_embed_widgets(html, rel_path):
    """Raw iframe widgets in embed/ (except embed/index.html) must be noindex and must not load adsbygoogle.js."""
    if not rel_path.startswith("embed/") or os.path.basename(rel_path) == "index.html":
        return html
    html = re.sub(r'\s*<meta\s+name=["\']google-adsense-account["\'][^>]*>', "", html, flags=re.I)
    html = re.sub(r'\s*<script[^>]*adsbygoogle\.js[^>]*></script>', "", html, flags=re.I)
    if not re.search(r'name=["\']robots["\'][^>]*noindex', html, re.I):
        html = re.sub(r"(<head[^>]*>)", r'\1\n  <meta name="robots" content="noindex, nofollow">', html, count=1, flags=re.I)
    return html


TRUST_FOOTER_BAR = """    <div class="inw-trust-links" style="margin-top:16px; padding-top:14px; border-top:1px solid rgba(148,163,184,0.16); display:flex; justify-content:center; align-items:center; flex-wrap:wrap; gap:16px; font-size:0.84rem; color:#94a3b8;">
      <a href="/index.html" style="color:#94a3b8; text-decoration:none; font-weight:600;">Home</a>
      <a href="/about.html" style="color:#94a3b8; text-decoration:none; font-weight:600;">About Lab</a>
      <a href="/contact.html" style="color:#94a3b8; text-decoration:none; font-weight:600;">Contact</a>
      <a href="/privacy-policy.html" style="color:#94a3b8; text-decoration:none; font-weight:600;">Privacy Policy</a>
      <a href="/terms-of-service.html" style="color:#94a3b8; text-decoration:none; font-weight:600;">Terms of Service</a>
    </div>"""


def fix_trust_footer(html, rel_path):
    """Ensure every live content page contains crawlable links to About, Contact, Privacy Policy, and Terms of Service."""
    has_priv = bool(re.search(r'href=["\'][^"\']*?(?:privacy-policy\.html|privacy\.html|/privacy(?:["\'#?]|$))', html, re.I)) or ("privacy" in rel_path)
    has_terms = bool(re.search(r'href=["\'][^"\']*?(?:terms-of-service\.html|terms\.html|/terms(?:["\'#?]|$))', html, re.I)) or ("terms" in rel_path)
    has_about = bool(re.search(r'href=["\'][^"\']*?(?:about\.html|/about(?:["\'#?]|$))', html, re.I)) or ("about" in rel_path)
    has_contact = bool(re.search(r'href=["\'][^"\']*?(?:contact\.html|/contact(?:["\'#?]|$))', html, re.I)) or ("contact" in rel_path)
    if has_priv and has_terms and has_about and has_contact:
        return html
    if re.search(r"</footer>", html, re.I):
        return re.sub(r"(</footer>)", lambda m: TRUST_FOOTER_BAR + "\n  " + m.group(1), html, count=1, flags=re.I)
    if re.search(r"</body>", html, re.I):
        footer_wrap = f'\n  <footer style="max-width:1100px; margin:40px auto 24px; padding:0 20px; text-align:center;">\n{TRUST_FOOTER_BAR}\n  </footer>\n'
        return re.sub(r"(</body>)", lambda m: footer_wrap + m.group(1), html, count=1, flags=re.I)
    return html


def is_live(rel_path, html):
    if os.path.basename(rel_path) == "404.html":
        return False
    return not rel_path.startswith("embed/") and not re.search(r'http-equiv=["\']refresh', html, re.I)


def transform(rel_path, html):
    html = fix_dead_host(html)
    html = fix_html_math_and_escapes(html)
    html = fix_embed_widgets(html, rel_path)
    if not is_live(rel_path, html):
        return html
    html = fix_claims(html)
    html = fix_reading_time(html)
    html = fix_ga4(html)
    html = fix_adsense(html, rel_path)
    html = fix_meta_description(html)
    html = fix_canonical(html, rel_path)
    html = fix_canonical_self(html, rel_path)
    html = fix_opengraph(html, rel_path)
    html = fix_social_image(html)
    html = fix_img_alt(html)
    html = fix_trust_footer(html, rel_path)
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
