document.getElementById('magicSquareForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    // Obtener los valores de la matriz
    const matrix = [
        [
            parseInt(document.getElementById('cell-0-0').value),
            parseInt(document.getElementById('cell-0-1').value),
            parseInt(document.getElementById('cell-0-2').value)
        ],
        [
            parseInt(document.getElementById('cell-1-0').value),
            parseInt(document.getElementById('cell-1-1').value),
            parseInt(document.getElementById('cell-1-2').value)
        ],
        [
            parseInt(document.getElementById('cell-2-0').value),
            parseInt(document.getElementById('cell-2-1').value),
            parseInt(document.getElementById('cell-2-2').value)
        ]
    ];

    // Enviar la matriz al endpoint usando fetch
    fetch('http://localhost:3000/check-magic-square', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ matrix: matrix })
    })
    .then(response => response.json())
    .then(data => {
        // Mostrar el resultado en el div con id 'result'
        const resultDiv = document.getElementById('result');
        
        // Generar la tabla de la matriz
        let tableHTML = '<table border="1" style="margin: 10px auto; border-collapse: collapse;">';
        for (let i = 0; i < data.matrix.length; i++) {
            tableHTML += '<tr>';
            for (let j = 0; j < data.matrix[i].length; j++) {
                tableHTML += `<td style="padding: 10px; text-align: center;">${data.matrix[i][j]}</td>`;
            }
            tableHTML += '</tr>';
        }
        tableHTML += '</table>';

        // Mostrar el resultado y la tabla de la matriz
        resultDiv.innerHTML = `
            <p>${data.message}</p>
            <p>Constante mágica: ${data.magicConstant || 'sin constante magica'}</p>
            <h3>Matriz:</h3>
            ${tableHTML}
        `;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
