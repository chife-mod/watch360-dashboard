import { SimpleBarSlide } from './SimpleBarSlide'

export function SlideV2_05() {
    return (
        <SimpleBarSlide
            title={'TOP CASE\nMATERIALS'}
            rows={[
                { label: 'Stainless Steel', count: 63 },
                { label: 'Titanium', count: 22 },
                { label: 'Bio-Sourced', count: 14 },
                { label: 'Rose Gold', count: 11 },
                { label: 'Platinum', count: 6 },
                { label: 'Ceramic', count: 6 },
                { label: 'Polymer', count: 6 },
                { label: 'Gold', count: 4 },
                { label: 'Red Gold', count: 4 },
                { label: 'Composite Fibreshell', count: 3 },
            ]}
        />
    )
}
