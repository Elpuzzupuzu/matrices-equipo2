document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const matrixOutput = document.getElementById('matrix-output');
    const zeroCounts = document.getElementById('zero-counts');

    // Función para hacer la solicitud al servidor
    generateBtn.addEventListener('click', () => {
        fetch('http://localhost:3000/matrix/generate')
            .then(response => response.json())
            .then(data => {
                displayMatrix(data.matrix);
                displayZeroCounts(data.zeroCounts);
            })
            .catch(error => {
                console.error('Error al generar la matriz:', error);
                matrixOutput.innerHTML = 'Error al generar la matriz. Revisa la consola para más detalles.';
            });
    });

    // Función para mostrar la matriz en la página
    function displayMatrix(matrix) {
        matrixOutput.innerHTML = ''; // Limpiar el contenido previo
        const table = document.createElement('table');

        matrix.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        matrixOutput.appendChild(table);
    }

    // Función para mostrar la cantidad de ceros por fila
    function displayZeroCounts(counts) {
        zeroCounts.innerHTML = ''; // Limpiar el contenido previo
        counts.forEach(count => {
            const p = document.createElement('p');
            p.textContent = count;
            zeroCounts.appendChild(p);
        });
    }
});
