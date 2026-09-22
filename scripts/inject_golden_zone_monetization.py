"""
Idempotent Batch Injection Engine for Golden-Zone AdSense Units & Dossier Export
Author: Inwoovation Lab (inwoovation.com)
"""

import os
import re
import glob

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PORTAL_DIR = os.path.dirname(SCRIPT_DIR)
TOOLS_DIR = os.path.join(PORTAL_DIR, "tools")

ADSENSE_CLIENT = "ca-pub-8597809158257497"

ADSENSE_META = f'  <meta name="google-adsense-account" content="{ADSENSE_CLIENT}">'
ADSENSE_HEAD_SCRIPT = f'  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={ADSENSE_CLIENT}" crossorigin="anonymous"></script>'

DOSSIER_SCRIPT_TAG = '  <script src="js/inwoovation_dossier_engine.js"></script>'

GOLDEN_ZONE_HTML = f"""
    <!-- High-RPM Native Golden-Zone AdSense Unit (Option C) -->
    <div class="inw-ad-container inw-golden-zone">
      <div class="inw-ad-label">Sponsored / Commercial Intelligence</div>
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="{ADSENSE_CLIENT}"
           data-ad-slot="auto"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>
        try {{
          (adsbygoogle = window.adsbygoogle || []).push({{}});
        }} catch (e) {{}}
      </script>
    </div>
"""

DOSSIER_BTN_HTML = """
    <!-- Bank-Ready Feasibility Dossier PDF Export (Option A) -->
    <div style="text-align:center; margin: 20px auto 28px auto;">
      <button type="button" class="btn-export-dossier" onclick="InwDossierEngine.openDossierModal()" style="background:linear-gradient(135deg, #0284c7, #0369a1); color:#fff; border:1px solid rgba(255,255,255,0.2); padding:11px 22px; border-radius:10px; font-weight:700; font-size:0.92rem; cursor:pointer; display:inline-flex; align-items:center; gap:8px; box-shadow:0 4px 12px rgba(2,132,199,0.35); transition:all 0.2s ease;">
        <span>📄</span>
        <span>Export Bank-Ready Feasibility Dossier (PDF)</span>
      </button>
    </div>
"""

def process_tools():
    tool_files = glob.glob(os.path.join(TOOLS_DIR, "*.html"))
    updated_count = 0
    skipped_count = 0

    print(f"🔍 Inspecting {len(tool_files)} tool files in {TOOLS_DIR}...")

    for fpath in tool_files:
        fname = os.path.basename(fpath)
        if fname == "index.html":
            continue

        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()

        modified = False

        # 1. Check AdSense in <head>
        if ADSENSE_CLIENT not in content:
            # Insert meta & script into <head>
            if "</head>" in content:
                replacement = f"{ADSENSE_META}\n{ADSENSE_HEAD_SCRIPT}\n</head>"
                content = content.replace("</head>", replacement, 1)
                modified = True
        else:
            if "adsbygoogle.js" not in content and "</head>" in content:
                content = content.replace("</head>", f"{ADSENSE_HEAD_SCRIPT}\n</head>", 1)
                modified = True

        # 2. Check Dossier Engine Script
        if "inwoovation_dossier_engine.js" not in content:
            if "</body>" in content:
                content = content.replace("</body>", f"{DOSSIER_SCRIPT_TAG}\n</body>", 1)
                modified = True

        # 3. Check Golden Zone Ad Unit
        if "inw-golden-zone" not in content:
            injection = ""
            
            # Add export button if no other export PDF button is present
            if "export" not in content.lower() and "auditpdf" not in content.lower() and "dossier" not in content.lower():
                injection += DOSSIER_BTN_HTML
            
            injection += GOLDEN_ZONE_HTML

            # Find injection anchor
            if "<!-- START: INJECTED EDITORIAL" in content:
                content = content.replace("<!-- START: INJECTED EDITORIAL", f"{injection}\n    <!-- START: INJECTED EDITORIAL", 1)
                modified = True
            elif '<div class="tool-editorial-wrapper">' in content:
                content = content.replace('<div class="tool-editorial-wrapper">', f"{injection}\n    <div class=\"tool-editorial-wrapper\">", 1)
                modified = True
            elif '<section class="editorial-card">' in content:
                content = content.replace('<section class="editorial-card">', f"{injection}\n    <section class=\"editorial-card\">", 1)
                modified = True
            elif "</main>" in content:
                content = content.replace("</main>", f"{injection}\n</main>", 1)
                modified = True
            elif "</body>" in content:
                content = content.replace("</body>", f"{injection}\n</body>", 1)
                modified = True

        if modified:
            with open(fpath, "w", encoding="utf-8", newline="\n") as f:
                f.write(content)
            updated_count += 1
            print(f"  ✅ Patched: {fname}")
        else:
            skipped_count += 1

    print(f"\n🎉 SUMMARY: {updated_count} files updated, {skipped_count} files verified clean/already configured.")

if __name__ == "__main__":
    process_tools()
