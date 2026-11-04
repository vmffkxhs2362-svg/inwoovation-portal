# 🌐 INWOOVATION PORTAL (`inwoovation.com`) — DOMAIN AGENT RULES
> **Hierarchical Scope**: `Career/Inwoovation_Portal/**` (Automatically loaded by Antigravity v3.0 when operating on portal files)

## 1. Zero-PII Air-Gap & Security Rules
- **100% Public Repository Air-Gap**: Never expose personal financial figures, loan names, internal company passwords, employee IDs, or residential addresses inside `Career/Inwoovation_Portal/`.
- **Deterministic Pre-Push Verification**:
  1. `uv run python build_all.py` (includes `Engine/Scripts/daily_portal_auto_upgrader.py`)
  2. `uv run python Engine/Gates/verify_site_integrity.py` (`H1–H17` Hard Gates: 0 broken links, 0 raw LaTeX/control-char corruptions, 100% Air-Gap compliance)
  3. `uv run python Engine/Scripts/verify_e2e_calculators.py` (22 interactive engineering tools)
  4. Weekly Sunday Gate: `uv run python Engine/Scripts/verify_portal_e2e_weekly.py` (336+ pages in Headless Chromium PC `1440x900` & Mobile `390x844` viewports).

## 2. Daily 1% Compounding & Multilingual Parity (Rule 20)
- Every daily build runs `daily_portal_auto_upgrader.py` to inject interactive live widgets (`<!-- INW-LIVE-WIDGET-START -->`) and `FAQPage` JSON-LD rich snippets, logging progress in [`Engine/Data/PORTAL_EVOLUTION_LEDGER.md`](file:///g:/Meine%20Ablage/Antigravity/Headquater/Engine/Data/PORTAL_EVOLUTION_LEDGER.md).
- Maintain strict bidirectional `hreflang` (`en`, `de`, `ja`, `x-default`) and canonical tags across all translated technical guides.
