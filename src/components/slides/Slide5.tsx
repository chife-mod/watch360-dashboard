import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import './Slide5.css'
import LOGO_SYMBOL from '/assets/logos/watch360-symbol.svg'
import LOGO_WORDMARK from '/assets/logos/watch360-wordmark.svg'

/* ── Types ── */
export interface DonutSegment {
    label: string      // e.g. "Limited\nEdition"
    value: number
    color: string      // hex
}

interface Slide5Props {
    period?: string
    title?: string
    subtitle?: string
    segments?: DonutSegment[]
    centerLabel?: string   // e.g. "Special Editions"
    caption?: string
}

/* ── Easing ── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* ── Counter Hook ── */
function useCounter(target: number, duration = 0.9, delay = 0) {
    const [count, setCount] = useState(0)
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true })

    useEffect(() => {
        if (!inView) return
        const timeout = setTimeout(() => {
            const start = performance.now()
            const step = (now: number) => {
                const elapsed = now - start
                const progress = Math.min(elapsed / (duration * 1000), 1)
                const eased = 1 - Math.pow(1 - progress, 3)
                setCount(Math.round(eased * target))
                if (progress < 1) requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
        }, delay * 1000)
        return () => clearTimeout(timeout)
    }, [inView, target, duration, delay])

    return { count, ref }
}

/* ── Semi-Donut SVG ──
   Draws a 180° arc (left→right). Gaps between segments have CONSTANT
   pixel width (parallel walls). Uses SVG path with round linejoin + stroke
   for perfect 4px rounded corners and identical gap thicknesses.
*/
function SemiDonut({
    segments,
    width = 880,
    height = 440,
    thickness = 120,
    gapPx = 8,
}: {
    segments: DonutSegment[]
    width?: number
    height?: number
    thickness?: number
    gapPx?: number   // constant gap in pixels between segments
}) {
    const strokeW = 8
    const cornerR = strokeW / 2
    const cx = width / 2
    const cy = height - cornerR

    // Adjusted radii to fit stroke inside bounds
    const visualOuterR = cy
    const pathOuterR = visualOuterR - cornerR
    const pathInnerR = visualOuterR - thickness + cornerR
    const pathMidR = (pathOuterR + pathInnerR) / 2

    // Stroke adds thickness to borders, decreasing apparent gap
    const pathGapPx = gapPx + strokeW
    const total = segments.reduce((s, seg) => s + seg.value, 0)

    const gapAngleMid = (pathGapPx / pathMidR) * (180 / Math.PI)
    const totalGapMid = gapAngleMid * (segments.length - 1)
    const availableDeg = 180 - totalGapMid

    const outerGapHalf = ((pathGapPx / 2) / pathOuterR) * (180 / Math.PI)
    const innerGapHalf = ((pathGapPx / 2) / pathInnerR) * (180 / Math.PI)

    const polarToCart = (angleDeg: number, r: number) => {
        const rad = (angleDeg * Math.PI) / 180
        return {
            x: cx + r * Math.cos(rad),
            y: cy - r * Math.sin(rad),
        }
    }

    let currentAngleMid = 180
    const paths = segments.map((seg, i) => {
        const segDeg = (seg.value / total) * availableDeg
        const startMid = currentAngleMid
        const endMid = currentAngleMid - segDeg
        currentAngleMid = endMid - gapAngleMid

        // Decreasing startMid and increasing endMid shrinks the wedge by the gap
        const outerStart = polarToCart(startMid - (i === 0 ? 0 : outerGapHalf), pathOuterR)
        const outerEnd = polarToCart(endMid + (i === segments.length - 1 ? 0 : outerGapHalf), pathOuterR)
        const innerStart = polarToCart(endMid + (i === segments.length - 1 ? 0 : innerGapHalf), pathInnerR)
        const innerEnd = polarToCart(startMid - (i === 0 ? 0 : innerGapHalf), pathInnerR)

        const arcSweep = segDeg > 180 ? 1 : 0

        const d = [
            `M ${outerStart.x} ${outerStart.y}`,
            `A ${pathOuterR} ${pathOuterR} 0 ${arcSweep} 1 ${outerEnd.x} ${outerEnd.y}`,
            `L ${innerStart.x} ${innerStart.y}`,
            `A ${pathInnerR} ${pathInnerR} 0 ${arcSweep} 0 ${innerEnd.x} ${innerEnd.y}`,
            'Z',
        ].join(' ')

        return (
            <motion.path
                key={i}
                d={d}
                fill={seg.color}
                stroke={seg.color}
                strokeWidth={strokeW}
                strokeLinejoin="round"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.15, ease: EASE }}
            />
        )
    })

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            width={width}
            height={height}
            style={{ display: 'block' }}
        >
            {paths}
        </svg>
    )
}

/* ── Default data ── */
const DEFAULT_SEGMENTS: DonutSegment[] = [
    { label: 'Limited\nEdition', value: 37, color: '#A98155' },
    { label: 'Partnership\nEdition', value: 9, color: '#B16BE8' },
    { label: 'Anniversary\nEdition', value: 3, color: '#979797' },
]

/* ── Component ── */
export function Slide5({
    period = 'January 2026',
    title = 'Special Edition',
    subtitle = 'Types of Special Novelties',
    segments = DEFAULT_SEGMENTS,
    centerLabel = 'Special Editions',
    caption = '',
}: Slide5Props) {
    const total = segments.reduce((s, seg) => s + seg.value, 0)
    const totalCounter = useCounter(total, 1.0, 0.8)
    const donutRef = useRef<HTMLDivElement>(null)
    const inView = useInView(donutRef, { once: true })

    return (
        <div className="s5-viewport">

            {/* ── Dark panel ── */}
            <motion.div
                className="s5-dark-panel"
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.0, delay: 0.2, ease: EASE }}
            />

            {/* ── Logo ── */}
            <motion.div
                className="s5-logo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            >
                <img src={LOGO_SYMBOL} alt="Watch360" style={{ height: '56px', width: 'auto', marginRight: '12px' }} />
                <img src={LOGO_WORDMARK} alt="WATCH360" style={{ height: '30px', width: 'auto' }} />
            </motion.div>

            {/* ── Date ── */}
            <motion.p
                className="s5-date"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
            >
                {period}
            </motion.p>

            {/* ── Headline ── */}
            <motion.div
                className="s5-headline-block"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            >
                <p className="s5-headline__gold">{title}</p>
                <p className="s5-headline__sub">{subtitle}</p>
            </motion.div>

            {/* ── Semi-Donut Chart ── */}
            <div className="s5-donut-wrap" ref={donutRef}>
                {inView && <SemiDonut segments={segments} />}

                {/* Center label */}
                <motion.div
                    className="s5-center-label"
                    initial={{ opacity: 0, x: '-50%', y: 20 }}
                    animate={inView ? { opacity: 1, x: '-50%', y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 1.0, ease: EASE }}
                >
                    <span className="s5-center-label__title">Total</span>
                    <span className="s5-center-label__number" ref={totalCounter.ref}>
                        {totalCounter.count}
                    </span>
                    <span className="s5-center-label__sub">{centerLabel}</span>
                </motion.div>
            </div>

            {/* ── Legend (3 columns) ── */}
            <div className="s5-legend">
                {segments.map((seg, i) => {
                    const counter = useCounter(seg.value, 0.9, 1.0 + i * 0.15)
                    return (
                        <motion.div
                            key={i}
                            className="s5-legend-item"
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 1.1 + i * 0.15, ease: EASE }}
                        >
                            <span
                                className="s5-legend-number"
                                style={{ color: seg.color }}
                                ref={counter.ref}
                            >
                                {counter.count}
                            </span>
                            <span className="s5-legend-label">
                                {seg.label.split('\n').map((line, j) => (
                                    <span key={j}>
                                        {j > 0 && <br />}
                                        {line}
                                    </span>
                                ))}
                            </span>
                        </motion.div>
                    )
                })}
            </div>

            {/* ── Caption ── */}
            {caption && (
                <motion.p
                    className="s5-caption"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.5, ease: 'easeOut' }}
                >
                    {caption}
                </motion.p>
            )}
        </div>
    )
}
