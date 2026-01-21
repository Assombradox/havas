import React, { useEffect, useState } from 'react';
import { ordersAdminService, type DashboardOrder } from '../services/ordersAdminService';
import { productsAdminService } from '../services/productsAdminService';
import { categoriesAdminService } from '../services/categoriesAdminService';
import { DollarSign, Clock, ShoppingBag, TrendingUp, Package, Tag, ArrowRight, Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [orders, setOrders] = useState<DashboardOrder[]>([]);
    const [productsCount, setProductsCount] = useState(0);
    const [categoriesCount, setCategoriesCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [ordersData, productsData, categoriesData] = await Promise.all([
                    ordersAdminService.getAll(),
                    productsAdminService.getAll(),
                    categoriesAdminService.getAll()
                ]);

                setOrders(ordersData);
                setProductsCount(productsData.length);
                setCategoriesCount(categoriesData.length);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    // KPIs Calculations
    const approvedRevenue = orders
        .filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')
        .reduce((acc, curr) => acc + curr.totalAmount, 0);

    const pendingRevenue = orders
        .filter(o => o.status === 'waiting_payment' || o.status === 'pending')
        .reduce((acc, curr) => acc + curr.totalAmount, 0);

    const totalOrders = orders.length;
    const paidOrdersCount = orders.filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered').length;

    // Ticket Médio (Baseado em vendas pagas para ser real, ou total? O prompt pede "Faturamento / Total Pedidos". 
    // Vamos usar Faturamento Aprovado / Total de Pedidos Pagos para fazer sentido financeiro.)
    const averageTicket = paidOrdersCount > 0 ? approvedRevenue / paidOrdersCount : 0;

    const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            paid: 'bg-green-100 text-green-700',
            shipped: 'bg-blue-100 text-blue-700',
            delivered: 'bg-purple-100 text-purple-700',
            waiting_payment: 'bg-yellow-100 text-yellow-700',
            pending: 'bg-gray-100 text-gray-700',
            failed: 'bg-red-100 text-red-700',
            canceled: 'bg-red-100 text-red-700',
        };
        const labels: Record<string, string> = {
            paid: 'PAGO',
            shipped: 'ENVIADO',
            delivered: 'ENTREGUE',
            waiting_payment: 'AGUARDANDO',
            pending: 'PENDENTE',
            failed: 'FALHOU',
            canceled: 'CANCELADO',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${styles[status] || styles.pending}`}>
                {labels[status] || status}
            </span>
        );
    };

    const handleNavigate = (path: string) => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new Event('popstate'));
    };

    if (loading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Aprovado */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Faturamento Aprovado</p>
                        <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(approvedRevenue)}</h3>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                        <DollarSign className="text-green-600" size={24} />
                    </div>
                </div>

                {/* Pendente PIX */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Pendente (PIX)</p>
                        <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(pendingRevenue)}</h3>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                        <Clock className="text-yellow-600" size={24} />
                    </div>
                </div>

                {/* Pedidos */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Pedidos</p>
                        <h3 className="text-2xl font-bold text-gray-900">{totalOrders}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <ShoppingBag className="text-blue-600" size={24} />
                    </div>
                </div>

                {/* Ticket Médio */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Ticket Médio (Pagos)</p>
                        <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(averageTicket)}</h3>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-lg">
                        <TrendingUp className="text-indigo-600" size={24} />
                    </div>
                </div>
            </div>

            {/* Main Grid: Latest Sales & Shortcuts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Latest Sales (2 Cols) */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Últimas 5 Vendas</h3>
                        <button
                            onClick={() => handleNavigate('/admin/orders')}
                            className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
                        >
                            Ver todas <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-3">ID / Data</th>
                                    <th className="px-6 py-3">Cliente</th>
                                    <th className="px-6 py-3">Valor</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.slice(0, 5).map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-mono text-xs text-gray-500 mb-0.5">#{order.paymentId || order._id.slice(-6)}</p>
                                            <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900">{order.customer?.name || 'Cliente Visitante'}</p>
                                            <p className="text-xs text-gray-500">{order.customer?.email || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(order.status)}
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">
                                            Nenhuma venda registrada ainda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Shortcuts & Catalog Stats (1 Col) */}
                <div className="space-y-6">

                    {/* Catalog Summary */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-bold text-gray-800 mb-4">Resumo do Catálogo</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded border border-gray-100">
                                        <Package className="text-purple-600" size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">Produtos Ativos</span>
                                </div>
                                <span className="text-lg font-bold text-gray-900">{productsCount}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded border border-gray-100">
                                        <Tag className="text-pink-600" size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">Categorias</span>
                                </div>
                                <span className="text-lg font-bold text-gray-900">{categoriesCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 text-white">
                        <h3 className="font-bold mb-1">Ações Rápidas</h3>
                        <p className="text-gray-400 text-xs mb-6">Gerencie seu catálogo com facilidade.</p>

                        <div className="space-y-3">
                            <button
                                onClick={() => handleNavigate('/admin/products/new')}
                                className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 transition-colors px-4 py-3 rounded-lg border border-white/10 backdrop-blur-sm"
                            >
                                <span className="font-medium text-sm">Novo Produto</span>
                                <ArrowRight size={16} />
                            </button>
                            <button
                                onClick={() => handleNavigate('/admin/categories')}
                                className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 transition-colors px-4 py-3 rounded-lg border border-white/10 backdrop-blur-sm"
                            >
                                <span className="font-medium text-sm">Gerenciar Categorias</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
