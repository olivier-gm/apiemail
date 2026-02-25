import 'dotenv/config';

// Enviamos emails usando la API HTTP de Resend (no SMTP)
// Esto evita el bloqueo de puertos SMTP en plataformas como Render

// Mantenemos el objeto rotatingTransporter para no romper el controlador
const rotatingTransporter = {
    getStats: () => {
        return {
            currentDate: new Date().toDateString(),
            dailyLimit: 'N/A',
            accounts: [{
                account: 1,
                email: process.env.EMAIL_FROM,
                dailyCount: 'N/A',
                remaining: 'N/A',
                isBlocked: false,
                lastError: null
            }]
        };
    }
};

// Función principal que usa la API HTTP de Resend
const nodemailerService = async (mensaje) => {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        throw new Error('RESEND_API_KEY no está definida en las variables de entorno');
    }

    const payload = {
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: Array.isArray(mensaje.to) ? mensaje.to : [mensaje.to],
        subject: mensaje.subject,
        html: mensaje.html,
    };

    console.log(`📤 Enviando correo a: ${payload.to.join(', ')}...`);

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('❌ Error de Resend API:', data);
        throw new Error(data.message || `Error HTTP ${response.status}`);
    }

    console.log(`✅ Correo enviado. ID: ${data.id}`);
    return data;
};

export default nodemailerService;
export { rotatingTransporter };