import { SimpleBarSlide } from './SimpleBarSlide'

export function SlideV2_07() {
    return (
        <SimpleBarSlide
            title={'TOP DIAL\nCOLORS'}
            rows={[
                { label: 'Blue', count: 30 },
                { label: 'Black', count: 22 },
                { label: 'Green', count: 16 },
                { label: 'Silver', count: 15 },
                { label: 'Skeleton', count: 11 },
                { label: 'White', count: 8 },
                { label: 'Teal', count: 8 },
                { label: 'Multi-Color', count: 8 },
                { label: 'Beige', count: 7 },
                { label: 'Grey', count: 6 },
            ]}
        />
    )
}
