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
        <div class="print-page" style="font-family:'Plus Jakarta Sans',sans-serif; color:#0f172a; padding:40px; max-width:800px; margin:0 auto; background:#ffffff;">
            <!-- Header -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #10b981; padding-bottom:16px; margin-bottom:24px;">
                <div>
                    <div style="font-size:1.4rem; font-weight:800; color:#0f172a; letter-spacing:-0.02em;">INWOOVATION LAB</div>
                    <div style="font-size:0.8rem; color:#64748b; font-weight:600;">Controlled Environment Agriculture R&D • Open-Source Engineering</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:0.75rem; font-weight:700; color:#10b981; background:#ecfdf5; border:1px solid #a7f3d0; padding:4px 8px; border-radius:6px; display:inline-block;">OFFICIAL AUDIT REPORT</div>
                    <div style="font-size:0.75rem; color:#94a3b8; margin-top:4px;">Date: ${todayStr}</div>
                </div>
            </div>

            <!-- Title -->
            <div style="margin-bottom:20px;">
                <h1 style="font-size:1.6rem; font-weight:800; color:#0f172a; margin:0 0 6px 0;">${reportTitle}</h1>
                <p style="font-size:0.85rem; color:#475569; margin:0; line-height:1.5;">Biophysical thermodynamic calculation summary generated autonomously via Inwoovation Lab open-access engineering engines (inwoovation.com).</p>
            </div>

            <!-- Key Results KPI Grid -->
            <div style="margin-bottom:24px;">
                <h2 style="font-size:1rem; font-weight:700; color:#0f172a; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1px solid #e2e8f0; padding-bottom:6px; margin-bottom:12px;">1. Executive Calculation Results</h2>
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px;">
                    ${kpiRows}
                </div>
            </div>

            <!-- Input Parameters Table -->
            <div style="margin-bottom:24px;">
                <h2 style="font-size:1rem; font-weight:700; color:#0f172a; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1px solid #e2e8f0; padding-bottom:6px; margin-bottom:12px;">2. Baseline Simulation Inputs</h2>
                <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
                    <tbody>
                        ${inputRows}
                    </tbody>
                </table>
            </div>

            <!-- Recommendations & Standards -->
            <div style="margin-bottom:24px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:16px;">
                <h2 style="font-size:0.95rem; font-weight:700; color:#166534; margin:0 0 6px 0;">3. Engineering Assessment & Standards Compliance</h2>
                <p style="font-size:0.85rem; color:#15803d; line-height:1.6; margin:0;">${recommendationText}</p>
            </div>

            
            <!-- 4. Legal & Engineering Disclaimer -->
            <div style="margin-bottom:16px; padding:10px 14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; font-size:0.68rem; color:#64748b; line-height:1.4;">
                <strong>⚖️ Engineering & Agronomic Disclaimer:</strong> This automated audit report is generated for preliminary estimation, educational, and research modeling purposes. Calculations are derived from standard biophysical models (ASABE, DIN V 18599, FAO-56). Commercial execution, structural sizing, and chemical/biological applications must be verified by licensed Professional Engineers (PE) and certified local crop consultants. Inwoovation Lab assumes no liability for commercial outcomes or equipment performance.
            </div>

            <!-- Footer & Disclaimers -->
            <div style="border-top:1px solid #e2e8f0; padding-top:12px; margin-top:30px; display:flex; justify-content:space-between; font-size:0.7rem; color:#94a3b8;">
                <div>Verified by Inwoovation Lab Automated Biophysical Kernel v2026.9</div>
                <div>Document ID: INW-${Math.random().toString(36).substring(2, 9).toUpperCase()} • Public Access</div>
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
                body * { visibility: hidden; }
                #institutional-print-container, #institutional-print-container * { visibility: visible; }
                #institutional-print-container {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    display: block !important;
                }
                @page {
                    size: A4 portrait;
                    margin: 15mm;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Trigger Print
    window.print();
}
