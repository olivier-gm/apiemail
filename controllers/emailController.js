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

    const ticketsList = tickets.join(', ');
    const ticketsCount = tickets.length;

    const mensaje = {
        to: email,
        subject: `🎟️ Confirmación de tus tickets de rifa - ${nombre}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c3e50;">¡Gracias por participar, ${nombre}!</h2>
                <p style="color: #555;">Hemos recibido tu compra correctamente. Aquí está el resumen de tus tickets:</p>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="background-color: #f2f2f2;">
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Nombre</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${nombre}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Cédula</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${cedula}</td>
                    </tr>
                    <tr style="background-color: #f2f2f2;">
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Correo</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Total de tickets</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${ticketsCount}</td>
                    </tr>
                    <tr style="background-color: #f2f2f2;">
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Números asignados</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${ticketsList}</td>
                    </tr>
                </table>

                <p style="color: #888; font-size: 12px;">Guarda este correo como comprobante de tu participación. ¡Buena suerte! 🍀</p>
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