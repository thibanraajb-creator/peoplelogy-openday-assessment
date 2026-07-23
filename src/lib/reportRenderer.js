/**
 * reportRenderer.js
 * ---------------------------------------------------------------
 * A small vector-PDF layout engine built on jsPDF's text API.
 *
 * WHY THIS EXISTS
 * The previous approach (html2canvas -> jsPDF.addImage) produced a
 * single 6330px-tall raster crushed onto one A4 page: ~39MB, zero
 * text layer, and any content inside a collapsed tab/accordion was
 * display:none and therefore never captured.
 *
 * This renders real vector text. Output is ~150KB, selectable,
 * searchable, correctly paginated, and generated with zero network
 * calls — it works on dead exhibition wifi.
 *
 * USAGE
 *   import { Doc } from './reportRenderer'
 *   const d = new Doc({ title: 'Your AI Readiness Report' })
 *   d.heroCard({...}); d.barRow({...}); d.save('report.pdf')
 *
 * Requires: jspdf ^2.5
 * ---------------------------------------------------------------
 */

import { jsPDF } from 'jspdf'

/* ---------------------------------------------------------------
 * DESIGN TOKENS — mirror the on-screen report
 * ------------------------------------------------------------- */
export const T = {
  navy:      '#1B3A5C',
  navyDeep:  '#12263F',
  teal:      '#00ADA9',
  blue:      '#3B82F6',
  green:     '#22C55E',
  orange:    '#F97316',
  red:       '#EF4444',
  purple:    '#7C3AED',
  amber:     '#EAB308',
  ink:       '#1F2937',
  body:      '#4B5563',
  muted:     '#9CA3AF',
  rule:      '#E5E7EB',
  track:     '#EDF0F3',
  panel:     '#F7F9FB',
  white:     '#FFFFFF',
}

/* A4 portrait, millimetres */
const PAGE_W = 210
const PAGE_H = 297
const M = 16                     // outer margin
const CONTENT_W = PAGE_W - M * 2 // 178mm
const FOOTER_RESERVE = 16        // keep-out zone at page bottom

const hex = (h) => {
  const s = h.replace('#', '')
  return [
    parseInt(s.slice(0, 2), 16),
    parseInt(s.slice(2, 4), 16),
    parseInt(s.slice(4, 6), 16),
  ]
}

export class Doc {
  /**
   * @param {object} opts
   * @param {string} opts.runningHeader  repeated at top of pages 2+
   * @param {string} opts.footerNote     repeated at bottom of every page
   */
  constructor(opts = {}) {
    this.pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
    this.pdf.setFont('helvetica', 'normal')
    this.y = M
    this.page = 1
    this.runningHeader = opts.runningHeader || ''
    this.footerNote = opts.footerNote || ''
    this._paintPageChrome()
  }

  /* ---------- internal ---------- */

  _fill(color) { const [r, g, b] = hex(color); this.pdf.setFillColor(r, g, b) }
  _stroke(color) { const [r, g, b] = hex(color); this.pdf.setDrawColor(r, g, b) }
  _text(color) { const [r, g, b] = hex(color); this.pdf.setTextColor(r, g, b) }

  _font(size, weight = 'normal') {
    this.pdf.setFont('helvetica', weight)
    this.pdf.setFontSize(size)
  }

  /** Height of `txt` when wrapped to `w` at the CURRENT font setting. */
  _measure(txt, w, lineH) {
    const lines = this.pdf.splitTextToSize(String(txt ?? ''), w)
    return { lines, h: lines.length * lineH }
  }

  /** Break to a new page if `need` mm won't fit above the footer zone. */
  _need(need) {
    if (this.y + need > PAGE_H - M - FOOTER_RESERVE) this.addPage()
  }

  _paintPageChrome() {
    // footer rule + note + page number
    const fy = PAGE_H - M - 4
    this._stroke(T.rule)
    this.pdf.setLineWidth(0.2)
    this.pdf.line(M, fy - 4, PAGE_W - M, fy - 4)

    this._font(7, 'normal')
    this._text(T.muted)
    if (this.footerNote) this.pdf.text(this.footerNote, M, fy)
    this.pdf.text(`Page ${this.page}`, PAGE_W - M, fy, { align: 'right' })
  }

  addPage() {
    this.pdf.addPage()
    this.page += 1
    this.y = M
    this._paintPageChrome()
    if (this.runningHeader) {
      this._font(7.5, 'normal')
      this._text(T.muted)
      this.pdf.text(this.runningHeader, M, this.y)
      this.y += 6
    }
    return this
  }

  space(mm = 4) { this.y += mm; return this }

  /* ---------- primitives ---------- */

  /** Document title block. Only used once, at the very top. */
  docHeader({ title, subtitle, meta }) {
    this._font(20, 'bold')
    this._text(T.navy)
    this.pdf.text(title, M, this.y + 6)
    this.y += 10

    if (subtitle) {
      this._font(11, 'normal')
      this._text(T.body)
      this.pdf.text(subtitle, M, this.y + 3)
      this.y += 6
    }
    if (meta) {
      this._font(8, 'normal')
      this._text(T.muted)
      this.pdf.text(meta, M, this.y + 2)
      this.y += 5
    }
    this.y += 3
    this._stroke(T.rule)
    this.pdf.setLineWidth(0.3)
    this.pdf.line(M, this.y, PAGE_W - M, this.y)
    this.y += 7
    return this
  }

  /** Small uppercase section label, e.g. "REALITY CHECK SCORES". */
  sectionLabel(txt, color = T.teal) {
    this._need(12)
    this._font(8, 'bold')
    this._text(color)
    this.pdf.text(String(txt).toUpperCase(), M, this.y + 3)
    this.y += 7
    return this
  }

  /**
   * Dark hero panel — archetype / headline result.
   * Auto-measures so it never overflows a page.
   */
  heroCard({ eyebrow, headline, tagline, body, accent = T.blue, bg = T.navy }) {
    const padX = 10, padY = 9
    const innerW = CONTENT_W - padX * 2

    // measure first
    let h = padY
    if (eyebrow) h += 6
    this._font(17, 'bold')
    const H = this._measure(headline, innerW, 7.4); h += H.h + 2
    let TG = null
    if (tagline) { this._font(10, 'normal'); TG = this._measure(tagline, innerW, 5.2); h += TG.h + 3 }
    let B = null
    if (body) { this._font(9, 'normal'); B = this._measure(body, innerW, 4.6); h += 4 + B.h }
    h += padY

    this._need(h)

    this._fill(bg)
    this.pdf.roundedRect(M, this.y, CONTENT_W, h, 3.5, 3.5, 'F')

    let cy = this.y + padY
    const cx = PAGE_W / 2

    if (eyebrow) {
      this._font(7, 'bold'); this._text(T.teal)
      this.pdf.text(String(eyebrow).toUpperCase(), cx, cy + 2, { align: 'center' })
      cy += 6
    }
    this._font(17, 'bold'); this._text(accent)
    H.lines.forEach((l, i) => this.pdf.text(l, cx, cy + 5.6 + i * 7.4, { align: 'center' }))
    cy += H.h + 2

    if (TG) {
      this._font(10, 'normal'); this._text('#D6E0EA')
      TG.lines.forEach((l, i) => this.pdf.text(l, cx, cy + 4 + i * 5.2, { align: 'center' }))
      cy += TG.h + 3
    }
    if (B) {
      // hairline divider
      this._stroke(T.teal); this.pdf.setLineWidth(0.4)
      this.pdf.line(cx - 12, cy + 1, cx + 12, cy + 1)
      cy += 4
      this._font(9, 'normal'); this._text('#AFC0CF')
      B.lines.forEach((l, i) => this.pdf.text(l, cx, cy + 3.4 + i * 4.6, { align: 'center' }))
    }

    this.y += h + 6
    return this
  }

  /**
   * Two side-by-side stat cards (Operational Readiness / Leadership & Culture).
   * Pass 1 item for a single full-width card.
   */
  statCards(items) {
    const h = 26
    this._need(h + 4)
    const gap = 6
    const w = items.length === 1 ? CONTENT_W : (CONTENT_W - gap) / 2

    items.forEach((it, i) => {
      const x = M + i * (w + gap)
      this._fill(T.white); this._stroke(T.rule); this.pdf.setLineWidth(0.3)
      this.pdf.roundedRect(x, this.y, w, h, 2.5, 2.5, 'FD')

      this._font(7, 'bold'); this._text(T.muted)
      this.pdf.text(String(it.label).toUpperCase(), x + w / 2, this.y + 6, { align: 'center' })

      this._font(19, 'bold'); this._text(T.navy)
      this.pdf.text(`${it.value}%`, x + w / 2, this.y + 15.5, { align: 'center' })

      // progress track
      const bw = w - 12
      this._fill(T.track)
      this.pdf.roundedRect(x + 6, this.y + 19.5, bw, 2.4, 1.2, 1.2, 'F')
      const pct = Math.max(0, Math.min(100, Number(it.value) || 0))
      if (pct > 0) {
        this._fill(it.color || T.teal)
        this.pdf.roundedRect(x + 6, this.y + 19.5, (bw * pct) / 100, 2.4, 1.2, 1.2, 'F')
      }
    })
    this.y += h + 6
    return this
  }

  /** Tinted callout box for conditional insight copy. */
  calloutBox({ text, accent = T.blue, tint = '#EFF6FF', title }) {
    const padX = 7, padY = 6
    const innerW = CONTENT_W - padX * 2 - 2

    let h = padY
    if (title) { this._font(9, 'bold'); h += 5 }
    this._font(8.6, 'normal')
    const B = this._measure(text, innerW, 4.4)
    h += B.h + padY

    this._need(h + 3)

    this._fill(tint); this._stroke(accent); this.pdf.setLineWidth(0.25)
    this.pdf.roundedRect(M, this.y, CONTENT_W, h, 2.5, 2.5, 'FD')
    // accent spine
    this._fill(accent)
    this.pdf.rect(M, this.y + 1.5, 1.4, h - 3, 'F')

    let cy = this.y + padY
    if (title) {
      this._font(9, 'bold'); this._text(accent)
      this.pdf.text(title, M + padX, cy + 2)
      cy += 5
    }
    this._font(8.6, 'normal'); this._text(T.ink)
    B.lines.forEach((l, i) => this.pdf.text(l, M + padX, cy + 3.2 + i * 4.4))

    this.y += h + 5
    return this
  }

  /**
   * Labelled horizontal bar. Used for pillars, dimensions, heatmap rows.
   * `note` renders as a small grey caption under the label.
   */
  barRow({ label, value, color, note, badge }) {
    const h = note ? 15 : 11
    this._need(h)

    this._font(9.5, 'bold'); this._text(T.ink)
    this.pdf.text(String(label), M, this.y + 3.5)

    const pct = Math.max(0, Math.min(100, Number(value) || 0))
    const c = color || (pct >= 75 ? T.green : pct >= 50 ? T.orange : T.red)

    this._font(9.5, 'bold'); this._text(c)
    this.pdf.text(`${pct}%`, PAGE_W - M, this.y + 3.5, { align: 'right' })

    if (badge) {
      const bw = this.pdf.getTextWidth(badge) + 5
      this._font(6.5, 'bold')
      const bx = PAGE_W - M - 14 - bw
      this._fill(badge === 'Strength' ? '#E8F8EE' : '#FEF2E7')
      this.pdf.roundedRect(bx, this.y - 0.6, bw, 5, 2.5, 2.5, 'F')
      this._text(badge === 'Strength' ? T.green : T.orange)
      this.pdf.text(badge, bx + bw / 2, this.y + 2.8, { align: 'center' })
    }

    const by = this.y + 6
    this._fill(T.track)
    this.pdf.roundedRect(M, by, CONTENT_W, 2.6, 1.3, 1.3, 'F')
    if (pct > 0) {
      this._fill(c)
      this.pdf.roundedRect(M, by, (CONTENT_W * pct) / 100, 2.6, 1.3, 1.3, 'F')
    }

    if (note) {
      this._font(7.4, 'normal'); this._text(T.muted)
      this.pdf.text(String(note), M, by + 6)
    }
    this.y += h
    return this
  }

  /** Centred outlined badge — capability tier / maturity level. */
  tierBadge({ label, sub, color = T.teal }) {
    const h = 20
    this._need(h + 4)
    const w = 84
    const x = (PAGE_W - w) / 2

    this._fill(T.white); this._stroke(color); this.pdf.setLineWidth(0.6)
    this.pdf.roundedRect(x, this.y, w, h, 3, 3, 'FD')

    this._font(15, 'bold'); this._text(color)
    this.pdf.text(String(label), PAGE_W / 2, this.y + 9.5, { align: 'center' })

    if (sub) {
      this._font(8, 'normal'); this._text(T.muted)
      this.pdf.text(String(sub), PAGE_W / 2, this.y + 15.5, { align: 'center' })
    }
    this.y += h + 6
    return this
  }

  /** Numbered action list — "What you should do first". */
  numberedList(items, accent = T.teal) {
    items.forEach((it, i) => {
      this._font(8.6, 'normal')
      const B = this._measure(it.desc, CONTENT_W - 12, 4.3)
      const h = 7 + B.h + 3
      this._need(h)

      this._fill(accent)
      this.pdf.circle(M + 3, this.y + 3, 3, 'F')
      this._font(8, 'bold'); this._text(T.white)
      this.pdf.text(String(i + 1), M + 3, this.y + 4.2, { align: 'center' })

      this._font(9.6, 'bold'); this._text(T.ink)
      this.pdf.text(String(it.title), M + 9, this.y + 4)

      this._font(8.6, 'normal'); this._text(T.body)
      B.lines.forEach((l, k) => this.pdf.text(l, M + 9, this.y + 9.6 + k * 4.3))

      this.y += h
    })
    return this
  }

  /** Learning-track row with RECOMMENDED / ALSO RELEVANT state. */
  trackRow({ number, category, name, tagline, color, badge, dim }) {
    const h = 15
    this._need(h)

    if (badge) {
      this._fill(badge === 'RECOMMENDED' ? '#E6F7F6' : '#EEF2F7')
      this._stroke(badge === 'RECOMMENDED' ? T.teal : T.navy)
      this.pdf.setLineWidth(0.4)
      this.pdf.roundedRect(M, this.y, CONTENT_W, h - 2, 2.5, 2.5, 'FD')
    }

    const a = dim ? T.muted : color
    this._fill(a)
    this.pdf.roundedRect(M + 3, this.y + 3.4, 16, 5.4, 2.7, 2.7, 'F')
    this._font(6.8, 'bold'); this._text(T.white)
    this.pdf.text(`Track ${number}`, M + 11, this.y + 7.1, { align: 'center' })

    this._font(7, 'normal'); this._text(T.muted)
    this.pdf.text(category, M + 22, this.y + 7.1)

    this._font(10, 'bold'); this._text(dim ? T.muted : T.ink)
    this.pdf.text(name, M + 44, this.y + 7.4)

    this._font(8, 'normal'); this._text(T.muted)
    const tw = this.pdf.getTextWidth(name)
    this.pdf.text(`— ${tagline}`, M + 47 + tw, this.y + 7.4)

    if (badge) {
      this._font(6.5, 'bold')
      const bw = this.pdf.getTextWidth(badge) + 6
      const bx = PAGE_W - M - 3 - bw
      this._fill(badge === 'RECOMMENDED' ? T.teal : T.navy)
      this.pdf.roundedRect(bx, this.y + 3.4, bw, 5.4, 2.7, 2.7, 'F')
      this._text(T.white)
      this.pdf.text(badge, bx + bw / 2, this.y + 7.1, { align: 'center' })
    }

    this.y += h
    return this
  }

  /** Legend chips for the heatmap bands. */
  legend(items) {
    this._need(9)
    let x = M
    items.forEach((it) => {
      this._font(7, 'normal')
      const w = this.pdf.getTextWidth(it.label) + 9
      this._fill(it.tint)
      this.pdf.roundedRect(x, this.y, w, 5.6, 2.8, 2.8, 'F')
      this._fill(it.color)
      this.pdf.circle(x + 3, this.y + 2.8, 1.3, 'F')
      this._text(it.color)
      this.pdf.text(it.label, x + 6, this.y + 3.8)
      x += w + 4
    })
    this.y += 10
    return this
  }

  /** Closing quote panel — the participant's own words. */
  quotePanel({ lead, quote, response, note }) {
    const padX = 10, padY = 8
    const innerW = CONTENT_W - padX * 2

    let h = padY
    this._font(8.4, 'normal'); h += 5
    this._font(11, 'bolditalic')
    const Q = this._measure(`"${quote}"`, innerW, 5.6); h += Q.h + 4
    this._font(8.6, 'normal')
    const R = this._measure(response, innerW, 4.4); h += R.h
    if (note) h += 6
    h += padY

    this._need(h)

    this._fill(T.navyDeep)
    this.pdf.roundedRect(M, this.y, CONTENT_W, h, 3.5, 3.5, 'F')

    const cx = PAGE_W / 2
    let cy = this.y + padY
    this._font(8.4, 'normal'); this._text('#8FA3B8')
    this.pdf.text(lead, cx, cy + 3, { align: 'center' })
    cy += 5

    this._font(11, 'bolditalic'); this._text(T.white)
    Q.lines.forEach((l, i) => this.pdf.text(l, cx, cy + 4.6 + i * 5.6, { align: 'center' }))
    cy += Q.h + 4

    this._font(8.6, 'normal'); this._text('#AFC0CF')
    R.lines.forEach((l, i) => this.pdf.text(l, cx, cy + 3.2 + i * 4.4, { align: 'center' }))
    cy += R.h

    if (note) {
      this._font(7, 'normal'); this._text('#6B8299')
      this.pdf.text(note, cx, cy + 4, { align: 'center' })
    }

    this.y += h + 5
    return this
  }

  /** Simple key/value grid — used by the facilitator summary. */
  kvGrid(pairs, cols = 3) {
    const gap = 5
    const w = (CONTENT_W - gap * (cols - 1)) / cols
    const rows = Math.ceil(pairs.length / cols)
    const h = 18
    this._need(rows * (h + gap))

    pairs.forEach((p, i) => {
      const r = Math.floor(i / cols), c = i % cols
      const x = M + c * (w + gap)
      const yy = this.y + r * (h + gap)
      this._fill(T.panel); this._stroke(T.rule); this.pdf.setLineWidth(0.25)
      this.pdf.roundedRect(x, yy, w, h, 2.5, 2.5, 'FD')
      this._font(6.8, 'bold'); this._text(T.muted)
      this.pdf.text(String(p.label).toUpperCase(), x + w / 2, yy + 6, { align: 'center' })
      this._font(15, 'bold'); this._text(p.color || T.navy)
      this.pdf.text(String(p.value), x + w / 2, yy + 14, { align: 'center' })
    })
    this.y += rows * (h + gap) + 2
    return this
  }

  /** Plain paragraph. */
  paragraph(txt, { size = 9, color = T.body, weight = 'normal' } = {}) {
    this._font(size, weight)
    const B = this._measure(txt, CONTENT_W, size * 0.5 + 0.2)
    this._need(B.h + 3)
    this._text(color)
    B.lines.forEach((l, i) => this.pdf.text(l, M, this.y + 3 + i * (size * 0.5 + 0.2)))
    this.y += B.h + 4
    return this
  }

  /**
   * Expanded track panel — the content that lived inside the on-screen
   * accordion and was therefore invisible to html2canvas.
   *
   * Renders: OBJECTIVE / TARGET AUDIENCE / COURSES IN THIS TRACK /
   * WHAT YOU WILL ACHIEVE.
   *
   * Course lists auto-flow into 2 columns above `colBreak` entries
   * (Track 2 has 14 courses; a single column would eat half a page).
   *
   * The whole panel is measured first. If it fits on a fresh page but
   * not the remaining space, we break BEFORE drawing so the panel is
   * never split across pages. If it is too tall for any single page,
   * we draw it unboxed and let it flow.
   */
  /** Measure a trackDetail panel without drawing it. */
  measureTrackDetail({ objective, audience, courses = [], outcomes = [], colBreak = 7 }) {
    const padX = 7, padY = 6
    const innerW = CONTENT_W - padX * 2
    const twoCol = courses.length > colBreak
    const colW = twoCol ? (innerW - 6) / 2 : innerW

    this._font(8.4, 'normal')
    const OBJ = this._measure(objective, innerW, 4.3)
    const AUD = this._measure(audience, innerW, 4.3)
    const courseLines = courses.map(c => this._measure(c, colW - 6, 4.2))
    const courseRows = twoCol ? Math.ceil(courses.length / 2) : courses.length
    const coursesH = twoCol
      ? courseRows * 5
      : courseLines.reduce((a, m) => a + Math.max(5, m.h), 0)
    const outcomeMeas = outcomes.map(o => this._measure(o, innerW - 7, 4.2))
    const outcomesH = outcomeMeas.reduce((a, m) => a + Math.max(5, m.h), 0)

    let h = padY + 4 + OBJ.h + 4 + 4 + AUD.h + 4
    if (courses.length) h += 4 + coursesH + 4
    if (outcomes.length) h += 4 + outcomesH
    h += padY

    return { h, OBJ, AUD, coursesH, outcomeMeas, twoCol, colW, padX, padY }
  }

  trackDetail(opts) {
    const { objective, audience, courses = [], outcomes = [], accent = T.teal } = opts
    const m = this.measureTrackDetail(opts)
    const { h, OBJ, AUD, coursesH, outcomeMeas, twoCol, colW, padX, padY } = m

    const usable = PAGE_H - M * 2 - FOOTER_RESERVE
    const boxed = h <= usable
    if (boxed) this._need(h + 3)

    const top = this.y
    if (boxed) {
      this._fill('#F7F9FB')
      this._stroke(T.rule)
      this.pdf.setLineWidth(0.25)
      this.pdf.roundedRect(M, top, CONTENT_W, h, 2.5, 2.5, 'FD')
      this._fill(accent)
      this.pdf.rect(M, top + 1.5, 1.4, h - 3, 'F')
    }

    let cy = top + padY
    const label = (txt) => {
      this._font(6.8, 'bold'); this._text(T.muted)
      this.pdf.text(String(txt).toUpperCase(), M + padX, cy + 2)
      cy += 4
    }

    /* ----- OBJECTIVE ----- */
    label('Objective')
    this._font(8.4, 'normal'); this._text(T.body)
    OBJ.lines.forEach((l, i) => this.pdf.text(l, M + padX, cy + 3.2 + i * 4.3))
    cy += OBJ.h + 4

    /* ----- TARGET AUDIENCE ----- */
    label('Target audience')
    this._font(8.4, 'normal'); this._text(T.body)
    AUD.lines.forEach((l, i) => this.pdf.text(l, M + padX, cy + 3.2 + i * 4.3))
    cy += AUD.h + 4

    /* ----- COURSES ----- */
    if (courses.length) {
      label(`Courses in this track (${courses.length})`)
      this._font(8.4, 'normal')
      courses.forEach((c, i) => {
        const col = twoCol ? i % 2 : 0
        const row = twoCol ? Math.floor(i / 2) : i
        const x = M + padX + col * (colW + 6)
        const yy = cy + row * 5
        this._fill(accent)
        this.pdf.circle(x + 1.2, yy + 2, 1, 'F')
        this._text(T.navy)
        const txt = twoCol
          ? this.pdf.splitTextToSize(c, colW - 6)[0]
          : c
        this.pdf.text(txt, x + 4, yy + 3)
      })
      cy += coursesH + 4
    }

    /* ----- OUTCOMES ----- */
    if (outcomes.length) {
      label('What you will achieve')
      this._font(8.4, 'normal')
      outcomes.forEach((o, i) => {
        const m = outcomeMeas[i]
        // tick mark drawn as two vector strokes — no icon font needed
        this._stroke(accent); this.pdf.setLineWidth(0.7)
        this.pdf.line(M + padX + 0.6, cy + 2.2, M + padX + 1.7, cy + 3.3)
        this.pdf.line(M + padX + 1.7, cy + 3.3, M + padX + 3.8, cy + 0.9)
        this._text(T.body)
        m.lines.forEach((l, k) => this.pdf.text(l, M + padX + 6.5, cy + 3 + k * 4.2))
        cy += Math.max(5, m.h)
      })
    }

    this.y = boxed ? top + h + 5 : cy + 5
    return this
  }

  /**
   * Track header + expanded detail as ONE unbreakable unit.
   *
   * Without this, a badged track row can land at the foot of a page
   * with its OBJECTIVE / COURSES panel orphaned onto the next —
   * which reads as a layout fault to anyone holding the PDF.
   *
   * We measure both, then break BEFORE the header if the pair won't
   * fit. If the detail alone exceeds a full page we allow the split,
   * since there is nowhere else for it to go.
   */
  trackBlock({ track, badge }) {
    const detailOpts = {
      objective: track.objective,
      audience: track.audience,
      courses: track.courses,
      outcomes: track.outcomes,
      accent: track.color,
    }
    const { h: detailH } = this.measureTrackDetail(detailOpts)
    const headerH = 15
    const usable = PAGE_H - M * 2 - FOOTER_RESERVE

    // Keep together when the pair genuinely fits on one page.
    if (headerH + detailH <= usable) {
      this._need(headerH + detailH + 3)
    } else {
      // Oversized panel: at minimum keep the header with the first
      // ~45mm of detail so the reader sees what it belongs to.
      this._need(headerH + 45)
    }

    this.trackRow({ ...track, badge, dim: false })
    this.trackDetail(detailOpts)
    return this
  }

  /**
   * Compact all-tracks comparison table.
   * Keeps the cross-sell catalogue present without diluting the
   * two recommended tracks above it.
   */
  /* `countHeader` labels the numeric column. The productivity report
     counts courses; the safety report shows contact hours. Shared
     primitive, so the caller names it. */
  comparisonTable({ rows, highlight = [], countHeader = 'COURSES' }) {
    const colW = [46, 62, 18, 52]   // Track | Audience | Courses | Focus
    const headH = 7

    this._need(headH + 12)

    /* header */
    this._fill(T.navy)
    this.pdf.roundedRect(M, this.y, CONTENT_W, headH, 1.5, 1.5, 'F')
    this._font(6.8, 'bold'); this._text(T.white)
    const heads = ['TRACK', 'WHO IT IS FOR', countHeader, 'FOCUS']
    let hx = M + 3
    heads.forEach((hd, i) => {
      this.pdf.text(hd, hx, this.y + 4.6)
      hx += colW[i]
    })
    this.y += headH

    rows.forEach((r) => {
      this._font(7.4, 'normal')
      const A = this._measure(r.audience, colW[1] - 4, 3.9)
      const F = this._measure(r.focus, colW[3] - 4, 3.9)
      const rowH = Math.max(11, A.h + 4, F.h + 4)

      this._need(rowH)

      const isHi = highlight.includes(r.number)
      if (isHi) {
        this._fill('#E6F7F6')
        this.pdf.rect(M, this.y, CONTENT_W, rowH, 'F')
      }
      this._stroke(T.rule); this.pdf.setLineWidth(0.2)
      this.pdf.line(M, this.y + rowH, PAGE_W - M, this.y + rowH)

      let x = M + 3
      /* track name + colour dot */
      this._fill(r.color)
      this.pdf.circle(x + 1.2, this.y + 4.4, 1.3, 'F')
      this._font(7.8, 'bold'); this._text(T.ink)
      this.pdf.text(r.name, x + 4.5, this.y + 5.2)
      this._font(6.4, 'normal'); this._text(T.muted)
      this.pdf.text(`Track ${r.number} · ${r.category}`, x + 4.5, this.y + 8.8)
      x += colW[0]

      /* audience */
      this._font(7.4, 'normal'); this._text(T.body)
      A.lines.forEach((l, i) => this.pdf.text(l, x, this.y + 4.6 + i * 3.9))
      x += colW[1]

      /* course count */
      this._font(10, 'bold'); this._text(isHi ? T.teal : T.navy)
      this.pdf.text(String(r.courseCount), x + 6, this.y + 5.8, { align: 'center' })
      x += colW[2]

      /* focus */
      this._font(7.4, 'normal'); this._text(T.body)
      F.lines.forEach((l, i) => this.pdf.text(l, x, this.y + 4.6 + i * 3.9))

      this.y += rowH
    })
    this.y += 5
    return this
  }

  /* ---------- output ---------- */

  /**
   * Mobile-safe save.
   *
   * jsPDF's doc.save() is unreliable in iOS Safari — it frequently
   * does nothing at all. We generate a Blob, try the anchor-download
   * path, and fall back to opening the blob in a new tab so the user
   * can use the native share sheet. Returns the blob URL so the
   * caller can render a visible fallback link.
   */
  save(filename = 'report.pdf') {
    const blob = this.pdf.output('blob')
    const url = URL.createObjectURL(blob)

    const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    if (isIOS) {
      // Safari ignores the download attribute; opening lets the user
      // hit Share -> Save to Files.
      const w = window.open(url, '_blank')
      if (!w) {
        // popup blocked — navigate in place
        window.location.href = url
      }
    } else {
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }

    // Don't revoke immediately — iOS needs the URL to stay alive.
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
    return url
  }

  blob() { return this.pdf.output('blob') }
}

export { PAGE_W, PAGE_H, M, CONTENT_W }
