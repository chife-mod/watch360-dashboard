import './v2.css'
import './SlideV2_01.css'
import LOGO_SYMBOL from '/assets/logos/watch360-symbol.svg'
import LOGO_WORDMARK from '/assets/logos/watch360-wordmark.svg'
import COVER_IMG from '/assets/images/cover-watch.png'

export function SlideV2_01() {
    return (
        <div className="v2-slide">
            {/* Panels */}
            <div className="v2-top" />
            <div className="v2-bottom" />

            {/* Watch image — behind stat boxes */}
            <img src={COVER_IMG} alt="Watch" className="v2-cover-img" />

            {/* Header */}
            <div className="v2-header">
                <div className="v2-header__logo">
                    <img src={LOGO_SYMBOL} alt="Watch360" className="v2-header__logo-symbol" />
                    <img src={LOGO_WORDMARK} alt="WATCH360" className="v2-header__logo-wordmark" />
                </div>
                <p className="v2-header__url">www.watch360.ai</p>
            </div>

            {/* Title: WATCH NOVELTIES (gold, 2 lines) */}
            <p className="v2-title" style={{ top: 213 }}>
                {'WATCH\nNOVELTIES'}
            </p>

            {/* JAN 2026 — same size, charcoal */}
            <p className="v2-title v2-title--charcoal">JAN 2026</p>

            {/* Stat boxes — above image */}
            <div className="v2-stat-row">
                <div className="v2-stat-box">
                    <p className="v2-stat-num">147</p>
                    <p className="v2-stat-lbl">New Models</p>
                </div>
                <div className="v2-stat-divider" />
                <div className="v2-stat-box">
                    <p className="v2-stat-num">39</p>
                    <p className="v2-stat-lbl">Watch Brands</p>
                </div>
            </div>
        </div>
    )
}
