document.getElementById('generateMatrix').addEventListener('click', function () {
    // Enviar la solicitud al servidor para generar la matriz y calcular las operaciones
    fetch('http://localhost:3000/matrix/sum-average', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Mostrar la matriz generada
        const generatedMatrixDiv = document.getElementById('generatedMatrix');
        generatedMatrixDiv.textContent = formatMatrix(data.generatedMatrix);

        // Mostrar la matriz de sumas y promedios
        const sumAvgMatrixDiv = document.getElementById('sumAvgMatrix');
        sumAvgMatrixDiv.textContent = formatMatrix(data.sumAverageMatrix);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Función para formatear la matriz como texto legible
function formatMatrix(matrix) {
    return matrix.map(row => row.join(' ')).join('\n');
}
