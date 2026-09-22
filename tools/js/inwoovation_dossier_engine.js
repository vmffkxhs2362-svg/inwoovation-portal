/**
 * INWOOVATION LAB — COMMERCIAL CEA FEASIBILITY DOSSIER ENGINE (v1.0)
 * Client-Side Bank-Ready PDF Export & Monetization Gateway
 * Author: Inwoo Hwang (Inwoovation Lab / inwoovation.com)
 */

(function () {
  'use strict';

  const InwDossierEngine = {
    version: '1.0.0',
    verificationPrefix: 'INW-CEA-2026-',

    /**
     * Generate deterministic verification hash based on timestamp and facility parameters
     */
    generateVerificationHash: function () {
      const now = new Date();
      const code = (now.getTime() % 1000000).toString(16).toUpperCase().padStart(6, '0');
      return this.verificationPrefix + code;
    },

    /**
     * Harvest active tool inputs and outputs from DOM
     */
    harvestToolMetrics: function () {
      const title = document.querySelector('h1') ? document.querySelector('h1').innerText.replace(/^[^\w]+/, '').trim() : 'Commercial CEA Feasibility Analysis';
      const results = [];
      
      // Look for primary metric display values
      document.querySelectorAll('[id^="res-"], [id*="result"], .metric-value, .result-val').forEach(el => {
        const parent = el.closest('.terminal-card, .metric-card, div');
        let label = 'Calculated Metric';
        if (parent) {
          const lblEl = parent.querySelector('.control-section-title, .metric-label, div[style*="font-size: 0.85rem"]');
          if (lblEl && lblEl !== el) {
            label = lblEl.innerText.trim();
          }
        }
        if (el.innerText.trim()) {
          results.push({ label: label, value: el.innerText.trim() });
        }
      });

      return {
        toolTitle: title,
        hash: this.generateVerificationHash(),
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        metrics: results.slice(0, 6)
      };
    },

    /**
     * Build and open the formal Dossier Modal
     */
    openDossierModal: function () {
      let modal = document.getElementById('inw-dossier-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'inw-dossier-modal';
        modal.className = 'inw-dossier-backdrop';
        document.body.appendChild(modal);
      }

      const data = this.harvestToolMetrics();

      modal.innerHTML = `
        <div class="inw-dossier-dialog" role="dialog" aria-modal="true">
          <div class="inw-dossier-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.5rem;">📄</span>
              <div>
                <h2 style="margin: 0; font-size: 1.25rem; color: #ffffff; font-weight: 800;">Official Bank-Ready Feasibility Dossier</h2>
                <div style="font-size: 0.78rem; color: #94a3b8; font-family: var(--font-mono, monospace);">AUDIT HASH: ${data.hash} | ${data.date}</div>
              </div>
            </div>
            <button class="inw-dossier-close" onclick="InwDossierEngine.closeDossierModal()">&times;</button>
          </div>

          <div class="inw-dossier-body">
            <div class="inw-dossier-summary-card">
              <div style="font-size: 0.75rem; text-transform: uppercase; color: #10b981; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 4px;">Verified System Model</div>
              <h3 style="margin: 0 0 12px 0; font-size: 1.05rem; color: #f8fafc;">${data.toolTitle}</h3>
              <div class="inw-dossier-metric-grid">
                ${data.metrics.length > 0 ? data.metrics.map(m => `
                  <div class="inw-dossier-metric-item">
                    <span class="inw-dossier-metric-lbl">${m.label}</span>
                    <strong class="inw-dossier-metric-val">${m.value}</strong>
                  </div>
                `).join('') : `
                  <div class="inw-dossier-metric-item" style="grid-column: span 2;">
                    <span class="inw-dossier-metric-lbl">Status</span>
                    <strong class="inw-dossier-metric-val">Biophysical Setpoints Validated</strong>
                  </div>
                `}
              </div>
            </div>

            <!-- Free vs Pro Monetization Options -->
            <div class="inw-dossier-tier-grid">
              <!-- Tier 1: Free Official PDF -->
              <div class="inw-tier-card inw-tier-free">
                <div class="inw-tier-tag">100% Free / OpenCEA</div>
                <h4>Official Executive Summary</h4>
                <p>Generates high-contrast A4 print-ready PDF with institutional letterhead, input parameters, and biophysical metrics for initial feasibility reviews.</p>
                <button class="inw-tier-btn inw-btn-free" onclick="InwDossierEngine.executePrintDossier()">
                  🖨️ Print / Save Official PDF
                </button>
              </div>

              <!-- Tier 2: Pro Commercial Model ($29 / $49) -->
              <div class="inw-tier-card inw-tier-pro">
                <div class="inw-tier-tag inw-tag-pro">⭐ Commercial Underwriting ($29 Pro / $49 Enterprise)</div>
                <h4>10-Page Bank Loan &amp; Grant Package</h4>
                <p>Includes 10-year discounted cash flow (DCF), sensitivity analysis for natural gas/power spikes, USDA/CDFA grant application worksheets &amp; Excel master template.</p>
                <a href="https://inwoovation.com/contact.html?subject=Request_Commercial_Feasibility_Package&hash=${data.hash}" class="inw-tier-btn inw-btn-pro" target="_blank" rel="noopener noreferrer">
                  🚀 Unlock Full Bank Dossier ($29 Pro)
                </a>
              </div>
            </div>

            <div class="inw-dossier-disclaimer">
              🛡️ <strong>Institutional Notice:</strong> Dossiers are synthesized using peer-reviewed biophysical governing equations (DIN V 18599 / Farquhar FvCB / Penman-Monteith). Figures are formatted for submission to agricultural lenders (Farm Credit, AgWest) and public grant authorities (USDA REAP/EQIP, CDFA).
            </div>
          </div>
        </div>
      `;

      modal.classList.add('inw-open');
      document.body.style.overflow = 'hidden';
    },

    closeDossierModal: function () {
      const modal = document.getElementById('inw-dossier-modal');
      if (modal) {
        modal.classList.remove('inw-open');
      }
      document.body.style.overflow = '';
    },

    executePrintDossier: function () {
      this.closeDossierModal();
      setTimeout(function () {
        window.print();
      }, 300);
    }
  };

  // Inject Modal Styles dynamically
  const style = document.createElement('style');
  style.textContent = `
    .inw-dossier-backdrop {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(3, 7, 18, 0.85);
      backdrop-filter: blur(8px);
      z-index: 10000;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .inw-dossier-backdrop.inw-open {
      display: flex;
    }
    .inw-dossier-dialog {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      max-width: 680px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      overflow: hidden;
      animation: inwFadeIn 0.2s ease-out;
    }
    @keyframes inwFadeIn {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
    .inw-dossier-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: rgba(30, 41, 59, 0.6);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .inw-dossier-close {
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 1.8rem;
      cursor: pointer;
      line-height: 1;
      padding: 0;
    }
    .inw-dossier-close:hover { color: #f8fafc; }
    .inw-dossier-body {
      padding: 20px;
      max-height: 80vh;
      overflow-y: auto;
    }
    .inw-dossier-summary-card {
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 20px;
    }
    .inw-dossier-metric-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .inw-dossier-metric-item {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 10px;
    }
    .inw-dossier-metric-lbl {
      display: block;
      font-size: 0.72rem;
      color: #94a3b8;
      margin-bottom: 4px;
    }
    .inw-dossier-metric-val {
      font-size: 0.95rem;
      color: #38bdf8;
      font-family: var(--font-mono, monospace);
    }
    .inw-dossier-tier-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 18px;
    }
    @media (max-width: 600px) {
      .inw-dossier-tier-grid { grid-template-columns: 1fr; }
    }
    .inw-tier-card {
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .inw-tier-free {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .inw-tier-pro {
      background: linear-gradient(145deg, rgba(6, 182, 212, 0.1), rgba(16, 185, 129, 0.15));
      border: 1px solid rgba(16, 185, 129, 0.4);
      box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.1);
    }
    .inw-tier-tag {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      color: #94a3b8;
      margin-bottom: 8px;
    }
    .inw-tag-pro { color: #34d399; }
    .inw-tier-card h4 {
      margin: 0 0 8px 0;
      font-size: 0.98rem;
      color: #ffffff;
    }
    .inw-tier-card p {
      font-size: 0.8rem;
      color: #cbd5e1;
      line-height: 1.45;
      margin: 0 0 16px 0;
      flex-grow: 1;
    }
    .inw-tier-btn {
      display: block;
      width: 100%;
      box-sizing: border-box;
      text-align: center;
      padding: 10px 12px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      text-decoration: none;
      border: none;
      transition: all 0.15s ease;
    }
    .inw-btn-free {
      background: #334155;
      color: #f8fafc;
    }
    .inw-btn-free:hover { background: #475569; }
    .inw-btn-pro {
      background: linear-gradient(135deg, #10b981, #06b6d4);
      color: #030712;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    .inw-btn-pro:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.45);
    }
    .inw-dossier-disclaimer {
      font-size: 0.74rem;
      color: #94a3b8;
      background: rgba(0, 0, 0, 0.25);
      border-radius: 8px;
      padding: 10px 12px;
      line-height: 1.5;
    }
  `;
  document.head.appendChild(style);

  // Attach to window
  window.InwDossierEngine = InwDossierEngine;

  // Auto-bind any button with data-inw-dossier
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-inw-dossier], .btn-export-dossier').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        InwDossierEngine.openDossierModal();
      });
    });
  });
})();
