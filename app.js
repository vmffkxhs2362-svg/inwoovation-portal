/* 
   Inwoovation Lab Portal Logic (Unified Pure English)
   Author: vmffkxhs2362-svg
   Features: Unified Global English UI & State Management
*/

const i18n = {
    en: {
        heroTitle: "AgTech & Software Engineering Lab<br>for Next-Generation Agriculture",
        heroDesc: "Inwoovation Lab engineers lightweight, zero-latency biophysical crop models, symptom-based biosecurity diagnostics, and operational optimization toolkits. Committed to dependency-free, high-performance static architectures.",
        
        // Card 1: Smart Farm
        card1Title: "Smart Farm Engineering Lab",
        card1Desc: "Greenhouse microclimate analytics and physical simulator. Instantly calculate Vapor Pressure Deficit (VPD), nighttime greenhouse heat loss, and Penman-Monteith standard crop transpiration.",
        card1Badge: "AgTech Core",
        card1Action: "Enter Lab Website",

        // Card 2: Diagnosis & Bee Safety
        card2Title: "Greenhouse Diagnosis & Bee Safety",
        card2Desc: "3-step visual scouting decision-tree for greenhouse diseases. Instantly cross-references prescribed chemical treatments to calculate managed bumblebee/honeybee Re-entry Intervals (REI).",
        card2Badge: "Biosecurity",
        card2Action: "Launch Diagnostics",

        // Card 3: Vertical Farming
        card3Title: "Vertical Farming DLI Calculator",
        card3Desc: "Precision lighting design utility for indoor vertical farming. Calculate target PPFD and photoperiod combinations to optimize the Daily Light Integral (DLI) across crops.",
        card3Badge: "Lighting Control",
        card3Action: "Open DLI Calculator",

        // Card 4: Gumroad Shop
        card4Title: "Smart Farm Operator OS & Tools",
        card4Desc: "Professional Notion templates and engineering spreadsheet packages. Systematize commercial farm operations, sensor calibration schedules, and nutrient formulas via Gumroad.",
        card4Badge: "Premium Toolkit",
        card4Action: "Visit Gumroad Store",

        // Card 5: AgriAtlas Wiki
        card5Title: "AgriAtlas Global Wiki & Research",
        card5Desc: "An engineering-centric repository for Controlled Environment Agriculture. Access detailed climate steering, crop nutrition, doctoral research papers, and reference manual PDFs in one unified archive.",
        card5Badge: "Knowledge Archive",
        card5Action: "Enter Wiki Library",

        // Footer
        footerReserved: "© 2026 Inwoovation Lab. All rights reserved. | Privacy Policy | Terms of Service | About | Contact | Engineering Guides",
        footerTech: "Decoupled Serverless Infrastructure. Hosted on GitHub Pages with 0% runtime dependency."
    }
};

let currentLang = 'en';

function setLanguage(lang) {
    currentLang = 'en';
    localStorage.setItem('inwoovation_pref_lang', 'en');
    
    // Manage active state of buttons
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById('lang-en');
    if (btn) btn.classList.add('active');
    
    updateUI();
}

function updateUI() {
    const translation = i18n.en;
    
    // Update Hero
    const heroTitleEl = document.getElementById('hero-title');
    const heroDescEl = document.getElementById('hero-desc');
    if (heroTitleEl) heroTitleEl.innerHTML = translation.heroTitle;
    if (heroDescEl) heroDescEl.innerText = translation.heroDesc;
    
    // Update Card 1
    const c1 = document.getElementById('card-smartfarm');
    if (c1) c1.href = `https://smartfarm.inwoovation.com/?lang=en`;
    if (document.getElementById('c1-badge')) document.getElementById('c1-badge').innerText = translation.card1Badge;
    if (document.getElementById('c1-title')) document.getElementById('c1-title').innerText = translation.card1Title;
    if (document.getElementById('c1-desc')) document.getElementById('c1-desc').innerText = translation.card1Desc;
    if (document.getElementById('c1-action')) document.getElementById('c1-action').innerHTML = `${translation.card1Action} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

    // Update Card 2
    const c2 = document.getElementById('card-pollinator');
    if (c2) c2.href = `https://smartfarm.inwoovation.com/diagnosis.html?lang=en`;
    if (document.getElementById('c2-badge')) document.getElementById('c2-badge').innerText = translation.card2Badge;
    if (document.getElementById('c2-title')) document.getElementById('c2-title').innerText = translation.card2Title;
    if (document.getElementById('c2-desc')) document.getElementById('c2-desc').innerText = translation.card2Desc;
    if (document.getElementById('c2-action')) document.getElementById('c2-action').innerHTML = `${translation.card2Action} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

    // Update Card 3
    const c3 = document.getElementById('card-vertical');
    if (c3) c3.href = `https://smartfarm.inwoovation.com/vertical_dli.html?lang=en`;
    if (document.getElementById('c3-badge')) document.getElementById('c3-badge').innerText = translation.card3Badge;
    if (document.getElementById('c3-title')) document.getElementById('c3-title').innerText = translation.card3Title;
    if (document.getElementById('c3-desc')) document.getElementById('c3-desc').innerText = translation.card3Desc;
    if (document.getElementById('c3-action')) document.getElementById('c3-action').innerHTML = `${translation.card3Action} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

    // Update Card 4
    if (document.getElementById('c4-badge')) document.getElementById('c4-badge').innerText = translation.card4Badge;
    if (document.getElementById('c4-title')) document.getElementById('c4-title').innerText = translation.card4Title;
    if (document.getElementById('c4-desc')) document.getElementById('c4-desc').innerText = translation.card4Desc;
    if (document.getElementById('c4-action')) document.getElementById('c4-action').innerHTML = `${translation.card4Action} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

    // Update Card 5
    const c5 = document.getElementById('card-wiki');
    if (c5) c5.href = `https://wiki.inwoovation.com/?lang=en`;
    if (document.getElementById('c5-badge')) document.getElementById('c5-badge').innerText = translation.card5Badge;
    if (document.getElementById('c5-title')) document.getElementById('c5-title').innerText = translation.card5Title;
    if (document.getElementById('c5-desc')) document.getElementById('c5-desc').innerText = translation.card5Desc;
    if (document.getElementById('c5-action')) document.getElementById('c5-action').innerHTML = `${translation.card5Action} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

    // Update Footer
    if (document.getElementById('footer-reserved')) document.getElementById('footer-reserved').innerHTML = translation.footerReserved;
    if (document.getElementById('footer-tech')) document.getElementById('footer-tech').innerText = translation.footerTech;
}

// Initial Loading Logic
document.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem('inwoovation_pref_lang', 'en');
    setLanguage('en');
});
