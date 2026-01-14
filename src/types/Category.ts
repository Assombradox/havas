export interface CategoryConfig {
    slug: string;
    title: string;
    description: string;
    image: string;
    type: 'category' | 'collection';
    order: number;
}
