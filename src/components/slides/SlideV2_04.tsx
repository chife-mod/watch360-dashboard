import './v2.css'
import LOGO_SYMBOL from '/assets/logos/watch360-symbol.svg'
import LOGO_WORDMARK from '/assets/logos/watch360-wordmark.svg'
import LOGO_SWATCH from '/assets/brand-logos/swatch.svg'
import LOGO_HUBLOT from '/assets/brand-logos/hublot.svg'
import LOGO_TAG from '/assets/brand-logos/tag-heuer.svg'
import LOGO_FC from '/assets/brand-logos/frederique-constant.svg'
import LOGO_LV from '/assets/brand-logos/louis-vuitton.svg'
import LOGO_BVLGARI from '/assets/brand-logos/bvlgari.svg'
import LOGO_CITIZEN from '/assets/brand-logos/citizen.svg'

interface BrandRow {
    name: string
    count: number
    logo: string
}

const BRANDS: BrandRow[] = [
    { name: 'Swatch', count: 23, logo: LOGO_SWATCH },
    { name: 'Hublot', count: 18, logo: LOGO_HUBLOT },
    { name: 'TAG Heuer', count: 10, logo: LOGO_TAG },
    { name: 'Frederique Constant', count: 8, logo: LOGO_FC },
    { name: 'Louis Vuitton', count: 7, logo: LOGO_LV },
    { name: 'Bvlgari', count: 7, logo: LOGO_BVLGARI },
    { name: 'Citizen', count: 7, logo: LOGO_CITIZEN },
]

const MAX = 23

export function SlideV2_04() {
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

            <p className="v2-title">{'TOP BRANDS\n2026'}</p>

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
