import React, { useEffect, useState } from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '../components/Header';
import CategoryProductGrid from '../components/CategoryProductGrid';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import { productsService } from '../services/storefront/products.service';
import type { Product } from '../types/Product';

const SearchPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const loadResults = async () => {
            // Get query from URL
            const urlParams = new URLSearchParams(window.location.search);
            const q = urlParams.get('q') || '';
            setQuery(q);

            if (!q.trim()) {
                setProducts([]);
                setLoading(false);
                return;
            }

            try {
                const allProducts = await productsService.getAll();
                const lowerQ = q.toLowerCase();

                const filtered = allProducts.filter(p =>
                    p.name.toLowerCase().includes(lowerQ) ||
                    p.description?.toLowerCase().includes(lowerQ) ||
                    p.categories?.some(c => c.includes(lowerQ))
                );

                setProducts(filtered);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setLoading(false);
            }
        };

        loadResults();

        // Listen for popstate to reload if URL changes (though App.tsx usually handles re-render on route change, 
        // query param changes might need detection if component doesn't unmount)
        const handlePopState = () => loadResults();
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    return (
        <div className="w-full bg-white min-h-screen flex flex-col">
            <AnnouncementBar />
            <Header />

            <main className="flex-grow">
                {/* Search Header */}
                <div className="w-full bg-gray-50 py-12 px-4 text-center border-b border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {loading ? 'Buscando...' : `Resultados para "${query}"`}
                    </h1>
                    <p className="text-gray-500">
                        {loading ? 'Aguarde um momento' : `${products.length} produtos encontrados`}
                    </p>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    </div>
                ) : products.length > 0 ? (
                    <CategoryProductGrid products={products} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <p className="text-lg text-gray-500 mb-6">Não encontramos nenhum produto com esse termo.</p>
                        <button
                            onClick={() => {
                                window.history.pushState({}, '', '/');
                                window.dispatchEvent(new Event('popstate'));
                                window.scrollTo(0, 0);
                            }}
                            className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                        >
                            Voltar para a Loja
                        </button>
                    </div>
                )}

                <FAQSection />
            </main>

            <Footer />
        </div>
    );
};

export default SearchPage;
