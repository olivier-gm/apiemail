// test-endpoint.js
// Prueba del endpoint POST /api/send-email
// Ejecutar con: node test-endpoint.js

const payload = {
    email: 'julianrafael1604@gmail.com',
    cedula: '30336715',
    nombre: 'Julian Amer',
    tickets: Array.from({
        length: 100
    }, (_, i) => i + 1) // [1, 2, 3, ..., 100]
};

async function testSendEmail() {
    console.log('📤 Enviando petición al endpoint...');
    console.log('📋 Payload:', JSON.stringify(payload, null, 2));
    console.log('─'.repeat(50));

    try {
        const response = await fetch('https://apiemails.onrender.com/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Éxito!');
            console.log('📨 Respuesta:', JSON.stringify(data, null, 2));
        } else {
            console.log('❌ Error en la respuesta:');
            console.log('🔴 Status:', response.status);
            console.log('📨 Respuesta:', JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error('🚨 Error de conexión:', error.message);
        console.error('👉 Asegurate de que el servidor está corriendo en https://apiemails.onrender.com');
    }
}

testSendEmail();