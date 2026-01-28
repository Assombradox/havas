import React from 'react';
import { Package, FolderTree, LayoutDashboard, Menu, X, ArrowLeft, ShoppingBag, Image as ImageIcon } from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const navigate = (path: string) => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new Event('popstate'));
    };

    const isActive = (path: string) => window.location.pathname.startsWith(path);

    return (
        <div className="min-h-screen bg-gray-100 flex font-sans">
            {/* Sidebar */}
            <aside
                className={`bg-gray-900 text-white transition-all duration-300 flex flex-col fixed md:relative z-20 h-full
                ${isSidebarOpen ? 'w-64' : 'w-20'}`}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
                    {isSidebarOpen && <span className="font-bold text-lg tracking-wider">ADMIN PANEL</span>}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1 hover:bg-gray-800 rounded"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 py-6 flex flex-col gap-2 px-2">
                    <button
                        onClick={() => navigate('/admin')}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors
                        ${isActive('/admin') && window.location.pathname === '/admin' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
                        title="Dashboard"
                    >
                        <LayoutDashboard size={22} />
                        {isSidebarOpen && <span>Dashboard</span>}
                    </button>

                    <button
                        onClick={() => navigate('/admin/products')}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors
                        ${isActive('/admin/products') ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
                        title="Produtos"
                    >
                        <Package size={22} />
                        {isSidebarOpen && <span>Produtos</span>}
                    </button>

                    <button
                        onClick={() => navigate('/admin/categories')}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors
                        ${isActive('/admin/categories') ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
                        title="Categorias"
                    >
                        <FolderTree size={22} />
                        {isSidebarOpen && <span>Categorias</span>}
                    </button>

                    <button
                        onClick={() => navigate('/admin/orders')}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors
                        ${isActive('/admin/orders') ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
                        title="Vendas"
                    >
                        <ShoppingBag size={22} />
                        {isSidebarOpen && <span>Vendas</span>}
                    </button>

                    <button
                        onClick={() => navigate('/admin/banners')}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors
                        ${isActive('/admin/banners') ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
                        title="Banners"
                    >
                        <ImageIcon size={22} />
                        {isSidebarOpen && <span>Banners</span>}
                    </button>

                    <div className="mt-auto pt-6 border-t border-gray-800">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-400 w-full"
                            title="Voltar para Loja"
                        >
                            <ArrowLeft size={22} />
                            {isSidebarOpen && <span>Voltar psra Loja</span>}
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-white shadow-sm flex items-center px-8 border-b border-gray-200">
                    <h1 className="text-xl font-semibold text-gray-800">
                        {window.location.pathname === '/admin' && 'Dashboard'}
                        {window.location.pathname.includes('/admin/products') && 'Gerenciar Produtos'}
                        {window.location.pathname.includes('/admin/categories') && 'Gerenciar Categorias'}
                        {window.location.pathname.includes('/admin/banners') && 'Gerenciar Banners'}
                    </h1>
                </header>
                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
