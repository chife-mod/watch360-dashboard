// Data Types for Watch360 Social Dashboard
// Phase 1: Static Hero Slide
// Phase 2+: Animated slide series

export interface DashboardMeta {
    title: string
    period: string
    generated_at: string
    powered_by: string
}

export interface OverviewStats {
    new_watch_releases: number
    active_brands: number
}

export interface Insight {
    id: string
    label: string
    value: string
    detail: string
}

export interface BrandEntry {
    name: string
    releases: number
    segment: string
}

export interface HeroSlideData {
    meta: DashboardMeta
    overview: OverviewStats
    insights: Insight[]
    top_brands: BrandEntry[]
}

// Slide registry type — used for future multi-slide architecture
export type SlideId =
    | 'hero'
    | 'brand-activity'
    | 'price-segmentation'
    | 'movement-trends'
    | 'materials'

export interface SlideConfig {
    id: SlideId
    title: string
    component: string
    order: number
    isActive: boolean
}
