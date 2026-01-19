import React, { useState, useEffect } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { type Product, type ProductColor } from '../data/products';
import { productsService } from '../services/storefront/products.service';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '../components/Header';
import ImageGallery from '../components/ImageGallery';
import PriceBlock from '../components/PriceBlock';
import SizeSelector from '../components/SizeSelector';
import DeliveryInfo from '../components/DeliveryInfo';
import ProductDescription from '../components/ProductDescription';
import ScrollingAnnouncementBarDelivery from '../components/ScrollingAnnouncementBarDelivery';
import FAQSection from '../components/FAQSection';
import ProductGrid from '../components/ProductGrid';
import FixedBottomPurchaseBar from '../components/FixedBottomPurchaseBar';
import Footer from '../components/Footer';

const ProductPDP: React.FC = () => {
    // 1. All Hooks at the top
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [colorVariations, setColorVariations] = useState<Product[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

    const { addToCart } = useCart();

    // 2. Effects
    // Load Product
    useEffect(() => {
        const loadProduct = async () => {
            const path = window.location.pathname;
            const slug = path.split('/produto/')[1];

            if (!slug) {
                // Fallback for /pdp dev route
                const fallback = await productsService.getBySlug('chinelo-havaianas-farm-mar-de-ondas');
                if (fallback) {
                    setProduct(fallback);
                    setSelectedColor(fallback.colors[0]);
                }
            } else {
                const found = await productsService.getBySlug(slug);
                if (found) {
                    setProduct(found);
                    setSelectedColor(found.colors[0]);
                    // Reset states on product change
                    setSelectedSize(null);
                    window.scrollTo(0, 0);

                    // Resolve related products for color variations
                    if (found.relatedProducts?.length) {
                        const variations = await Promise.all(found.relatedProducts.map(s => productsService.getBySlug(s)));
                        setColorVariations(variations.filter((p): p is Product => !!p));
                    } else {
                        setColorVariations([]);
                    }
                } else {
                    setNotFound(true);
                }
            }
        };
        loadProduct();
    }, [window.location.pathname]);

    // Load Recommended Products (Related) - Depends on product
    useEffect(() => {
        if (product) {
            productsService.getAll().then(all => {
                const others = all.filter(p => p.id !== product.id).slice(0, 4);
                setRelatedProducts(others);
            });
        }
    }, [product]);

    // 3. Handlers & Logic
    const handleColorSelect = (color: ProductColor) => {
        setSelectedColor(color);
    };

    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);
    };

    const handleAddToBag = () => {
        if (selectedSize && product && selectedColor) {
            addToCart({
                id: product.id,
                name: product.name,
                image: selectedColor.images[0], // Use main image of color
                color: selectedColor.name,
                size: selectedSize,
                unitPrice: product.originalPrice || product.price,
                discountedPrice: product.price
            });
        }
    };

    const handleInfoClick = () => {
        const descriptionElement = document.getElementById('product-description');
        if (descriptionElement) {
            descriptionElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // 4. Conditional Renders (Early Returns)
    if (notFound) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Produto não encontrado 😕</h1>
                    <p className="text-gray-500 mb-6">O produto que você está procurando não existe ou foi removido.</p>
                    <button
                        onClick={() => window.history.back()}
                        className="text-red-600 font-bold underline"
                    >
                        Voltar para loja
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product || !selectedColor) return <div className="min-h-screen bg-white" />; // Loading

    // DIAGNOSIS: Checks if product has minimal data structure
    const hasValidData = product && product.colors && product.colors.length > 0;
    if (!hasValidData) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50">
                    <AlertCircle size={48} className="text-yellow-500 mb-4" />
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Dados Incompletos ⚠️</h1>
                    <p className="text-gray-500 mb-6 max-w-md">
                        Este produto existe no banco de dados, mas não possui <strong>Cores</strong> ou <strong>Imagens</strong> cadastradas.
                        <br />Por favor, acesse o painel Admin para corrigir.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-black text-white px-6 py-2 rounded-lg font-bold"
                    >
                        Voltar
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    // 5. Main Render
    return (
        <div className="w-full bg-white min-h-screen flex flex-col">
            <AnnouncementBar />
            <Header />

            <main className="flex-grow">
                {/* Product Gallery - changes based on color */}
                <ImageGallery images={selectedColor.images} />

                {/* Product Info */}
                <PriceBlock
                    productName={product.name}
                    originalPrice={product.originalPrice || 0}
                    currentPrice={product.price}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                />

                {/* Variation Selection (Slug-Based - NEW V1.1) */}
                {/* Only render if we have related products defined */}
                {(product.relatedProducts && product.relatedProducts.length > 0) ? (
                    <div className="w-full px-4 py-4 bg-white border-t border-gray-100 pb-0">
                        <p className="text-sm text-gray-900 mb-3">
                            Cor: <span className="font-bold uppercase">{product.color || selectedColor.name}</span>
                        </p>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {/* Current Product (Active) */}
                            <button
                                className="relative w-16 h-16 rounded-lg overflow-hidden flex-none border-2 border-black transition-all"
                            >
                                <img
                                    src={product.colors[0].thumbnail}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-1 right-1 bg-black rounded-full p-0.5">
                                    <Check className="w-2 h-2 text-white" strokeWidth={4} />
                                </div>
                            </button>

                            {/* Related Products */}
                            {colorVariations.map(related => {
                                const variationThumb = related.colors?.[0]?.thumbnail;
                                const isError = !variationThumb;

                                return (
                                    <button
                                        key={related.slug}
                                        onClick={() => {
                                            window.history.pushState({}, '', `/produto/${related.slug}`);
                                            window.dispatchEvent(new Event('popstate'));
                                            window.scrollTo(0, 0);
                                        }}
                                        className={`relative w-16 h-16 rounded-lg overflow-hidden flex-none transition-all
                                        ${isError ? 'border-2 border-red-500 bg-red-100 flex items-center justify-center' : 'border-2 border-transparent hover:border-gray-200'}`}
                                        title={isError ? "Erro: Produto sem imagem cadastrada" : (related.color || related.name)}
                                    >
                                        {isError ? (
                                            <AlertCircle size={24} className="text-red-500" />
                                        ) : (
                                            <img
                                                src={variationThumb}
                                                alt={related.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ) : null}

                {/* Legacy Size Selector (Hides internal colors if slug-based selector is active) */}
                <SizeSelector
                    colors={product.colors}
                    sizesAvailable={product.sizes.filter(s => s.available).map(s => s.label)}
                    onColorSelect={handleColorSelect}
                    onSizeSelect={handleSizeSelect}
                    hideColors={!!(product.relatedProducts && product.relatedProducts.length > 0)}
                />

                {/* Delivery Info */}
                <DeliveryInfo />

                {/* Product Description */}
                {product.description && (
                    <div id="product-description">
                        <ProductDescription
                            description={product.description}
                        />
                    </div>
                )}

                {/* Recommended Products */}
                {relatedProducts.length > 0 && (
                    <ProductGrid
                        key={product.id}
                        title="Leve também 🛍️"
                        products={relatedProducts}
                    />
                )}
                {/* Recommended Products */}
                {relatedProducts.length > 0 && (
                    <ProductGrid
                        key={product.id}
                        title="Estão levando 🔥"
                        products={relatedProducts}
                    />
                )}

                {/* Delivery Marquee */}
                <ScrollingAnnouncementBarDelivery />

                {/* FAQ */}
                <FAQSection />
            </main>

            <Footer />

            <FixedBottomPurchaseBar
                price={product.price}
                isSizeSelected={!!selectedSize}
                onAddToBag={handleAddToBag}
                onInfoClick={handleInfoClick}
            />
        </div>
    );
};

export default ProductPDP;
