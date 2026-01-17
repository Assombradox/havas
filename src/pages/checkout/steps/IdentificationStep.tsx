import React, { useState } from 'react';
import { useCheckout } from '../../../context/CheckoutContext';

interface IdentificationStepProps {
    onNext: () => void;
}

const IdentificationStep: React.FC<IdentificationStepProps> = ({ onNext }) => {
    const { checkoutData, updateContact, updateAddress } = useCheckout();

    // --- State Management (Initialized from Context) ---
    const [name, setName] = useState(checkoutData.contact.name);
    const [lastName, setLastName] = useState(checkoutData.contact.lastName);
    const [email, setEmail] = useState(checkoutData.contact.email);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [cpf, setCpf] = useState(checkoutData.contact.cpf);

    // Address State
    const [cep, setCep] = useState(checkoutData.address.zip);
    const [address, setAddress] = useState(checkoutData.address.street);
    const [number, setNumber] = useState(checkoutData.address.number);
    const [complement, setComplement] = useState(checkoutData.address.complement);
    const [neighborhood, setNeighborhood] = useState(checkoutData.address.neighborhood);
    const [city, setCity] = useState(checkoutData.address.city);
    const [uf, setUf] = useState(checkoutData.address.uf);

    const [phone, setPhone] = useState(checkoutData.contact.phone);

    // --- Save to Context on Next ---
    const handleNext = () => {
        updateContact({
            name,
            lastName,
            email,
            cpf,
            phone
        });
        updateAddress({
            zip: cep,
            street: address,
            number,
            complement,
            neighborhood,
            city,
            uf,
            state: uf // Mapping uf to state as well
        });
        onNext();
    };

    // --- 1. Email Autocomplete Logic ---
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        if (value.includes('@')) {
            const [localPart, domainPart] = value.split('@');
            const domains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];

            // Filter suggestions based on what user already typed after @
            const matches = domains.filter(d => d.startsWith(domainPart));

            if (matches.length > 0 && domainPart !== matches[0]) {
                setSuggestions(matches.map(d => `${localPart}@${d}`));
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
            }
        } else {
            setShowSuggestions(false);
        }
    };

    const selectEmailSuggestion = (suggestion: string) => {
        setEmail(suggestion);
        setShowSuggestions(false);
    };

    // --- 2. CPF Mask Logic (000.000.000-00) ---
    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length > 11) value = value.slice(0, 11);

        // Apply mask
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        setCpf(value);
    };

    // --- 4. CEP Logic & ViaCEP Integration ---
    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);

        // Mask 00000-000
        const displayValue = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
        setCep(displayValue);

        // Fetch Address if complete
        if (value.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setAddress(data.logradouro);
                    setNeighborhood(data.bairro);
                    setCity(data.localidade);
                    setUf(data.uf);
                }
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
            }
        }
    };

    // --- 5. Phone Mask Logic (00) 00000-0000 ---
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        // Mask
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d{4})$/, '$1-$2');

        setPhone(value);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4 animate-in fade-in slide-in-from-bottom-2">
            {/* Contact Section */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Dados de contato</h2>
                <div className="space-y-4">
                    {/* Name and Last Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Nome</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Seu nome"
                                className="w-full border border-gray-300 rounded px-3 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Sobrenome</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Seu sobrenome"
                                className="w-full border border-gray-300 rounded px-3 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Email Input with Autocomplete */}
                    <div className="relative">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Seu melhor e-mail"
                            className="w-full border border-gray-300 rounded px-3 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                        />
                        {/* Suggestion Dropdown */}
                        {showSuggestions && (
                            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow-lg mt-1">
                                {suggestions.map((suggestion) => (
                                    <div
                                        key={suggestion}
                                        onClick={() => selectEmailSuggestion(suggestion)}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            id="newsletter"
                            defaultChecked
                            className="mt-0.5"
                        />
                        <label htmlFor="newsletter" className="text-xs text-gray-600">
                            Enviar novidades e ofertas para mim por e-mail
                        </label>
                    </div>

                    {/* CPF Masked */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">CPF</label>
                        <input
                            type="tel" // Opens numeric keypad on mobile better than Text
                            value={cpf}
                            onChange={handleCpfChange}
                            placeholder="000.000.000-00"
                            maxLength={14}
                            className="w-full border border-gray-300 rounded px-3 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                        />
                    </div>

                    {/* [REMOVED] Data de Nascimento */}
                </div>
            </div>

            {/* Delivery Address Section */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Endereço de entrega</h2>
                <div className="space-y-4">
                    {/* Country Fixed */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1 text-gray-400">País / Região</label>
                        <div className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-3 text-sm text-gray-500">
                            Brasil
                        </div>
                    </div>

                    {/* CEP with ViaCEP */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">CEP</label>
                        <input
                            type="tel"
                            value={cep}
                            onChange={handleCepChange}
                            placeholder="00000-000"
                            maxLength={9}
                            className="w-full border border-gray-300 rounded px-3 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                        />
                    </div>

                    {/* Automatic Address Fields */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Endereço</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Rua, Avenida..."
                            className="w-full border border-gray-300 rounded px-3 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Número</label>
                            <input
                                type="text"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Complemento <span className="font-normal text-gray-400">(opcional)</span></label>
                            <input
                                type="text"
                                value={complement}
                                onChange={(e) => setComplement(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Bairro</label>
                        <input
                            type="text"
                            value={neighborhood}
                            onChange={(e) => setNeighborhood(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Cidade</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Estado</label>
                            <input
                                type="text"
                                value={uf}
                                onChange={(e) => setUf(e.target.value)}
                                maxLength={2}
                                className="w-full border border-gray-300 rounded px-3 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Phone with Prefix and Mask */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Telefone / WhatsApp</label>
                        <div className="flex">
                            <div className="flex items-center justify-center bg-gray-100 border border-r-0 border-gray-300 rounded-l px-3 text-gray-500 text-sm">
                                +55
                            </div>
                            <input
                                type="tel"
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder="(00) 00000-0000"
                                maxLength={15}
                                className="w-full border border-gray-300 rounded-r px-3 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <button
                onClick={handleNext}
                className="w-full bg-[#E50000] hover:bg-[#cc0000] text-white font-bold py-4 rounded transition-colors text-base uppercase tracking-wide"
            >
                Prosseguir para entrega
            </button>
        </div>
    );
};

export default IdentificationStep;
