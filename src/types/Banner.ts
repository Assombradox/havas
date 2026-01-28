export type BannerLocation = 'HERO' | 'EDITORIAL';
export const BannerLocation = {
    HERO: 'HERO',
    EDITORIAL: 'EDITORIAL'
} as const;

export interface Banner {
    id: string; // Public ID or _id
    title: string;
    imageUrl: string;
    link?: string;
    active: boolean;
    order: number;
    location: BannerLocation;
    createdAt?: string;
    updatedAt?: string;
}
