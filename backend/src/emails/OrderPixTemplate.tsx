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

interface OrderPixTemplateProps {
    customerName: string;
    orderId: string;
    total: string;
    pixCode: string;
    qrCodeUrl?: string;
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
    maxWidth: '600px', // Responsive container
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

const totalText = {
    fontSize: '32px',
    fontWeight: '800',
    color: '#32cd32', // Green for money
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
    fontSize: '14px',
    color: '#333',
    fontFamily: 'monospace',
    wordBreak: 'break-all' as const, // Critical for mobile
    lineHeight: '1.5',
    backgroundColor: '#fff',
    padding: '12px',
    borderRadius: '4px',
    border: '1px border-dashed #ccc',
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
};

export const OrderPixTemplate = ({
    customerName,
    orderId,
    total,
    pixCode,
    qrCodeUrl = 'https://via.placeholder.com/200x200?text=QR+Code',
}: OrderPixTemplateProps) => (
    <Html>
        <Head />
        <Preview>Pagamento via Pix para o Pedido #{orderId}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                        HAVAS STORE
                    </Text>
                </Section>
                <Section style={heroSection}>
                    <Heading style={heading}>Pedido Recebido!</Heading>
                    <Text style={{ fontSize: '16px', color: '#525f7f' }}>
                        Olá {customerName}, recebemos seu pedido <strong>#{orderId}</strong>.
                    </Text>
                    <Text style={{ fontSize: '16px', color: '#525f7f' }}>
                        Para finalizar, realize o pagamento via Pix:
                    </Text>
                    <Text style={totalText}>{total}</Text>
                </Section>

                <Section style={pixBox}>
                    <Text style={codeLabel}>Código Pix (Copia e Cola)</Text>
                    <div style={codeText}>
                        {pixCode}
                    </div>

                    {/* Placeholder for QR Code */}
                    <div style={{ marginTop: '20px' }}>
                        <Img
                            src={qrCodeUrl}
                            alt="QR Code Pix"
                            style={qrPlaceholder}
                        />
                        <Text style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                            Escaneie com seu app do banco
                        </Text>
                    </div>
                </Section>

                <Section style={{ textAlign: 'center', padding: '0 32px' }}>
                    <Button
                        style={{
                            backgroundColor: '#32cd32',
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

                <Section style={footer}>
                    <Text>
                        Se tiver dúvidas, responda a este email.<br />
                        Obrigado por comprar conosco!
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default OrderPixTemplate;
