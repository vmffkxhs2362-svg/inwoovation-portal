/**
 * Universal Client-Side Engineering Audit Report Generator
 * Generates an institutional-grade A4 printable PDF report directly in the browser
 * 100% Client-Side • 0 Server Cost • Zero Personal Maintenance
 */

function generateInstitutionalPDF(reportTitle, kpiData, inputSummary, recommendationText) {
    // Create print container if not exists
    let printContainer = document.getElementById('institutional-print-container');
    if (!printContainer) {
        printContainer = document.createElement('div');
        printContainer.id = 'institutional-print-container';
        document.body.appendChild(printContainer);
    }

    const todayStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    let kpiRows = '';
    kpiData.forEach(item => {
        kpiRows += `
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:12px; text-align:center;">
                <div style="font-size:1.5rem; font-weight:800; color:#0f766e;">${item.value}</div>
                <div style="font-size:0.8rem; font-weight:700; color:#475569; text-transform:uppercase; margin-top:2px;">${item.label}</div>
                <div style="font-size:0.7rem; color:#64748b;">${item.unit || ''}</div>
            </div>
        `;
    });

    let inputRows = '';
    inputSummary.forEach(item => {
        inputRows += `
            <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:8px 12px; font-weight:600; color:#334155;">${item.label}</td>
                <td style="padding:8px 12px; text-align:right; font-family:monospace; color:#0f172a;">${item.value}</td>
            </tr>
        `;
    });

    printContainer.innerHTML = `
        <div class="print-page" style="font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#0f172a; padding:24px 32px; max-width:820px; margin:0 auto; background:#ffffff; box-sizing:border-box;">
            <!-- Header -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:3px solid #10b981; padding-bottom:14px; margin-bottom:18px;">
                <div>
                    <div style="font-size:1.5rem; font-weight:800; color:#0f172a; letter-spacing:-0.02em; display:flex; align-items:center; gap:8px;">
                        <span>INWOOVATION LAB</span>
                        <span style="font-size:0.75rem; background:#0f172a; color:#38bdf8; font-family:monospace; padding:2px 8px; border-radius:4px; font-weight:600;">CEA R&D</span>
                    </div>
                    <div style="font-size:0.78rem; color:#475569; font-weight:600; margin-top:2px;">Controlled Environment Agriculture Engineering • Open-Source Thermodynamic Kernel</div>
                    <div style="font-size:0.72rem; color:#64748b;">Official Reference: inwoovation.com • Knoblauchsland Horticultural Research Hub</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:0.75rem; font-weight:800; color:#047857; background:#ecfdf5; border:1px solid #6ee7b7; padding:4px 10px; border-radius:6px; display:inline-block; letter-spacing:0.04em;">
                        OFFICIAL AUDIT REPORT
                    </div>
                    <div style="font-size:0.72rem; color:#64748b; margin-top:4px;">Date: <strong>${todayStr}</strong></div>
                    <div style="font-size:0.68rem; color:#94a3b8; font-family:monospace;">STAMP: DIN V 18599 / ISO 20480-1</div>
                </div>
            </div>

            <!-- Title & Scope -->
            <div style="margin-bottom:16px;">
                <h1 style="font-size:1.45rem; font-weight:800; color:#0f172a; margin:0 0 4px 0; letter-spacing:-0.01em;">${reportTitle}</h1>
                <p style="font-size:0.8rem; color:#475569; margin:0; line-height:1.45;">Deterministic biophysical simulation audit computed client-side with zero data persistence. Calibrated against ASABE, DIN V 18599, and Wageningen UR peer-reviewed thermodynamic standards.</p>
            </div>

            <!-- Key Results KPI Grid -->
            <div style="margin-bottom:18px;">
                <div style="font-size:0.85rem; font-weight:800; color:#0f172a; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1px solid #cbd5e1; padding-bottom:4px; margin-bottom:10px;">
                    1. Executive KPI Telemetry
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:10px;">
                    ${kpiRows}
                </div>
            </div>

            <!-- Input Parameters Table -->
            <div style="margin-bottom:18px;">
                <div style="font-size:0.85rem; font-weight:800; color:#0f172a; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1px solid #cbd5e1; padding-bottom:4px; margin-bottom:8px;">
                    2. Baseline Operational Inputs
                </div>
                <table style="width:100%; border-collapse:collapse; font-size:0.8rem;">
                    <tbody>
                        ${inputRows}
                    </tbody>
                </table>
            </div>

            <!-- Recommendations & Standards -->
            <div style="margin-bottom:16px; background:#f0fdf4; border:1px solid #86efac; border-radius:8px; padding:12px 14px;">
                <div style="font-size:0.85rem; font-weight:800; color:#166534; margin:0 0 4px 0; display:flex; align-items:center; gap:6px;">
                    <span>📋</span>
                    <span>3. Engineering Interpretation & Operational Recommendations</span>
                </div>
                <p style="font-size:0.78rem; color:#14532d; line-height:1.55; margin:0;">${recommendationText}</p>
            </div>

            <!-- Pro Commercial Package Upsell Banner -->
            <div style="margin-bottom:14px; padding:10px 14px; background:linear-gradient(90deg, #f0fdf4, #ecfeff); border:1.5px solid #10b981; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <div style="font-size:0.8rem; font-weight:800; color:#065f46;">💼 Commercial Underwriting &amp; Bank Loan Package ($29 Pro / $49 Commercial)</div>
                    <div style="font-size:0.7rem; color:#047857; margin-top:2px;">Includes 10-Year Discounted Cash Flow (DCF), USDA REAP/EQIP grant worksheets, and utility rate sensitivity matrix.</div>
                </div>
                <div style="text-align:right;">
                    <a href="https://inwoovation.com/contact.html?subject=Request_Commercial_Feasibility_Package" target="_blank" style="text-decoration:none; font-size:0.72rem; font-weight:700; color:#0f766e; font-family:monospace; background:#ffffff; padding:4px 8px; border:1px solid #10b981; border-radius:4px; display:inline-block;">inwoovation.com/contact.html</a>
                </div>
            </div>

            <!-- Legal & Engineering Disclaimer -->
            <div style="margin-bottom:14px; padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; font-size:0.65rem; color:#64748b; line-height:1.4;">
                <strong>⚖️ Engineering &amp; Agronomic Disclaimer:</strong> This automated audit report is generated for preliminary estimation, educational modeling, and facility feasibility assessment. Calculations follow standard biophysical formulations (ASABE, DIN V 18599, FAO-56). Commercial execution, structural sizing, and chemical/biological dosing must be reviewed by licensed Professional Engineers (PE) and certified crop consultants. Inwoovation Lab assumes no liability for operational performance.
            </div>

            <!-- Footer & Disclaimers -->
            <div style="border-top:1px solid #e2e8f0; padding-top:8px; margin-top:14px; display:flex; justify-content:space-between; align-items:center; font-size:0.68rem; color:#94a3b8;">
                <div>Verified by Inwoovation Lab Automated Biophysical Kernel v2026.9</div>
                <div style="font-family:monospace; font-weight:700; color:#0f766e;">DOC-ID: INW-${Math.random().toString(36).substring(2, 9).toUpperCase()} • 100% Client-Side</div>
                <div>https://inwoovation.com</div>
            </div>
        </div>
    `;

    // Print CSS styles injection
    if (!document.getElementById('institutional-print-css')) {
        const style = document.createElement('style');
        style.id = 'institutional-print-css';
        style.innerHTML = `
            @media screen {
                #institutional-print-container { display: none; }
            }
            @media print {
                body * { visibility: hidden !important; }
                #institutional-print-container, #institutional-print-container * { visibility: visible !important; }
                #institutional-print-container {
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100% !important;
                    display: block !important;
                }
                .print-page {
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                }
                @page {
                    size: A4 portrait;
                    margin: 10mm 12mm;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Trigger Print
    window.print();
}

