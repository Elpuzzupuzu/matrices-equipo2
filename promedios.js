document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('fetchData').addEventListener('click', function () {
        fetch('http://localhost:3000/students/averages')
            .then(response => response.json())
            .then(data => {
                // Formatear la salida para mostrarla en el contenedor
                const output = `
Resultados Generales:
${data.overallAverages.map(student => `- ${student.name}: Promedio ${student.average}`).join('\n')}

Promedio Mayor:
- ${data.highestAverage.name}: ${data.highestAverage.average}

Promedio Menor:
- ${data.lowestAverage.name}: ${data.lowestAverage.average}

Alumnos Reprobados:
${data.failedStudents.length > 0 ? data.failedStudents.map(failed => `- ${failed.name}: Reprobó ${failed.failedGrades.join(', ')}`).join('\n') : 'Ninguno'}

Distribución de Promedios:
${Object.entries(data.gradeDistribution).map(([range, count]) => `${range}: ${count} alumnos`).join('\n')}
                `;
                document.getElementById('output').textContent = output;
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
            });
    });
});
