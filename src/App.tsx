import { useEffect, useState } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import DeliveryAvailabilityBar from './components/DeliveryAvailabilityBar';
import HeroBanner from './components/HeroBanner';
import ScrollingAnnouncementBar from './components/ScrollingAnnouncementBar';
import ProductGrid from './components/ProductGrid';
import CategoryCarousel from './components/CategoryCarousel';
import SummerProductGrid from './components/SummerProductGrid';
import EditorialBanner from './components/EditorialBanner';
import CategoryCarousel2 from './components/CategoryCarousel2';
import ScrollingAnnouncementBarDelivery from './components/ScrollingAnnouncementBarDelivery';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import ProductPDP from './pages/ProductPDP';
import CategoryListingPage from './pages/CategoryListingPage';
import CheckoutLayout from './pages/checkout/CheckoutLayout';
import PixPaymentPage from './pages/checkout/PixPaymentPage';
import CheckoutSuccessPage from './pages/checkout/CheckoutSuccessPage';
import { CartProvider } from './context/CartContext';
import CartContainer from './components/CartContainer';

// ADMIN IMPORTS
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import ProductsList from './admin/pages/Products/ProductsList';
import ProductForm from './admin/pages/Products/ProductForm';
import CategoriesList from './admin/pages/Categories/CategoriesList';
import CategoryForm from './admin/pages/Categories/CategoryForm';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // Move content rendering to a helper function or component to clean up
  const renderContent = () => {
    // --- ADMIN ROUTES ---
    if (currentPath.startsWith('/admin')) {
      // Dashboard
      if (currentPath === '/admin') {
        return <AdminLayout><Dashboard /></AdminLayout>;
      }

      // Products List
      if (currentPath === '/admin/products') {
        return <AdminLayout><ProductsList /></AdminLayout>;
      }

      // Product Create
      if (currentPath === '/admin/products/new') {
        return <AdminLayout><ProductForm /></AdminLayout>;
      }

      // Product Edit
      if (currentPath.startsWith('/admin/products/')) {
        const id = currentPath.split('/admin/products/')[1];
        return <AdminLayout><ProductForm id={id} /></AdminLayout>;
      }

      // Categories List
      if (currentPath === '/admin/categories') {
        return <AdminLayout><CategoriesList /></AdminLayout>;
      }

      // Category Create
      if (currentPath === '/admin/categories/new') {
        return <AdminLayout><CategoryForm /></AdminLayout>;
      }

      // Category Edit
      if (currentPath.startsWith('/admin/categories/')) {
        const slug = currentPath.split('/admin/categories/')[1];
        return <AdminLayout><CategoryForm slug={slug} /></AdminLayout>;
      }
    }

    const isProductRoute = currentPath.startsWith('/produto/');
    const isPixRoute = currentPath.startsWith('/checkout/pix/');

    if (isPixRoute) {
      const parts = currentPath.split('/checkout/pix/');
      const paymentId = parts[1];
      return <PixPaymentPage paymentId={paymentId} />;
    }

    if (currentPath === '/checkout/pix') { // Legacy or direct access fallback
      return <PixPaymentPage />;
    }

    if (currentPath === '/checkout/success') {
      return <CheckoutSuccessPage />;
    }

    if (currentPath === '/checkout') {
      return <CheckoutLayout />;
    }

    if (isProductRoute) {
      return <ProductPDP />;
    }

    if (currentPath === '/pdp') {
      return <ProductPDP />;
    }

    if (currentPath === '/category' || currentPath === '/categoria/chinelos') {
      return <CategoryListingPage categorySlug="chinelos" />;
    }

    if (currentPath === '/categoria/rasteirinhas') {
      return <CategoryListingPage categorySlug="rasteirinhas" />;
    }

    if (currentPath === '/categoria/farm') {
      return <CategoryListingPage categorySlug="farm" />;
    }

    if (currentPath === '/categoria/times-futebol') {
      return <CategoryListingPage categorySlug="times-futebol" />;
    }

    if (currentPath === '/categoria/pride') {
      return <CategoryListingPage categorySlug="pride" />;
    }

    if (currentPath === '/categoria/glitter') {
      return <CategoryListingPage categorySlug="glitter" />;
    }

    if (currentPath === '/categoria/floral') {
      return <CategoryListingPage categorySlug="floral" />;
    }

    // Default Home
    return (
      <div className="w-full">
        <AnnouncementBar />
        <Header />
        <DeliveryAvailabilityBar />

        {/* Temporary Link to PDP Preview */}
        <div className="bg-blue-50 p-2 text-center text-sm text-blue-800 flex justify-center gap-4">
          <button onClick={() => navigate('/pdp')} className="underline font-bold">
            [DEV] Preview PDP
          </button>
          <button onClick={() => navigate('/category')} className="underline font-bold">
            [DEV] Preview Category
          </button>
          <button onClick={() => navigate('/checkout')} className="underline font-bold">
            [DEV] Checkout
          </button>
        </div>

        <HeroBanner />
        <ScrollingAnnouncementBar />
        <ProductGrid />
        <CategoryCarousel />
        <SummerProductGrid />
        <EditorialBanner />
        <CategoryCarousel2 />
        <ScrollingAnnouncementBarDelivery />
        <FAQSection />

        <Footer />
      </div>
    );
  };

  return (
    <CartProvider>
      {renderContent()}
      <CartContainer />
    </CartProvider>
  );
}

export default App;
