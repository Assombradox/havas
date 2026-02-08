import { useEffect, useState } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import AnnouncementBar from './components/AnnouncementBar';
import CampaignBanner from './components/CampaignBanner';
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
import SearchPage from './pages/SearchPage';
import CheckoutLayout from './pages/checkout/CheckoutLayout';
import PixPaymentPage from './pages/checkout/PixPaymentPage';
import CheckoutSuccessPage from './pages/checkout/CheckoutSuccessPage';
// import { SpeedInsights } from "@vercel/speed-insights/react";
import { CartProvider } from './context/CartContext';
import CartContainer from './components/CartContainer';

// ADMIN IMPORTS
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import ProductsList from './admin/pages/Products/ProductsList';
import ProductForm from './admin/pages/Products/ProductForm';
import CategoriesList from './admin/pages/Categories/CategoriesList';
import CategoryForm from './admin/pages/Categories/CategoryForm';
import CategoryProducts from './admin/pages/Categories/CategoryProducts';
import BannersList from './admin/pages/Banners/BannersList';
import EmailEditor from './admin/pages/Settings/EmailEditor';
import BannerForm from './admin/pages/Banners/BannerForm';
import Integrations from './admin/pages/Settings/Integrations';
import OrdersList from './admin/pages/Orders/OrdersList';
import Login from './admin/pages/Login';
import ProtectedRoute from './admin/components/ProtectedRoute';

import { useUtmTracking } from './hooks/useUtmTracking';

function InnerApp() {
  useUtmTracking();
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
      if (currentPath.startsWith('/admin/categories/') && !currentPath.endsWith('/products')) {
        const slug = currentPath.split('/admin/categories/')[1];
        if (slug !== 'new') {
          return protectedAdmin(<CategoryForm slug={slug} />);
        }
      }

      // Category Products (Sort)
      if (currentPath.startsWith('/admin/categories/') && currentPath.endsWith('/products')) {
        // /admin/categories/:slug/products
        const slug = currentPath.split('/admin/categories/')[1].replace('/products', '');
        return protectedAdmin(<CategoryProducts slug={slug} />);
      }

      // Orders List
      if (currentPath === '/admin/orders') {
        return protectedAdmin(<OrdersList />);
      }

      // Banners List
      if (currentPath === '/admin/banners') {
        return protectedAdmin(<BannersList />);
      }

      // Banner Create
      if (currentPath === '/admin/banners/new') {
        return protectedAdmin(<BannerForm />);
      }

      // Banner Edit
      if (currentPath.startsWith('/admin/banners/')) {
        const id = currentPath.split('/admin/banners/')[1];
        return protectedAdmin(<BannerForm id={id} />);
      }

      // Email Editor
      if (currentPath === '/admin/email-editor') {
        return protectedAdmin(<EmailEditor />);
      }

      // Integrations
      if (currentPath === '/admin/integrations') {
        return protectedAdmin(<Integrations />);
      }
    }
  };

  const adminContent = renderContent();
  if (adminContent) return adminContent;


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

  // Dynamic Category Routing
  if (currentPath.startsWith('/categoria/')) {
    const slug = currentPath.split('/categoria/')[1];
    if (slug) {
      return <CategoryListingPage categorySlug={slug} />;
    }
  }

  if (currentPath === '/search' || currentPath.startsWith('/search?')) {
    return <SearchPage />;
  }

  // Default Home
  return (
    <div className="w-full">
      <AnnouncementBar />
      <Header />
      <DeliveryAvailabilityBar />



      <HeroBanner />
      <ScrollingAnnouncementBar />

      <FeaturedSection title="Outlet" categorySlug="outlet" limit={4} />

      <CategoryCarousel />

      <FeaturedSection title="Verão é com as originais do Brasil" categorySlug="promo-as-originais" limit={4} />

      <IconicSection title="Os mais icônicos" categorySlug="iconicos" />

      <EditorialBanner />

      <CategoryCarousel2 />

      <ScrollingAnnouncementBarDelivery />
      <FAQSection />

      <Footer />
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <SpeedInsights />
      <Analytics />
      <CampaignBanner />
      <InnerApp />
      <CartContainer />
    </CartProvider>
  );
}


export default App;
