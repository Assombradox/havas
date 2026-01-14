import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(__dirname, '../../data/categories.json');
const SRC_BACKUP = path.join(__dirname, '../../../../src/data/categories.json');

interface CategoryConfig {
    slug: string;
    title: string;
    description: string;
    image: string;
    type: 'category' | 'collection';
    order: number;
}

export const categoriesService = {
    getAll: (): CategoryConfig[] => {
        try {
            if (!fs.existsSync(DATA_FILE)) {
                if (fs.existsSync(SRC_BACKUP)) {
                    console.log('Seeding categories from src/data...');
                    const seedData = fs.readFileSync(SRC_BACKUP, 'utf-8');
                    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
                    fs.writeFileSync(DATA_FILE, seedData);
                    return JSON.parse(seedData);
                }
                return [];
            }

            const data = fs.readFileSync(DATA_FILE, 'utf-8');
            const categories = JSON.parse(data);

            // If empty array, try reseeding
            if (Array.isArray(categories) && categories.length === 0) {
                if (fs.existsSync(SRC_BACKUP)) {
                    console.log('Re-seeding empty categories file...');
                    const seedData = fs.readFileSync(SRC_BACKUP, 'utf-8');
                    fs.writeFileSync(DATA_FILE, seedData);
                    return JSON.parse(seedData);
                }
            }

            return categories;
        } catch (error) {
            console.error('Error reading categories:', error);
            return [];
        }
    },

    getBySlug: (slug: string): CategoryConfig | undefined => {
        const categories = categoriesService.getAll();
        return categories.find(c => c.slug === slug);
    },

    create: (category: CategoryConfig): CategoryConfig => {
        const categories = categoriesService.getAll();

        // Validate Slug Uniqueness
        if (categories.some(c => c.slug === category.slug)) {
            throw new Error(`Slug "${category.slug}" already exists.`);
        }

        categories.push(category);
        fs.writeFileSync(DATA_FILE, JSON.stringify(categories, null, 4));
        return category;
    },

    update: (slug: string, updates: Partial<CategoryConfig>): CategoryConfig | undefined => {
        const categories = categoriesService.getAll();
        const index = categories.findIndex(c => c.slug === slug);

        if (index === -1) return undefined;

        // Check Slug Uniqueness if updating slug
        if (updates.slug && updates.slug !== categories[index].slug) {
            if (categories.some(c => c.slug === updates.slug)) {
                throw new Error(`Slug "${updates.slug}" already exists.`);
            }
        }

        const updatedCategory = { ...categories[index], ...updates };
        categories[index] = updatedCategory;

        fs.writeFileSync(DATA_FILE, JSON.stringify(categories, null, 4));
        return updatedCategory;
    }
};
