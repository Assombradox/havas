import React, { useEffect, useState } from 'react';
import { bannersAdminService } from '../../services/bannersAdminService';
import type { Banner } from '../../../types/Banner';
import { Edit, Trash2, Plus, Image, Eye, EyeOff } from 'lucide-react';

const BannersList: React.FC = () => {
    const [banners, setBanners] = useState<Banner[]>([]);

    // Manual Navigation helper helper
    const navigate = (path: string) => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new Event('popstate'));
    };

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        try {
            const data = await bannersAdminService.getAll();
            setBanners(data);
        } catch (error) {
            console.error('Failed to load banners');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este banner?')) {
            try {
                await bannersAdminService.delete(id);
                loadBanners();
            } catch (error) {
                alert('Erro ao excluir banner');
            }
        }
    };

    const toggleStatus = async (banner: Banner) => {
        try {
            await bannersAdminService.update(banner.id, { active: !banner.active });
            loadBanners();
        } catch (error) {
            alert('Erro ao alterar status');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="font-semibold text-gray-700">Gerenciar Banners</h2>
                <button
                    onClick={() => navigate('/admin/banners/new')}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                    <Plus size={16} />
                    Novo Banner
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                        <tr>
                            <th className="p-4">Imagem</th>
                            <th className="p-4">Título</th>
                            <th className="p-4">Local</th>
                            <th className="p-4">Ordem</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {banners.map((banner) => (
                            <tr key={banner.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="w-24 h-12 bg-gray-100 rounded overflow-hidden border border-gray-200 relative">
                                        <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-gray-900">{banner.title}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${banner.location === 'HERO' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {banner.location}
                                    </span>
                                </td>
                                <td className="p-4 font-mono text-gray-500">{banner.order}</td>
                                <td className="p-4">
                                    <button
                                        onClick={() => toggleStatus(banner)}
                                        className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${banner.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                                    >
                                        {banner.active ? <Eye size={12} /> : <EyeOff size={12} />}
                                        {banner.active ? 'Ativo' : 'Inativo'}
                                    </button>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/banners/${banner.id}`)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner.id)}
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

export default BannersList;
