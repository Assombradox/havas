import React, { useEffect, useState } from 'react';
import { productsAdminService } from '../../services/productsAdminService';
import type { Product } from '../../../types/Product';
import { Edit, Trash2, Plus, Search, ImageOff, Eye, Copy } from 'lucide-react';

const ProductsList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const data = await productsAdminService.getAll();
                setProducts(data || []);
            } catch (error) {
                console.error('Failed to load products');
            }
        };
        load();
    }, []);

    const handleNavigate = (path: string) => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new Event('popstate'));
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Tem certeza que deseja excluir "${name}"?`)) {
            await productsAdminService.delete(id);
            const data = await productsAdminService.getAll();
            setProducts(data);
        }
    };

    const handleDuplicate = async (id: string) => {
        if (confirm('Deseja duplicar este produto?')) {
            try {
                const newProduct = await productsAdminService.duplicate(id);
                alert('Produto duplicado! Você está editando a cópia.');
                handleNavigate(`/admin/products/${newProduct.id}`);
            } catch (error) {
                alert('Erro ao duplicar produto.');
                console.error(error);
            }
        }
    };

    const filteredProducts = (products || []).filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4 items-center bg-gray-50">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar produtos..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => handleNavigate('/admin/products/new')}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <Plus size={18} />
                    Novo Produto
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                        <tr>
                            <th className="p-4">Produto</th>
                            <th className="p-4">Preço</th>
                            <th className="p-4">Categorias</th>
                            <th className="p-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        {(() => {
                                            const imgUrl = product.coverImage || product.colors?.[0]?.thumbnail || product.colors?.[0]?.images?.[0];
                                            if (imgUrl) {
                                                return (
                                                    <img
                                                        src={imgUrl}
                                                        alt={product.name}
                                                        className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0 bg-gray-50"
                                                    />
                                                );
                                            }
                                            return (
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                                                    <ImageOff size={16} />
                                                </div>
                                            );
                                        })()}
                                        <div>
                                            <p className="font-semibold text-gray-900">{product.name}</p>
                                            <p className="text-xs text-gray-500">{product.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-gray-700">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-1">
                                        {(product.categories || []).map(c => (
                                            <span key={c} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full border border-gray-200">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <a
                                            href={`/product/${product.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors"
                                            title="Ver na Loja"
                                        >
                                            <Eye size={18} />
                                        </a>
                                        <button
                                            onClick={() => handleNavigate(`/admin/products/${product.id}`)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            title="Editar"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDuplicate(product.id)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                                            title="Duplicar"
                                        >
                                            <Copy size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id, product.name)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Excluir"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && (
                    <div className="p-8 text-center text-gray-500">Nenhum produto encontrado.</div>
                )}
            </div>
        </div>
    );
};

export default ProductsList;
