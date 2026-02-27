import { useRef, useState, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useNavigate } from 'react-router-dom'
import '../styles/global.css'
import '../styles/presentation.css'

/* ── Slide imports ── */
import LOGO_SYMBOL from '/assets/logos/watch360-symbol.svg'
import LOGO_WORDMARK from '/assets/logos/watch360-wordmark.svg'
import COVER_IMG from '/assets/images/cover-watch.png'

import LOGO_HUBLOT from '/assets/brand-logos/hublot.svg'
import LOGO_BVLGARI from '/assets/brand-logos/bvlgari.svg'
import LOGO_LV from '/assets/brand-logos/louis-vuitton.svg'
import LOGO_TAG from '/assets/brand-logos/tag-heuer.svg'
import LOGO_ZENITH from '/assets/brand-logos/zenith.svg'
import LOGO_GG from '/assets/brand-logos/gerald-genta.png'
import LOGO_DR from '/assets/brand-logos/daniel-roth.png'
import LOGO_FC from '/assets/brand-logos/frederique-constant.svg'
import LOGO_ALPINA from '/assets/brand-logos/alpina.svg'

gsap.registerPlugin()

/* ── Constants ── */
const SLIDE_W = 1080
const SLIDE_H = 1350
const SLIDE_DURATION = 2    // seconds per slide (visible time)
const TRANSITION_DUR = 1.2  // transition between slides
const TOTAL_SLIDES = 9

/* ── Donut math (same as SlideV2_02) ── */
const CX = 440, CY = 440, RO = 440, RI = 280
const TOTAL_NOVELTIES = 147, GOLD_COUNT = 101
const GAP_DEG = 2.5

function pt(r: number, deg: number) {
    const rad = (deg * Math.PI) / 180
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

function annularArcPath(startDeg: number, endDeg: number) {
    const span = endDeg - startDeg
    if (span <= 0) return ''
    const large = span > 180 ? 1 : 0
    const o1 = pt(RO, startDeg), o2 = pt(RO, endDeg)
    const i1 = pt(RI, endDeg), i2 = pt(RI, startDeg)
    return [
        `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
        `A ${RO} ${RO} 0 ${large} 1 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
        `L ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
        `A ${RI} ${RI} 0 ${large} 0 ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
        'Z',
    ].join(' ')
}

/* ── Data ── */
const LVMH_BRANDS = [
    { name: 'Hublot', count: 16, logo: LOGO_HUBLOT },
    { name: 'Bvlgari', count: 7, logo: LOGO_BVLGARI },
    { name: 'Louis Vuitton', count: 7, logo: LOGO_LV },
    { name: 'TAG Heuer', count: 6, logo: LOGO_TAG },
    { name: 'Zenith', count: 6, logo: LOGO_ZENITH },
    { name: 'Gerald Genta', count: 2, logo: LOGO_GG },
    { name: 'Daniel Roth', count: 1, logo: LOGO_DR },
]

const ALL_BRANDS = [
    { name: 'Hublot', count: 18, logo: LOGO_HUBLOT },
    { name: 'TAG Heuer', count: 10, logo: LOGO_TAG },
    { name: 'Frederique Constant', count: 8, logo: LOGO_FC },
    { name: 'Bvlgari', count: 7, logo: LOGO_BVLGARI },
    { name: 'Louis Vuitton', count: 7, logo: LOGO_LV },
    { name: 'Zenith', count: 6, logo: LOGO_ZENITH },
    { name: 'Alpina', count: 5, logo: LOGO_ALPINA },
]

const CASE_MATERIALS = [
    { label: 'Stainless Steel', count: 63 },
    { label: 'Titanium', count: 22 },
    { label: 'Bio-Sourced', count: 14 },
    { label: 'Rose Gold', count: 11 },
    { label: 'Platinum', count: 6 },
    { label: 'Ceramic', count: 6 },
    { label: 'Polymer', count: 6 },
    { label: 'Gold', count: 4 },
    { label: 'Red Gold', count: 4 },
    { label: 'Composite Fibreshell', count: 3 },
]

const STRAP_MATERIALS = [
    { label: 'Stainless Steel', count: 28 },
    { label: 'Rubber', count: 25 },
    { label: 'Calfskin', count: 22 },
    { label: 'Silicone', count: 21 },
    { label: 'Alligator', count: 19 },
    { label: 'Leather', count: 9 },
    { label: 'Titanium', count: 7 },
    { label: 'Rose Gold', count: 5 },
    { label: 'Gold', count: 3 },
    { label: 'Ceramic', count: 2 },
]

const DIAL_COLORS = [
    { label: 'Blue', count: 30 },
    { label: 'Black', count: 22 },
    { label: 'Green', count: 16 },
    { label: 'Silver', count: 15 },
    { label: 'Skeleton', count: 11 },
    { label: 'White', count: 8 },
    { label: 'Teal', count: 8 },
    { label: 'Multi-Color', count: 8 },
    { label: 'Beige', count: 7 },
    { label: 'Grey', count: 6 },
]

const SPECIAL_EDITIONS = [
    { label: 'Limited Edition', count: 39 },
    { label: 'Partnership Edition', count: 9 },
    { label: 'Anniversary Edition', count: 3 },
]

const PRICE_RANGES = [
    { label: '$0–$500', count: 26 },
    { label: '$100,000–$250,000', count: 18 },
    { label: '$10,000–$25,000', count: 18 },
    { label: '$1,000–$2,500', count: 17 },
    { label: '$5,000–$10,000', count: 14 },
    { label: 'N/A', count: 12 },
    { label: '$25,000–$50,000', count: 12 },
    { label: '$2,500–$5,000', count: 12 },
    { label: '$500–$1,000', count: 9 },
    { label: '$50,000–$100,000', count: 5 },
]

/* ════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════ */
export function AnimatedPresentation() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isStarted, setIsStarted] = useState(false)
    const masterTlRef = useRef<gsap.core.Timeline | null>(null)
    const navigate = useNavigate()

    // Compute scale for viewport fitting
    const [scale, setScale] = useState(1)
    useEffect(() => {
        const computeScale = () => {
            const s = Math.min(
                window.innerWidth / SLIDE_W,
                window.innerHeight / SLIDE_H,
            )
            setScale(s)
        }
        computeScale()
        window.addEventListener('resize', computeScale)
        return () => window.removeEventListener('resize', computeScale)
    }, [])

    /* ── Build the master timeline ── */
    const buildTimeline = useCallback(() => {
        if (!containerRef.current) return null

        const tl = gsap.timeline({ paused: true })
        const slides = containerRef.current.querySelectorAll('.pres-slide')

        slides.forEach((slide, i) => {
            const slideLabel = `slide${i}`

            // ─── ENTER TRANSITION ───
            if (i === 0) {
                // First slide: just appears
                tl.set(slide, { opacity: 1, zIndex: 10 }, slideLabel)
            } else {
                // Transition: fade out previous, bring in current
                const prevSlide = slides[i - 1]
                tl.to(prevSlide, {
                    opacity: 0,
                    scale: 0.95,
                    duration: TRANSITION_DUR,
                    ease: 'power2.inOut',
                }, slideLabel)
                tl.fromTo(slide, {
                    opacity: 0,
                    scale: 1.03,
                }, {
                    opacity: 1,
                    scale: 1,
                    zIndex: 10 + i,
                    duration: TRANSITION_DUR,
                    ease: 'power2.inOut',
                }, slideLabel)
            }

            // Update slide counter via callback
            tl.call(() => setCurrentSlide(i), [], slideLabel + '+=0.1')

            // ─── PER-SLIDE CONTENT ANIMATIONS ───
            const animStart = i === 0 ? '+=0' : `+=${TRANSITION_DUR * 0.3}`

            switch (i) {
                case 0: animateCoverSlide(tl, slide, slideLabel, animStart); break
                case 1: animateBarSlide(tl, slide, slideLabel, animStart, 18); break
                case 2: animateDonutSlide(tl, slide, slideLabel, animStart); break
                case 3: animateBarSlide(tl, slide, slideLabel, animStart, 16); break
                case 4: animateSimpleBarSlide(tl, slide, slideLabel, animStart, CASE_MATERIALS); break
                case 5: animateSimpleBarSlide(tl, slide, slideLabel, animStart, STRAP_MATERIALS); break
                case 6: animateSimpleBarSlide(tl, slide, slideLabel, animStart, DIAL_COLORS); break
                case 7: animateSpecialEditionsSlide(tl, slide, slideLabel, animStart); break
                case 8: animateSimpleBarSlide(tl, slide, slideLabel, animStart, PRICE_RANGES); break
            }

            // ─── HOLD (visible duration) ───
            tl.to({}, { duration: SLIDE_DURATION }, `${slideLabel}+=${TRANSITION_DUR + 1.5}`)
        })

        return tl
    }, [])

    /* ── Animation builders ── */

    function animateCoverSlide(tl: gsap.core.Timeline, slide: Element, label: string, offset: string) {
        const header = slide.querySelector('.pres-header')
        const title1 = slide.querySelector('.pres-cover-title-1')
        const title2 = slide.querySelector('.pres-cover-title-2')
        const jan = slide.querySelector('.pres-cover-jan')
        const cards = slide.querySelectorAll('.pres-stat-card')
        const nums = slide.querySelectorAll('.pres-stat-num')
        const watchImg = slide.querySelector('.pres-cover-img-wrap')

        const pos = `${label}${offset}`

        // Header logo & url fade in
        tl.fromTo(header, { opacity: 0, y: -30 }, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power2.out'
        }, pos)

        // Title lines wipe in — smoother, longer curves
        tl.fromTo(title1, { opacity: 0, x: -80, clipPath: 'inset(0 100% 0 0)' }, {
            opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)', duration: 1.0, ease: 'power2.out'
        }, `${pos}+=0.3`)

        tl.fromTo(title2, { opacity: 0, x: -80, clipPath: 'inset(0 100% 0 0)' }, {
            opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)', duration: 1.0, ease: 'power2.out'
        }, `${pos}+=0.55`)

        // JAN 2026
        tl.fromTo(jan, { opacity: 0, y: 25 }, {
            opacity: 1, y: 0, duration: 0.7, ease: 'power2.out'
        }, `${pos}+=0.85`)

        // Stat cards fly up — smoother
        tl.fromTo(cards, { opacity: 0, y: 70, scale: 0.9 }, {
            opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.18, ease: 'power3.out'
        }, `${pos}+=0.95`)

        // Counter animation
        nums.forEach((numEl) => {
            const target = parseInt(numEl.getAttribute('data-target') || '0')
            const obj = { val: 0 }
            tl.to(obj, {
                val: target,
                duration: 1.4,
                ease: 'power2.out',
                onUpdate() { numEl.textContent = Math.round(obj.val).toString() }
            }, `${pos}+=1.05`)
        })

        // Watch image slides up — much longer travel, smoother
        tl.fromTo(watchImg, { opacity: 0, y: 200 }, {
            opacity: 1, y: 0, duration: 1.6, ease: 'power2.out'
        }, `${pos}+=0.9`)
    }

    function animateDonutSlide(tl: gsap.core.Timeline, slide: Element, label: string, offset: string) {
        const header = slide.querySelector('.pres-header')
        const title = slide.querySelector('.pres-title')
        const subtitle = slide.querySelector('.pres-subtitle')
        const goldArc = slide.querySelector('.pres-donut-gold')
        const purpArc = slide.querySelector('.pres-donut-purp')
        const centerNum = slide.querySelector('.pres-donut-center-num')
        const centerSub = slide.querySelector('.pres-donut-center-sub')
        const legendNums = slide.querySelectorAll('.pres-legend-num')
        const legendLabel = slide.querySelector('.pres-legend-lbl')

        const pos = `${label}${offset}`

        tl.fromTo(header, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, pos)
        tl.fromTo(title, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, `${pos}+=0.15`)
        tl.fromTo(subtitle, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' }, `${pos}+=0.4`)

        // Gold arc grows
        const goldEnd = 180 + 180 * (GOLD_COUNT / TOTAL_NOVELTIES) - GAP_DEG / 2
        const goldObj = { deg: 180 }
        tl.to(goldObj, {
            deg: goldEnd,
            duration: 1.4,
            ease: 'power2.inOut',
            onUpdate() {
                const path = annularArcPath(180, goldObj.deg)
                if (goldArc) goldArc.setAttribute('d', path)
            }
        }, `${pos}+=0.5`)

        // Purple arc grows
        const purpStart = goldEnd + GAP_DEG
        const purpObj = { deg: purpStart }
        tl.to(purpObj, {
            deg: 360,
            duration: 0.8,
            ease: 'power2.inOut',
            onUpdate() {
                const path = annularArcPath(purpStart, purpObj.deg)
                if (purpArc) purpArc.setAttribute('d', path)
            }
        }, `${pos}+=1.5`)

        // Center number counts up
        const cObj = { val: 0 }
        tl.to(cObj, {
            val: 147,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate() { if (centerNum) centerNum.textContent = Math.round(cObj.val).toString() }
        }, `${pos}+=0.6`)

        tl.fromTo(centerSub, { opacity: 0 }, { opacity: 1, duration: 0.5 }, `${pos}+=1.2`)

        // Legend numbers count up
        const legendTargets = [101, 46]
        legendNums.forEach((el, idx) => {
            const lObj = { val: 0 }
            tl.to(lObj, {
                val: legendTargets[idx],
                duration: 1.0,
                ease: 'power2.out',
                onUpdate() { el.textContent = Math.round(lObj.val).toString() }
            }, `${pos}+=1.6`)
        })

        if (legendLabel) {
            tl.fromTo(legendLabel, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, `${pos}+=2.0`)
        }
    }

    function animateBarSlide(tl: gsap.core.Timeline, slide: Element, label: string, offset: string, _maxVal: number) {
        const header = slide.querySelector('.pres-header')
        const title = slide.querySelector('.pres-title')
        const subtitle = slide.querySelector('.pres-subtitle')
        const rows = slide.querySelectorAll('.pres-bar-row')
        const footnote = slide.querySelector('.pres-footnote')

        const pos = `${label}${offset}`

        tl.fromTo(header, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, pos)
        tl.fromTo(title, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, `${pos}+=0.15`)
        tl.fromTo(subtitle, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' }, `${pos}+=0.4`)

        // Stagger rows
        rows.forEach((row, idx) => {
            const logo = row.querySelector('.v2-logo-box')
            const fill = row.querySelector('.v2-bar-fill')
            const count = row.querySelector('.v2-bar-count')
            const labelEl = row.querySelector('.v2-bar-label')
            const delay = idx * 0.1

            if (logo) {
                tl.fromTo(logo, { opacity: 0, scale: 0.5, rotation: -10 }, {
                    opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)'
                }, `${pos}+=0.5+=${delay}`)
            }
            if (labelEl) {
                tl.fromTo(labelEl, { opacity: 0, x: -20 }, {
                    opacity: 1, x: 0, duration: 0.4, ease: 'power2.out'
                }, `${pos}+=0.55+=${delay}`)
            }
            if (fill) {
                tl.fromTo(fill, { width: '0%' }, {
                    width: fill.getAttribute('data-width') || '0%',
                    duration: 0.8,
                    ease: 'power3.out'
                }, `${pos}+=0.6+=${delay}`)
            }
            if (count) {
                const target = parseInt(count.getAttribute('data-target') || '0')
                const obj = { val: 0 }
                tl.to(obj, {
                    val: target,
                    duration: 0.8,
                    ease: 'power2.out',
                    onUpdate() { count.textContent = Math.round(obj.val).toString() }
                }, `${pos}+=0.6+=${delay}`)
            }
        })

        if (footnote) {
            tl.fromTo(footnote, { opacity: 0 }, { opacity: 1, duration: 0.4 }, `${pos}+=1.8`)
        }
    }

    function animateSimpleBarSlide(tl: gsap.core.Timeline, slide: Element, label: string, offset: string, _data: { label: string; count: number }[]) {
        const header = slide.querySelector('.pres-header')
        const title = slide.querySelector('.pres-title')
        const subtitle = slide.querySelector('.pres-subtitle')
        const rows = slide.querySelectorAll('.pres-simple-row')

        const pos = `${label}${offset}`

        tl.fromTo(header, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, pos)
        tl.fromTo(title, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, `${pos}+=0.15`)
        if (subtitle) {
            tl.fromTo(subtitle, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' }, `${pos}+=0.4`)
        }

        rows.forEach((row, idx) => {
            const fill = row.querySelector('.v2-bar-fill')
            const count = row.querySelector('.pres-simple-count')
            const labelEl = row.querySelector('.pres-simple-label')
            const delay = idx * 0.08

            if (labelEl) {
                tl.fromTo(labelEl, { opacity: 0, x: -15 }, {
                    opacity: 1, x: 0, duration: 0.35, ease: 'power2.out'
                }, `${pos}+=0.5+=${delay}`)
            }
            if (fill) {
                tl.fromTo(fill, { width: '0%' }, {
                    width: fill.getAttribute('data-width') || '0%',
                    duration: 0.7,
                    ease: 'power3.out'
                }, `${pos}+=0.55+=${delay}`)
            }
            if (count) {
                const target = parseInt(count.getAttribute('data-target') || '0')
                const obj = { val: 0 }
                tl.to(obj, {
                    val: target,
                    duration: 0.7,
                    ease: 'power2.out',
                    onUpdate() { count.textContent = Math.round(obj.val).toString() }
                }, `${pos}+=0.55+=${delay}`)
            }
        })
    }

    function animateSpecialEditionsSlide(tl: gsap.core.Timeline, slide: Element, label: string, offset: string) {
        const header = slide.querySelector('.pres-header')
        const title = slide.querySelector('.pres-title')
        const subtitle = slide.querySelector('.pres-subtitle')
        const rows = slide.querySelectorAll('.pres-se-row')

        const pos = `${label}${offset}`

        tl.fromTo(header, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, pos)
        tl.fromTo(title, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, `${pos}+=0.15`)
        if (subtitle) {
            tl.fromTo(subtitle, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' }, `${pos}+=0.4`)
        }

        rows.forEach((row, idx) => {
            const fill = row.querySelector('.v2-bar-fill')
            const count = row.querySelector('.pres-se-count')
            const labelEl = row.querySelector('.pres-se-label-text')
            const delay = idx * 0.2

            if (labelEl) {
                tl.fromTo(labelEl, { opacity: 0, x: -25 }, {
                    opacity: 1, x: 0, duration: 0.5, ease: 'power2.out'
                }, `${pos}+=0.5+=${delay}`)
            }
            if (fill) {
                tl.fromTo(fill, { width: '0%' }, {
                    width: fill.getAttribute('data-width') || '0%',
                    duration: 1.0,
                    ease: 'power3.out'
                }, `${pos}+=0.6+=${delay}`)
            }
            if (count) {
                const target = parseInt(count.getAttribute('data-target') || '0')
                const obj = { val: 0 }
                tl.to(obj, {
                    val: target,
                    duration: 1.0,
                    ease: 'power2.out',
                    onUpdate() { count.textContent = Math.round(obj.val).toString() }
                }, `${pos}+=0.6+=${delay}`)
            }
        })
    }

    /* ── Init: auto-reset on every mount (navigate in = fresh start) ── */
    useGSAP(() => {
        // Kill any previous timeline
        if (masterTlRef.current) {
            masterTlRef.current.kill()
            masterTlRef.current = null
        }
        // Reset state
        setCurrentSlide(0)
        setIsPlaying(false)
        setIsStarted(false)

        // Build fresh timeline
        const tl = buildTimeline()
        if (tl) {
            masterTlRef.current = tl
        }
    }, { scope: containerRef, dependencies: [buildTimeline] })

    const handlePlay = () => {
        if (!masterTlRef.current) {
            const tl = buildTimeline()
            if (tl) masterTlRef.current = tl
        }
        if (masterTlRef.current) {
            if (!isStarted) {
                masterTlRef.current.play(0)
                setIsStarted(true)
            } else {
                masterTlRef.current.play()
            }
            setIsPlaying(true)
        }
    }

    const handlePause = () => {
        masterTlRef.current?.pause()
        setIsPlaying(false)
    }

    const handleRestart = () => {
        if (masterTlRef.current) {
            masterTlRef.current.restart()
            setIsPlaying(true)
            setIsStarted(true)
        }
    }

    /* ── Progress bar ── */
    const progressRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        let raf: number
        const tick = () => {
            if (masterTlRef.current && progressRef.current) {
                const p = masterTlRef.current.progress() * 100
                progressRef.current.style.width = `${p}%`
            }
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [])

    /* ── Keyboard shortcuts ── */
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.code === 'Space') { e.preventDefault(); isPlaying ? handlePause() : handlePlay() }
            if (e.code === 'KeyR') handleRestart()
            if (e.code === 'Escape') navigate('/')
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [isPlaying, navigate])

    const GOLD_END = 180 + 180 * (GOLD_COUNT / TOTAL_NOVELTIES) - GAP_DEG / 2
    void GOLD_END // used in donut animation builder

    /* ── Render helpers ── */
    const renderHeader = () => (
        <div className="pres-header v2-header" style={{ opacity: 0 }}>
            <div className="v2-header__logo">
                <img src={LOGO_SYMBOL} alt="Watch360" className="v2-header__logo-symbol" />
                <img src={LOGO_WORDMARK} alt="WATCH360" className="v2-header__logo-wordmark" />
            </div>
            <p className="v2-header__url">www.watch360.ai</p>
        </div>
    )

    const renderBarRows = (brands: typeof ALL_BRANDS, maxVal: number) => (
        <div className="v2-bars">
            {brands.map((b) => (
                <div key={b.name} className="v2-bar-row pres-bar-row">
                    <div className="v2-logo-box" style={{ opacity: 0 }}>
                        <img src={b.logo} alt={b.name} />
                    </div>
                    <div className="v2-bar-content">
                        <div className="v2-bar-label-row">
                            <p className="v2-bar-label" style={{ opacity: 0 }}>{b.name.toUpperCase()}</p>
                            <p className="v2-bar-count" data-target={b.count} style={{ opacity: 0 }}>0</p>
                        </div>
                        <div className="v2-bar-track">
                            <div className="v2-bar-fill" data-width={`${(b.count / maxVal) * 100}%`} style={{ width: '0%' }} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )

    const renderSimpleRows = (data: { label: string; count: number }[]) => {
        const max = Math.max(...data.map(r => r.count))
        return (
            <div className="v2-bars--simple">
                {data.map((r) => (
                    <div key={r.label} className="v2-bar-row--simple pres-simple-row">
                        <div className="v2-bar-label-row--simple">
                            <p className="v2-bar-label--simple pres-simple-label" style={{ opacity: 0 }}>{r.label.toUpperCase()}</p>
                            <p className="v2-bar-count--simple pres-simple-count" data-target={r.count} style={{ opacity: 0 }}>0</p>
                        </div>
                        <div className="v2-bar-track--simple">
                            <div className="v2-bar-fill" data-width={`${(r.count / max) * 100}%`} style={{ width: '0%' }} />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="pres-viewport">
            <div
                ref={containerRef}
                className="pres-stage"
                style={{
                    width: SLIDE_W,
                    height: SLIDE_H,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                }}
            >
                {/* ─── SLIDE 0: Cover ─── */}
                <div className="pres-slide" style={{ opacity: 0 }}>
                    <div className="v2-slide slide01">
                        <div className="slide01__sand" />
                        <div className="slide01__dark" />
                        {renderHeader()}
                        <p className="v2-title pres-cover-title-1" style={{ opacity: 0, fontSize: 108, letterSpacing: '1.08px' }}>WATCH</p>
                        <p className="v2-title pres-cover-title-2" style={{ opacity: 0, fontSize: 108, letterSpacing: '1.08px', top: 213 + 108 * 0.93 }}>NOVELTIES</p>
                        <p className="v2-title pres-cover-jan" style={{ opacity: 0, color: '#3A3935', top: 416 }}>JAN 2026</p>
                        <div className="slide01__stats">
                            <div className="pres-stat-card slide01__card slide01__card--shadow" style={{ opacity: 0 }}>
                                <p className="slide01__num pres-stat-num" data-target="147">0</p>
                                <p className="slide01__lbl">New Models</p>
                            </div>
                            <div className="pres-stat-card slide01__card" style={{ opacity: 0 }}>
                                <p className="slide01__num pres-stat-num" data-target="39">0</p>
                                <p className="slide01__lbl">Watch Brands</p>
                            </div>
                        </div>
                        <div className="slide01__img-wrap pres-cover-img-wrap" style={{ opacity: 0 }}>
                            <img src={COVER_IMG} alt="Watch" className="slide01__img" />
                        </div>
                    </div>
                </div>

                {/* ─── SLIDE 1: Novelties (Top 7 Brands — all) ─── */}
                <div className="pres-slide" style={{ opacity: 0 }}>
                    <div className="v2-slide">
                        <div className="v2-top" />
                        <div className="v2-bottom" />
                        {renderHeader()}
                        <p className="v2-title pres-title" style={{ opacity: 0 }}>NOVELTIES</p>
                        <p className="v2-subtitle pres-subtitle" style={{ opacity: 0, top: 317 }}>JAN 2026 [TOP 7 BRANDS]</p>
                        {renderBarRows(ALL_BRANDS, 18)}
                        <p className="s04-footnote pres-footnote" style={{ opacity: 0 }}>Novelties excluding $0 - $500 price range.</p>
                    </div>
                </div>

                {/* ─── SLIDE 2: Donut (Novelties vs LVMH) ─── */}
                <div className="pres-slide" style={{ opacity: 0 }}>
                    <div className="v2-slide">
                        <div className="v2-top" />
                        <div className="v2-bottom" />
                        {renderHeader()}
                        <p className="v2-title pres-title s02-title" style={{ opacity: 0, whiteSpace: 'nowrap' }}>NOVELTIES</p>
                        <p className="s02-subtitle pres-subtitle" style={{ opacity: 0 }}>JAN 2026 VS LVMH 2026</p>
                        <div className="s02-donut-wrap">
                            <svg viewBox="0 0 880 440" width="880" height="440" style={{ display: 'block', overflow: 'visible' }}>
                                <path className="pres-donut-gold" d="" fill="#A98155" />
                                <path className="pres-donut-purp" d="" fill="#B16BE8" />
                            </svg>
                            <div className="s02-center-label">
                                <p className="s02-center-num pres-donut-center-num" style={{ opacity: 0 }}>0</p>
                                <p className="s02-center-sub pres-donut-center-sub" style={{ opacity: 0 }}>Total Novelties</p>
                            </div>
                        </div>
                        <div className="s02-legend">
                            <div className="s02-legend-item">
                                <p className="s02-legend-num pres-legend-num" style={{ color: '#A98155' }}>0</p>
                            </div>
                            <div className="s02-legend-item">
                                <p className="s02-legend-num pres-legend-num" style={{ color: '#B16BE8' }}>0</p>
                                <p className="s02-legend-lbl pres-legend-lbl" style={{ opacity: 0 }}>Presented at LVMH</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── SLIDE 3: LVMH Novelties (Top 7 Brands) ─── */}
                <div className="pres-slide" style={{ opacity: 0 }}>
                    <div className="v2-slide">
                        <div className="v2-top" />
                        <div className="v2-bottom" />
                        {renderHeader()}
                        <p className="v2-title pres-title" style={{ opacity: 0 }}>LVMH NOVELTIES</p>
                        <p className="v2-subtitle pres-subtitle" style={{ opacity: 0, top: 213 + 100 * 0.93 + 11 }}>LVMH 2026 [TOP 7 BRANDS]</p>
                        {renderBarRows(LVMH_BRANDS, 16)}
                    </div>
                </div>

                {/* ─── SLIDE 4: Case Materials ─── */}
                <div className="pres-slide" style={{ opacity: 0 }}>
                    <div className="v2-slide">
                        <div className="v2-top" />
                        <div className="v2-bottom" />
                        {renderHeader()}
                        <p className="v2-title pres-title" style={{ opacity: 0 }}>CASE MATERIALS</p>
                        <p className="v2-subtitle pres-subtitle" style={{ opacity: 0, top: 213 + 100 * 0.93 + 11 }}>JAN 2026 NOVELTIES</p>
                        {renderSimpleRows(CASE_MATERIALS)}
                    </div>
                </div>

                {/* ─── SLIDE 5: Strap Materials ─── */}
                <div className="pres-slide" style={{ opacity: 0 }}>
                    <div className="v2-slide">
                        <div className="v2-top" />
                        <div className="v2-bottom" />
                        {renderHeader()}
                        <p className="v2-title pres-title" style={{ opacity: 0 }}>STRAP MATERIALS</p>
                        <p className="v2-subtitle pres-subtitle" style={{ opacity: 0, top: 213 + 100 * 0.93 + 11 }}>JAN 2026 NOVELTIES</p>
                        {renderSimpleRows(STRAP_MATERIALS)}
                    </div>
                </div>

                {/* ─── SLIDE 6: Dial Colors ─── */}
                <div className="pres-slide" style={{ opacity: 0 }}>
                    <div className="v2-slide">
                        <div className="v2-top" />
                        <div className="v2-bottom" />
                        {renderHeader()}
                        <p className="v2-title pres-title" style={{ opacity: 0 }}>DIAL COLORS</p>
                        <p className="v2-subtitle pres-subtitle" style={{ opacity: 0, top: 213 + 100 * 0.93 + 11 }}>JAN 2026 NOVELTIES</p>
                        {renderSimpleRows(DIAL_COLORS)}
                    </div>
                </div>

                {/* ─── SLIDE 7: Special Editions ─── */}
                <div className="pres-slide" style={{ opacity: 0 }}>
                    <div className="v2-slide">
                        <div className="v2-top" />
                        <div className="v2-bottom" />
                        {renderHeader()}
                        <p className="v2-title pres-title" style={{ opacity: 0 }}>SPECIAL EDITIONS</p>
                        <p className="v2-subtitle pres-subtitle" style={{ opacity: 0, top: 213 + 100 * 0.93 + 11 }}>JAN 2026 NOVELTIES</p>
                        <div className="v2-se-rows">
                            {SPECIAL_EDITIONS.map((r) => (
                                <div key={r.label} className="v2-se-row pres-se-row">
                                    <div className="v2-bar-label-row">
                                        <p className="v2-se-label pres-se-label-text" style={{ opacity: 0 }}>{r.label.toUpperCase()}</p>
                                        <p className="v2-se-count pres-se-count" data-target={r.count} style={{ opacity: 0 }}>0</p>
                                    </div>
                                    <div className="v2-bar-track">
                                        <div className="v2-bar-fill" data-width={`${(r.count / 39) * 100}%`} style={{ width: '0%', height: '100%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ─── SLIDE 8: Price Ranges ─── */}
                <div className="pres-slide" style={{ opacity: 0 }}>
                    <div className="v2-slide">
                        <div className="v2-top" />
                        <div className="v2-bottom" />
                        {renderHeader()}
                        <p className="v2-title pres-title" style={{ opacity: 0 }}>PRICE RANGES</p>
                        <p className="v2-subtitle pres-subtitle" style={{ opacity: 0, top: 213 + 100 * 0.93 + 11 }}>JAN 2026 NOVELTIES</p>
                        {renderSimpleRows(PRICE_RANGES)}
                    </div>
                </div>
            </div>

            {/* ─── Controls ─── */}
            <div className="pres-controls">
                <button className="pres-back-btn" onClick={() => navigate('/')} title="Back to slides (Esc)">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className="pres-controls-center">
                    <button className="pres-ctrl-btn" onClick={handleRestart} title="Restart (R)">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M3 3V7H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 7C4.2 4.5 6.4 3 9 3C12.3 3 15 5.7 15 9C15 12.3 12.3 15 9 15C6.4 15 4.2 13.5 3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button className="pres-play-btn" onClick={isPlaying ? handlePause : handlePlay} title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}>
                        {isPlaying ? (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <rect x="5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
                                <rect x="11.5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M6 4L16 10L6 16V4Z" fill="currentColor" />
                            </svg>
                        )}
                    </button>
                </div>

                <div className="pres-slide-counter">
                    <span className="pres-slide-current">{String(currentSlide + 1).padStart(2, '0')}</span>
                    <span className="pres-slide-sep">/</span>
                    <span className="pres-slide-total">{String(TOTAL_SLIDES).padStart(2, '0')}</span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="pres-progress-track">
                <div className="pres-progress-fill" ref={progressRef} />
            </div>
        </div>
    )
}
