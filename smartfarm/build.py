import os
import glob
import re

def build_site():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    src_dir = os.path.join(base_dir, "src_pages")
    template_path = os.path.join(base_dir, "_template.html")

    if not os.path.exists(template_path):
        print(f"Error: Template not found at {template_path}")
        return
    if not os.path.exists(src_dir):
        print(f"Error: Source directory not found at {src_dir}")
        return

    with open(template_path, "r", encoding="utf-8") as f:
        template = f.read()

    built_urls = []
    files = glob.glob(os.path.join(src_dir, "*.html"))
    for f in files:
        filename = os.path.basename(f)
        with open(f, "r", encoding="utf-8") as fh:
            content = fh.read()

        # Parse frontmatter
        title = ""
        desc = ""
        keywords = ""
        active_tab = ""
        active_chip = ""

        extra_scripts = ""
        script_match = re.search(r'<!-- SCRIPTS_START -->(.*?)<!-- SCRIPTS_END -->', content, flags=re.DOTALL)
        if script_match:
            extra_scripts = script_match.group(1).strip()
            content = content.replace(script_match.group(0), '')

        # Remove comments and extract values
        lines = content.split('\n')
        body_lines = []
        for line in lines:
            if line.startswith('<!-- TITLE:'):
                title = line.replace('<!-- TITLE:', '').replace('-->', '').strip()
            elif line.startswith('<!-- DESC:'):
                desc = line.replace('<!-- DESC:', '').replace('-->', '').strip()
            elif line.startswith('<!-- KEYWORDS:'):
                keywords = line.replace('<!-- KEYWORDS:', '').replace('-->', '').strip()
            elif line.startswith('<!-- ACTIVE_TAB:'):
                active_tab = line.replace('<!-- ACTIVE_TAB:', '').replace('-->', '').strip()
            elif line.startswith('<!-- ACTIVE_CHIP:'):
                active_chip = line.replace('<!-- ACTIVE_CHIP:', '').replace('-->', '').strip()
            else:
                body_lines.append(line)
        
        body_html = '\n'.join(body_lines)

        url = "https://smartfarm.inwoovation.com/"
        if filename != "index.html":
            url += filename.replace('.html', '')

        # Inject into template
        out_html = template.replace('{{TITLE}}', title)
        out_html = out_html.replace('{{DESC}}', desc)
        out_html = out_html.replace('{{KEYWORDS}}', keywords)
        out_html = out_html.replace('{{BODY}}', body_html)
        out_html = out_html.replace('{{EXTRA_SCRIPTS}}', extra_scripts)
        out_html = out_html.replace('{{URL}}', url)
        
        import datetime
        last_updated = datetime.datetime.now().strftime("%B %d, %Y")
        out_html = out_html.replace('{{LAST_UPDATED}}', last_updated)

        # Set active classes
        if active_tab:
            # The template has: <a class="tab-btn" href="..." id="active_tab">
            # We want to replace `class="tab-btn"` with `class="tab-btn active"` for the specific ID
            pattern = r'(<a[^>]*class="tab-btn"[^>]*id="' + re.escape(active_tab) + r'"[^>]*>)'
            # If id comes before class:
            pattern2 = r'(<a[^>]*id="' + re.escape(active_tab) + r'"[^>]*class="tab-btn"[^>]*>)'
            
            def replacer_tab(match):
                return match.group(1).replace('class="tab-btn"', 'class="tab-btn active"')
            
            out_html, n = re.subn(pattern, replacer_tab, out_html)
            if n == 0:
                out_html, n = re.subn(pattern2, replacer_tab, out_html)

        if active_chip:
            pattern = r'(<button[^>]*class="chip"[^>]*id="' + re.escape(active_chip) + r'"[^>]*>)'
            pattern2 = r'(<button[^>]*id="' + re.escape(active_chip) + r'"[^>]*class="chip"[^>]*>)'
            
            def replacer_chip(match):
                return match.group(1).replace('class="chip"', 'class="chip active"')
            
            out_html, n = re.subn(pattern, replacer_chip, out_html)
            if n == 0:
                out_html, n = re.subn(pattern2, replacer_chip, out_html)

        # Write to root
        out_path = os.path.join(base_dir, filename)
        with open(out_path, "w", encoding="utf-8") as out_f:
            out_f.write(out_html)
        
        built_urls.append((url, "1.0" if filename == "index.html" else "0.8"))
        print(f"Built {filename}")

    # Generate sitemap.xml
    import datetime
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    sitemap_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]
    
    # Add built pages
    for url, priority in built_urls:
        sitemap_lines.append('  <url>')
        sitemap_lines.append(f'    <loc>{url}</loc>')
        sitemap_lines.append(f'    <lastmod>{today}</lastmod>')
        sitemap_lines.append('    <changefreq>monthly</changefreq>')
        sitemap_lines.append(f'    <priority>{priority}</priority>')
        sitemap_lines.append('  </url>')
        
    # Add extra static pages in root if they exist
    extra_pages = [('greenpocket', '0.8'), ('privacy', '0.3')]
    for page, priority in extra_pages:
        if os.path.exists(os.path.join(base_dir, f"{page}.html")):
            sitemap_lines.append('  <url>')
            sitemap_lines.append(f'    <loc>https://smartfarm.inwoovation.com/{page}</loc>')
            sitemap_lines.append(f'    <lastmod>{today}</lastmod>')
            sitemap_lines.append('    <changefreq>monthly</changefreq>')
            sitemap_lines.append(f'    <priority>{priority}</priority>')
            sitemap_lines.append('  </url>')

    sitemap_lines.append('</urlset>')
    
    with open(os.path.join(base_dir, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write('\n'.join(sitemap_lines))
    print("Generated sitemap.xml")

if __name__ == "__main__":
    build_site()
