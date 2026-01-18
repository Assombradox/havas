import React, { useEffect, useState } from 'react';
import { Package, Clock, XCircle, CheckCircle } from 'lucide-react';

interface Order {
    _id: string;
    customer: {
        name: string;
        email: string;
    } | null;
    totalAmount: number;
    status: 'pending' | 'paid' | 'failed';
    createdAt: string;
}

const OrdersList: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/orders`);
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    console.error('Failed to fetch orders');
                }
            } catch (error) {
                console.error('Error loading orders:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return (
                    <span className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold uppercase">
                        <CheckCircle size={14} /> Pago
                    </span>
                );
            case 'failed':
                return (
                    <span className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold uppercase">
                        <XCircle size={14} /> Falha
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold uppercase">
                        <Clock size={14} /> Pendente
                    </span>
                );
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-500">Carregando pedidos...</span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Package size={20} />
                    Vendas Recentes
                </h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Cliente</th>
                            <th className="p-4">Data</th>
                            <th className="p-4">Valor</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-mono text-gray-500 text-xs">
                                    #{order._id.slice(-6).toUpperCase()}
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">
                                            {order.customer?.name || 'Cliente Desconhecido'}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {order.customer?.email || '-'}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                    <span className="text-xs text-gray-400 ml-1">
                                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </td>
                                <td className="p-4 font-semibold text-gray-900">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.totalAmount || 0)}
                                </td>
                                <td className="p-4">
                                    {getStatusBadge(order.status)}
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    Nenhum pedido encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersList;
