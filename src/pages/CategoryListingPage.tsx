import React, { useEffect, useState } from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '../components/Header';
import CategoryHeader from '../components/CategoryHeader';
import CategoryProductGrid from '../components/CategoryProductGrid';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import { productsService } from '../services/storefront/products.service';
import { categoriesService } from '../services/storefront/categories.service';
import type { CategoryConfig } from '../types/Category';
import type { Product } from '../types/Product';

interface CategoryListingPageProps {
    categorySlug?: string;
}

const CategoryListingPage: React.FC<CategoryListingPageProps> = ({ categorySlug }) => {
    // If no prop is passed, try to get from URL (manual fallback for dev/testing without router)
    const effectiveSlug = categorySlug || window.location.pathname.split('/').pop() || '';

    const [categoryConfig, setCategoryConfig] = useState<CategoryConfig | undefined>(undefined);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            // Load Category Config
            const cat = await categoriesService.getBySlug(effectiveSlug);

            if (cat) {
                setCategoryConfig(cat);
                // Load Products and Filter only if category found
                const allProducts = await productsService.getAll();
                const filtered = allProducts.filter(p => p.categories?.includes(effectiveSlug));
                setFilteredProducts(filtered);
            }
            setLoading(false);
        };
        loadData();
    }, [effectiveSlug]);

    if (loading) {
        return (
            <div className="w-full bg-white min-h-screen flex flex-col">
                <AnnouncementBar />
                <Header />
                <div className="flex-grow flex items-center justify-center">
                    <h1 className="text-2xl font-bold text-gray-800">Carregando...</h1>
                </div>
                <Footer />
            </div>
        );
    }

    if (!categoryConfig) {
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
    // Correction: I cannot change the "Not Found" JSX too much. 
    // But since I control the return, I can return a Loading spinner if I add state.

    console.log('Filtered Products Count:', filteredProducts.length);

    return (
        <div className="w-full bg-white min-h-screen flex flex-col">
            <AnnouncementBar />
            <Header />

            <main className="flex-grow">
                {/* Category Header */}
                <CategoryHeader
                    title={categoryConfig.title || categoryConfig.name || categoryConfig.slug}
                    description={categoryConfig.description || ''}
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
