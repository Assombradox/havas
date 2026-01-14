import React, { useEffect } from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '../components/Header';
import CategoryHeader from '../components/CategoryHeader';
import CategoryProductGrid from '../components/CategoryProductGrid';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import { products } from '../data/products';
import { getCategoryBySlug } from '../data/categories';

interface CategoryListingPageProps {
    categorySlug?: string;
}

const CategoryListingPage: React.FC<CategoryListingPageProps> = ({ categorySlug }) => {
    // If no prop is passed, try to get from URL (manual fallback for dev/testing without router)
    const effectiveSlug = categorySlug || window.location.pathname.split('/').pop() || '';

    // Debugging logs as requested
    console.log('--- CLP Debug ---');
    console.log('Effective Slug:', effectiveSlug);

    const categoryConfig = getCategoryBySlug(effectiveSlug);
    console.log('Category Config Found:', categoryConfig);

    if (!categoryConfig) {
        console.warn('Category not found for slug:', effectiveSlug);
        return (
            <div className="w-full bg-white min-h-screen flex flex-col">
                <AnnouncementBar />
                <Header />
                <div className="flex-grow flex items-center justify-center">
                    <h1 className="text-2xl font-bold text-gray-800">Categoria não encontrada: {effectiveSlug}</h1>
                </div>
                <Footer />
            </div>
        );
    }

    // Filter products (Product can have multiple categories)
    // Safety check for p.categories existence
    const filteredProducts = products.filter(p => {
        const match = p.categories?.includes(effectiveSlug);
        return match;
    });

    console.log('Filtered Products Count:', filteredProducts.length);

    return (
        <div className="w-full bg-white min-h-screen flex flex-col">
            <AnnouncementBar />
            <Header />

            <main className="flex-grow">
                {/* Category Header */}
                <CategoryHeader
                    title={categoryConfig.title}
                    description={categoryConfig.description}
                />

                {/* Product Grid - Handles pagination internally */}
                <CategoryProductGrid products={filteredProducts} />

                {/* FAQ Section - Naturally flows below grid */}
                <FAQSection />
            </main>

            <Footer />
        </div>
    );
};

export default CategoryListingPage;
