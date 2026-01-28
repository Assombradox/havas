import React from 'react';
import { X, User, MapPin, Phone, Mail } from 'lucide-react';
import type { DashboardOrder } from '../services/ordersAdminService';

interface OrderDetailsModalProps {
    order: DashboardOrder;
    onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
    // Source of Truth: order.totalAmount
    const total = order.totalAmount || 0;

    const formatCurrency = (val: number | string | undefined) => {
        if (!val) return 'R$ 0,00';
        if (typeof val === 'number') {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
        }
        return val; // It's already a formatted string ("R$ 50,00")
    };

    // Helper to render address
    const renderAddress = () => {
        if (order.shippingAddress) {
            const { street, number, neighborhood, city, state, zipCode } = order.shippingAddress;
            return (
                <div className="text-gray-600 text-xs text-right">
                    <p>{street}, {number}</p>
                    <p>{neighborhood} - {city}/{state}</p>
                    <p>{zipCode}</p>
                </div>
            );
        }
        return <span className="text-gray-400 italic">Endereço não capturado no checkout</span>;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl shadow-xl border border-gray-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 rounded-none">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Pedido #{order.paymentId || order._id.slice(-6).toUpperCase()}</h2>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Detalhes do Pedido</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 transition-colors rounded-none text-gray-500 hover:text-gray-900">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 space-y-6 flex-1">

                    {/* Customer Card */}
                    <div className="bg-gray-50 border border-gray-100 p-4">
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2">
                            <User size={14} /> Dados do Cliente
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                                <p className="font-bold text-gray-900">{order.customer?.name || "Cliente Desconhecido"}</p>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail size={12} /> {order.customer?.email || "-"}
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone size={12} /> {order.customer?.phone || "-"}
                                </div>
                            </div>
                            <div className="text-gray-600 md:text-right flex flex-col items-start md:items-end">
                                {order.customer?.document && (
                                    <p className="text-xs text-gray-500 mb-2">Doc: {order.customer.document}</p>
                                )}
                                <div className="flex items-center gap-2 text-xs">
                                    <MapPin size={12} className="text-gray-400" />
                                    {renderAddress()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div>
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Itens do Pedido</h3>
                        <div className="border border-gray-200 overflow-hidden unstackable-table">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-100 text-gray-600 font-semibold uppercase text-xs">
                                    <tr>
                                        <th className="p-3">Produto</th>
                                        <th className="p-3 text-center">Qtd</th>
                                        <th className="p-3 text-right">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {order.items?.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="p-3 font-medium text-gray-900 flex items-center gap-3">
                                                {item.image && (
                                                    <img src={item.image} alt="" className="w-8 h-8 rounded object-cover border border-gray-200" />
                                                )}
                                                <div className="flex flex-col">
                                                    <span>{item.name || item.title || 'Produto sem nome'}</span>
                                                    {item.color && <span className="text-xs text-gray-400">{item.color} {item.size ? `/ ${item.size}` : ''}</span>}
                                                </div>
                                            </td>
                                            <td className="p-3 text-center text-gray-600">{item.quantity}</td>
                                            <td className="p-3 text-right font-semibold text-gray-900">
                                                {formatCurrency(item.price || item.unitPrice)}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!order.items || order.items.length === 0) && (
                                        <tr>
                                            <td colSpan={3} className="p-4 text-center text-gray-500 italic">
                                                Nenhum item listado neste pedido.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer Financial Summary */}
                <div className="bg-gray-50 p-4 border-t border-gray-200">
                    <div className="flex flex-col gap-1 items-end text-sm">
                        <div className="flex justify-between w-48 mt-2 pt-2 text-lg font-bold text-gray-900">
                            <span>TOTAL:</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OrderDetailsModal;
