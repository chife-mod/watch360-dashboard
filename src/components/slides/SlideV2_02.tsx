import './v2.css'
import './SlideV2_02.css'
import LOGO_SYMBOL from '/assets/logos/watch360-symbol.svg'
import LOGO_WORDMARK from '/assets/logos/watch360-wordmark.svg'

// Semi-donut SVG parameters
const CX = 440
const CY = 340      // center of the half-circle (within bottom panel coords)
const R_OUTER = 210
const R_INNER = 130
const GAP_DEG = 3   // gap between segments in degrees

// Total = 147, gold = 101, purple = 46
const TOTAL = 147
const GOLD_VAL = 101
const PURPLE_VAL = 46

// Semi-donut sweeps 180° (π radians), left half = purple, right = gold
// We draw from 180° to 360° (bottom-pointing arc)
function polarToXY(deg: number, r: number, cx: number, cy: number) {
    const rad = (deg * Math.PI) / 180
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
    }
}

function arcPath(
    cx: number, cy: number,
    rOuter: number, rInner: number,
    startDeg: number, endDeg: number,
    borderRadius = 4
) {
    // Build annular sector path
    const o1 = polarToXY(startDeg, rOuter, cx, cy)
    const o2 = polarToXY(endDeg, rOuter, cx, cy)
    const i1 = polarToXY(endDeg, rInner, cx, cy)
    const i2 = polarToXY(startDeg, rInner, cx, cy)
    const large = endDeg - startDeg > 180 ? 1 : 0
    return [
        `M ${o1.x} ${o1.y}`,
        `A ${rOuter} ${rOuter} 0 ${large} 1 ${o2.x} ${o2.y}`,
        `L ${i1.x} ${i1.y}`,
        `A ${rInner} ${rInner} 0 ${large} 0 ${i2.x} ${i2.y}`,
        'Z',
    ].join(' ')
}

function SemiDonut() {
    // Each segment fills proportionally 0→180°
    const goldFrac = GOLD_VAL / TOTAL  // ~0.687
    const purpleFrac = PURPLE_VAL / TOTAL  // ~0.313

    // Arc spans 180° → 360° (right side to left, clockwise)
    const START = 180  // leftmost point
    const END = 360  // rightmost point
    const SPAN = 180

    const goldDeg = SPAN * goldFrac
    const purpleDeg = SPAN * purpleFrac

    // Gold arc: 180° → 180+goldDeg (larger left arc)
    // Purple arc: 180+goldDeg+gap → 360°
    const goldStart = START
    const goldEnd = START + goldDeg - GAP_DEG
    const purpleStart = START + goldDeg + GAP_DEG
    const purpleEnd = END

    return (
        <svg
            viewBox={`0 0 880 440`}
            width={880}
            height={440}
            className="v2-donut-svg"
        >
            {/* Gold segment (left, 101) */}
            <path
                d={arcPath(CX, CY, R_OUTER, R_INNER, goldStart, goldEnd)}
                fill="#A98155"
            />
            {/* Purple segment (right, 46) */}
            <path
                d={arcPath(CX, CY, R_OUTER, R_INNER, purpleStart, purpleEnd)}
                fill="#9B67C8"
            />
            {/* Center label */}
            <text
                x={CX} y={CY - 18}
                textAnchor="middle"
                fontFamily="Lato, sans-serif"
                fontSize={96}
                fontWeight={900}
                fill="#FFFFFF"
            >
                {TOTAL}
            </text>
            <text
                x={CX} y={CY + 26}
                textAnchor="middle"
                fontFamily="Lato, sans-serif"
                fontSize={30}
                fontWeight={400}
                fill="#FFFFFF"
                letterSpacing={0.5}
            >
                Total Novelties
            </text>
        </svg>
    )
}

export function SlideV2_02() {
    return (
        <div className="v2-slide">
            {/* Top panel */}
            <div className="v2-top" />
            <div className="v2-bottom" />

            {/* Header */}
            <div className="v2-header">
                <div className="v2-header__logo">
                    <img src={LOGO_SYMBOL} alt="Watch360" className="v2-header__logo-symbol" />
                    <img src={LOGO_WORDMARK} alt="WATCH360" className="v2-header__logo-wordmark" />
                </div>
                <p className="v2-header__url">www.watch360.ai</p>
            </div>

            {/* Title */}
            <p className="v2-title">ALL RELEASES</p>
            <p className="v2-subtitle" style={{ top: '373px' }}>
                JAN 2026 VS LVMH 2026
            </p>

            {/* Semi-donut */}
            <div className="v2-donut-wrap">
                <SemiDonut />
            </div>

            {/* Legend */}
            <div className="v2-donut-legend">
                <div className="v2-donut-legend__item">
                    <span className="v2-donut-legend__num" style={{ color: '#A98155' }}>101</span>
                    <span className="v2-donut-legend__lbl">Not Presented</span>
                </div>
                <div className="v2-donut-legend__item">
                    <span className="v2-donut-legend__num" style={{ color: '#9B67C8' }}>46</span>
                    <span className="v2-donut-legend__lbl">Presented at LVMH</span>
                </div>
            </div>
        </div>
    )
}
