import { motion } from 'framer-motion'
import type { HeroSlideData } from '../../types/dashboard'
import './HeroSlide.css'
import LOGO_SYMBOL from '/assets/logos/watch360-symbol.svg'
import LOGO_WORDMARK from '/assets/logos/watch360-wordmark.svg'

interface HeroSlideProps {
    data: HeroSlideData
    isAnimated?: boolean  // Phase 2: toggle animation
    slideIndex?: number   // Position in multi-slide deck
    totalSlides?: number  // For progress strip
}

// ── Framer Motion variants (Phase 2 ready — off by default) ──
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
}

const fadeUpVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 100,
            damping: 20,
        },
    },
}

const statVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 80,
            damping: 18,
            delay: 0.2,
        },
    },
}

export function HeroSlide({
    data,
    isAnimated = false,
    slideIndex = 0,
    totalSlides = 5,
}: HeroSlideProps) {
    const { meta, overview, insights } = data

    const MotionWrapper = isAnimated ? motion.div : 'div'

    return (
        <div className="slide-viewport">
            {/* ── Progress Strip ── */}
            <div className="progress-strip" aria-label="Slide progress">
                {Array.from({ length: totalSlides }).map((_, i) => (
                    <div
                        key={i}
                        className={`progress-dot${i === slideIndex ? ' is-active' : ''}`}
                        role="presentation"
                    />
                ))}
            </div>

            {/* ── Logo ── */}
            <MotionWrapper
                className="slide-logo"
                {...(isAnimated
                    ? { variants: fadeUpVariants, initial: 'hidden', animate: 'visible' }
                    : {})}
            >
                <img
                    src={LOGO_SYMBOL}
                    alt="Watch360 symbol"
                    style={{ height: '56px', width: 'auto', marginRight: '12px' }}
                />
                <img
                    src={LOGO_WORDMARK}
                    alt="WATCH360"
                    style={{ height: '32px', width: 'auto' }}
                />
            </MotionWrapper>

            {/* ── Date ── */}
            <MotionWrapper
                className="slide-date"
                {...(isAnimated
                    ? { variants: fadeUpVariants, initial: 'hidden', animate: 'visible' }
                    : {})}
            >
                {meta.period}
            </MotionWrapper>

            {/* ── Hero Headline ── */}
            <MotionWrapper
                className="slide-headline"
                {...(isAnimated
                    ? { variants: fadeUpVariants, initial: 'hidden', animate: 'visible' }
                    : {})}
            >
                <span className="slide-headline__gold">
                    {meta.title.split(' ').slice(0, 2).join(' ')}
                </span>
                <span className="slide-headline__dark">
                    {meta.title.split(' ').slice(2).join(' ')}
                </span>
            </MotionWrapper>

            {/* ── Divider ── */}
            <div className="slide-divider" />

            {/* ── Overview Stats ── */}
            <MotionWrapper
                className="slide-stats"
                {...(isAnimated
                    ? { variants: statVariants, initial: 'hidden', animate: 'visible' }
                    : {})}
            >
                <div className="stat-block">
                    <p className="stat-value">{overview.new_watch_releases}</p>
                    <p className="stat-label">New Watch Releases</p>
                </div>
                <div className="stat-block">
                    <p className="stat-value">{overview.active_brands}</p>
                    <p className="stat-label">Active Brands</p>
                </div>
            </MotionWrapper>

            {/* ── Insights Section ── */}
            <MotionWrapper
                className="slide-insights"
                {...(isAnimated
                    ? { variants: containerVariants, initial: 'hidden', animate: 'visible' }
                    : {})}
            >
                <p className="insights-header">Key Structural Insights</p>
                <ul className="insights-list">
                    {insights.map((insight) => (
                        <li key={insight.id} className="insight-item">
                            <div className="insight-left">
                                <span className="insight-label">{insight.label}</span>
                                <span className="insight-value">{insight.value}</span>
                            </div>
                            <span className="insight-detail">{insight.detail}</span>
                        </li>
                    ))}
                </ul>
            </MotionWrapper>

            {/* ── Footer: Powered By + Swipe CTA ── */}
            <div className="slide-footer">
                <div className="footer-powered">
                    <span className="footer-powered-label">Powered by</span>
                    <img
                        src={LOGO_SYMBOL}
                        alt="Watch360"
                        className="footer-logo-symbol"
                    />
                    <span
                        className="footer-powered-label"
                        style={{ color: 'var(--color-charcoal)', opacity: 0.7, fontWeight: 700 }}
                    >
                        Watch360
                    </span>
                </div>
                <div className="footer-cta">
                    <span>Swipe for more</span>
                    <span className="footer-cta-arrow" />
                </div>
            </div>
        </div>
    )
}
