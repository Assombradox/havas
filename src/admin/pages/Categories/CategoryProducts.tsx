import React, { useEffect, useState } from 'react';

import { productsAdminService } from '../../services/productsAdminService';
import { categoriesAdminService } from '../../services/categoriesAdminService';
import type { Product } from '../../../types/Product';
import { Save, ArrowLeft, Image } from 'lucide-react';

interface CategoryProductsProps {
    slug: string;
}

const CategoryProducts: React.FC<CategoryProductsProps> = ({ slug }) => {
    // const navigate = useNavigate(); // Project uses manual routing or window.history
    const navigate = (path: string) => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new Event('popstate'));
    };

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryTitle, setCategoryTitle] = useState('');

    useEffect(() => {
        const load = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                // Load category details for title
                const cats = await categoriesAdminService.getAll();
                const currentCat = cats.find(c => c.slug === slug);
                setCategoryTitle(currentCat?.title || currentCat?.name || slug);

                // Load products
                const data = await productsAdminService.getAll(slug);
                setProducts(data);
            } catch (error) {
                console.error('Failed to load data', error);
                alert('Erro ao carregar produtos');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [slug]);

    const handleOrderChange = (id: string, newOrder: string) => {
        const orderNum = parseInt(newOrder) || 0;
        setProducts(prev => prev.map(p => p.id === id ? { ...p, order: orderNum } : p));
    };

    const handleSave = async () => {
        try {
            const items = products.map(p => ({ id: p.id, order: p.order || 0 }));
            await productsAdminService.batchReorder(items);
            alert('Ordem atualizada com sucesso!');
            // Reload to confirm (optional)
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar ordem.');
        }
    };

    if (loading) return <div className="p-8 text-center">Carregando...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/categories')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Organizar Vitrine</h1>
                        <p className="text-gray-500">Categoria: <span className="font-semibold text-blue-600">{categoryTitle}</span> ({products.length} produtos)</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium"
                >
                    <Save size={20} />
                    Salvar Ordem
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                        <tr>
                            <th className="p-4 w-20 text-center">Ordem</th>
                            <th className="p-4 w-20 text-center">Img</th>
                            <th className="p-4">Produto</th>
                            <th className="p-4">Preço</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <input
                                        type="number"
                                        value={product.order || 0}
                                        onChange={(e) => handleOrderChange(product.id, e.target.value)}
                                        className="w-16 p-2 border border-gray-300 rounded text-center font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </td>
                                <td className="p-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                        {product.coverImage ? (
                                            <img src={product.coverImage} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <Image size={20} className="text-gray-400" />
                                        )}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <p className="font-semibold text-gray-900">{product.name}</p>
                                    <p className="text-xs text-gray-500">{product.slug}</p>
                                </td>
                                <td className="p-4 text-gray-600 font-medium">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        Nenhum produto nesta categoria.
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryProducts;
