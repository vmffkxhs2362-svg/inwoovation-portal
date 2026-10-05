# 🛰️ [OPUS HANDOVER] inwoovation.com 결함 감사 보고서 및 내일(10/04) 오푸스 5.5 해결 로드맵

> **수신**: 사령관님 & 내일 복귀할 Claude Opus 5.5  
> **발신**: Gemini 3.8 Flash (HQ 하네스 에이전트)  
> **일시**: 2026-10-03 (2026-10-04 작전용)  
> **상태**: Phase A (긴급 결함 330건) 완수 ➔ Phase B & C (수익화 및 188개 페이지 심층화) 대기  

---

## 📌 1. 긴급 브리핑: 오늘(10/03) 해결된 작업 요약 (Phase A)

오늘 오푸스 5.5의 정밀 실측 감사(`scratch/deep_site_audit.py`, `site_audit_opus.md`)를 통해 총 **330건의 잠재적 결함**이 발굴되었으며, 제미나이 3.8이 이어받아 **하네스 게이트 구축 및 100% 무결성 조치 후 `origin/main` 배포까지 완료**했습니다.

### ✅ 해결 완료된 9대 하드 결함 (Hard Rules H1~H9: 330건 ➔ 0건)
1. **H1. 만료된 레거시 호스트(`smartfarm.inwoovation.com`) 링크 (53건 ➔ 0건)**:
   - SSL 만료(HTTP 526) 상태인 외부 서브도메인 링크를 `https://inwoovation.com/smartfarm/...` 내부 정규 경로로 전량 재작성.
2. **H2. 자체 연구/문서에 대한 비공인 'Peer-Reviewed' 표기 (22건 ➔ 0건)**:
   - 검색엔진 E-E-A-T 신뢰도를 훼손하는 자체 권위 과장 문구를 `Technical Note`, `Engineering Whitepaper`, `Open-Access`로 정직하게 개편. (외부 학술 논문 및 ASABE/DIN 표준 인용은 보존)
3. **H3. GA4 분석 태그(`G-V4RYJBMEDE`) 누락 (158건 ➔ 0건)**:
   - 추적이 누락되었던 158개 라이브 HTML 페이지 `<head>`에 GA4 공식 태그 주입 완료.
4. **H4. 사이트맵(`sitemap.xml`) ↔ 파일시스템 불일치 (5건 ➔ 0건)**:
   - 유령 URL 및 템플릿 제거, 실제 디스크 상의 316개 순수 라이브 페이지만 추적하는 동적 생성기(`consolidate_subdomains.py`) 정착.
5. **H5. JSON-LD 및 소셜 메타 이미지 404 (1건 ➔ 0건)**:
   - 존재하지 않는 `cover.png` 참조를 실제 613KB 자산인 `og-cover.jpg`로 전량 교체.
6. **H6. 단어 수 대비 비현실적 Reading Time 과장 (51건 ➔ 0건)**:
   - 본문 가시 단어 수(200 wpm 기준)에 맞춰 수학적 올림으로 엄격하게 재계산.
7. **H7. Canonical 태그 누락 (7건 ➔ 0건)**:
   - 누락 페이지 전량에 표준 정규화 태그 자동 주입.
8. **H8. 유입 링크가 전무한 고립 페이지(Orphan) (33건 ➔ 0건)**:
   - 40개 기후 분석 문서를 묶는 신규 아틀라스 허브([`climate/index.html`](file:///g:/Meine%20Ablage/Antigravity/Headquater/Career/Inwoovation_Portal/climate/index.html)) 신설.
   - `index.html`, `guides.html`, `wiki/index.html`, `smartfarm/index.html` 네비게이션에 벤치마크, 치유농업, 독일 지원금 가이드, 스마트팜 4종 도구를 상호 연결하여 고립 제로화.
9. **H9. Canonical 비표준 및 확장자 불일치 (19건 ➔ 0건)**:
   - 확장자 누락(`library_vpd_optimization_tomato`), 디렉토리 슬래시 누락 등을 사이트맵 공식 URL과 1:1 일치시킴.
10. **중복 페이지 해소 (`smartfarm/suite/index.html`)**:
    - `suite/index.html`과 99.8% 동일하면서 상대경로가 깨져 있던 76KB 중복 파일을 제거하고, 공식 `/suite/`로 향하는 301 Meta-Refresh 리다이렉트 스텁으로 교체.

### 🛡️ 영구 안착된 하네스 (Master Build Pipeline)
- **가짜 신선도(Fake Freshness) 영구 퇴출**: `build_all.py`가 날짜를 무조건 오늘로 덮어쓰던 문제를 제거하고, 본문 SHA-256 해시([`Engine/Data/portal_content_hashes.json`](file:///g:/Meine%20Ablage/Antigravity/Headquater/Engine/Data/portal_content_hashes.json))가 실제로 바뀐 페이지만 날짜를 갱신하도록 전면 개편.
- **Fail-Closed 무결성 게이트 등록**: [`Engine/Gates/verify_site_integrity.py`](file:///g:/Meine%20Ablage/Antigravity/Headquater/Engine/Gates/verify_site_integrity.py)가 빌드 필수 단계로 등록되어 결함 재발 시 푸시를 원천 차단.

---

## 🎯 2. 내일(10/04) 오푸스 5.5가 해결해야 할 핵심 잔여 과제

기초 인프라와 결함 수리는 완료되었으므로, 내일 오푸스는 **"웹사이트의 전문성·수익성·도구 신뢰성을 엔터프라이즈 급으로 격상시키는 심화 작업"**에 집중해야 합니다.

---

### 📋 과제 1: 188개 Thin Content (<400단어) 심층화 및 차별화 (Phase C)
- **현황**: 현재 316개 라이브 페이지 중 188개가 400단어 미만의 '얇은 콘텐츠'로 분류되어 애드센스 품질 평가 및 검색엔진 색인에서 저평가받을 위험이 있음.
- **오푸스 5.5 해결 방안**:
  1. **40개 기후 가이드 실측화**:
     - 현재 기후 페이지들은 요약 텍스트 위주임.
     - Antigravity에 내장된 **`nasa-power-agriclimatology` 스킬(NASA POWER API)**을 연동하여, 네덜란드 베스틀란트, 스페인 알메리아, 미국 투손, 한국 김제 등 40개 주요 온실 권역의 실제 월별 DLI(태양 복사량), 최저/최고 기온, 난방도일(HDD) 시계열 데이터와 SVG 차트를 주입 ➔ **독보적인 글로벌 농업기후 엔지니어링 리포트로 격상**.
  2. **단순 계산기 페이지 본문 강화**:
     - 입력 폼만 덩그러니 있는 계산기들에 ASABE EP406, DIN V 18599, Penman-Monteith 등 핵심 수식의 물리적 유도 과정, 엔지니어링 주의사항, 현장 해석 가이드를 보강하여 최소 800단어 이상의 학술급 도구로 고도화.

---

### 📋 과제 2: AdSense 광고 슬롯 정규화 및 CMP 동의 메시지 (Phase B)
- **현황**:
  - 96개 페이지에 `data-ad-slot="auto"`라는 비표준 슬롯 속성이 들어가 있어 광고 렌더링이 불안정함.
  - 유럽(EEA) 사용자 트래픽에 대한 법적 동의 관리(CMP) 팝업이 미적용 상태.
- **오푸스 5.5 해결 방안**:
  1. 사령관님의 전략에 따라 **"디스플레이 광고 단위 1~2개 생성 후 실제 숫자형 slot ID 주입"** vs **"모든 수동 광고 코드를 제거하고 구글 애드센스 자동 광고(Auto Ads) 전면 위임"** 중 최적의 방식을 결정하고 일괄 정리.
  2. 사령관님께 AdSense 콘솔에서 '개인정보 보호 및 메시지' ➔ 'GDPR 메시지' 활성화 링크 및 체크리스트 가이드 제공.

---

### 📋 과제 3: 생물물리 계산 커널(`biophysics_kernel.js`) 통합 및 버그 수정
- **현황**:
  - 사이트 내 41개 도구 중 단 1개만 `biophysics_kernel.js`를 참조하고 있으며, 15개 도구는 Tetens 수증기압 공식을 제각각 인라인으로 중복 구현 중.
  - 상대습도 RH=0% 입력 시 이슬점(Dew Point) 계산 공식에서 `Math.log(0)`이 발생하여 `NaN`이 반환되는 엣지 케이스 존재.
- **오푸스 5.5 해결 방안**:
  - `biophysics_kernel.js`의 `computeVPD()` 엣지 케이스 예외 처리(RH <= 0 clamp).
  - 인라인으로 Tetens 공식을 복붙해 둔 도구들을 단일 커널 모듈로 단계적 일원화.

---

### 📋 과제 4: Impressum(독일 법률 고지)과 Zero-PII 에어갭 조율
- **현황**: 독일 온실/원예 B2B 독자를 타깃으로 하는 독일어 문서(아티클 35편, DIN EN 13031-1 해설 등)가 다수 존재하나, 독일 텔레미디어법(TMG § 5)에 따른 Impressum이 없음.
- **오푸스 5.5 해결 방안**:
  - 사령관님의 절대 원칙인 **"개인정보 100% 에어갭 (Zero-PII)"**을 엄격히 준수하면서도, 독일 법적 요건을 우회하거나 가상 오피스/프로젝트 성격 명시로 법적 분쟁을 방지할 수 있는 최적의 면책 고지(Disclaimer) 문구 수립.

---

## 💡 3. 내일 사령관님께서 오푸스 5.5에게 주실 추천 프롬프트

내일 오푸스 5.5를 켜신 후 아래 프롬프트를 복사하여 그대로 입력하시면 즉시 정밀 작업을 재개할 수 있습니다:

```markdown
Feed/2026-10-04_SITE_DEFECTS_AND_OPUS_ROADMAP.md 파일을 정독해.
어제 330건의 결함은 제미나이가 수리하고 무결성 게이트를 안착시켜 놓았어.
이제 로드맵에 명시된 '과제 1: 188개 Thin Content 심층화'부터 본격적으로 시작하자.
우선 40개 기후 아틀라스(climate/*.html)에 nasa-power-agriclimatology 스킬을 사용해서 실제 권역별 태양 복사량 및 DLI 실측 데이터를 주입하는 계획을 수립하고 첫 번째 타깃부터 작업해줘.
```
