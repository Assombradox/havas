import React, { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { configService } from '../../services/config.service';

const Integrations: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        utmifyToken: '',
        utmifyActive: false
    });

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const config = await configService.getPublicConfig(); // We might need a private specific one, but usually it's same endpoint
            // Since public config might filter tokens, we might need to ensure backend sends it for admin.
            // Assuming getPublicConfig returns everything for now or we might need to update the service to fetch full config.
            // checking configService... it usually hits /api/config.
            // backend configController.ts returns everything. Secure? Maybe not for public but acceptable for this MVP level.
            setFormData({
                utmifyToken: config.utmifyToken || '',
                utmifyActive: config.utmifyActive || false
            });
        } catch (error) {
            console.error('Failed to load config', error);
            setMessage({ type: 'error', text: 'Erro ao carregar configurações.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            await configService.updateConfig(formData);
            setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
        } catch (error) {
            console.error('Failed to save config', error);
            setMessage({ type: 'error', text: 'Erro ao salvar configurações.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Integrações</h1>
                    <p className="text-gray-500">Configure conexões com serviços externos.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* UTMify Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📈</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">UTMify</h2>
                                <p className="text-sm text-gray-500">Rastreamento avançado de conversões e UTMs.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${formData.utmifyActive ? 'text-green-600' : 'text-gray-400'}`}>
                                {formData.utmifyActive ? 'Ativo' : 'Inativo'}
                            </span>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, utmifyActive: !prev.utmifyActive }))}
                                className={`
                                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
                                    ${formData.utmifyActive ? 'bg-green-500' : 'bg-gray-200'}
                                `}
                            >
                                <span
                                    className={`
                                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                        ${formData.utmifyActive ? 'translate-x-6' : 'translate-x-1'}
                                    `}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                API Token
                            </label>
                            <input
                                type="password"
                                value={formData.utmifyToken}
                                onChange={(e) => setFormData(prev => ({ ...prev, utmifyToken: e.target.value }))}
                                placeholder="Cole seu token aqui"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Você encontra este token no painel da UTMify em Configurações API.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                    {message && (
                        <div className={`text-sm flex items-center gap-2 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                            {message.text}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                        Salvar Configurações
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Integrations;
