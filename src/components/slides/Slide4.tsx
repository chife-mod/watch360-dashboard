import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import './Slide4.css'
import LOGO_SYMBOL from '/assets/logos/watch360-symbol.svg'
import LOGO_WORDMARK from '/assets/logos/watch360-wordmark.svg'

/* ── Types ── */
export interface PriceRow {
    label: string
    count: number
}

interface Slide4Props {
    period?: string
    title?: string
    subtitle?: string
    rows?: PriceRow[]
    caption?: string
    highlightFirst?: boolean
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

/* ── Single Bar Row ── */
function PriceBar({
    row,
    index,
    maxCount,
    highlightFirst,
}: {
    row: PriceRow
    index: number
    maxCount: number
    highlightFirst: boolean
}) {
    const pct = row.count / maxCount
    const baseDelay = 0.3 + index * 0.08
    const counter = useCounter(row.count, 0.8, baseDelay + 0.2)
    const rowRef = useRef<HTMLDivElement>(null)
    const inView = useInView(rowRef, { once: true })

    return (
        <motion.div
            className="s4-bar-row"
            ref={rowRef}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, delay: baseDelay, ease: EASE }}
        >
            <div className="s4-bar-header">
                <span className="s4-label">{row.label}</span>
                <span className="s4-count" ref={counter.ref}>
                    {counter.count}
                </span>
            </div>

            <div className="s4-track">
                <motion.div
                    className={`s4-fill s4-fill--${highlightFirst && index === 0 ? 'gold' : 'white'}`}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${pct * 100}%` } : {}}
                    transition={{
                        duration: 0.9,
                        delay: baseDelay + 0.08,
                        ease: EASE,
                    }}
                />
            </div>
        </motion.div>
    )
}

/* ── Default data ── */
const DEFAULT_ROWS: PriceRow[] = [
    { label: '$0-$500', count: 26 },
    { label: '$100,000-$250,000', count: 18 },
    { label: '$10,000-$25,000', count: 18 },
    { label: '$1,000-$2,500', count: 17 },
    { label: '$5,000-$10,000', count: 14 },
    { label: '$25,000-$50,000', count: 12 },
    { label: '$2,500-$5,000', count: 12 },
    { label: '$500-$1,000', count: 9 },
    { label: '$50,000-$100,000', count: 5 },
    { label: '$250,000-$500,000', count: 4 },
]

/* ── Component ── */
export function Slide4({
    period = 'January 2026',
    title = 'Price Range',
    subtitle = 'New Releases by Price Segment',
    rows = DEFAULT_ROWS,
    caption = 'Powered by Watch360 : Data extracted from 147 references across 39 brands.',
    highlightFirst = true,
}: Slide4Props) {
    const maxCount = rows[0]?.count ?? 1

    return (
        <div className="s4-viewport">

            {/* ── Dark panel ── */}
            <motion.div
                className="s4-dark-panel"
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.0, delay: 0.2, ease: EASE }}
            />

            {/* ── Logo ── */}
            <motion.div
                className="s4-logo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            >
                <img src={LOGO_SYMBOL} alt="Watch360" style={{ height: '56px', width: 'auto', marginRight: '12px' }} />
                <img src={LOGO_WORDMARK} alt="WATCH360" style={{ height: '30px', width: 'auto' }} />
            </motion.div>

            {/* ── Date ── */}
            <motion.p
                className="s4-date"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
            >
                {period}
            </motion.p>

            {/* ── Headline ── */}
            <motion.div
                className="s4-headline-block"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            >
                <p className="s4-headline__gold">{title}</p>
                <p className="s4-headline__sub">{subtitle}</p>
            </motion.div>

            {/* ── Bar list ── */}
            <div className="s4-bars">
                {rows.map((r, i) => (
                    <PriceBar key={r.label} row={r} index={i} maxCount={maxCount} highlightFirst={highlightFirst} />
                ))}
            </div>

            {/* ── Caption ── */}
            {caption && (
                <motion.p
                    className="s4-caption"
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
