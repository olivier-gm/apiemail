import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import apiRoutes from './routes/apiroutes.js';

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api', apiRoutes);

// Health check
app.get('/ping', (req, res) => {
    res.json({
        status: 'ok',
        message: 'pong'
    });
});

// Auto-ping para mantener el servidor activo si es necesario
setInterval(async () => {
    try {
        const ping = await fetch(`http://localhost:${port}/ping`);
        const data = await ping.json();
        console.log('💓 Heartbeat:', data.message);
    } catch (error) {
        console.error('💔 Heartbeat failed:', error.message);
    }
}, 780000);

app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});