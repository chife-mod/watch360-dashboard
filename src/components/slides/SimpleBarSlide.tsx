import './v2.css'
import LOGO_SYMBOL from '/assets/logos/watch360-symbol.svg'
import LOGO_WORDMARK from '/assets/logos/watch360-wordmark.svg'

// Reusable simple bar slide — no logos, 10 rows, 56px height / 21px gap
interface SimpleRow { label: string; count: number }

interface Props {
    title: string          // Shown as pre-line (use \n for 2nd line)
    subtitle?: string      // Optional line below title in charcoal
    rows: SimpleRow[]
    subtitleTop?: number   // absolute Y; default: auto after title
}

export function SimpleBarSlide({ title, subtitle, rows, subtitleTop }: Props) {
    const max = Math.max(...rows.map(r => r.count))
    // Title height: 1 line ≈ 100px, 2 lines ≈ 200px
    const titleLines = title.split('\n').length
    const computedSubTop = 213 + titleLines * 108 * 0.93 + 10

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

            <p className="v2-title" style={{ whiteSpace: 'pre-line' }}>{title}</p>

            {subtitle && (
                <p
                    className="v2-subtitle"
                    style={{ top: subtitleTop ?? computedSubTop }}
                >
                    {subtitle}
                </p>
            )}

            {/* Simple bar rows */}
            <div className="v2-bars--simple">
                {rows.map((r) => (
                    <div key={r.label} className="v2-bar-row--simple">
                        <div className="v2-bar-label-row--simple">
                            <p className="v2-bar-label--simple">{r.label.toUpperCase()}</p>
                            <p className="v2-bar-count--simple">{r.count}</p>
                        </div>
                        <div className="v2-bar-track--simple">
                            <div
                                className="v2-bar-fill"
                                style={{ height: '100%', width: `${(r.count / max) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
