import { SimpleBarSlide } from './SimpleBarSlide'

export function SlideV2_06() {
    return (
        <SimpleBarSlide
            title={'TOP STRAP\nMATERIALS'}
            rows={[
                { label: 'Stainless Steel', count: 28 },
                { label: 'Rubber', count: 25 },
                { label: 'Calfskin', count: 22 },
                { label: 'Silicone', count: 21 },
                { label: 'Alligator', count: 19 },
                { label: 'Leather', count: 9 },
                { label: 'Titanium', count: 7 },
                { label: 'Rose Gold', count: 5 },
                { label: 'Gold', count: 3 },
                { label: 'Ceramic', count: 2 },
            ]}
        />
    )
}
