import React, { useEffect, useState } from 'react';
import { productsAdminService } from '../../services/productsAdminService';
import type { Product } from '../../../types/Product';
import { Edit, Trash2, Plus, Search } from 'lucide-react';

const ProductsList: React.FC = () => {
    // CRUD States
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Bulk Import States
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importJson, setImportJson] = useState('');
    const [importError, setImportError] = useState<string | null>(null);

    // Load Products
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

    // Navigation Helper
    const handleNavigate = (path: string) => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new Event('popstate'));
    };

    // Delete Handler
    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Tem certeza que deseja excluir "${name}"?`)) {
            await productsAdminService.delete(id);
            const data = await productsAdminService.getAll();
            setProducts(data || []);
        }
    };

    // Filter Logic
    const filteredProducts = (products || []).filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Bulk Import Logic
    const handleImport = async () => {
        setImportError(null);
        try {
            const data = JSON.parse(importJson);
            if (!Array.isArray(data)) {
                setImportError('O JSON deve ser uma lista (array) de produtos: [...]');
                return;
            }
            await productsAdminService.createBulk(data);
            alert(`${data.length} produtos importados com sucesso!`);
            setIsImportModalOpen(false);
            setImportJson('');

            // Reload list
            const fresh = await productsAdminService.getAll();
            setProducts(fresh || []);
        } catch (error: any) {
            setImportError(error.message || 'Erro ao processar JSON. Verifique a sintaxe.');
        }
    };

    const EXAMPLE_JSON = `[
  {
    "name": "Chinelo Exemplo",
    "slug": "chinelo-exemplo-slug",
    "price": 59.90,
    "categories": ["masculino", "lancamentos"],
    "colors": [
      {
        "name": "Azul",
        "thumbnail": "URL_DA_IMAGEM",
        "images": ["URL_DA_IMAGEM"]
      }
    ],
    "sizes": [
      { "label": "39/40", "available": true }
    ]
  }
]`;

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
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setImportJson(EXAMPLE_JSON);
                            setIsImportModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors font-medium border border-gray-700"
                    >
                        <span className="text-yellow-400">⚡</span> Importar JSON
                    </button>
                    <button
                        onClick={() => handleNavigate('/admin/products/new')}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Plus size={18} />
                        Novo Produto
                    </button>
                </div>
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
                                    <div>
                                        <p className="font-semibold text-gray-900">{product.name}</p>
                                        <p className="text-xs text-gray-500">{product.slug}</p>
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
                                        <button
                                            onClick={() => handleNavigate(`/admin/products/${product.id}`)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            title="Editar"
                                        >
                                            <Edit size={18} />
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

            {/* Import Modal */}
            {isImportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="text-yellow-500">⚡</span>
                                Importação em Massa (JSON)
                            </h3>
                            <button
                                onClick={() => setIsImportModalOpen(false)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                                X
                            </button>
                        </div>
                        <div className="p-6 flex-1 overflow-auto bg-gray-50">
                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-1">Instruções:</p>
                                <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
                                    <li>Cole uma <strong>lista</strong> (Array) de objetos JSON.</li>
                                    <li>Certifique-se de que cada objeto tenha ao menos <code>name</code>, <code>slug</code> e <code>price</code>.</li>
                                    <li>Campos de sistema como <code>_id</code> serão ignorados.</li>
                                </ul>
                            </div>

                            <textarea
                                className="w-full h-80 p-4 border border-gray-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-inner"
                                value={importJson}
                                onChange={(e) => setImportJson(e.target.value)}
                                placeholder="Colar JSON aqui..."
                                autoFocus
                            />

                            {importError && (
                                <div className="mt-3 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-start gap-2">
                                    <span className="font-bold">Erro:</span>
                                    {importError}
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white rounded-b-xl">
                            <button
                                onClick={() => setIsImportModalOpen(false)}
                                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleImport}
                                className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                            >
                                Processar Importação
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsList;
