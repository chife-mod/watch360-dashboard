import { useState, useCallback, useRef } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import './styles/global.css'
import { Slide2 } from './components/slides/Slide2'

const MIN = 0.2
const MAX = 1.0
const STEP = 0.05
const DEFAULT = 0.55

function App() {
    const [scale, setScale] = useState(DEFAULT)
    const [isExporting, setIsExporting] = useState(false)
    const slideRef = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const clamp = (v: number) => Math.round(Math.min(MAX, Math.max(MIN, v)) * 100) / 100

    const dec = useCallback(() => setScale(s => clamp(s - STEP)), [])
    const inc = useCallback(() => setScale(s => clamp(s + STEP)), [])

    const handleSavePdf = async () => {
        if (!wrapperRef.current || !slideRef.current) return

        try {
            setIsExporting(true)

            // Temporarily set scale to 1 on the real element for pixel-perfect capture
            const wrapper = wrapperRef.current
            const prevTransform = wrapper.style.transform
            wrapper.style.transform = 'scale(1)'

            // Scroll into view and wait for repaint
            wrapper.scrollIntoView({ block: 'start' })
            await new Promise(r => setTimeout(r, 200))

            const canvas = await html2canvas(slideRef.current, {
                width: 1080,
                height: 1350,
                scale: 2,
                useCORS: true,
                backgroundColor: '#F0EFEE',
                logging: false,
            })

            // Restore scale
            wrapper.style.transform = prevTransform

            const imgData = canvas.toDataURL('image/jpeg', 0.95)

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [1080, 1350],
                hotfixes: ['px_scaling'],
            })

            pdf.addImage(imgData, 'JPEG', 0, 0, 1080, 1350)
            pdf.save('watch360-slide-2.pdf')
        } catch (error) {
            console.error('Failed to export PDF:', error)
            alert('Failed to generate PDF. See console for details.')
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <>
            {/* ── Slide canvas ── */}
            <div
                ref={wrapperRef}
                style={{
                    width: 1080,
                    height: 1350,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    flexShrink: 0,
                }}
            >
                <div ref={slideRef} style={{ width: 1080, height: 1350, overflow: 'hidden', position: 'relative' }}>
                    <Slide2 />
                </div>
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

                <div className="hud-divider" style={{ width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />

                <button
                    className="save-pdf-btn"
                    onClick={handleSavePdf}
                    disabled={isExporting}
                    title="Save to PDF"
                >
                    {isExporting ? 'Saving...' : 'Save to PDF'}
                </button>
            </div>
        </>
    )
}

export default App
