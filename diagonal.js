document.getElementById('matrixForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Evitar envío tradicional del formulario

    // Obtener el valor del tamaño de la matriz
    const matrixSize = document.getElementById('matrixSize').value;

    // Enviar la solicitud al servidor para generar y transformar la matriz
    fetch('http://localhost:3000/matrix/transform', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ n: parseInt(matrixSize) })
    })
    .then(response => response.json())
    .then(data => {
        // Mostrar la matriz original
        const originalMatrixDiv = document.getElementById('originalMatrix');
        originalMatrixDiv.textContent = formatMatrix(data.originalMatrix);

        // Mostrar cada paso de la transformación
        const transformationStepsDiv = document.getElementById('transformationSteps');
        transformationStepsDiv.innerHTML = ''; // Limpiar contenido previo
        data.steps.forEach((step, index) => {
            const stepElement = document.createElement('pre');
            stepElement.textContent = `Paso ${index}:\n${formatMatrix(step)}`;
            transformationStepsDiv.appendChild(stepElement);
        });

        // Mostrar la matriz transformada
        const transformedMatrixDiv = document.getElementById('transformedMatrix');
        transformedMatrixDiv.textContent = formatMatrix(data.transformedMatrix);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Función para formatear la matriz como texto legible
function formatMatrix(matrix) {
    return matrix.map(row => row.join(' ')).join('\n');
}
