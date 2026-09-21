/**
 * InwooGauge - Universal Lightweight SVG Biophysical Gauge Dial
 * 100% Vanilla JS • Zero External Dependencies • Vector Crisp (SVG)
 * Designed for Commercial CEA & Horticultural Engineering Instrumentation
 */

class InwooGauge {
    constructor(containerId, options = {}) {
        this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
        if (!this.container) {
            console.warn(`[InwooGauge] Container #${containerId} not found.`);
            return;
        }

        this.min = options.min !== undefined ? options.min : 0;
        this.max = options.max !== undefined ? options.max : 100;
        this.value = options.value !== undefined ? options.value : this.min;
        this.unit = options.unit || '';
        this.title = options.title || 'Biophysical Index';
        this.decimals = options.decimals !== undefined ? options.decimals : 1;
        
        // Zones: array of { from, to, color, label }
        this.zones = options.zones || [
            { from: this.min, to: this.min + (this.max - this.min) * 0.5, color: '#10b981', label: 'OPTIMAL' },
            { from: this.min + (this.max - this.min) * 0.5, to: this.min + (this.max - this.min) * 0.8, color: '#f59e0b', label: 'CAUTION' },
            { from: this.min + (this.max - this.min) * 0.8, to: this.max, color: '#ef4444', label: 'CRITICAL' }
        ];

        this.init();
    }

    init() {
        this.container.innerHTML = '';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';
        this.container.style.padding = '12px';
        this.container.style.background = 'rgba(15, 23, 42, 0.75)';
        this.container.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        this.container.style.borderRadius = '14px';
        this.container.style.backdropFilter = 'blur(10px)';

        const width = 220;
        const height = 135;
        const cx = 110;
        const cy = 105;
        const r = 80;
        const strokeWidth = 12;

        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('width', '100%');
        svg.setAttribute('style', 'max-width: 220px; overflow: visible;');

        // Background Track Arc (180 degrees from -180 to 0)
        const bgTrack = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const dTrack = this.describeArc(cx, cy, r, -180, 0);
        bgTrack.setAttribute('d', dTrack);
        bgTrack.setAttribute('fill', 'none');
        bgTrack.setAttribute('stroke', 'rgba(255, 255, 255, 0.08)');
        bgTrack.setAttribute('stroke-width', strokeWidth);
        bgTrack.setAttribute('stroke-linecap', 'round');
        svg.appendChild(bgTrack);

        // Colored Zone Arcs
        this.zones.forEach(zone => {
            const startAngle = this.valueToAngle(zone.from);
            const endAngle = this.valueToAngle(zone.to);
            const zonePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            zonePath.setAttribute('d', this.describeArc(cx, cy, r, startAngle, endAngle));
            zonePath.setAttribute('fill', 'none');
            zonePath.setAttribute('stroke', zone.color);
            zonePath.setAttribute('stroke-width', strokeWidth);
            zonePath.setAttribute('stroke-linecap', 'butt');
            zonePath.setAttribute('opacity', '0.88');
            svg.appendChild(zonePath);
        });

        // Needle group
        this.needleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.needleGroup.setAttribute('style', `transform-origin: ${cx}px ${cy}px; transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);`);

        // Needle polygon
        const needle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        needle.setAttribute('points', `${cx - 3},${cy} ${cx + 3},${cy} ${cx},${cy - r + 4}`);
        needle.setAttribute('fill', '#ffffff');
        needle.setAttribute('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))');
        this.needleGroup.appendChild(needle);

        // Center hub circle
        const hub = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        hub.setAttribute('cx', cx);
        hub.setAttribute('cy', cy);
        hub.setAttribute('r', '7');
        hub.setAttribute('fill', '#38bdf8');
        hub.setAttribute('stroke', '#0f172a');
        hub.setAttribute('stroke-width', '2');
        this.needleGroup.appendChild(hub);

        svg.appendChild(this.needleGroup);
        this.container.appendChild(svg);

        // Title Label
        this.titleEl = document.createElement('div');
        this.titleEl.style.fontSize = '0.75rem';
        this.titleEl.style.fontWeight = '700';
        this.titleEl.style.color = '#94a3b8';
        this.titleEl.style.textTransform = 'uppercase';
        this.titleEl.style.letterSpacing = '0.05em';
        this.titleEl.style.marginTop = '-6px';
        this.titleEl.innerText = this.title;
        this.container.appendChild(this.titleEl);

        // Digital Value Readout
        this.valueEl = document.createElement('div');
        this.valueEl.style.fontFamily = "'JetBrains Mono', monospace, sans-serif";
        this.valueEl.style.fontSize = '1.45rem';
        this.valueEl.style.fontWeight = '800';
        this.valueEl.style.color = '#f8fafc';
        this.valueEl.style.marginTop = '2px';
        this.container.appendChild(this.valueEl);

        // Context Status Badge
        this.badgeEl = document.createElement('div');
        this.badgeEl.style.fontSize = '0.72rem';
        this.badgeEl.style.fontWeight = '800';
        this.badgeEl.style.padding = '3px 10px';
        this.badgeEl.style.borderRadius = '999px';
        this.badgeEl.style.marginTop = '6px';
        this.badgeEl.style.letterSpacing = '0.04em';
        this.container.appendChild(this.badgeEl);

        // Render initial value
        this.update(this.value);
    }

    polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    describeArc(x, y, radius, startAngle, endAngle) {
        const start = this.polarToCartesian(x, y, radius, endAngle);
        const end = this.polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
        return [
            'M', start.x, start.y,
            'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(' ');
    }

    valueToAngle(val) {
        const clamped = Math.max(this.min, Math.min(this.max, val));
        const pct = (clamped - this.min) / (this.max - this.min);
        // Map from 0..1 to -180..0 degrees
        return -180 + (pct * 180);
    }

    update(val) {
        this.value = val;
        const clamped = Math.max(this.min, Math.min(this.max, val));
        
        // Needle rotation angle (relative to 12 o'clock / straight up = -90 deg)
        // At min (-180 deg in polar), angle relative to top is -90 deg
        // At max (0 deg in polar), angle relative to top is +90 deg
        const pct = (clamped - this.min) / (this.max - this.min);
        const needleAngle = -90 + (pct * 180);
        if (this.needleGroup) {
            this.needleGroup.setAttribute('style', `transform-origin: 110px 105px; transform: rotate(${needleAngle}deg); transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);`);
        }

        // Value text
        if (this.valueEl) {
            this.valueEl.innerText = `${val.toFixed(this.decimals)} ${this.unit}`.trim();
        }

        // Active Zone Evaluation
        let activeZone = this.zones[0];
        for (let i = 0; i < this.zones.length; i++) {
            if (val >= this.zones[i].from && val <= this.zones[i].to) {
                activeZone = this.zones[i];
                break;
            }
        }
        if (val > this.zones[this.zones.length - 1].to) {
            activeZone = this.zones[this.zones.length - 1];
        }

        if (this.badgeEl && activeZone) {
            this.badgeEl.innerText = activeZone.label;
            this.badgeEl.style.color = activeZone.color;
            this.badgeEl.style.backgroundColor = `${activeZone.color}22`;
            this.badgeEl.style.border = `1px solid ${activeZone.color}55`;
        }
    }
}

// Global exposure
if (typeof window !== 'undefined') {
    window.InwooGauge = InwooGauge;
}
