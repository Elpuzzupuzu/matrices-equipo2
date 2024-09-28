document.getElementById('matrixForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Leer valores individuales de cada matriz
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);
    const c = parseFloat(document.getElementById('c').value);
    const d = parseFloat(document.getElementById('d').value);

    const eValue = parseFloat(document.getElementById('e').value);
    const f = parseFloat(document.getElementById('f').value);
    const g = parseFloat(document.getElementById('g').value);
    const h = parseFloat(document.getElementById('h').value);

    // Enviar la solicitud POST al servidor con los valores individuales
    fetch('http://localhost:3000/matrix/operations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ a, b, c, d, e: eValue, f, g, h })
    })
    .then(response => response.json())
    .then(data => {
        // Mostrar el resultado en la pantalla
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <h2>Resultados</h2>
            <h3>Matriz 1:</h3>
            <pre>${matrixToString(data.matrix1)}</pre>
            <h3>Matriz 2:</h3>
            <pre>${matrixToString(data.matrix2)}</pre>
            <h3>Suma:</h3>
            <pre>${matrixToString(data.sumMatrix)}</pre>
            <h3>Resta:</h3>
            <pre>${matrixToString(data.diffMatrix)}</pre>
            <h3>Producto:</h3>
            <pre>${matrixToString(data.productMatrix)}</pre>
            <h3>División:</h3>
            <pre>${matrixToString(data.divMatrix, true)}</pre>
        `;
    })
    .catch(error => console.error('Error:', error));
});

// Función para convertir una matriz a un string más legible
function matrixToString(matrix, isDivision = false) {
    return matrix.map(row => row.map(cell => {
        if (cell === null && isDivision) return 'N/A';
        return cell.toFixed(2);
    }).join(' | ')).join('\n');
}
