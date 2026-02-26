import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './Slide2.css'

const LOGO_SYMBOL = '/assets/logos/watch360-symbol.svg'
const LOGO_WORDMARK = '/assets/logos/watch360-wordmark.svg'

/* ── Counter Hook ── */
function useCounter(target: number, duration = 1.6, delay = 0) {
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
                // ease-out cubic
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

/* ── Motion Variants ── */
const EASE_PRECISION: [number, number, number, number] = [0.16, 1, 0.3, 1]

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (d: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay: d, ease: EASE_PRECISION },
    }),
}

const fadeIn = {
    hidden: { opacity: 0 },
    visible: (d: number) => ({
        opacity: 1,
        transition: { duration: 0.6, delay: d, ease: 'easeOut' as const },
    }),
}

const scaleIn = {
    hidden: { opacity: 0, scale: 0.92, y: 20 },
    visible: (d: number) => ({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.75, delay: d, ease: EASE_PRECISION },
    }),
}

const lineGrow = {
    hidden: { scaleX: 0 },
    visible: (d: number) => ({
        scaleX: 1,
        transition: { duration: 0.8, delay: d, ease: EASE_PRECISION },
    }),
}

const signalRow = {
    hidden: { opacity: 0, x: -20 },
    visible: (d: number) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.55, delay: d, ease: EASE_PRECISION },
    }),
}

/* ── Types ── */
interface SignalRow {
    label: string
    value: string
}

interface Slide2Props {
    period?: string
    newReleases?: number
    activeBrands?: number
    signals?: SignalRow[]
    caption?: string
}

const DEFAULT_SIGNALS: SignalRow[] = [
    { label: 'Automatic', value: '58%' },
    { label: '$5K–25K', value: 'Core segment' },
    { label: '40–42 mm', value: 'Market standard' },
    { label: 'Steel', value: 'Dominant material' },
    { label: 'Chronograph & Date', value: 'Leading functions' },
]

/* ── Component ── */
export function Slide2({
    period = 'January 2026',
    newReleases = 147,
    activeBrands = 39,
    signals = DEFAULT_SIGNALS,
    caption = 'Powered by Watch360 : Data extracted from 147 references across 39 brands.',
}: Slide2Props) {
    const releases = useCounter(newReleases, 1.4, 1.0)
    const brands = useCounter(activeBrands, 1.2, 1.15)

    return (
        <div className="slide2-viewport">

            {/* ── Dark bottom panel ── */}
            <motion.div
                className="slide2-dark-panel"
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.0, delay: 0.3, ease: EASE_PRECISION }}
            />

            {/* ── Logo ── */}
            <motion.div
                className="slide2-logo"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.15}
            >
                <img
                    src={LOGO_SYMBOL}
                    alt="Watch360 symbol"
                    style={{ height: '56px', width: 'auto', marginRight: '12px' }}
                />
                <img
                    src={LOGO_WORDMARK}
                    alt="WATCH360"
                    style={{ height: '30px', width: 'auto' }}
                />
            </motion.div>

            {/* ── Date ── */}
            <motion.p
                className="slide2-date"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                custom={0.35}
            >
                {period}
            </motion.p>

            {/* ── Hero Headline ── */}
            <motion.div
                className="slide2-headline-block"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.25}
            >
                <div className="slide2-headline">
                    <motion.span
                        className="slide2-headline__gold"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={0.3}
                    >
                        Watch Market
                    </motion.span>
                    <motion.span
                        className="slide2-headline__dark"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={0.45}
                    >
                        Snapshot
                    </motion.span>
                </div>
            </motion.div>

            {/* ── Stat Cards ── */}
            <div className="slide2-stats">
                <motion.div
                    className="slide2-stat-card slide2-stat-card--shadow"
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    custom={0.7}
                >
                    <p className="slide2-stat-value">
                        <span ref={releases.ref}>{releases.count}</span>
                    </p>
                    <p className="slide2-stat-label">New Releases</p>
                </motion.div>

                <motion.div
                    className="slide2-stat-card"
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    custom={0.85}
                >
                    <p className="slide2-stat-value">
                        <span ref={brands.ref}>{brands.count}</span>
                    </p>
                    <p className="slide2-stat-label">Active Brands</p>
                </motion.div>
            </div>

            {/* ── Signals Section ── */}
            <div className="slide2-signals">
                <motion.p
                    className="slide2-signals-title"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={1.3}
                >
                    Key Market Signals
                </motion.p>

                <ul className="signals-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {signals.map((row, i) => (
                        <motion.li
                            key={i}
                            className="signal-row"
                            variants={signalRow}
                            initial="hidden"
                            animate="visible"
                            custom={1.5 + i * 0.12}
                        >
                            <span className="signal-label">{row.label}</span>
                            <motion.span
                                className="signal-line"
                                aria-hidden="true"
                                variants={lineGrow}
                                initial="hidden"
                                animate="visible"
                                custom={1.7 + i * 0.12}
                                style={{ transformOrigin: 'left center' }}
                            />
                            <motion.span
                                className="signal-value"
                                variants={fadeIn}
                                initial="hidden"
                                animate="visible"
                                custom={1.9 + i * 0.12}
                            >
                                {row.value}
                            </motion.span>
                        </motion.li>
                    ))}
                </ul>
            </div>

            {/* ── Footer caption ── */}
            <motion.p
                className="slide2-caption"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                custom={2.6}
            >
                {caption}
            </motion.p>
        </div>
    )
}
