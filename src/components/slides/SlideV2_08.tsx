import './v2.css'
import './SlideV2_08.css'
import LOGO_SYMBOL from '/assets/logos/watch360-symbol.svg'
import LOGO_WORDMARK from '/assets/logos/watch360-wordmark.svg'

// Slide 08 — Special Editions: only 3 rows, larger spacing, no logos
const DATA = [
    { label: 'Limited Edition', count: 37 },
    { label: 'Celebrity / Collab', count: 9 },
    { label: 'Manufacture', count: 3 },
]

const MAX = 37

export function SlideV2_08() {
    return (
        <div className="v2-slide">
            <div className="v2-top" />
            <div className="v2-bottom" />

            <div className="v2-header">
                <div className="v2-header__logo">
                    <img src={LOGO_SYMBOL} alt="Watch360" className="v2-header__logo-symbol" />
                    <img src={LOGO_WORDMARK} alt="WATCH360" className="v2-header__logo-wordmark" />
                </div>
                <p className="v2-header__url">www.watch360.ai</p>
            </div>

            <p className="v2-title" style={{ whiteSpace: 'pre-line' }}>{'SPECIAL\nEDITIONS'}</p>

            {/* 3 large rows */}
            <div className="v2-se-rows">
                {DATA.map((r) => (
                    <div key={r.label} className="v2-se-row">
                        <div className="v2-bar-label-row">
                            <p className="v2-se-label">{r.label.toUpperCase()}</p>
                            <p className="v2-se-count">{r.count}</p>
                        </div>
                        <div className="v2-bar-track">
                            <div
                                className="v2-bar-fill"
                                style={{ height: '100%', width: `${(r.count / MAX) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
