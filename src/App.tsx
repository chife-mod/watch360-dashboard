import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import './styles/global.css'
import { SlideV2_01 } from './components/slides/SlideV2_01'
import { SlideV2_02 } from './components/slides/SlideV2_02'
import { SlideV2_03 } from './components/slides/SlideV2_03'
import { SlideV2_04 } from './components/slides/SlideV2_04'
import { SlideV2_05 } from './components/slides/SlideV2_05'
import { SlideV2_06 } from './components/slides/SlideV2_06'
import { SlideV2_07 } from './components/slides/SlideV2_07'
import { SlideV2_08 } from './components/slides/SlideV2_08'
import { SlideV2_09 } from './components/slides/SlideV2_09'

const SLIDE_W = 1080
const SLIDE_H = 1350
const GAP = 10
const HUD_H = 72
const SLIDES_COUNT = 9

const computeAutoScale = () =>
    Math.min(
        window.innerWidth / SLIDE_W,
        (window.innerHeight - HUD_H - 80) / SLIDE_H,
    ) * 0.97

function App() {
    const navigate = useNavigate()
    const [scale, setScale] = useState(computeAutoScale)
    const [activeIndex, setActiveIndex] = useState(0)
    const [isExporting, setIsExporting] = useState(false)

    const activeRef = useRef(0)
    const userAdjRef = useRef(false)
    const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const onResize = () => { if (!userAdjRef.current) setScale(computeAutoScale()) }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    const MIN = 0.25
    const MAX = 1.5
    const STEP = 0.05
    const clamp = (v: number) => Math.round(Math.min(MAX, Math.max(MIN, v)) * 100) / 100

    const dec = () => { userAdjRef.current = true; setScale(s => clamp(s - STEP)) }
    const inc = () => { userAdjRef.current = true; setScale(s => clamp(s + STEP)) }

    const slideStride = SLIDE_W * scale + GAP

    const slideRefs = useRef<(HTMLDivElement | null)[]>([])
    const deckRef = useRef<HTMLDivElement>(null)

    const scrollTo = useCallback((idx: number) => {
        const deck = deckRef.current
        if (!deck) return
        const clamped = Math.max(0, Math.min(SLIDES_COUNT - 1, idx))
        deck.scrollTo({ left: clamped * slideStride, behavior: 'smooth' })
        setActiveIndex(clamped)
        activeRef.current = clamped
    }, [slideStride])

    const onScroll = () => {
        const deck = deckRef.current
        if (!deck) return
        const idx = Math.round(deck.scrollLeft / slideStride)
        if (idx !== activeRef.current) {
            setActiveIndex(idx)
            activeRef.current = idx
        }
    }

    useEffect(() => {
        const deck = deckRef.current
        if (!deck) return
        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
            e.preventDefault()
            if (wheelTimer.current) return
            const dir = e.deltaY > 0 ? 1 : -1
            scrollTo(activeRef.current + dir)
            wheelTimer.current = setTimeout(() => { wheelTimer.current = null }, 550)
        }
        deck.addEventListener('wheel', onWheel, { passive: false })
        return () => deck.removeEventListener('wheel', onWheel)
    }, [scrollTo])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') scrollTo(activeRef.current + 1)
            if (e.key === 'ArrowLeft') scrollTo(activeRef.current - 1)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [scrollTo])

    const handleSavePdf = async () => {
        try {
            setIsExporting(true)
            const pdf = new jsPDF({
                orientation: 'portrait', unit: 'px',
                format: [SLIDE_W, SLIDE_H], hotfixes: ['px_scaling'],
            })

            for (let i = 0; i < slides.length; i++) {
                const el = slideRefs.current[i]
                if (!el) continue
                const prev = el.style.transform
                el.style.transform = 'none'
                await new Promise(r => setTimeout(r, 200))
                const canvas = await html2canvas(el, {
                    width: SLIDE_W, height: SLIDE_H,
                    scale: 2, useCORS: true,
                    backgroundColor: '#F0EFEE', logging: false,
                })
                el.style.transform = prev
                const imgData = canvas.toDataURL('image/jpeg', 0.95)
                if (i > 0) pdf.addPage([SLIDE_W, SLIDE_H], 'portrait')
                pdf.addImage(imgData, 'JPEG', 0, 0, SLIDE_W, SLIDE_H)
            }

            pdf.save('watch360-all-slides.pdf')
        } catch (err) {
            console.error(err)
        } finally {
            setIsExporting(false)
        }
    }

    const slides = [
        <SlideV2_01 />,
        <SlideV2_04 />,
        <SlideV2_02 />,
        <SlideV2_03 />,
        <SlideV2_05 />,
        <SlideV2_06 />,
        <SlideV2_07 />,
        <SlideV2_08 />,
        <SlideV2_09 />,
    ]

    return (
        <>
            <div
                ref={deckRef}
                className="slide-deck"
                onScroll={onScroll}
            >
                {slides.map((slide, i) => (
                    <div
                        key={i}
                        className={`slide-outer${i === activeIndex ? ' slide-outer--active' : ''}`}
                        style={{ width: SLIDE_W * scale, height: SLIDE_H * scale }}
                        onClick={() => scrollTo(i)}
                    >
                        <div
                            ref={el => { slideRefs.current[i] = el }}
                            style={{
                                width: SLIDE_W, height: SLIDE_H,
                                transform: `scale(${scale})`,
                                transformOrigin: 'top left',
                                flexShrink: 0,
                            }}
                        >
                            {slide}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
                <button
                    className="pagination-arrow"
                    onClick={() => scrollTo(activeIndex - 1)}
                    disabled={activeIndex === 0}
                    aria-label="Previous slide"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {Array.from({ length: SLIDES_COUNT }).map((_, i) => (
                    <button
                        key={i}
                        className={`pagination-num${i === activeIndex ? ' pagination-num--active' : ''}`}
                        onClick={() => scrollTo(i)}
                        aria-label={`Slide ${i + 1}`}
                    >
                        {String(i + 1).padStart(2, '0')}
                    </button>
                ))}

                <button
                    className="pagination-arrow"
                    onClick={() => scrollTo(activeIndex + 1)}
                    disabled={activeIndex === SLIDES_COUNT - 1}
                    aria-label="Next slide"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Bottom HUD */}
            <div className="scale-hud">
                <button className="scale-btn" onClick={dec} aria-label="Уменьшить">−</button>
                <div className="scale-track">
                    <input
                        type="range"
                        min={MIN} max={MAX} step={STEP} value={scale}
                        onChange={e => {
                            userAdjRef.current = true
                            setScale(clamp(parseFloat(e.target.value)))
                        }}
                        className="scale-slider"
                        aria-label="Масштаб"
                    />
                </div>
                <button className="scale-btn" onClick={inc} aria-label="Увеличить">+</button>
                <span className="scale-label">{Math.round(scale * 100)}%</span>
                <div className="hud-divider" />
                <button className="save-pdf-btn" onClick={handleSavePdf} disabled={isExporting}>
                    {isExporting ? 'Saving...' : 'Save PDF'}
                </button>
                <div className="hud-divider" />
                <button className="anim-btn" onClick={() => navigate('/animation')} title="Animated Presentation">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginRight: 6 }}>
                        <path d="M3 2L12 7L3 12V2Z" fill="currentColor" />
                    </svg>
                    Play
                </button>
            </div>
        </>
    )
}

export default App
