import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "A entrega é rápida mesmo para minha região?",
        answer: "Sim. Trabalhamos com entrega rápida para diversas regiões do Brasil. Pedidos confirmados até o final do dia podem ser enviados em modalidade expressa, com prazo estimado de 24 a 48 horas, de acordo com a localidade."
    },
    {
        question: "Como acompanho meu pedido após a compra?",
        answer: "Após a confirmação do pagamento, você receberá atualizações por e-mail. Pedidos enviados no modelo express recebem o código de rastreio assim que saem para entrega, o que pode acontecer entre 24 e 48 horas. Caso a sua região não esteja disponível para entrega rápida, o envio será feito pelos Correios, com prazo médio de 7 a 10 dias úteis."
    },
    {
        question: "E se não servir ou eu quiser trocar?",
        answer: "Sem problemas. Caso o produto não sirva ou você queira trocar, o processo é simples e sem burocracia. Nossa equipe de atendimento está pronta para ajudar em todas as etapas."
    },
    {
        question: "Posso parcelar minha compra?",
        answer: "Sim. Você pode parcelar sua compra em até 6x no cartão de crédito. Também oferecemos pagamento via PIX, para mais praticidade."
    },
    {
        question: "É seguro comprar neste site?",
        answer: "Sim. Nosso site utiliza tecnologia de segurança para proteger seus dados e trabalha apenas com meios de pagamento confiáveis, garantindo uma experiência segura do início ao fim."
    }
];

const FAQSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="w-full bg-white py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Dúvidas Frequentes</h2>
                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-100 last:border-none">
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex justify-between items-center py-4 text-left focus:outline-none group"
                            >
                                <span className={`text-sm font-medium ${openIndex === index ? 'text-gray-900' : 'text-gray-600'} group-hover:text-gray-900`}>
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                )}
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <p className="text-sm text-gray-500 leading-relaxed pr-8">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
