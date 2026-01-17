import React from 'react';
import { productsAdminService } from '../services/productsAdminService';
import { categoriesAdminService } from '../services/categoriesAdminService';
import { Package, FolderTree, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [stats, setStats] = React.useState({ products: 0, categories: 0 });

    React.useEffect(() => {
        const loadStats = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    productsAdminService.getAll(),
                    categoriesAdminService.getAll()
                ]);
                setStats({
                    products: productsData ? productsData.length : 0,
                    categories: categoriesData ? categoriesData.length : 0
                });
            } catch (error) {
                console.error('Failed to load dashboard stats', error);
            }
        };
        loadStats();
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stats Card: Products */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total de Produtos</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.products}</h3>
                    </div>
                </div>

                {/* Stats Card: Categories */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-full">
                        <FolderTree size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Categorias Ativas</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.categories}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
