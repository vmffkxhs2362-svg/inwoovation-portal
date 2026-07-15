/* 
   Inwoovation Lab Portal Logic
   Author: vmffkxhs2362-svg
   Features: Dynamic I18n translation & Client-side state persistence
*/

const i18n = {
    ko: {
        heroTitle: "미래형 비즈니스를 위한<br>AgTech & 소프트웨어 엔지니어링 랩",
        heroDesc: "이노베이션 랩(Inwoovation Lab)은 정밀 원예 공학 모델, 자가진단 시스템, 그리고 운영 자동화 디지털 도구를 전문적으로 엔지니어링합니다. 가벼우며 의존성 없는 고성능 정적 웹 기술을 지향합니다.",
        
        // Card 1: Smart Farm
        card1Title: "스마트팜 엔지니어링 랩",
        card1Desc: "시설하우스 재배 환경 진단 및 정밀 물리학적 시뮬레이터. VPD(포화수증기압차), 온실 야간 열손실, Penman-Monteith 표준 작물 증산량 등 영농 핵심 모델을 즉각 연산합니다.",
        card1Badge: "AgTech 코어",
        card1Action: "연구소 입장하기",

        // Card 2: Diagnosis & Bee Safety
        card2Title: "병해충 자가진단 & 수분벌 안전 포털",
        card2Desc: "3단계 예찰을 통해 주요 온실 질병을 즉시 진단하고 적정 방제 약제를 처방합니다. 살포된 약제의 화분매개벌 안전 대기 시간(REI) 및 온실 온도별 방사 활동성을 예측 시뮬레이션합니다.",
        card2Badge: "생태 진단",
        card2Action: "자가진단 툴킷 실행",

        // Card 3: Vertical Farming
        card3Title: "수직농업 DLI 광량 계산기",
        card3Desc: "완전 밀폐형 수직농장(식물공장)의 광환경 정밀 설계 도구. 목표 Daily Light Integral(DLI)을 충족하기 위한 광합성 유효 광양자속 밀도(PPFD)와 최적 광주기(Photoperiod)를 연산합니다.",
        card3Badge: "인공광 제어",
        card3Action: "DLI 계산기 실행",

        // Card 4: Gumroad Shop
        card4Title: "스마트팜 운영 OS & 엑셀 패키지",
        card4Desc: "상업용 하우스 운영을 자동화하기 위한 노션(Notion) 통합 관리 템플릿과 정밀 양액 처방 배합법, 센서 보정 일지 엑셀 툴킷을 Gumroad 스토어에서 공식 제공합니다.",
        card4Badge: "프리미엄 템플릿",
        card4Action: "스토어 둘러보기",

        // Card 5: AgriAtlas Wiki
        card5Title: "AgriAtlas 글로벌 위키",
        card5Desc: "전 세계 스마트팜 정밀 공학 가이드북 및 작물별 생식/영양생장 조향 데이터 허브. 국내외 공인 규격 레퍼런스 PDF 자료를 직관적으로 열람할 수 있는 통합 지식 도서관입니다.",
        card5Badge: "지식 아카이브",
        card5Action: "위키 라이브러리 입장",

        // Footer
        footerReserved: "© 2026 Inwoovation Lab. All rights reserved. | 이노베이션 연구소",
        footerTech: "Decoupled Serverless Infrastructure. Hosted on GitHub Pages with 0% runtime dependency."
    },
    en: {
        heroTitle: "AgTech & Software Engineering Lab<br>for Next-Generation Businesses",
        heroDesc: "Inwoovation Lab engineers lightweight, zero-latency physical crop models, symptom-based biosecurity diagnostics, and operational optimization toolkits. Committed to dependency-free, high-performance static architectures.",
        
        // Card 1: Smart Farm
        card1Title: "Smart Farm Engineering Lab",
        card1Desc: "Greenhouse microclimate analytics and physical simulator. Instantly calculate Vapor Pressure Deficit (VPD), nighttime greenhouse heat loss, and Penman-Monteith standard crop transpiration.",
        card1Badge: "AgTech Core",
        card1Action: "Enter Lab Website",

        // Card 2: Diagnosis & Bee Safety
        card2Title: "Greenhouse Diagnosis & Bee Safety",
        card2Desc: "3-step visual scouting decision-tree for greenhouse diseases. Instantly cross-references prescribed chemical treatments to calculate managed bumblebee/honeybee Re-entry Intervals (REI).",
        card2Badge: "Ecology Portal",
        card2Action: "Launch Diagnostics",

        // Card 3: Vertical Farming
        card3Title: "Vertical Farming DLI Calculator",
        card3Desc: "Precision lighting design utility for indoor vertical farming. Calculate target PPFD and photoperiod combinations to optimize the Daily Light Integral (DLI) across crops.",
        card3Badge: "Artificial Light",
        card3Action: "Open DLI Calculator",

        // Card 4: Gumroad Shop
        card4Title: "Smart Farm Operator OS & Tools",
        card4Desc: "Professional Notion templates and engineering spreadsheet packages. Systematize commercial farm operations, sensor calibration schedules, and nutrient formulas via Gumroad.",
        card4Badge: "Premium Store",
        card4Action: "Visit Gumroad Store",

        // Card 5: AgriAtlas Wiki
        card5Title: "AgriAtlas Global Wiki",
        card5Desc: "An engineering-centric repository for Controlled Environment Agriculture. Access detailed climate steering, crop nutrition, and reference manual PDFs in one unified archive.",
        card5Badge: "Knowledge Base",
        card5Action: "Enter Wiki Library",

        // Footer
        footerReserved: "© 2026 Inwoovation Lab. All rights reserved.",
        footerTech: "Decoupled Serverless Infrastructure. Hosted on GitHub Pages with 0% runtime dependency."
    }
};

let currentLang = 'ko';

function setLanguage(lang) {
    if (lang !== 'ko' && lang !== 'en') lang = 'ko';
    currentLang = lang;
    localStorage.setItem('inwoovation_pref_lang', lang);
    
    // Manage active state of buttons
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');
    
    updateUI();
}

function updateUI() {
    const translation = i18n[currentLang];
    
    // Update Hero
    document.getElementById('hero-title').innerHTML = translation.heroTitle;
    document.getElementById('hero-desc').innerText = translation.heroDesc;
    
    // Update Card 1
    document.getElementById('card-smartfarm').href = `https://smartfarm.inwoovation.com/?lang=${currentLang}`;
    document.getElementById('c1-badge').innerText = translation.card1Badge;
    document.getElementById('c1-title').innerText = translation.card1Title;
    document.getElementById('c1-desc').innerText = translation.card1Desc;
    document.getElementById('c1-action').innerHTML = `${translation.card1Action} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

    // Update Card 2
    document.getElementById('card-pollinator').href = `https://smartfarm.inwoovation.com/?tab=pollinator&lang=${currentLang}`;
    document.getElementById('c2-badge').innerText = translation.card2Badge;
    document.getElementById('c2-title').innerText = translation.card2Title;
    document.getElementById('c2-desc').innerText = translation.card2Desc;
    document.getElementById('c2-action').innerHTML = `${translation.card2Action} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

    // Update Card 3
    document.getElementById('card-vertical').href = `https://smartfarm.inwoovation.com/?tab=vertical&lang=${currentLang}`;
    document.getElementById('c3-badge').innerText = translation.card3Badge;
    document.getElementById('c3-title').innerText = translation.card3Title;
    document.getElementById('c3-desc').innerText = translation.card3Desc;
    document.getElementById('c3-action').innerHTML = `${translation.card3Action} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

    // Update Card 4
    document.getElementById('c4-badge').innerText = translation.card4Badge;
    document.getElementById('c4-title').innerText = translation.card4Title;
    document.getElementById('c4-desc').innerText = translation.card4Desc;
    document.getElementById('c4-action').innerHTML = `${translation.card4Action} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

    // Update Card 5
    document.getElementById('card-wiki').href = `https://wiki.inwoovation.com/?lang=${currentLang}`;
    document.getElementById('c5-badge').innerText = translation.card5Badge;
    document.getElementById('c5-title').innerText = translation.card5Title;
    document.getElementById('c5-desc').innerText = translation.card5Desc;
    document.getElementById('c5-action').innerHTML = `${translation.card5Action} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

    // Update Footer
    document.getElementById('footer-reserved').innerText = translation.footerReserved;
    document.getElementById('footer-tech').innerText = translation.footerTech;
}

// Initial Loading Logic
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('inwoovation_pref_lang');
    if (savedLang) {
        setLanguage(savedLang);
    } else {
        // Auto-detect browser locale
        const userLocale = navigator.language || navigator.userLanguage;
        if (userLocale.startsWith('ko')) {
            setLanguage('ko');
        } else {
            setLanguage('en');
        }
    }
});
