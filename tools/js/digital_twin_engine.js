/**
 * DIGITAL TWIN GREENHOUSE SIMULATION ENGINE v2.0
 * Based on Wageningen University (WUR) Greenhouse Microclimate Models
 * & DIN V 18599 Thermodynamic Heat Transfer Equations.
 */

class GreenhouseDigitalTwin {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();

    // Simulation State Parameters
    this.state = {
      // Outdoor Environment
      t_out: 14.0,       // Outdoor Temp (°C)
      rh_out: 65.0,      // Outdoor RH (%)
      solar_rad: 650,    // Solar Radiation (W/m²)
      sun_altitude: 45,  // Sun elevation (degrees)
      
      // Actuator States (0.0 to 1.0 or Booleans)
      vent_opening: 0.25,      // 25% roof vent opening
      screen_closure: 0.0,     // 0% screen closed (daytime)
      heating_power: 0.15,     // 15% pipe rail heating
      led_toplights: true,     // Supplemental LED on
      fogging_active: false,   // High-pressure fogging
      co2_dosing_ppm: 850,     // CO2 concentration (ppm)
      
      // Indoor Microclimate (Computed Dynamic States)
      t_in: 21.5,        // Indoor Air Temp (°C)
      t_leaf: 19.8,      // Crop Leaf Temp (°C)
      rh_in: 72.0,       // Indoor RH (%)
      vpd_leaf: 0.95,    // Leaf-to-Air VPD (kPa)
      dli_accum: 18.4,   // Daily Light Integral (mol/m²/day)
      crop_transpiration: 185.0 // Transpiration flux (g/m²/h)
    };

    // Auto-PID Climate Controller State
    this.auto_pid = true;
    this.target_vpd = 1.0; // Target 1.0 kPa
    this.target_temp = 22.0; // Target 22°C

    this.initEventListeners();
    this.animate();
  }

  resizeCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  // Tetens Equation for Saturated Vapor Pressure (kPa)
  calcSaturatedVaporPressure(tempC) {
    return 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  }

  // Physics Simulation Step
  updatePhysics() {
    // 1. Calculate Solar Heat & Light Gain
    const transmissivity = (1.0 - this.state.screen_closure * 0.55) * 0.85;
    const effective_solar_w = this.state.solar_rad * transmissivity;
    const led_w = this.state.led_toplights ? 85.0 : 0.0;
    
    // 2. Heat Losses & Pipe Heating
    const u_val = this.state.screen_closure > 0.8 ? 3.2 : 6.5; // W/m²K
    const transmission_loss = u_val * (this.state.t_in - this.state.t_out);
    const vent_loss = this.state.vent_opening * 45.0 * (this.state.t_in - this.state.t_out);
    const pipe_heat_in = this.state.heating_power * 120.0; // Max 120 W/m²

    // Net thermal heat flux (W/m²)
    const net_q = effective_solar_w * 0.45 + pipe_heat_in + led_w * 0.35 - transmission_loss - vent_loss;
    
    // Temperature delta (thermal inertia ~ 1800 J/m²K)
    this.state.t_in += (net_q / 3600.0) * 0.05;
    this.state.t_in = Math.max(-5, Math.min(45, this.state.t_in));

    // 3. Leaf Temperature Physics
    // Leaf cools via transpiration and heats via radiation
    const radiation_load = effective_solar_w * 0.6 + (this.state.led_toplights ? 40 : 0);
    this.state.t_leaf = this.state.t_in + (radiation_load / 350.0) - (this.state.crop_transpiration / 90.0);

    // 4. Humidity & VPD Calculations
    const es_leaf = this.calcSaturatedVaporPressure(this.state.t_leaf);
    const es_air = this.calcSaturatedVaporPressure(this.state.t_in);
    
    // Transpiration generates moisture; ventilation vents moisture
    const evap_rate = Math.max(10, 80 + (radiation_load * 0.25) + (es_leaf - (es_air * (this.state.rh_in / 100))) * 60);
    this.state.crop_transpiration = evap_rate;

    const moisture_in = evap_rate * 0.005 + (this.state.fogging_active ? 1.2 : 0);
    const moisture_out = this.state.vent_opening * (this.state.rh_in - this.state.rh_out) * 0.08;
    this.state.rh_in += (moisture_in - moisture_out);
    this.state.rh_in = Math.max(20, Math.min(99, this.state.rh_in));

    const ea_air = es_air * (this.state.rh_in / 100.0);
    this.state.vpd_leaf = Math.max(0.05, es_leaf - ea_air);

    // 5. Automated PID Climate Control Loop
    if (this.auto_pid) {
      // Temperature PID
      if (this.state.t_in > this.target_temp + 0.5) {
        this.state.vent_opening = Math.min(1.0, this.state.vent_opening + 0.01);
        this.state.heating_power = Math.max(0.0, this.state.heating_power - 0.02);
      } else if (this.state.t_in < this.target_temp - 0.5) {
        this.state.vent_opening = Math.max(0.0, this.state.vent_opening - 0.02);
        this.state.heating_power = Math.min(1.0, this.state.heating_power + 0.015);
      }

      // VPD PID Tuning via Fogging / Vents
      if (this.state.vpd_leaf > 1.4) {
        this.state.fogging_active = true;
      } else if (this.state.vpd_leaf < 0.8) {
        this.state.fogging_active = false;
        if (this.state.rh_in > 82) {
          this.state.vent_opening = Math.min(0.6, this.state.vent_opening + 0.01);
        }
      }
    }
  }

  // Draw 2D Venlo Greenhouse Cross-Section on Canvas
  draw() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    // 1. Sky & Sun Atmosphere
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    if (this.state.solar_rad > 400) {
      skyGrad.addColorStop(0, '#0284c7');
      skyGrad.addColorStop(1, '#38bdf8');
    } else if (this.state.solar_rad > 100) {
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(1, '#f97316');
    } else {
      skyGrad.addColorStop(0, '#020617');
      skyGrad.addColorStop(1, '#0f172a');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Sun
    if (this.state.solar_rad > 50) {
      const sunX = w * 0.85;
      const sunY = h * 0.18;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 32, 0, Math.PI * 2);
      ctx.fillStyle = '#fde047';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 24;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 2. Ground Terrain
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, h * 0.82, w, h * 0.18);

    // 3. Greenhouse Structure (Venlo Gable Profile)
    const ghX = w * 0.12;
    const ghW = w * 0.76;
    const ghGutterY = h * 0.42;
    const ghRidgeY = h * 0.22;
    const ghFloorY = h * 0.82;

    // Glass Envelope Fill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(ghX, ghFloorY);
    ctx.lineTo(ghX, ghGutterY);
    ctx.lineTo(ghX + ghW * 0.25, ghRidgeY);
    ctx.lineTo(ghX + ghW * 0.5, ghGutterY);
    ctx.lineTo(ghX + ghW * 0.75, ghRidgeY);
    ctx.lineTo(ghX + ghW, ghGutterY);
    ctx.lineTo(ghX + ghW, ghFloorY);
    ctx.closePath();
    ctx.fill();

    // Aluminum Structural Frame
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 4. Roof Vents (Animated Opening)
    const ventAngle = this.state.vent_opening * 0.5; // radians
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    
    // Left Vent
    ctx.beginPath();
    ctx.moveTo(ghX + ghW * 0.25, ghRidgeY);
    ctx.lineTo(ghX + ghW * 0.25 + Math.cos(ventAngle) * 50, ghRidgeY - Math.sin(ventAngle) * 50);
    ctx.stroke();

    // Right Vent
    ctx.beginPath();
    ctx.moveTo(ghX + ghW * 0.75, ghRidgeY);
    ctx.lineTo(ghX + ghW * 0.75 + Math.cos(ventAngle) * 50, ghRidgeY - Math.sin(ventAngle) * 50);
    ctx.stroke();

    // 5. Thermal Screen (Animated Curtain)
    if (this.state.screen_closure > 0.05) {
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
      ctx.lineWidth = 6;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.moveTo(ghX + 10, ghGutterY + 15);
      ctx.lineTo(ghX + ghW * this.state.screen_closure - 10, ghGutterY + 15);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 6. Supplemental LED Toplights (Pink / Far-Red Spectrum Glow)
    if (this.state.led_toplights) {
      ctx.fillStyle = '#ec4899';
      // LED Fixtures
      for (let i = 1; i <= 4; i++) {
        const lx = ghX + (ghW * i) / 5;
        const ly = ghGutterY + 30;
        ctx.fillRect(lx - 12, ly, 24, 6);
        
        // Light Beam Cone
        const coneGrad = ctx.createLinearGradient(lx, ly, lx, ghFloorY);
        coneGrad.addColorStop(0, 'rgba(236, 72, 153, 0.35)');
        coneGrad.addColorStop(1, 'rgba(236, 72, 153, 0.02)');
        ctx.fillStyle = coneGrad;
        ctx.beginPath();
        ctx.moveTo(lx - 12, ly + 6);
        ctx.lineTo(lx - 45, ghFloorY);
        ctx.lineTo(lx + 45, ghFloorY);
        ctx.lineTo(lx + 12, ly + 6);
        ctx.closePath();
        ctx.fill();
      }
    }

    // 7. Crop Canopy (Tomato High-Wire Plants)
    ctx.fillStyle = '#10b981';
    for (let c = 1; c <= 7; c++) {
      const cx = ghX + (ghW * c) / 8;
      const cy = ghFloorY;
      
      // Stem Wire
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, ghGutterY + 40);
      ctx.stroke();

      // Foliage Clusters
      ctx.fillStyle = '#10b981';
      for (let leaf = 0; leaf < 5; leaf++) {
        ctx.beginPath();
        ctx.arc(cx + (leaf % 2 === 0 ? 12 : -12), cy - 40 - leaf * 28, 16, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ripe Tomatoes
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx - 8, cy - 35, 7, 0, Math.PI * 2);
      ctx.arc(cx + 8, cy - 42, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // 8. Heating Pipe Rail (Red Glow)
    if (this.state.heating_power > 0.05) {
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 + this.state.heating_power * 0.6})`;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(ghX + 15, ghFloorY - 12);
      ctx.lineTo(ghX + ghW - 15, ghFloorY - 12);
      ctx.stroke();
    }
  }

  updateDOMTelemetry() {
    document.getElementById('val-temp-in').innerText = `${this.state.t_in.toFixed(1)} °C`;
    document.getElementById('val-rh-in').innerText = `${this.state.rh_in.toFixed(0)} %`;
    
    const vpdEl = document.getElementById('val-vpd-in');
    vpdEl.innerText = `${this.state.vpd_leaf.toFixed(2)} kPa`;
    if (this.state.vpd_leaf >= 0.8 && this.state.vpd_leaf <= 1.2) {
      vpdEl.style.color = '#10b981'; // Optimal Green
    } else if (this.state.vpd_leaf < 0.5 || this.state.vpd_leaf > 1.6) {
      vpdEl.style.color = '#f43f5e'; // Danger Red
    } else {
      vpdEl.style.color = '#f59e0b'; // Warning Amber
    }

    document.getElementById('val-transpiration').innerText = `${this.state.crop_transpiration.toFixed(0)} g/m²h`;
  }

  initEventListeners() {
    window.addEventListener('resize', () => this.resizeCanvas());

    // Sliders
    const solarSlider = document.getElementById('slider-solar');
    if (solarSlider) {
      solarSlider.addEventListener('input', (e) => {
        this.state.solar_rad = parseFloat(e.target.value);
        document.getElementById('lbl-solar').innerText = `${this.state.solar_rad} W/m²`;
      });
    }

    const tOutSlider = document.getElementById('slider-tout');
    if (tOutSlider) {
      tOutSlider.addEventListener('input', (e) => {
        this.state.t_out = parseFloat(e.target.value);
        document.getElementById('lbl-tout').innerText = `${this.state.t_out.toFixed(1)} °C`;
      });
    }

    const ledToggle = document.getElementById('toggle-led');
    if (ledToggle) {
      ledToggle.addEventListener('change', (e) => {
        this.state.led_toplights = e.target.checked;
      });
    }

    const pidToggle = document.getElementById('toggle-pid');
    if (pidToggle) {
      pidToggle.addEventListener('change', (e) => {
        this.auto_pid = e.target.checked;
      });
    }
  }

  animate() {
    this.updatePhysics();
    this.draw();
    this.updateDOMTelemetry();
    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.greenhouseSim = new GreenhouseDigitalTwin('ghCanvas');
});
