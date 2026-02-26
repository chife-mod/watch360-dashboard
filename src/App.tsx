import { useState, useCallback, useRef } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import './styles/global.css'
import { Slide2 } from './components/slides/Slide2'
import { Slide3 } from './components/slides/Slide3'
import { Slide4 } from './components/slides/Slide4'
import LOGO_BVLGARI from '/assets/brand-logos/bvlgari.svg'
import LOGO_CITIZEN from '/assets/brand-logos/citizen.svg'
import LOGO_ZENITH from '/assets/brand-logos/zenith.svg'
import LOGO_ALPINA from '/assets/brand-logos/alpina.svg'
import LOGO_PEQUIGNET from '/assets/brand-logos/pequignet.svg'

const MIN = 0.2
const MAX = 1.0
const STEP = 0.05
const DEFAULT = 0.55

const SLIDE_W = 1080
const SLIDE_H = 1350
const GAP = 40
const PEEK = 120   // px of next slide visible on the right

const SLIDES_COUNT = 4

/* ── Slide 4 data (Rank 6–10) ── */
const SLIDE4_BRANDS = [
    { name: 'Bvlgari', count: 7, logo: LOGO_BVLGARI },
    { name: 'Citizen', count: 7, logo: LOGO_CITIZEN },
    { name: 'Zenith', count: 6, logo: LOGO_ZENITH },
    { name: 'Alpina', count: 5, logo: LOGO_ALPINA },
    { name: 'Pequignet', count: 5, logo: LOGO_PEQUIGNET },
]

function App() {
    const [scale, setScale] = useState(DEFAULT)
    const [activeIndex, setActiveIndex] = useState(0)
    const [isExporting, setIsExporting] = useState(false)

    // slideRefs — native 1080×1350 slide elements for PDF capture
    const slideRefs = useRef<(HTMLDivElement | null)[]>([])
    // deckRef — scroll container
    const deckRef = useRef<HTMLDivElement>(null)
    // wrapperRef — the scaled outer container
    const wrapperRef = useRef<HTMLDivElement>(null)

    const clamp = (v: number) => Math.round(Math.min(MAX, Math.max(MIN, v)) * 100) / 100
    const dec = useCallback(() => setScale(s => clamp(s - STEP)), [])
    const inc = useCallback(() => setScale(s => clamp(s + STEP)), [])

    /* ── Mouse drag-to-scroll ── */
    const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 })

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const deck = deckRef.current
        if (!deck || e.button !== 0) return
        // Disable snap during drag so CSS doesn't fight JS
        deck.style.scrollSnapType = 'none'
        dragRef.current = { active: true, startX: e.clientX, scrollLeft: deck.scrollLeft }
        deck.setPointerCapture(e.pointerId)
        deck.style.cursor = 'grabbing'
        deck.style.userSelect = 'none'
    }

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current
        const deck = deckRef.current
        if (!drag.active || !deck) return
        const dx = (e.clientX - drag.startX) / scale
        deck.scrollLeft = drag.scrollLeft - dx
    }

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current
        const deck = deckRef.current
        if (!drag.active || !deck) return
        drag.active = false
        deck.releasePointerCapture(e.pointerId)
        deck.style.cursor = 'grab'
        deck.style.userSelect = ''
        // Snap smoothly to nearest slide
        const idx = Math.max(0, Math.min(SLIDES_COUNT - 1,
            Math.round(deck.scrollLeft / (SLIDE_W + GAP))
        ))
        deck.scrollTo({ left: idx * (SLIDE_W + GAP), behavior: 'smooth' })
        setActiveIndex(idx)
        // Re-enable CSS snap after smooth scroll completes
        setTimeout(() => { deck.style.scrollSnapType = '' }, 500)
    }

    /* ── Scroll to slide ── */
    const scrollTo = (idx: number) => {
        deckRef.current?.scrollTo({ left: idx * (SLIDE_W + GAP), behavior: 'smooth' })
        setActiveIndex(idx)
    }

    /* ── Sync dot on scroll ── */
    const onScroll = () => {
        const deck = deckRef.current
        if (!deck) return
        const idx = Math.round(deck.scrollLeft / (SLIDE_W + GAP))
        setActiveIndex(idx)
    }

    /* ── PDF export ── */
    const handleSavePdf = async () => {
        const slideEl = slideRefs.current[activeIndex]
        const wrapper = wrapperRef.current
        const deck = deckRef.current
        if (!slideEl || !wrapper || !deck) return

        try {
            setIsExporting(true)

            // 1. Remove CSS scale so html2canvas sees native 1080×1350
            const prevTransform = wrapper.style.transform
            wrapper.style.transform = 'scale(1)'

            // 2. Ensure target slide is scrolled into view (deck at exact offset, no snap fight)
            const prevSnap = deck.style.scrollSnapType
            const prevScroll = deck.scrollLeft
            deck.style.scrollSnapType = 'none'
            deck.scrollLeft = activeIndex * (SLIDE_W + GAP)

            // 3. Wait for layout + repaint
            await new Promise(r => setTimeout(r, 250))

            const canvas = await html2canvas(slideEl, {
                width: SLIDE_W,
                height: SLIDE_H,
                scale: 2,
                useCORS: true,
                backgroundColor: '#F0EFEE',
                logging: false,
            })

            // 4. Restore everything
            wrapper.style.transform = prevTransform
            deck.style.scrollSnapType = prevSnap
            deck.scrollLeft = prevScroll

            const imgData = canvas.toDataURL('image/jpeg', 0.95)
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [SLIDE_W, SLIDE_H],
                hotfixes: ['px_scaling'],
            })
            pdf.addImage(imgData, 'JPEG', 0, 0, SLIDE_W, SLIDE_H)
            pdf.save(`watch360-slide-${activeIndex + 2}.pdf`)
        } catch (err) {
            console.error(err)
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <>
            {/* ── Scaled deck viewport ──
                Width = SLIDE_W + PEEK so the next slide peeks from the right.
                The deck scrolls inside this clipped window.                     */}
            <div
                ref={wrapperRef}
                style={{
                    width: SLIDE_W + PEEK,
                    height: SLIDE_H,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    overflow: 'hidden',
                    flexShrink: 0,
                }}
            >
                {/* Horizontal scroll deck — content wider than viewport = peek effect */}
                <div
                    ref={deckRef}
                    className="slide-deck"
                    onScroll={onScroll}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                    style={{ gap: GAP, cursor: 'grab' }}
                >
                    {/* Slide 2 — Watch Market Snapshot */}
                    <div
                        ref={el => { slideRefs.current[0] = el }}
                        style={{ width: SLIDE_W, height: SLIDE_H, flexShrink: 0 }}
                    >
                        <Slide2 />
                    </div>

                    {/* Slide 3 — Brand Activity Top 5 */}
                    <div
                        ref={el => { slideRefs.current[1] = el }}
                        style={{ width: SLIDE_W, height: SLIDE_H, flexShrink: 0 }}
                    >
                        <Slide3 />
                    </div>

                    {/* Slide 4 — Brand Activity Rank 6–10 */}
                    <div
                        ref={el => { slideRefs.current[2] = el }}
                        style={{ width: SLIDE_W, height: SLIDE_H, flexShrink: 0 }}
                    >
                        <Slide3
                            subtitle="Rank 6–10 by Novelties"
                            brands={SLIDE4_BRANDS}
                            hint=""
                            highlightFirst={false}
                            globalMax={23}
                        />
                    </div>

                    {/* Slide 5 — Price Range */}
                    <div
                        ref={el => { slideRefs.current[3] = el }}
                        style={{ width: SLIDE_W, height: SLIDE_H, flexShrink: 0 }}
                    >
                        <Slide4 caption="" />
                    </div>

                    {/* End spacer so last slide can snap flush */}
                    <div style={{ width: PEEK, flexShrink: 0 }} />
                </div>
            </div>

            {/* ── Pagination dots (above HUD, left-anchored) ── */}
            <div className="pagination">
                {Array.from({ length: SLIDES_COUNT }).map((_, i) => (
                    <button
                        key={i}
                        className={`pagination-dot${i === activeIndex ? ' pagination-dot--active' : ''}`}
                        onClick={() => scrollTo(i)}
                        aria-label={`Slide ${i + 2}`}
                    />
                ))}
            </div>

            {/* ── Bottom HUD ── */}
            <div className="scale-hud">
                <button className="scale-btn" onClick={dec} aria-label="Уменьшить">−</button>

                <div className="scale-track">
                    <input
                        type="range"
                        min={MIN}
                        max={MAX}
                        step={STEP}
                        value={scale}
                        onChange={e => setScale(clamp(parseFloat(e.target.value)))}
                        className="scale-slider"
                        aria-label="Масштаб"
                    />
                </div>

                <button className="scale-btn" onClick={inc} aria-label="Увеличить">+</button>

                <span className="scale-label">{Math.round(scale * 100)}%</span>

                <div className="hud-divider" />

                <button
                    className="save-pdf-btn"
                    onClick={handleSavePdf}
                    disabled={isExporting}
                >
                    {isExporting ? 'Saving...' : 'Save PDF'}
                </button>
            </div>
        </>
    )
}

export default App
