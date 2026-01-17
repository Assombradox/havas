import React, { useEffect, useState } from 'react';
import { categoriesAdminService } from '../../services/categoriesAdminService';
import type { CategoryConfig } from '../../../types/Category';
import { ArrowLeft, Save } from 'lucide-react';

interface CategoryFormProps {
    slug?: string; // If present, edit mode
}

const CategoryForm: React.FC<CategoryFormProps> = ({ slug }) => {
    const isEditMode = !!slug;

    const [formData, setFormData] = useState<CategoryConfig>({
        slug: '',
        name: '',
        title: '',
        description: '',
        type: 'category',
        order: 1,
        image: ''
    });

    useEffect(() => {
        const load = async () => {
            if (isEditMode && slug) {
                const existing = await categoriesAdminService.getById(slug);
                if (existing) {
                    setFormData(existing);
                }
            }
        };
        load();
    }, [slug, isEditMode]);

    const handleNavigate = (path: string) => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new Event('popstate'));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'order' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await categoriesAdminService.save(formData);
            alert('Categoria salva com sucesso!');
            handleNavigate('/admin/categories');
        } catch (error) {
            alert('Erro ao salvar categoria');
            console.error(error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => handleNavigate('/admin/categories')}
                    className="p-2 hover:bg-gray-200 rounded-full text-gray-600"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? `Editar: ${formData.title}` : 'Nova Categoria'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input
                            type="text"
                            name="title"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.title}
                            onChange={(e) => {
                                handleChange(e);
                                // Auto-fill name if empty to keep it sync
                                if (!formData.name) {
                                    setFormData(prev => ({ ...prev, name: e.target.value }));
                                }
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Interno</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                        <input
                            type="text"
                            name="slug"
                            required
                            disabled={isEditMode} // Lock slug on edit to prevent navigating issues for now
                            className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isEditMode ? 'bg-gray-100 text-gray-500' : ''}`}
                            value={formData.slug}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                        <select
                            name="type"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option value="category">Category</option>
                            <option value="collection">Collection</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
                        <input
                            type="number"
                            name="order"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={formData.order}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Imagem Key (Asset)</label>
                        <input
                            type="text"
                            name="image"
                            required
                            placeholder="ex: categoryChinelos"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={formData.image}
                            onChange={handleChange}
                        />
                        <p className="text-xs text-gray-500 mt-1">Nome da variável importada ou URL.</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <textarea
                        name="description"
                        rows={4}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Save size={18} />
                        Salvar Categoria
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;
