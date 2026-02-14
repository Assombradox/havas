import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-gray-50 py-8 px-4 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col gap-2 text-left">
                {/* Copyright */}
                <p className="text-sm font-bold text-gray-900">
                    © {currentYear} Havainas Brasil. All Rights Reserved.
                </p>

                {/* Legal Info */}
                <div className="text-xs text-gray-500 leading-snug">
                    <p className="mb-1">
                        Razão Social: havainas oficial • CNPJ: 81.029.117/0001-09 • Endereço: Av. das Nações Unidas, nº 14.261 - Ala A - 10º andar - Fortaleza - Brasil - CEP 04794-000
                    </p>

                    <p className="mb-1">
                        Fale Conosco: SP (11) 3003-7941 | Outras regiões 0800 3030 566 • Horário de Atendimento: 09h às 18h de segunda a sexta
                    </p>

                    <p>
                        Opções de pagamento: Cartão de Crédito (Visa, MasterCard, Amex, Diners Club e Hipercard) e PIX.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
