import { useState, useEffect } from 'react'

/* ─── SVG Icons ─────────────────────────────────────────────────── */
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

/* ─── PCB SVG — FC-V1 board representation ──────────────────────── */
/* Based on extracted Gerber data: 43mm × 36mm board, 2-layer       */
const FCVPCB = () => (
  <svg
    viewBox="0 0 430 360"
    width="100%"
    style={{ maxWidth: 380, display: 'block' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Board outline with rounded corners */}
    <rect x="1" y="1" width="428" height="358" rx="28" ry="28"
      fill="#0B1A0B" stroke="#1A6B1A" strokeWidth="2"/>

    {/* Silkscreen outline */}
    <rect x="6" y="6" width="418" height="348" rx="24" ry="24"
      fill="none" stroke="#2A9B2A" strokeWidth="0.8" strokeDasharray="6,4"/>

    {/* Board label */}
    <text x="215" y="22" textAnchor="middle" fill="#3AC03A"
      fontFamily="monospace" fontSize="9" letterSpacing="2">FC-V1  STM32F411CEU6</text>

    {/* ── MCU footprint (UFQFPN48, 7×7mm center) ── */}
    <g transform="translate(170, 130)">
      {/* MCU body */}
      <rect x="0" y="0" width="90" height="90" rx="4" ry="4"
        fill="#1A1A2A" stroke="#00D4FF" strokeWidth="1.2"/>
      <rect x="4" y="4" width="82" height="82" rx="2" ry="2"
        fill="#141428" stroke="#0080AA" strokeWidth="0.5"/>
      {/* Pin 1 marker */}
      <circle cx="8" cy="8" r="3" fill="#00D4FF" opacity="0.7"/>
      {/* MCU label */}
      <text x="45" y="40" textAnchor="middle" fill="#00D4FF"
        fontFamily="monospace" fontSize="7" fontWeight="bold">STM32</text>
      <text x="45" y="52" textAnchor="middle" fill="#00A8CC"
        fontFamily="monospace" fontSize="6">F411CEU6</text>
      <text x="45" y="64" textAnchor="middle" fill="#006688"
        fontFamily="monospace" fontSize="5">UFQFPN-48</text>

      {/* Pads — top row */}
      {[0,9,18,27,36,45,54,63,72,81,90].map((x, i) => (
        <rect key={`t${i}`} x={i*8+1} y="-6" width="5" height="6"
          fill="#C8A000" stroke="#8B6D00" strokeWidth="0.3" rx="0.5"/>
      ))}
      {/* Pads — bottom row */}
      {[0,9,18,27,36,45,54,63,72,81,90].map((x, i) => (
        <rect key={`b${i}`} x={i*8+1} y="90" width="5" height="6"
          fill="#C8A000" stroke="#8B6D00" strokeWidth="0.3" rx="0.5"/>
      ))}
      {/* Pads — left col */}
      {[0,9,18,27,36,45,54,63,72,81].map((y, i) => (
        <rect key={`l${i}`} x="-6" y={i*8+5} width="6" height="5"
          fill="#C8A000" stroke="#8B6D00" strokeWidth="0.3" rx="0.5"/>
      ))}
      {/* Pads — right col */}
      {[0,9,18,27,36,45,54,63,72,81].map((y, i) => (
        <rect key={`r${i}`} x="90" y={i*8+5} width="6" height="5"
          fill="#C8A000" stroke="#8B6D00" strokeWidth="0.3" rx="0.5"/>
      ))}
      {/* Thermal pad */}
      <rect x="20" y="20" width="50" height="50" fill="#C8A000" opacity="0.25" rx="2"/>
    </g>

    {/* ── IMU (ICM-42688 / MPU-6500 style, I2C) ── */}
    <g transform="translate(310, 60)">
      <rect x="0" y="0" width="55" height="45" rx="3" ry="3"
        fill="#1A1A2A" stroke="#9B5FFF" strokeWidth="1"/>
      <text x="27" y="17" textAnchor="middle" fill="#9B5FFF"
        fontFamily="monospace" fontSize="6" fontWeight="bold">IMU</text>
      <text x="27" y="28" textAnchor="middle" fill="#6B3FBF"
        fontFamily="monospace" fontSize="5">I2C</text>
      {/* pads */}
      {[8,16,24,32,40,48].map((x, i) => (
        <rect key={i} x={x-3} y="-5" width="5" height="5"
          fill="#C8A000" strokeWidth="0.3" rx="0.5"/>
      ))}
      {[8,16,24,32,40,48].map((x, i) => (
        <rect key={i} x={x-3} y="45" width="5" height="5"
          fill="#C8A000" strokeWidth="0.3" rx="0.5"/>
      ))}
    </g>

    {/* ── USB-C connector ── */}
    <g transform="translate(20, 155)">
      <rect x="0" y="0" width="42" height="28" rx="3"
        fill="#2A2A3A" stroke="#FFD600" strokeWidth="1"/>
      <rect x="4" y="4" width="34" height="20" rx="8"
        fill="#1A1A2A" stroke="#AA9000" strokeWidth="0.8"/>
      <text x="21" y="19" textAnchor="middle" fill="#FFD600"
        fontFamily="monospace" fontSize="6">USB-C</text>
    </g>

    {/* ── LDO Regulator 3.3V ── */}
    <g transform="translate(25, 65)">
      <rect x="0" y="0" width="40" height="25" rx="2"
        fill="#1A1A2A" stroke="#00FF88" strokeWidth="0.8"/>
      <text x="20" y="11" textAnchor="middle" fill="#00FF88"
        fontFamily="monospace" fontSize="5">LDO</text>
      <text x="20" y="21" textAnchor="middle" fill="#00AA55"
        fontFamily="monospace" fontSize="5">3.3V</text>
    </g>

    {/* ── Crystal 25MHz ── */}
    <g transform="translate(320, 180)">
      <ellipse cx="18" cy="12" rx="16" ry="10"
        fill="#1A1A2A" stroke="#FFD600" strokeWidth="0.8"/>
      <rect x="0" y="6" width="4" height="12" fill="#C8A000" rx="1"/>
      <rect x="32" y="6" width="4" height="12" fill="#C8A000" rx="1"/>
      <text x="18" y="15" textAnchor="middle" fill="#FFD600"
        fontFamily="monospace" fontSize="5">25MHz</text>
    </g>

    {/* ── Decoupling caps (0402 — the tiny devils) ── */}
    {[
      [155, 120], [165, 120], [175, 120], [155, 245], [165, 245], [175, 245],
      [265, 145], [265, 155], [265, 165], [265, 175], [265, 185]
    ].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width="8" height="5"
        fill="#8B6000" stroke="#6B4000" strokeWidth="0.3" rx="0.5"/>
    ))}

    {/* 0402 label */}
    <text x="155" y="115" fill="#FF6B00" fontFamily="monospace" fontSize="6"
      opacity="0.8">0402</text>

    {/* ── GPIO Header (2x20) ── */}
    <g transform="translate(55, 100)">
      {Array.from({length: 20}).map((_, i) => (
        <g key={i}>
          <circle cx={i * 9 + 4} cy="4" r="3"
            fill="#C8A000" stroke="#8B6D00" strokeWidth="0.5"/>
          <circle cx={i * 9 + 4} cy="14" r="3"
            fill="#C8A000" stroke="#8B6D00" strokeWidth="0.5"/>
        </g>
      ))}
    </g>

    {/* ── SWD Debug header (1x5) ── */}
    <g transform="translate(290, 250)">
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={i*10} y="0" width="8" height="8"
          fill="#C8A000" stroke="#8B6D00" strokeWidth="0.4" rx="1"/>
      ))}
      <text x="25" y="18" textAnchor="middle" fill="#6B6B8B"
        fontFamily="monospace" fontSize="6">SWD</text>
    </g>

    {/* ── Copper traces (F_Cu) ── */}
    <g stroke="#C8A000" strokeWidth="0.8" fill="none" opacity="0.6">
      {/* Power traces — thicker */}
      <line x1="65" y1="80" x2="65" y2="155" stroke="#C8A000" strokeWidth="1.5"/>
      <line x1="65" y1="80" x2="170" y2="80" strokeWidth="1.5"/>
      {/* I2C to IMU */}
      <path d="M 265 165 Q 300 165 310 90" strokeWidth="0.8"/>
      <path d="M 265 175 Q 305 175 310 100" strokeWidth="0.8"/>
      {/* USB traces */}
      <line x1="62" y1="165" x2="170" y2="165"/>
      <line x1="62" y1="170" x2="170" y2="170"/>
      {/* Various signal traces */}
      <line x1="260" y1="200" x2="260" y2="260"/>
      <line x1="170" y1="220" x2="100" y2="220"/>
    </g>

    {/* ── B_Cu (bottom copper — shown as slightly different) ── */}
    <g stroke="#4488FF" strokeWidth="0.6" fill="none" opacity="0.35">
      <line x1="100" y1="280" x2="390" y2="280"/>
      <line x1="50" y1="300" x2="380" y2="300"/>
      <rect x="40" y="270" width="360" height="40" rx="2"
        fill="#4488FF" opacity="0.05"/>
    </g>

    {/* ── Edge / dimension indicator ── */}
    <text x="215" y="350" textAnchor="middle" fill="#2A6B2A"
      fontFamily="monospace" fontSize="7" letterSpacing="1">43mm × 36mm  ·  2-LAYER  ·  KICAD 9.0</text>

    {/* ── Via dots ── */}
    {[
      [120,200],[130,200],[140,200],[150,200],
      [300,220],[310,220],[320,220],
      [200,290],[210,290],[220,290],[230,290]
    ].map(([x,y], i) => (
      <circle key={i} cx={x} cy={y} r="2.5"
        fill="#0B1A0B" stroke="#4488FF" strokeWidth="0.8"/>
    ))}
  </svg>
)

/* ─── Main App ───────────────────────────────────────────────────── */
export default function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* NAV */}
      <nav style={{ boxShadow: scrolled ? '0 1px 30px rgba(0,0,0,0.5)' : 'none' }}>
        <div className="container nav-inner">
          <span className="nav-logo">~/brian-estime</span>
          <ul className="nav-links">
            <li><a href="#projects">projects</a></li>
            <li><a href="#experience">experience</a></li>
            <li><a href="#skills">skills</a></li>
            <li><a href="#about">about</a></li>
            <li>
              <a href="https://github.com/BrianEstime1" target="_blank" rel="noreferrer"
                style={{ color: 'var(--cyan)' }}>
                github ↗
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <p className="hero-prompt">// hello world</p>
              <h1 className="hero-name">
                Brian<br /><span>Estime</span>
              </h1>
              <p className="hero-title">
                Electrical Engineering Student
                <span className="sep">|</span>
                Embedded Systems
                <span className="sep">|</span>
                PCB Design
                <span className="sep">|</span>
                Power Electronics
              </p>
              <div className="hero-links">
                <a
                  className="hero-link"
                  href="https://github.com/BrianEstime1"
                  target="_blank"
                  rel="noreferrer"
                >
                  <GithubIcon /> github.com/BrianEstime1
                </a>
                <a
                  className="hero-link"
                  href="https://linkedin.com/in/brianestime"
                  target="_blank"
                  rel="noreferrer"
                >
                  <LinkedInIcon /> linkedin.com/in/brianestime
                </a>
              </div>
            </div>

            <div className="terminal">
              <div className="terminal-bar">
                <span className="terminal-dot red"/>
                <span className="terminal-dot yellow"/>
                <span className="terminal-dot green"/>
                <span className="terminal-title">brian@workstation ~ profile.sh</span>
              </div>
              <div className="terminal-body">
                <div className="t-line">
                  <span className="t-prompt">$</span>
                  <span style={{color:'#9B8FFF'}}>cat</span>
                  <span style={{color:'var(--text-dim)'}}>profile.json</span>
                </div>
                <div className="t-blank"/>
                <div className="t-line">
                  <span className="t-key">  status</span>
                  <span style={{color:'var(--text-muted)'}}>:</span>
                  <span className="t-val">"Transferring to UCF Fall 2026"</span>
                </div>
                <div className="t-line">
                  <span className="t-key">  focus</span>
                  <span style={{color:'var(--text-muted)'}}>:</span>
                  <span className="t-val">"Embedded Systems &amp; PCB Design"</span>
                </div>
                <div className="t-line">
                  <span className="t-key">  research</span>
                  <span style={{color:'var(--text-muted)'}}>:</span>
                  <span className="t-val">"TROPICS Lab — Biomedical Optics"</span>
                </div>
                <div className="t-line">
                  <span className="t-key">  racing</span>
                  <span style={{color:'var(--text-muted)'}}>:</span>
                  <span className="t-val">"UCF Knights Racing Formula SAE"</span>
                </div>
                <div className="t-line">
                  <span className="t-key">  mcu</span>
                  <span style={{color:'var(--text-muted)'}}>:</span>
                  <span className="t-val">"STM32 (bare-metal C)"</span>
                </div>
                <div className="t-line">
                  <span className="t-key">  eda</span>
                  <span style={{color:'var(--text-muted)'}}>:</span>
                  <span className="t-val">["KiCad", "Altium"]</span>
                </div>
                <div className="t-blank"/>
                <div className="t-line">
                  <span className="t-prompt">$</span>
                  <span style={{color:'var(--text-dim)'}}>_<span className="cursor"/></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{background:'rgba(0,212,255,0.02)'}}>
        <div className="container">
          <div className="section-header">
            <p className="section-label">// 01 — projects</p>
            <h2 className="section-title">Built &amp; <span>Shipped</span></h2>
          </div>

          <div className="projects-grid">

            {/* FC-V1 */}
            <div className="project-card">
              <div className="card-top">
                <div className="card-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="2" y="2" width="28" height="28" rx="3"
                      fill="none" stroke="#00D4FF" strokeWidth="1.5"/>
                    <circle cx="8" cy="8" r="2" fill="#C8A000"/>
                    <circle cx="24" cy="8" r="2" fill="#C8A000"/>
                    <circle cx="8" cy="24" r="2" fill="#C8A000"/>
                    <circle cx="24" cy="24" r="2" fill="#C8A000"/>
                    <rect x="11" y="11" width="10" height="10" rx="1"
                      fill="#141428" stroke="#00D4FF" strokeWidth="1"/>
                    <line x1="2" y1="16" x2="8" y2="16" stroke="#C8A000" strokeWidth="0.8"/>
                    <line x1="24" y1="16" x2="30" y2="16" stroke="#C8A000" strokeWidth="0.8"/>
                    <line x1="16" y1="2" x2="16" y2="8" stroke="#C8A000" strokeWidth="0.8"/>
                    <line x1="16" y1="24" x2="16" y2="30" stroke="#C8A000" strokeWidth="0.8"/>
                  </svg>
                </div>
                <span className="status-badge badge-wip">◉ In Progress</span>
              </div>

              <h3 className="card-title">FC-V1 — Custom STM32 Dev Board</h3>
              <p className="card-desc">
                Custom 2-layer development board designed from scratch in KiCad around the
                STM32F411CEU6 (UFQFPN-48). Features a 6-DOF IMU over I²C, USB-C for
                power and programming, SWD debug header, LDO 3.3V regulation, and a
                full GPIO breakout header. Gerber files exported and verified.
              </p>

              <div className="card-note">
                ⚠ Ordered with 0402 passives — discovered they're near-impossible to
                hand-solder at home (0.5mm pads, 1mm pitch). Currently building a
                breadboard prototype implementing a Kalman filter for IMU fusion,
                validating firmware before the next PCB spin.
              </div>

              <div className="pcb-container">
                <div className="pcb-svg-wrap">
                  <FCVPCB />
                </div>
              </div>

              <div className="tags">
                <span className="tag">KiCad 9.0</span>
                <span className="tag">STM32F411CEU6</span>
                <span className="tag">2-Layer PCB</span>
                <span className="tag">IMU · I²C</span>
                <span className="tag">USB-C</span>
                <span className="tag">SWD</span>
                <span className="tag">Kalman Filter</span>
                <span className="tag">Bare-metal C</span>
              </div>
            </div>

            {/* Buck Converter */}
            <div className="project-card">
              <div className="card-top">
                <div className="card-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M4 22 L10 10 L16 18 L22 8 L28 16"
                      stroke="#FFD600" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    <circle cx="4" cy="22" r="2" fill="#FFD600"/>
                    <circle cx="28" cy="16" r="2" fill="#FFD600"/>
                    <rect x="12" y="24" width="8" height="4" rx="1"
                      fill="none" stroke="#FFD600" strokeWidth="1"/>
                    <line x1="16" y1="28" x2="16" y2="30" stroke="#FFD600" strokeWidth="1"/>
                    <line x1="13" y1="30" x2="19" y2="30" stroke="#FFD600" strokeWidth="1"/>
                  </svg>
                </div>
                <span className="status-badge badge-ordered">◎ Ordered</span>
              </div>

              <h3 className="card-title">Synchronous Buck Converter PCB</h3>
              <p className="card-desc">
                Synchronous step-down converter designed in KiCad for efficient DC–DC
                power conversion. High-side and low-side MOSFET switching with gate
                driver IC, optimized copper pours for thermal management, and
                deliberate trace geometry to minimize switching-node ringing.
                Intended as a building block for embedded power trees.
              </p>

              <div className="tags">
                <span className="tag">KiCad</span>
                <span className="tag">Power Electronics</span>
                <span className="tag">Synchronous Buck</span>
                <span className="tag">MOSFET Switching</span>
                <span className="tag">Gate Driver</span>
                <span className="tag">Thermal Design</span>
                <span className="tag">DC-DC</span>
              </div>
            </div>

            {/* FERDAIR */}
            <div className="project-card">
              <div className="card-top">
                <div className="card-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="2" y="8" width="28" height="20" rx="2"
                      fill="none" stroke="#00FF88" strokeWidth="1.5"/>
                    <path d="M8 4 H24 V8 H8 Z" fill="none" stroke="#00FF88" strokeWidth="1.2"/>
                    <line x1="8" y1="14" x2="24" y2="14" stroke="#00FF88" strokeWidth="0.8"/>
                    <line x1="8" y1="18" x2="20" y2="18" stroke="#00FF88" strokeWidth="0.8"/>
                    <line x1="8" y1="22" x2="18" y2="22" stroke="#00FF88" strokeWidth="0.8"/>
                    <circle cx="24" cy="22" r="4" fill="none" stroke="#00FF88" strokeWidth="1"/>
                    <line x1="24" y1="20" x2="24" y2="24" stroke="#00FF88" strokeWidth="0.8"/>
                    <line x1="22" y1="22" x2="26" y2="22" stroke="#00FF88" strokeWidth="0.8"/>
                  </svg>
                </div>
                <span className="status-badge badge-live">● Live</span>
              </div>

              <h3 className="card-title">FERDAIR — HVAC Management Platform</h3>
              <p className="card-desc">
                Full-stack SaaS platform built for the family HVAC business. Manages
                customer records, generates invoices and quotes, stores SOPs and KPIs,
                and tracks job status end-to-end. Replaced manual spreadsheets with a
                production-deployed web app actively used daily.
              </p>

              <div style={{
                background: 'rgba(0,255,136,0.06)',
                border: '1px solid rgba(0,255,136,0.15)',
                borderRadius: 4,
                padding: '8px 12px',
                marginBottom: 16,
                fontSize: 11,
                color: 'var(--green)',
                lineHeight: 1.6
              }}>
                ✓ Production deployed · 50+ daily users · FERDAIR LLC
              </div>

              <div className="tags">
                <span className="tag">React</span>
                <span className="tag">Flask</span>
                <span className="tag">PostgreSQL</span>
                <span className="tag">Full-Stack</span>
                <span className="tag">Invoice Engine</span>
                <span className="tag">SaaS</span>
                <span className="tag">Production</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience">
        <div className="container">
          <div className="section-header">
            <p className="section-label">// 02 — experience</p>
            <h2 className="section-title">Where I've <span>Worked</span></h2>
          </div>

          <div className="exp-list">

            <div className="exp-item">
              <div className="exp-meta">
                <span className="exp-period">2025 — Present</span>
                <span className="exp-org">University of South Florida</span>
                <span className="exp-status">
                  <span className="status-badge badge-wip" style={{fontSize:9}}>Active</span>
                </span>
              </div>
              <div>
                <h3 className="exp-role">Undergraduate Research Volunteer — TROPICS Lab</h3>
                <ul className="exp-bullets">
                  <li>Biomedical optical instrumentation research under TROPICS Lab</li>
                  <li>Developing embedded data acquisition pipelines with STM32 microcontrollers</li>
                  <li>Interfacing sensors and peripherals via I²C, SPI, and UART protocols</li>
                  <li>Supporting NIR spectroscopy experiments with Raspberry Pi-based control systems</li>
                  <li>Domain: near-infrared spectroscopy, tissue optical properties, optical bench setups</li>
                </ul>
              </div>
            </div>

            <div className="exp-item">
              <div className="exp-meta">
                <span className="exp-period">2024 — Present</span>
                <span className="exp-org">FERDAIR LLC</span>
                <span className="exp-status">
                  <span className="status-badge badge-live" style={{fontSize:9}}>Live</span>
                </span>
              </div>
              <div>
                <h3 className="exp-role">Technical Assistant &amp; Platform Developer</h3>
                <ul className="exp-bullets">
                  <li>Designed and deployed a full-stack HVAC business management platform from scratch</li>
                  <li>Built customer management, quoting, invoicing, and KPI tracking modules</li>
                  <li>Stack: React frontend, Flask REST API, PostgreSQL database</li>
                  <li>System serves 50+ daily active users in active field operations</li>
                </ul>
              </div>
            </div>

            <div className="exp-item">
              <div className="exp-meta">
                <span className="exp-period">Fall 2026</span>
                <span className="exp-org">University of Central Florida</span>
                <span className="exp-status">
                  <span className="status-badge badge-ordered" style={{fontSize:9}}>Incoming</span>
                </span>
              </div>
              <div>
                <h3 className="exp-role">Electrical Systems — UCF Knights Racing Formula SAE</h3>
                <ul className="exp-bullets">
                  <li>Joining the Formula SAE team's electrical systems sub-team at UCF</li>
                  <li>Focus area: embedded control systems, wiring harness design, sensor integration</li>
                  <li>Competition vehicle electronics: data acquisition, power distribution, CAN bus</li>
                  <li>Transferring to UCF for BS Electrical Engineering, Fall 2026</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{background:'rgba(0,212,255,0.02)'}}>
        <div className="container">
          <div className="section-header">
            <p className="section-label">// 03 — skills</p>
            <h2 className="section-title">Technical <span>Stack</span></h2>
          </div>

          <div className="skills-grid">
            <div className="skill-group">
              <div className="skill-group-label">Hardware</div>
              <div className="skill-items">
                {['KiCad', 'Altium Designer', 'PCB Layout & Routing', 'Schematic Capture',
                  'Oscilloscope / DMM', 'Power Electronics', '2-Layer PCB Design',
                  'Component Selection'].map(s => (
                  <div key={s} className="skill-item">{s}</div>
                ))}
              </div>
            </div>

            <div className="skill-group">
              <div className="skill-group-label">Embedded</div>
              <div className="skill-items">
                {['STM32 (F4 series)', 'Bare-metal C / CMSIS', 'I²C · SPI · UART · PWM',
                  'Raspberry Pi', 'Sensor Fusion', 'Kalman Filter',
                  'DMA & Interrupts', 'FreeRTOS (intro)'].map(s => (
                  <div key={s} className="skill-item">{s}</div>
                ))}
              </div>
            </div>

            <div className="skill-group">
              <div className="skill-group-label">Software</div>
              <div className="skill-items">
                {['C / C++', 'Python', 'MATLAB / Simulink', 'React', 'Flask',
                  'PostgreSQL', 'Git / GitHub', 'Linux CLI'].map(s => (
                  <div key={s} className="skill-item">{s}</div>
                ))}
              </div>
            </div>

            <div className="skill-group">
              <div className="skill-group-label">Research</div>
              <div className="skill-items">
                {['Biomedical Optics', 'NIR Spectroscopy', 'Optical Instrumentation',
                  'Data Acquisition', 'Signal Processing',
                  'Technical Documentation', 'Lab Prototyping'].map(s => (
                  <div key={s} className="skill-item">{s}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="container">
          <div className="section-header">
            <p className="section-label">// 04 — about</p>
            <h2 className="section-title">About <span>Me</span></h2>
          </div>

          <div className="about-grid">
            <div className="about-text">
              <p>
                I'm an Electrical Engineering student transferring to <strong>UCF in Fall 2026</strong>,
                focused on embedded systems, PCB design, and power electronics. I build
                real hardware — not just simulations. My current project, the FC-V1, is a
                custom STM32 dev board I designed from scratch in KiCad and sent to fab.
              </p>
              <p>
                My background is unusual: I grew up around my family's <strong>HVAC business</strong>,
                which gave me an early instinct for systems that have to work in the field.
                That same drive pushed me to build FERDAIR — a production SaaS platform
                that actually runs the business — before I had an EE degree.
              </p>
              <p>
                At the <strong>USF TROPICS Lab</strong>, I work on biomedical optical
                instrumentation — bridging low-level microcontroller code with
                NIR spectroscopy hardware. It's taught me that the gap between a schematic
                and a working sensor pipeline is where most of the engineering actually lives.
              </p>
              <p>
                I'm targeting roles in <strong>defense, aerospace, and automotive</strong> —
                industries where the hardware has to be right the first time. Joining UCF
                Knights Racing Formula SAE in Fall 2026 is part of that path:
                real-time embedded systems on a competition vehicle, shipping under deadline.
              </p>
            </div>

            <div className="about-stats">
              <div className="about-stat">
                <span className="stat-num">2</span>
                <div className="stat-label">PCBs Designed &amp; Ordered</div>
              </div>
              <div className="about-stat">
                <span className="stat-num">50+</span>
                <div className="stat-label">Daily Active Users on FERDAIR</div>
              </div>
              <div className="about-stat">
                <span className="stat-num">F411</span>
                <div className="stat-label">STM32 — Current MCU</div>
              </div>
              <div className="about-stat">
                <span className="stat-num">UCF</span>
                <div className="stat-label">BS EE · Fall 2026 Transfer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container footer-inner">
          <span className="footer-copy">
            Brian Estime © {new Date().getFullYear()} · Built with React
          </span>
          <div className="footer-links">
            <a href="https://github.com/BrianEstime1" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/brianestime" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>
    </>
  )
}
