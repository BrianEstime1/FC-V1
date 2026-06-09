"""
Parse KiCad Gerber files and render a composite board SVG.
Handles format 4.6, absolute coordinates, mm units.
"""
import re, sys, math
from pathlib import Path

GERBER_DIR = Path("/home/user/FC-V1")

# Coordinate scale: format 4.6 means 6 decimal places, divide by 1e6 → mm
SCALE = 1e6

def parse_gerbers():
    files = {
        "edge":  GERBER_DIR / "Stm32-pcb-Edge_Cuts.gm1",
        "f_cu":  GERBER_DIR / "Stm32-pcb-F_Cu.gtl",
        "b_cu":  GERBER_DIR / "Stm32-pcb-B_Cu.gbl",
        "silk":  GERBER_DIR / "Stm32-pcb-F_Silkscreen.gto",
    }

    layers = {}
    for name, path in files.items():
        layers[name] = parse_layer(path.read_text())
    return layers

def parse_layer(text):
    """Extract aperture definitions and draw commands."""
    apertures = {}
    paths = []
    flashes = []
    current_ap = None
    x, y = 0.0, 0.0
    in_region = False
    region_path = []

    # Parse aperture definitions
    for m in re.finditer(r'%ADD(\d+)([A-Z]+),([\d.X]+)\*%', text):
        ap_id = int(m.group(1))
        shape = m.group(2)
        params = [float(p) for p in m.group(3).split('X')]
        apertures[ap_id] = {'shape': shape, 'params': params}

    # Parse also RoundRect apertures
    for m in re.finditer(r'%ADD(\d+)RoundRect,([\d.X-]+)\*%', text):
        ap_id = int(m.group(1))
        params = [float(p) for p in m.group(2).split('X')]
        apertures[ap_id] = {'shape': 'RoundRect', 'params': params}

    lines = text.splitlines()
    i = 0
    current_path = []

    for line in lines:
        # Tool select
        m = re.match(r'D(\d+)\*', line.strip())
        if m:
            d = int(m.group(1))
            if d >= 10:
                current_ap = d
            continue

        # Move/draw/flash
        m = re.match(r'X(-?\d+)Y(-?\d+)D(\d+)\*', line.strip())
        if m:
            nx = int(m.group(1)) / SCALE
            ny = -int(m.group(2)) / SCALE  # flip Y axis
            op = int(m.group(3))
            if op == 2:  # move
                if current_path:
                    paths.append({'ap': current_ap, 'pts': current_path[:]})
                current_path = [(nx, ny)]
            elif op == 1:  # draw
                current_path.append((nx, ny))
            elif op == 3:  # flash
                if current_ap and current_ap in apertures:
                    flashes.append({'ap': current_ap, 'x': nx, 'y': ny,
                                    'aperture': apertures[current_ap]})
            x, y = nx, ny
            continue

        # Move/draw without Y
        m = re.match(r'X(-?\d+)D(\d+)\*', line.strip())
        if m:
            nx = int(m.group(1)) / SCALE
            ny = y
            op = int(m.group(2))
            if op == 2:
                if current_path:
                    paths.append({'ap': current_ap, 'pts': current_path[:]})
                current_path = [(nx, ny)]
            elif op == 1:
                current_path.append((nx, ny))
            elif op == 3:
                if current_ap and current_ap in apertures:
                    flashes.append({'ap': current_ap, 'x': nx, 'y': ny,
                                    'aperture': apertures[current_ap]})
            x, y = nx, ny
            continue

    if current_path and len(current_path) > 1:
        paths.append({'ap': current_ap, 'pts': current_path[:]})

    return {'apertures': apertures, 'paths': paths, 'flashes': flashes}

def board_bounds(layers):
    """Get board extents from edge cuts paths."""
    all_x, all_y = [], []
    for p in layers['edge']['paths']:
        for px, py in p['pts']:
            all_x.append(px); all_y.append(py)
    for f in layers['edge']['flashes']:
        all_x.append(f['x']); all_y.append(f['y'])
    if not all_x:
        return 50.5, -130.0, 93.5, -94.0
    return min(all_x), min(all_y), max(all_x), max(all_y)

def render_svg(layers):
    x0, y0, x1, y1 = board_bounds(layers)
    bw = x1 - x0   # board width  mm
    bh = y1 - y0   # board height mm

    PX = 8.0  # pixels per mm
    pad = 20
    W = bw * PX + pad * 2
    H = bh * PX + pad * 2

    def tx(x): return (x - x0) * PX + pad
    def ty(y): return (y - y0) * PX + pad

    def ap_stroke(ap_id, apertures, default=0.5):
        if ap_id and ap_id in apertures:
            p = apertures[ap_id]['params']
            if p: return max(p[0] * PX, 0.3)
        return default * PX

    parts = []
    parts.append(f'''<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 {W:.1f} {H:.1f}" width="{W:.0f}" height="{H:.0f}"
  style="background:#0B1A0B; border-radius:6px; display:block;">
<defs>
  <filter id="glow">
    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>
''')

    # ── Board fill (PCB green) ──────────────────────────────────────────
    parts.append(f'<rect x="{pad}" y="{pad}" width="{bw*PX:.1f}" height="{bh*PX:.1f}" '
                 f'rx="6" fill="#0D2010" stroke="#1A6B1A" stroke-width="1.5"/>\n')

    # ── B_Cu — blue tinted ground plane fill ──────────────────────────
    parts.append(f'<rect x="{pad+2}" y="{pad+2}" width="{bw*PX-4:.1f}" height="{bh*PX-4:.1f}" '
                 f'rx="4" fill="#071520" opacity="0.4"/>\n')

    # ── B_Cu paths ────────────────────────────────────────────────────
    bcu = layers['b_cu']
    for p in bcu['paths']:
        if len(p['pts']) < 2: continue
        sw = ap_stroke(p['ap'], bcu['apertures'], 0.15)
        pts_str = ' '.join(f'{tx(px):.1f},{ty(py):.1f}' for px, py in p['pts'])
        parts.append(f'<polyline points="{pts_str}" fill="none" '
                     f'stroke="#3366AA" stroke-width="{sw:.2f}" opacity="0.5" '
                     f'stroke-linecap="round" stroke-linejoin="round"/>\n')

    # B_Cu flashes
    for f in bcu['flashes']:
        ap = f['aperture']
        sw = ap['params'][0] * PX if ap['params'] else PX * 0.4
        parts.append(f'<circle cx="{tx(f["x"]):.1f}" cy="{ty(f["y"]):.1f}" '
                     f'r="{sw/2:.2f}" fill="#3366AA" opacity="0.5"/>\n')

    # ── F_Cu paths ────────────────────────────────────────────────────
    fcu = layers['f_cu']
    for p in fcu['paths']:
        if len(p['pts']) < 2: continue
        sw = ap_stroke(p['ap'], fcu['apertures'], 0.15)
        pts_str = ' '.join(f'{tx(px):.1f},{ty(py):.1f}' for px, py in p['pts'])
        parts.append(f'<polyline points="{pts_str}" fill="none" '
                     f'stroke="#D4A800" stroke-width="{sw:.2f}" opacity="0.85" '
                     f'stroke-linecap="round" stroke-linejoin="round"/>\n')

    # F_Cu flashes (pads)
    for f in fcu['flashes']:
        ap = f['aperture']
        shape = ap['shape']
        params = ap['params']
        cx, cy = tx(f['x']), ty(f['y'])
        if shape == 'C' and params:
            r = params[0] * PX / 2
            parts.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.2f}" '
                         f'fill="#D4A800" opacity="0.9"/>\n')
        elif shape == 'R' and len(params) >= 2:
            w, h = params[0] * PX, params[1] * PX
            parts.append(f'<rect x="{cx-w/2:.1f}" y="{cy-h/2:.1f}" '
                         f'width="{w:.2f}" height="{h:.2f}" fill="#D4A800" opacity="0.9"/>\n')
        elif shape in ('O', 'RoundRect') and len(params) >= 2:
            w = abs(params[1] if len(params) > 1 else params[0]) * 2 * PX
            h = abs(params[2] if len(params) > 2 else params[0]) * 2 * PX
            r = min(w, h) * 0.3
            parts.append(f'<rect x="{cx-w/2:.1f}" y="{cy-h/2:.1f}" '
                         f'width="{w:.2f}" height="{h:.2f}" rx="{r:.1f}" '
                         f'fill="#D4A800" opacity="0.9"/>\n')
        else:
            r = (params[0] if params else 0.5) * PX / 2
            parts.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{max(r,1.5):.2f}" '
                         f'fill="#D4A800" opacity="0.9"/>\n')

    # ── Silkscreen ────────────────────────────────────────────────────
    silk = layers['silk']
    for p in silk['paths']:
        if len(p['pts']) < 2: continue
        sw = ap_stroke(p['ap'], silk['apertures'], 0.1)
        pts_str = ' '.join(f'{tx(px):.1f},{ty(py):.1f}' for px, py in p['pts'])
        parts.append(f'<polyline points="{pts_str}" fill="none" '
                     f'stroke="#CCDDCC" stroke-width="{max(sw,0.8):.2f}" opacity="0.7" '
                     f'stroke-linecap="round" stroke-linejoin="round"/>\n')

    # ── Edge cuts (board outline) ─────────────────────────────────────
    edge = layers['edge']
    for p in edge['paths']:
        if len(p['pts']) < 2: continue
        pts_str = ' '.join(f'{tx(px):.1f},{ty(py):.1f}' for px, py in p['pts'])
        parts.append(f'<polyline points="{pts_str}" fill="none" '
                     f'stroke="#22AA22" stroke-width="2" opacity="1" '
                     f'stroke-linecap="round"/>\n')

    # ── Legend ────────────────────────────────────────────────────────
    lx, ly = pad, H - 8
    for color, label in [('#D4A800','F.Cu'), ('#3366AA','B.Cu'), ('#CCDDCC','Silk'), ('#22AA22','Edge')]:
        parts.append(f'<rect x="{lx}" y="{ly-7}" width="10" height="5" fill="{color}" rx="1" opacity="0.8"/>')
        parts.append(f'<text x="{lx+13}" y="{ly-2}" font-family="monospace" font-size="6" fill="#aaa">{label}</text>')
        lx += 60

    parts.append(f'<text x="{W/2:.0f}" y="{H-2}" text-anchor="middle" '
                 f'font-family="monospace" font-size="6" fill="#3A7A3A" letter-spacing="1">'
                 f'{bw:.1f}mm × {bh:.1f}mm · 2-LAYER · KiCad 9.0</text>')

    parts.append('</svg>')
    return ''.join(parts)

if __name__ == '__main__':
    layers = parse_gerbers()
    svg = render_svg(layers)
    out = Path('/home/user/FC-V1/docs/fc-v1-board.svg')
    out.parent.mkdir(exist_ok=True)
    out.write_text(svg)
    print(f"Written {out}  ({len(svg)//1024}KB)")

    # Stats
    for name, layer in layers.items():
        print(f"  {name:8s}: {len(layer['paths'])} paths, {len(layer['flashes'])} flashes")
