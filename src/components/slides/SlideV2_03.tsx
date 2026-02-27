import './v2.css'
import LOGO_SYMBOL from '/assets/logos/watch360-symbol.svg'
import LOGO_WORDMARK from '/assets/logos/watch360-wordmark.svg'
import LOGO_HUBLOT from '/assets/brand-logos/hublot.svg'
import LOGO_BVLGARI from '/assets/brand-logos/bvlgari.svg'
import LOGO_LV from '/assets/brand-logos/louis-vuitton.svg'
import LOGO_TAG from '/assets/brand-logos/tag-heuer.svg'
import LOGO_ZENITH from '/assets/brand-logos/zenith.svg'
import LOGO_GG from '/assets/brand-logos/gerald-genta.svg'
import LOGO_DR from '/assets/brand-logos/daniel-roth.svg'

interface BrandRow {
    name: string
    count: number
    logo: string
}

const BRANDS: BrandRow[] = [
    { name: 'Hublot', count: 16, logo: LOGO_HUBLOT },
    { name: 'Bvlgari', count: 7, logo: LOGO_BVLGARI },
    { name: 'Louis Vuitton', count: 7, logo: LOGO_LV },
    { name: 'TAG Heuer', count: 6, logo: LOGO_TAG },
    { name: 'Zenith', count: 6, logo: LOGO_ZENITH },
    { name: 'Gerald Genta', count: 2, logo: LOGO_GG },
    { name: 'Daniel Roth', count: 1, logo: LOGO_DR },
]

const MAX = 16

export function SlideV2_03() {
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

            <p className="v2-title">{'NOVELTIES\nLVMH 2026'}</p>

            {/* Bar chart with logos */}
            <div className="v2-bars">
                {BRANDS.map((b) => (
                    <div key={b.name} className="v2-bar-row">
                        <div className="v2-logo-box">
                            <img src={b.logo} alt={b.name} />
                        </div>
                        <div className="v2-bar-content">
                            <div className="v2-bar-label-row">
                                <p className="v2-bar-label">{b.name.toUpperCase()}</p>
                                <p className="v2-bar-count">{b.count}</p>
                            </div>
                            <div className="v2-bar-track">
                                <div
                                    className="v2-bar-fill"
                                    style={{ width: `${(b.count / MAX) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
