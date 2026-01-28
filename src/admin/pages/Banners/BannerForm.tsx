import React, { useEffect, useState } from 'react';
import { bannersAdminService } from '../../services/bannersAdminService';
import { BannerLocation, type Banner } from '../../../types/Banner';
import { ArrowLeft, Save, CloudUpload, Image as LucideImage } from 'lucide-react';
import { uploadAdminService } from '../../services/uploadAdminService';

interface BannerFormProps {
    id?: string;
}

const BannerForm: React.FC<BannerFormProps> = ({ id }) => {
    const isEditing = !!id;
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState<Partial<Banner>>({
        title: '',
        imageUrl: '',
        link: '',
        active: true,
        order: 0,
        location: BannerLocation.HERO
    });

    // Manual Navigation helper
    const navigate = (path: string) => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new Event('popstate'));
    };

    useEffect(() => {
        if (isEditing && id) {
            loadBanner();
        }
    }, [id]);

    const loadBanner = async () => {
        try {
            const data = await bannersAdminService.getAll(); // Or implement getById in service/backend
            const found = data.find(b => b.id === id); // Temporary workaround if getById not ready
            if (found) setFormData(found);
        } catch (error) {
            console.error('Error loading banner');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing && id) {
                await bannersAdminService.update(id, formData);
            } else {
                await bannersAdminService.create(formData);
            }
            alert('Banner salvo com sucesso!');
            navigate('/admin/banners');
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar banner');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (!file) return;

            setUploading(true);
            try {
                const url = await uploadAdminService.handleCloudinaryUpload(file);
                setFormData(prev => ({ ...prev, imageUrl: url }));
            } catch (error) {
                alert('Erro no upload da imagem');
            } finally {
                setUploading(false);
            }
        };
        input.click();
    };

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
                <button
                    type="button"
                    onClick={() => navigate('/admin/banners')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                    {isEditing ? 'Editar Banner' : 'Novo Banner'}
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Form */}
                <div className="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título (Interno)</label>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ex: Promoção de Verão"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                        <select
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value as BannerLocation })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value={BannerLocation.HERO}>HERO (Stories Topo)</option>
                            <option value={BannerLocation.EDITORIAL}>EDITORIAL (Banner Largo)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Imagem URL</label>
                        <div className="flex gap-2">
                            <input
                                required
                                type="text"
                                value={formData.imageUrl}
                                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                placeholder="https://..."
                            />
                            <button
                                type="button"
                                onClick={handleUpload}
                                disabled={uploading}
                                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                title="Upload Nuvem"
                            >
                                <CloudUpload size={20} />
                            </button>
                        </div>
                        {uploading && <p className="text-xs text-blue-500 mt-1">Enviando imagem...</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link de Destino (Opcional)</label>
                        <input
                            type="text"
                            value={formData.link || ''}
                            onChange={e => setFormData({ ...formData, link: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="/categoria/verao"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <input
                                type="checkbox"
                                id="active"
                                checked={formData.active}
                                onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="active" className="text-gray-700 font-medium cursor-pointer">Ativo</label>
                        </div>
                    </div>
                </div>

                {/* Right Column - Preview */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center">
                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Pré-visualização</h3>
                    {formData.imageUrl ? (
                        <div className={`relative overflow-hidden rounded-lg shadow-md ${formData.location === 'HERO' ? 'w-48 aspect-[9/16]' : 'w-full aspect-[21/9]'}`}>
                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-gray-400">
                            <LucideImage size={48} className="mb-2 opacity-50" />
                            <p className="text-sm">Sem imagem selecionada</p>
                        </div>
                    )}
                    <p className="mt-4 text-xs text-gray-500 max-w-xs">
                        Este é apenas um preview de proporção. O visual final depende do dispositivo do usuário.
                    </p>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg font-bold disabled:opacity-50"
                >
                    <Save size={20} />
                    {loading ? 'Salvando...' : 'Salvar Banner'}
                </button>
            </div>
        </form>
    );
};

export default BannerForm;
