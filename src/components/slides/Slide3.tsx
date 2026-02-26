import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import './Slide3.css'
import LOGO_SYMBOL from '/assets/logos/watch360-symbol.svg'
import LOGO_WORDMARK from '/assets/logos/watch360-wordmark.svg'
import LOGO_SWATCH from '/assets/brand-logos/swatch.svg'
import LOGO_HUBLOT from '/assets/brand-logos/hublot.svg'
import LOGO_TAG_HEUER from '/assets/brand-logos/tag-heuer.svg'
import LOGO_FREDERIQUE from '/assets/brand-logos/frederique-constant.svg'
import LOGO_LV from '/assets/brand-logos/louis-vuitton.svg'

/* ── Types ── */
export interface BrandRow {
    name: string
    count: number
    logo?: string  // path to brand logo SVG
}

interface Slide3Props {
    period?: string
    subtitle?: string
    brands?: BrandRow[]
    hint?: string
    caption?: string
}

/* ── Easing ── */
const EASE_PRECISION: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* ── Counter Hook ── */
function useCounter(target: number, duration = 1.0, delay = 0) {
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

/* ── Brand Bar Row ── */
function BrandBar({
    brand,
    index,
    maxCount,
}: {
    brand: BrandRow
    index: number
    maxCount: number
}) {
    const pct = brand.count / maxCount
    const baseDelay = 0.4 + index * 0.12
    const counter = useCounter(brand.count, 0.9, baseDelay + 0.25)
    const rowRef = useRef<HTMLDivElement>(null)
    const inView = useInView(rowRef, { once: true })

    return (
        <motion.div
            className="s3-bar-row"
            ref={rowRef}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: baseDelay, ease: EASE_PRECISION }}
        >
            {/* Logo column */}
            <div className="s3-logo-col">
                {brand.logo && (
                    <img
                        src={brand.logo}
                        alt={brand.name}
                        className="s3-brand-logo"
                    />
                )}
            </div>

            {/* Content: name + count + bar */}
            <div className="s3-bar-content">
                <div className="s3-bar-header">
                    <span className="s3-brand-name">{brand.name}</span>
                    <span className="s3-brand-count" ref={counter.ref}>
                        {counter.count}
                    </span>
                </div>

                <div className="s3-track">
                    <motion.div
                        className={`s3-fill s3-fill--${index === 0 ? 'gold' : 'white'}`}
                        initial={{ scaleX: 0 }}
                        animate={inView ? { scaleX: pct } : {}}
                        transition={{
                            duration: 1.0,
                            delay: baseDelay + 0.1,
                            ease: EASE_PRECISION,
                        }}
                        style={{ transformOrigin: 'left center' }}
                    />
                </div>
            </div>
        </motion.div>
    )
}

/* ── Default data ── */
const DEFAULT_BRANDS: BrandRow[] = [
    { name: 'Swatch', count: 23, logo: LOGO_SWATCH },
    { name: 'Hublot', count: 18, logo: LOGO_HUBLOT },
    { name: 'TAG Heuer', count: 10, logo: LOGO_TAG_HEUER },
    { name: 'Frederique Constant', count: 8, logo: LOGO_FREDERIQUE },
    { name: 'Louis Vuitton', count: 7, logo: LOGO_LV },
]

/* ── Component ── */
export function Slide3({
    period = 'January 2026',
    subtitle = 'Top 5 Brands by Novelties',
    brands = DEFAULT_BRANDS,
    hint = 'Top 5 shown. Next: Rank 6–10',
    caption = 'Powered by Watch360 : Data extracted from 147 references across 39 brands.',
}: Slide3Props) {
    const maxCount = brands[0]?.count ?? 1

    return (
        <div className="s3-viewport">

            {/* ── Dark bottom panel (top=405) ── */}
            <motion.div
                className="s3-dark-panel"
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.0, delay: 0.2, ease: EASE_PRECISION }}
            />

            {/* ── Logo — identical position to Slide2 ── */}
            <motion.div
                className="s3-logo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: EASE_PRECISION }}
            >
                <img src={LOGO_SYMBOL} alt="Watch360 symbol" style={{ height: '56px', width: 'auto', marginRight: '12px' }} />
                <img src={LOGO_WORDMARK} alt="WATCH360" style={{ height: '30px', width: 'auto' }} />
            </motion.div>

            {/* ── Date — identical position to Slide2 ── */}
            <motion.p
                className="s3-date"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
            >
                {period}
            </motion.p>

            {/* ── Headline block (top=213) ── */}
            <motion.div
                className="s3-headline-block"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: EASE_PRECISION }}
            >
                <p className="s3-headline__gold">Brand Activity</p>
                <p className="s3-headline__sub">{subtitle}</p>
            </motion.div>

            {/* ── Bar list (top=444) ── */}
            <div className="s3-bars">
                {brands.map((b, i) => (
                    <BrandBar key={b.name} brand={b} index={i} maxCount={maxCount} />
                ))}
            </div>

            {/* ── Hint ── */}
            <motion.p
                className="s3-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.5, ease: 'easeOut' }}
            >
                {hint}
            </motion.p>

            {/* ── Caption ── */}
            <motion.p
                className="s3-caption"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.7, ease: 'easeOut' }}
            >
                {caption}
            </motion.p>
        </div>
    )
}
