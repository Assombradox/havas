import React, { useState, useEffect } from 'react';
import { Upload, Save, Send, Palette, Type, Image as ImageIcon } from 'lucide-react';
import { configService, type StoreConfig } from '../../services/configService';
// Assuming uploadAdminService exists or we reuse the logic
import { uploadAdminService } from '../../services/uploadAdminService';

const EmailEditor = () => {
    const [config, setConfig] = useState<StoreConfig>({
        logoUrl: '',
        primaryColor: '#000000',
        storeName: ''
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const data = await configService.getConfig();
            if (data) setConfig(data);
        } catch (error) {
            console.error('Failed to load config');
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await configService.updateConfig(config);
            alert('Configurações salvas com sucesso!');
        } catch (error) {
            alert('Erro ao salvar');
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = async () => {
        setLoading(true);
        try {
            await configService.sendTestPreview(config);
            alert('Email de teste enviado para o admin!');
        } catch (error) {
            alert('Erro ao enviar teste');
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // Reusing existing upload logic if compatible
            // Assuming handleCloudinaryUpload expects a file object
            // If uploadAdminService.handleCloudinaryUpload doesn't exist, we might need to verify
            // Based on previous file views, it does exist.
            const url = await uploadAdminService.handleCloudinaryUpload(file);
            setConfig(prev => ({ ...prev, logoUrl: url }));
        } catch (error) {
            console.error(error);
            alert('Falha no upload da logo');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Editar E-mail</h1>
                    <p className="text-gray-400">Personalize a aparência dos emails transacionais</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handlePreview}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Send size={18} />
                        Enviar Teste
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors font-semibold"
                    >
                        <Save size={18} />
                        Salvar Alterações
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visual Settings */}
                <div className="space-y-6">
                    {/* Store Name */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Type size={20} className="text-blue-400" />
                            Identidade
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Nome da Loja</label>
                                <input
                                    type="text"
                                    value={config.storeName}
                                    onChange={e => setConfig({ ...config, storeName: e.target.value })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Ex: Havas Store"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Palette size={20} className="text-purple-400" />
                            Cores
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Cor Principal (Botões e Destaques)</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="color"
                                        value={config.primaryColor}
                                        onChange={e => setConfig({ ...config, primaryColor: e.target.value })}
                                        className="h-10 w-20 rounded cursor-pointer bg-transparent border-none"
                                    />
                                    <span className="text-gray-300 font-mono">{config.primaryColor}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 md:col-span-2">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Type size={20} className="text-yellow-400" />
                        Texto do Email
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Título do Email</label>
                            <input
                                type="text"
                                value={config.emailTitle || ''}
                                onChange={e => setConfig({ ...config, emailTitle: e.target.value })}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                                placeholder="Ex: Pedido Recebido!"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Mensagem de Saudação</label>
                            <input
                                type="text"
                                value={config.emailMessage || ''}
                                onChange={e => setConfig({ ...config, emailMessage: e.target.value })}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-yellow-500"
                                placeholder="Ex: Olá {name}, recebemos seu pedido."
                            />
                            <p className="text-xs text-gray-500 mt-1">Variáveis: {'{name}'}, {'{orderId}'}</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Rodapé</label>
                            <textarea
                                value={config.emailFooter || ''}
                                onChange={e => setConfig({ ...config, emailFooter: e.target.value })}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-yellow-500 h-24 resize-none"
                                placeholder="Texto do rodapé..."
                            />
                        </div>
                    </div>
                </div>

                {/* Logo Upload */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <ImageIcon size={20} className="text-green-400" />
                        Logo do Email
                    </h2>

                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-gray-500 transition-colors relative group">
                            {config.logoUrl ? (
                                <div className="relative">
                                    <img
                                        src={config.logoUrl}
                                        alt="Store Logo"
                                        className="max-h-32 mx-auto rounded-lg shadow-sm"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                        <span className="text-white text-sm font-medium">Trocar Imagem</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-400">
                                    <Upload className="mx-auto mb-2 opacity-50" size={32} />
                                    <p className="text-sm">Clique para fazer upload</p>
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                disabled={uploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>

                        {uploading && (
                            <p className="text-sm text-blue-400 text-center animate-pulse">Enviando imagem...</p>
                        )}

                        <p className="text-xs text-gray-500 text-center">
                            Recomendado: 300x100px PNG transparente
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailEditor;
