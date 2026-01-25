import { useEffect, useState } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import DeliveryAvailabilityBar from './components/DeliveryAvailabilityBar';
import HeroBanner from './components/HeroBanner';
import ScrollingAnnouncementBar from './components/ScrollingAnnouncementBar';
import CategoryCarousel from './components/CategoryCarousel';
import EditorialBanner from './components/EditorialBanner';
import CategoryCarousel2 from './components/CategoryCarousel2';
import FeaturedSection from './components/FeaturedSection';
import IconicSection from './components/IconicSection';
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
import OrdersList from './admin/pages/Orders/OrdersList';
import Login from './admin/pages/Login';
import ProtectedRoute from './admin/components/ProtectedRoute';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Move content rendering to a helper function or component to clean up
  const renderContent = () => {
    // --- ADMIN ROUTES ---
    if (currentPath.startsWith('/admin')) {
      // Login - Public
      if (currentPath === '/admin/login') {
        return <Login />;
      }

      // Protected Admin Area
      const protectedAdmin = (component: React.ReactNode) => (
        <ProtectedRoute>
          <AdminLayout>
            {component}
          </AdminLayout>
        </ProtectedRoute>
      );

      // Dashboard
      if (currentPath === '/admin') {
        return protectedAdmin(<Dashboard />);
      }

      // Products List
      if (currentPath === '/admin/products') {
        return protectedAdmin(<ProductsList />);
      }

      // Product Create
      if (currentPath === '/admin/products/new') {
        return protectedAdmin(<ProductForm />);
      }

      // Product Edit
      if (currentPath.startsWith('/admin/products/')) {
        const id = currentPath.split('/admin/products/')[1];
        return protectedAdmin(<ProductForm id={id} />);
      }

      // Categories List
      if (currentPath === '/admin/categories') {
        return protectedAdmin(<CategoriesList />);
      }

      // Category Create
      if (currentPath === '/admin/categories/new') {
        return protectedAdmin(<CategoryForm />);
      }

      // Category Edit
      if (currentPath.startsWith('/admin/categories/')) {
        const slug = currentPath.split('/admin/categories/')[1];
        return protectedAdmin(<CategoryForm slug={slug} />);
      }

      // Orders List
      if (currentPath === '/admin/orders') {
        return protectedAdmin(<OrdersList />);
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



        <HeroBanner />
        <ScrollingAnnouncementBar />

        <CategoryCarousel />

        <FeaturedSection title="Lançamentos" categorySlug="lancamentos" limit={8} />

        <IconicSection title="Os mais icônicos" categorySlug="iconicos" />

        <FeaturedSection title="Destaques Femininos" categorySlug="feminino" limit={8} />

        <CategoryCarousel2 />

        <FeaturedSection title="Para Eles" categorySlug="masculino" limit={8} />

        <EditorialBanner />
        <ScrollingAnnouncementBarDelivery />
        <FAQSection />

        <Footer />
      </div>
    );
  };

  return (
    <CartProvider>
      <SpeedInsights />
      {renderContent()}
      <CartContainer />
    </CartProvider>
  );
}
export default App;
