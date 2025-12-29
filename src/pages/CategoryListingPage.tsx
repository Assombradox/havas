import React from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '../components/Header';
import CategoryHeader from '../components/CategoryHeader';
import CategoryProductGrid from '../components/CategoryProductGrid';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';

const CategoryListingPage: React.FC = () => {
    return (
        <div className="w-full bg-white min-h-screen flex flex-col">
            <AnnouncementBar />
            <Header />

            <main className="flex-grow">
                {/* Category Header */}
                <CategoryHeader
                    title="Chinelos"
                    description="Explore nossa coleção de chinelos Havaianas. Conforto, estilo e qualidade para todos os momentos. Do básico ao estampado, encontre o par perfeito para você aproveitar o melhor do verão com liberdade e muito charme nos pés."
                />

                {/* Product Grid - Handles pagination internally */}
                <CategoryProductGrid />

                {/* FAQ Section - Naturally flows below grid */}
                <FAQSection />
            </main>

            <Footer />
        </div>
    );
};

export default CategoryListingPage;
