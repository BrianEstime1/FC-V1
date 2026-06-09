import { useParams, Link } from 'react-router-dom'

const PROJECTS = {
  'fc-v1': {
    title: 'FC-V1 — Custom STM32 Dev Board',
    status: 'In Progress',
    statusClass: 'badge-wip',
    eta: 'assembling now',
    tags: ['KiCad 9.0', 'STM32F411CEU6', '2-Layer PCB', 'IMU · I²C', 'USB-C', 'SWD', 'Kalman Filter', 'Bare-metal C'],
    images: [
      { src: '/fc-v1-board.svg', caption: 'PCB layout — rendered from KiCad Gerbers (F.Cu / B.Cu / Silkscreen)' },
    ],
    note: '⚠ Boards ordered with 0402 passives — currently prototyping on breadboard while waiting on a reflow solution.',
  },
  'buck-converter': {
    title: 'Synchronous Buck Converter PCB',
    status: 'Ordered',
    statusClass: 'badge-ordered',
    eta: 'board arrives soon',
    tags: ['KiCad', 'Power Electronics', 'Synchronous Buck', 'MOSFET Switching', 'Gate Driver', 'Thermal Design', 'DC-DC'],
    images: [
      { src: '/buck-board.svg', caption: 'PCB layout — rendered from KiCad Gerbers (F.Cu / B.Cu / Silkscreen) · 68.9mm × 59.0mm · 2-layer' },
    ],
    note: null,
  },
  'ferdair': {
    title: 'FERDAIR — HVAC Management Platform',
    status: 'Live',
    statusClass: 'badge-live',
    eta: null,
    tags: ['React', 'Flask', 'PostgreSQL', 'Full-Stack', 'Invoice Engine', 'SaaS', 'Production'],
    images: [],
    note: null,
  },
}

export default function ProjectPage() {
  const { slug } = useParams()
  const project = PROJECTS[slug]

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <p style={{ color: 'var(--text-dim)', fontFamily: 'var(--font)' }}>// 404 — project not found</p>
        <Link to="/" style={{ color: 'var(--cyan)', fontFamily: 'var(--font)', fontSize: 13 }}>← back to portfolio</Link>
      </div>
    )
  }

  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
        <div className="container nav-inner">
          <Link to="/" style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, color: 'var(--cyan)', letterSpacing: '0.05em', textDecoration: 'none' }}>
            ← ~/brian-estime
          </Link>
          <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            /projects/{slug}
          </span>
        </div>
      </nav>

      <div style={{ paddingTop: 96, paddingBottom: 80 }}>
        <div className="container" style={{ maxWidth: 780 }}>

          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 11, color: 'var(--cyan)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>
              // project writeup
            </p>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.2 }}>
              {project.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span className={`status-badge ${project.statusClass}`}>
                {project.status === 'Live' ? '● ' : project.status === 'Ordered' ? '◎ ' : '◉ '}{project.status}
              </span>
              <div className="tags" style={{ margin: 0 }}>
                {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          </div>

          {/* Note if any */}
          {project.note && (
            <div className="card-note" style={{ marginBottom: 32 }}>
              {project.note}
            </div>
          )}

          {/* Images */}
          {project.images.length > 0 && (
            <div style={{ marginBottom: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {project.images.map((img, i) => (
                <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: 'var(--bg-card)' }}>
                  <img src={img.src} alt={img.caption} style={{ width: '100%', display: 'block' }} />
                  {img.caption && (
                    <p style={{ padding: '10px 16px', fontSize: 11, color: 'var(--text-muted)', borderTop: '1px solid var(--border)', margin: 0 }}>
                      {img.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Writeup placeholder */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '40px 36px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 2, height: 24, background: 'var(--cyan)', borderRadius: 1, flexShrink: 0 }} />
              <p style={{ fontSize: 11, color: 'var(--cyan)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
                Technical Writeup
              </p>
            </div>

            <div style={{
              border: '1px dashed var(--border)',
              borderRadius: 6,
              padding: '32px 28px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 20, marginBottom: 12 }}>✍</p>
              <p style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 8, lineHeight: 1.8 }}>
                Writeup coming soon
                {project.eta ? ` — ${project.eta}.` : '.'}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 440, margin: '0 auto' }}>
                This page will hold the full technical narrative — decisions made, things that broke, what the oscilloscope showed, what got redesigned. Written after the hardware is in hand and tested, not before.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
