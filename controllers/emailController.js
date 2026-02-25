import nodemailerService, {
    rotatingTransporter
} from '../utils/nodemailer.js';

export const sendEmail = async (req, res) => {
    const {
        email,
        cedula,
        nombre,
        tickets
    } = req.body;

    // Validaciones
    if (!email || !cedula || !nombre || !tickets) {
        return res.status(400).json({
            success: false,
            message: 'Faltan campos requeridos: email, cedula, nombre, tickets'
        });
    }

    if (!Array.isArray(tickets) || tickets.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'El campo "tickets" debe ser un array no vacío de números'
        });
    }

    const ticketsHtml = tickets
        .map(t => (t === 1000000 ? '000000' : String(t).padStart(6, '0')))
        .map(ticket => `
            <div style="
                background-color: #28a745;
                color: white;
                padding: 10px 0;
                margin: 5px 1%;
                border-radius: 8px;
                display: inline-block;
                width: 22%;
                min-width: 80px;
                text-align: center;
                font-weight: bold;
                font-size: 14px;
                font-family: 'Courier New', monospace;
            ">
                ${ticket}
            </div>
        `).join('');

    const mensaje = {
        to: email,
        subject: `🎟️ Confirmación de tus tickets de rifa - ${nombre}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; text-align: center;">
                <!-- Flyer Image -->
                <img src="https://www.rifas4k.vip/static/img/partida.jpg" alt="Flyer de la Rifa" style="width: 100%; max-width: 400px; border-radius: 15px; margin-bottom: 20px;">
                
                <!-- Thank You Message -->
                <h1 style="color: #007bff; font-size: 28px; font-weight: bold; margin-bottom: 10px;">
                    ¡Gracias por participar en Rifas 4K, ${nombre} !
                </h1>
                
                <p style="color: #555; font-size: 18px; margin-top: 30px; margin-bottom: 20px;">
                    Estos son los tickets que compraste:
                </p>

                <!-- Tickets Grid -->
                <div style="text-align: center; padding: 10px; max-width: 500px; margin: 0 auto;">
                    ${ticketsHtml}
                </div>

                <p style="color: #888; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
                    Guarda este correo como comprobante de tu participación. ¡Buena suerte! 🍀
                </p>
            </div>
        `
    };

    try {
        await nodemailerService(mensaje);
        res.status(200).json({
            success: true,
            message: `Correo enviado exitosamente a ${email}`,
            data: {
                nombre,
                cedula,
                email,
                tickets
            }
        });
    } catch (error) {
        console.error('Error al enviar correo:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error al enviar el correo',
            error: error.message
        });
    }
};

export const getStats = (req, res) => {

    const stats = rotatingTransporter.getStats();
    res.json({
        success: true,
        data: stats
    });
};