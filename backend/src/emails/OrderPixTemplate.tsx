import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
    Button,
} from '@react-email/components';
import React from 'react';

export interface OrderItem {
    name: string;
    quantity: number;
    price: string;
    image?: string;
}

interface OrderPixTemplateProps {
    customerName: string;
    orderId: string;
    total: string;
    pixCode: string;
    qrCodeUrl?: string;
    brandColor?: string;
    logoUrl?: string;
    storeName?: string;
    items?: OrderItem[];
    emailTitle?: string;
    emailMessage?: string;
    emailFooter?: string;
}

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
    maxWidth: '600px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
};

const header = {
    padding: '32px',
    textAlign: 'center' as const,
};

const logo = {
    margin: '0 auto',
    maxWidth: '150px',
    maxHeight: '60px',
    objectFit: 'contain' as const
};

const heroSection = {
    padding: '0 32px',
    textAlign: 'center' as const,
};

const heading = {
    fontSize: '24px',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
    fontWeight: '700',
    color: '#484848',
    padding: '17px 0 0',
};

const messageText = {
    fontSize: '16px',
    color: '#525f7f',
    lineHeight: '1.6',
    margin: '16px 0',
};

const totalText = {
    fontSize: '32px',
    fontWeight: '800',
    color: '#32cd32',
    margin: '16px 0',
};

const pixBox = {
    backgroundColor: '#f1f3f5',
    borderRadius: '8px',
    padding: '24px',
    margin: '24px 32px',
    textAlign: 'center' as const,
    border: '1px solid #e0e0e0',
};

const codeLabel = {
    color: '#8898aa',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    marginBottom: '8px',
};

const codeText = {
    fontSize: '12px',
    color: '#333',
    fontFamily: 'monospace',
    wordBreak: 'break-all' as const,
    whiteSpace: 'pre-wrap' as const,
    lineHeight: '1.5',
    backgroundColor: '#f3f4f6',
    padding: '10px',
    borderRadius: '4px',
    border: '1px border-dashed #ccc',
    width: '100%',
    display: 'block'
};

const qrPlaceholder = {
    margin: '20px auto 0',
    maxWidth: '200px',
    width: '100%',
};

const footer = {
    padding: '0 32px',
    textAlign: 'center' as const,
    color: '#8898aa',
    fontSize: '12px',
    marginTop: '32px',
    borderTop: '1px solid #e6ebf1',
    paddingTop: '24px'
};

const table = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '24px',
};

const th = {
    textAlign: 'left' as const,
    color: '#8898aa',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    paddingBottom: '12px',
    borderBottom: '1px solid #e6ebf1',
};

const td = {
    padding: '12px 0',
    borderBottom: '1px solid #e6ebf1',
    color: '#525f7f',
    fontSize: '14px',
};

const tdImage = {
    ...td,
    width: '60px',
};

const tdPrice = {
    ...td,
    textAlign: 'right' as const,
    fontWeight: '600',
};

const productImg = {
    width: '50px',
    height: '50px',
    borderRadius: '4px',
    objectFit: 'cover' as const,
    border: '1px solid #e6ebf1',
};

export const OrderPixTemplate = ({
    customerName,
    orderId,
    total,
    pixCode,
    qrCodeUrl = 'https://via.placeholder.com/200x200?text=QR+Code',
    brandColor = '#32cd32',
    logoUrl,
    storeName = 'HAVAS STORE',
    items = [],
    emailTitle = 'Pedido Recebido!',
    emailMessage = 'Olá {name}, recebemos seu pedido <strong>#{orderId}</strong>.',
    emailFooter = 'Se tiver dúvidas, responda a este email.\nObrigado por comprar conosco!'
}: OrderPixTemplateProps) => {

    // Replace variables in Custom Text
    const formattedMessage = emailMessage
        .replace(/{name}/g, customerName)
        .replace(/{orderId}/g, orderId);

    const formattedFooter = emailFooter.split('\n').map((line, i) => (
        <span key={i}>{line}<br /></span>
    ));

    return (
        <Html>
            <Head />
            <Preview>Pagamento via Pix para o Pedido #{orderId}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header Logo */}
                    <Section style={header}>
                        {logoUrl ? (
                            <Img src={logoUrl} alt={storeName} style={logo} />
                        ) : (
                            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                                {storeName}
                            </Text>
                        )}
                    </Section>

                    {/* Hero Section */}
                    <Section style={heroSection}>
                        <Heading style={heading}>{emailTitle}</Heading>
                        <Text style={messageText} dangerouslySetInnerHTML={{ __html: formattedMessage }} />
                        <Text style={{ fontSize: '16px', color: '#525f7f' }}>
                            Para finalizar, realize o pagamento via Pix:
                        </Text>
                        <Text style={{ ...totalText, color: brandColor }}>{total}</Text>
                    </Section>

                    {/* Pix Box */}
                    <Section style={pixBox}>
                        <Text style={codeLabel}>Código Pix (Copia e Cola)</Text>
                        <div style={codeText}>{pixCode}</div>
                        <Text style={{ fontSize: '11px', color: '#666', marginTop: '4px', textAlign: 'center' }}>
                            Selecione o código acima para copiar
                        </Text>
                        <div style={{ marginTop: '20px' }}>
                            <Img src={qrCodeUrl} alt="QR Code Pix" style={qrPlaceholder} />
                            <Text style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                                Escaneie com seu app do banco
                            </Text>
                        </div>
                    </Section>

                    <Section style={{ textAlign: 'center', padding: '0 32px' }}>
                        <Button
                            style={{
                                backgroundColor: brandColor,
                                borderRadius: '5px',
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                textAlign: 'center',
                                display: 'inline-block',
                                width: '100%',
                                padding: '12px 0',
                            }}
                            href="#"
                        >
                            Já paguei!
                        </Button>
                    </Section>

                    {/* Order Summary */}
                    {items.length > 0 && (
                        <Section style={{ padding: '0 32px 24px' }}>
                            <Heading style={{ ...heading, fontSize: '18px', textAlign: 'left', marginTop: '32px' }}>
                                Resumo do Pedido
                            </Heading>
                            <table style={table}>
                                <thead>
                                    <tr>
                                        <th style={th}>Produto</th>
                                        <th style={th}>Qtd</th>
                                        <th style={th}>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index}>
                                            <td style={td}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    {item.image && (
                                                        <Img src={item.image} alt={item.name} style={productImg} />
                                                    )}
                                                    <span>{item.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ ...td, textAlign: 'center' }}>{item.quantity}x</td>
                                            <td style={tdPrice}>{item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Section>
                    )}

                    {/* Footer */}
                    <Section style={footer}>
                        <Text>{formattedFooter}</Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default OrderPixTemplate;
