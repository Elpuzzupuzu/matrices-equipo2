document.getElementById('fetchData').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/ventas');
        const data = await response.json();

        // Formatear la salida
        let output = '';
        output += `Menor Venta: ${data.menorVenta.valor}\n`;
        output += `Posiciones:\n`;
        data.menorVenta.posiciones.forEach(pos => {
            output += `Dia: ${pos.dia}, Mes: ${pos.mes}\n`;
        });

        output += `\nMayor Venta: ${data.mayorVenta.valor}\n`;
        output += `Posiciones:\n`;
        data.mayorVenta.posiciones.forEach(pos => {
            output += `Dia: ${pos.dia}, Mes: ${pos.mes}\n`;
        });

        output += `\nTotal Ventas: ${data.totalVentas}\n\n`;
        output += `Detalles de Ventas:\n`;
        data.detallesVentas.forEach(detalle => {
            output += `Dia: ${detalle.dia}, Mes: ${detalle.mes}, Venta: ${detalle.venta}\n`;
        });

        // Mostrar resultado
        document.getElementById('output').textContent = output;
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        document.getElementById('output').textContent = 'Error al obtener los datos.';
    }
});
