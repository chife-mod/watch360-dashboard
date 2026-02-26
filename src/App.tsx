import { useState, useCallback } from 'react'
import './styles/global.css'
import { Slide2 } from './components/slides/Slide2'

const MIN = 0.2
const MAX = 1.0
const STEP = 0.05
const DEFAULT = 0.5

function App() {
    const [scale, setScale] = useState(DEFAULT)

    const clamp = (v: number) => Math.round(Math.min(MAX, Math.max(MIN, v)) * 100) / 100

    const dec = useCallback(() => setScale(s => clamp(s - STEP)), [])
    const inc = useCallback(() => setScale(s => clamp(s + STEP)), [])

    return (
        <>
            {/* ── Slide canvas ── */}
            <div
                style={{
                    width: 1080,
                    height: 1350,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    flexShrink: 0,
                }}
            >
                <Slide2 />
            </div>

            {/* ── Scale HUD ── */}
            <div className="scale-hud">
                <button className="scale-btn" onClick={dec} aria-label="Уменьшить">−</button>

                <div className="scale-track">
                    <input
                        type="range"
                        min={MIN}
                        max={MAX}
                        step={STEP}
                        value={scale}
                        onChange={e => setScale(clamp(parseFloat(e.target.value)))}
                        className="scale-slider"
                        aria-label="Масштаб"
                    />
                </div>

                <button className="scale-btn" onClick={inc} aria-label="Увеличить">+</button>

                <span className="scale-label">{Math.round(scale * 100)}%</span>
            </div>
        </>
    )
}

export default App
