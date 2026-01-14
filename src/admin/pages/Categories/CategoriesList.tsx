import React, { useEffect, useState } from 'react';
import { categoriesAdminService } from '../../services/categoriesAdminService';
import type { CategoryConfig } from '../../../types/Category';
import { Edit, Trash2, Plus } from 'lucide-react';

const CategoriesList: React.FC = () => {
    const [categories, setCategories] = useState<CategoryConfig[]>([]);

    // Auto-load
    // Auto-load
    useEffect(() => {
        const load = async () => {
            try {
                const data = await categoriesAdminService.getAll();
                setCategories(data);
            } catch (error) {
                console.error('Failed to load categories');
            }
        };
        load();
    }, []);

    const handleNavigate = (path: string) => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new Event('popstate'));
    };

    const handleDelete = async (slug: string, title: string) => {
        if (confirm(`Tem certeza que deseja excluir "${title}"?`)) {
            await categoriesAdminService.delete(slug);
            const data = await categoriesAdminService.getAll();
            setCategories(data);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="font-semibold text-gray-700">Todas as Categorias</h2>
                <button
                    onClick={() => handleNavigate('/admin/categories/new')}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                    <Plus size={16} />
                    Nova Categoria
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                        <tr>
                            <th className="p-4">Ordem</th>
                            <th className="p-4">Título</th>
                            <th className="p-4">Slug</th>
                            <th className="p-4">Tipo</th>
                            <th className="p-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map((category) => (
                            <tr key={category.slug} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-mono text-gray-500">{category.order}</td>
                                <td className="p-4 font-semibold text-gray-900">{category.title}</td>
                                <td className="p-4 text-gray-500 text-sm">{category.slug}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                                        ${category.type === 'category' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                                        {category.type}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleNavigate(`/admin/categories/${category.slug}`)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.slug, category.title)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoriesList;
