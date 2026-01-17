import React, { useEffect, useState } from 'react';
import { productsAdminService } from '../../services/productsAdminService';
import type { Product } from '../../../types/Product';
import { categoriesAdminService } from '../../services/categoriesAdminService';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

interface ProductFormProps {
    id?: string; // If present, edit mode
}

const ProductForm: React.FC<ProductFormProps> = ({ id }) => {
    const isEditMode = !!id;
    const [allCategories, setAllCategories] = useState<any[]>([]); // Using any for simplicity in V1 refactor, or import type

    // Initial empty state
    const [formData, setFormData] = useState<Product>({
        id: '',
        slug: '',
        name: '',
        description: '',
        price: 0,
        originalPrice: 0,
        rating: 0,
        reviewCount: 0,
        categories: [],
        colors: [],
        sizes: []
    });

    useEffect(() => {
        const loadData = async () => {
            // Load Categories
            try {
                const cats = await categoriesAdminService.getAll();
                setAllCategories(cats);
            } catch (e) {
                console.error('Failed to load categories');
            }

            // Load Product if Edit
            if (isEditMode && id) {
                const existing = await productsAdminService.getById(id);
                if (existing) {
                    setFormData(existing);
                }
            } else {
                // Generate random ID for new product
                setFormData(prev => ({ ...prev, id: Math.floor(Math.random() * 10000).toString() }));
            }
        };
        loadData();
    }, [id, isEditMode]);

    const handleNavigate = (path: string) => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new Event('popstate'));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['price', 'originalPrice', 'rating', 'reviewCount'].includes(name) ? parseFloat(value) || 0 : value
        }));
    };

    const handleCategoryToggle = (slug: string) => {
        setFormData(prev => {
            const current = prev.categories || [];
            if (current.includes(slug)) {
                return { ...prev, categories: current.filter(c => c !== slug) };
            } else {
                return { ...prev, categories: [...current, slug] };
            }
        });
    };

    const handleAddSize = () => {
        setFormData(prev => ({
            ...prev,
            sizes: [...prev.sizes, { label: '37/38', available: true }]
        }));
    };

    const updateSize = (index: number, field: string, value: any) => {
        const newSizes = [...formData.sizes];
        newSizes[index] = { ...newSizes[index], [field]: value };
        setFormData(prev => ({ ...prev, sizes: newSizes }));
    };

    const removeSize = (index: number) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.filter((_, i) => i !== index)
        }));
    };

    const handleAddColor = () => {
        setFormData(prev => ({
            ...prev,
            colors: [...prev.colors, { id: Date.now().toString(), name: 'Nova Cor', thumbnail: '', images: [] }]
        }));
    };

    const removeColor = (index: number) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== index)
        }));
    };

    const updateColor = (index: number, field: string, value: string) => {
        const newColors = [...formData.colors];
        if (field === 'images') {
            // Handle newline or comma separation
            newColors[index] = {
                ...newColors[index],
                images: value.split(/[\n,]+/).map(s => s.trim())
            };
        } else {
            newColors[index] = { ...newColors[index], [field]: value };
        }
        setFormData(prev => ({ ...prev, colors: newColors }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await productsAdminService.save(formData);
            alert('Produto salvo com sucesso!');
            handleNavigate('/admin/products');
        } catch (error) {
            alert('Erro ao salvar produto');
            console.error(error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => handleNavigate('/admin/products')}
                    className="p-2 hover:bg-gray-200 rounded-full text-gray-600"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? `Editar: ${formData.name}` : 'Novo Produto'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-8">
                {/* Basic Info */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Informações Básicas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                            <input
                                type="text"
                                name="slug"
                                required
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={formData.slug}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                            <input
                                type="text"
                                name="id"
                                disabled
                                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                                value={formData.id}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea
                            name="description"
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={formData.description || ''}
                            onChange={handleChange}
                        />
                    </div>
                </section>

                {/* Pricing & Ratings */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Preço & Avaliação</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Preço Atual (R$)</label>
                            <input
                                type="number"
                                name="price"
                                step="0.01"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Preço Original (R$)</label>
                            <input
                                type="number"
                                name="originalPrice"
                                step="0.01"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={formData.originalPrice || 0}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nota (0-5)</label>
                            <input
                                type="number"
                                name="rating"
                                step="0.1"
                                max="5"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={formData.rating}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Avaliações</label>
                            <input
                                type="number"
                                name="reviewCount"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={formData.reviewCount}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Categorias</h3>
                    <div className="flex flex-wrap gap-3">
                        {allCategories.map(cat => (
                            <button
                                key={cat.slug}
                                type="button"
                                onClick={() => handleCategoryToggle(cat.slug)}
                                className={`px-4 py-2 rounded-full border transition-colors text-sm font-medium
                                ${formData.categories?.includes(cat.slug)
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                            >
                                {cat.title}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Sizes */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="text-lg font-semibold text-gray-800">Tamanhos</h3>
                        <button type="button" onClick={handleAddSize} className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                            <Plus size={16} /> Adicionar
                        </button>
                    </div>
                    <div className="space-y-2">
                        {formData.sizes.map((size, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg">
                                <input
                                    type="text"
                                    value={size.label}
                                    onChange={(e) => updateSize(idx, 'label', e.target.value)}
                                    className="w-24 p-1 border rounded"
                                />
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={size.available}
                                        onChange={(e) => updateSize(idx, 'available', e.target.checked)}
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Disponível</span>
                                </label>
                                <button type="button" onClick={() => removeSize(idx)} className="ml-auto text-red-500 hover:bg-red-100 p-1 rounded">
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Variações de Cor (Slug-Based) */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Variações de Cor</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Cor Atual</label>
                            <input
                                type="text"
                                name="color"
                                placeholder="Ex: Preto"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={formData.color || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Produtos Relacionados (Slugs)</label>
                            <textarea
                                name="relatedProducts"
                                placeholder="slug-1, slug-2, slug-3"
                                rows={2}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={formData.relatedProducts?.join(', ') || ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setFormData(prev => ({
                                        ...prev,
                                        relatedProducts: val.split(',').map(s => s.trim()).filter(s => s.length > 0)
                                    }));
                                }}
                            />
                            <p className="text-xs text-gray-500 mt-1">Separe os slugs por vírgula. Isso criará o seletor de cores no PDP.</p>
                        </div>
                    </div>
                </section>

                {/* Images/Colors (Dynamic URLs V2.1) */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="text-lg font-semibold text-gray-800">Cores & Imagens</h3>
                        <button type="button" onClick={handleAddColor} className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                            <Plus size={16} /> Adicionar Cor
                        </button>
                    </div>

                    <div className="space-y-6">
                        {formData.colors.map((color, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                                <button
                                    type="button"
                                    onClick={() => removeColor(idx)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
                                    title="Remover cor"
                                >
                                    <X size={18} />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Color Name */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome da Cor</label>
                                        <input
                                            type="text"
                                            value={color.name}
                                            onChange={(e) => updateColor(idx, 'name', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded bg-white"
                                            placeholder="Ex: Verde Militar"
                                        />
                                    </div>

                                    {/* Thumbnail URL */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Thumbnail URL</label>
                                        <input
                                            type="text"
                                            value={color.thumbnail}
                                            onChange={(e) => updateColor(idx, 'thumbnail', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded bg-white font-mono text-xs"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    {/* Images List */}
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                            Imagens do Produto (URLs) <span className="text-gray-400 font-normal lowercase">(uma por linha ou separadas por vírgula)</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={color.images.join('\n')}
                                            onChange={(e) => updateColor(idx, 'images', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded bg-white font-mono text-xs"
                                            placeholder="https://imagem1.jpg&#10;https://imagem2.jpg"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {formData.colors.length === 0 && (
                            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                                Nenhuma cor adicionada.
                            </div>
                        )}
                    </div>
                </section>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200"
                    >
                        <Save size={20} />
                        Salvar Produto
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
