import React from 'react';
import { X, User, MapPin, Phone, Mail } from 'lucide-react';
import type { DashboardOrder } from '../services/ordersAdminService';

interface OrderDetailsModalProps {
    order: DashboardOrder;
    onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
    // Calculate subtotal from items
    const subtotal = order.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
    const fixedFreight = 0.99;
    const total = subtotal + fixedFreight;

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

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
                            <div className="text-gray-600">
                                <div className="flex items-start gap-2">
                                    <MapPin size={12} className="mt-1 shrink-0" />
                                    <span>
                                        {order.customer?.address ? (
                                            <>
                                                {order.customer.address.street}, {order.customer.address.number}<br />
                                                {order.customer.address.neighborhood} - {order.customer.address.city}/{order.customer.address.state}<br />
                                                CEP: {order.customer.address.zipCode}
                                            </>
                                        ) : (
                                            "Endereço não informado"
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table (Text Only, No Thumbnails) */}
                    <div>
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Itens do Pedido</h3>
                        <div className="border border-gray-200 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-100 text-gray-600 font-semibold uppercase text-xs">
                                    <tr>
                                        <th className="p-3">Produto</th>
                                        <th className="p-3">Variação</th>
                                        <th className="p-3 text-center">Qtd</th>
                                        <th className="p-3 text-right">Unitário</th>
                                        <th className="p-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {order.items?.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="p-3 font-medium text-gray-900">{item.name}</td>
                                            <td className="p-3 text-gray-500">{item.color || '-'} / {item.size || '-'}</td>
                                            <td className="p-3 text-center">{item.quantity}</td>
                                            <td className="p-3 text-right text-gray-600">{formatCurrency(item.price)}</td>
                                            <td className="p-3 text-right font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                    {(!order.items || order.items.length === 0) && (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-gray-500 italic">
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
                        <div className="flex justify-between w-48 text-gray-600">
                            <span>Subtotal:</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between w-48 text-gray-600">
                            <span>Frete Fixo:</span>
                            <span>{formatCurrency(fixedFreight)}</span>
                        </div>
                        <div className="flex justify-between w-48 mt-2 pt-2 border-t border-gray-300 font-bold text-lg text-gray-900">
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
