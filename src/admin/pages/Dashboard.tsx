import React from 'react';
import { productsAdminService } from '../services/productsAdminService';
import { categoriesAdminService } from '../services/categoriesAdminService';
import { Package, FolderTree, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
    const products = productsAdminService.getAll();
    const categories = categoriesAdminService.getAll();

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
                        <h3 className="text-2xl font-bold text-gray-900">{products.length}</h3>
                    </div>
                </div>

                {/* Stats Card: Categories */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-full">
                        <FolderTree size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Categorias Ativas</p>
                        <h3 className="text-2xl font-bold text-gray-900">{categories.length}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                <div>
                    <h4 className="font-semibold text-blue-900">Modo de Simulação Local</h4>
                    <p className="text-sm text-blue-800 mt-1">
                        Este painel está rodando no navegador. As alterações são salvas no <strong>localStorage</strong> e não alteram os arquivos JSON reais.
                        Para persistir em disco, seria necessário um backend Node.js real.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
