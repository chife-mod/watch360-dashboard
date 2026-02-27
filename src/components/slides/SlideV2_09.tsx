import { SimpleBarSlide } from './SimpleBarSlide'

export function SlideV2_09() {
    return (
        <SimpleBarSlide
            title={'PRICE RANGE'}
            subtitle={'NEW RELEASES BY PRICE SEGMENT'}
            subtitleTop={313}
            rows={[
                { label: '$0–$500', count: 26 },
                { label: '$100,000–$250,000', count: 18 },
                { label: '$10,000–$25,000', count: 18 },
                { label: '$1,000–$2,500', count: 17 },
                { label: '$5,000–$10,000', count: 14 },
                { label: 'N/A', count: 12 },
                { label: '$25,000–$50,000', count: 12 },
                { label: '$2,500–$5,000', count: 12 },
                { label: '$500–$1,000', count: 9 },
                { label: '$50,000–$100,000', count: 5 },
            ]}
        />
    )
}
