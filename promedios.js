document.getElementById('fetchData').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/students/averages');
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }
        const data = await response.json();
        
        let output = `**Promedios de Alumnos**\n\n`;
        output += `Promedios por Alumno:\n`;
        data.overallAverages.forEach(student => {
            output += `${student.name}: ${student.average}\n`;
        });
        
        output += `\n**Mayor Promedio**: ${data.highestAverage.name} con un promedio de ${data.highestAverage.average}\n`;
        output += `**Menor Promedio**: ${data.lowestAverage.name} con un promedio de ${data.lowestAverage.average}\n`;

        if (data.failedStudents.length > 0) {
            output += `\n**Alumnos que reprobaron**:\n`;
            data.failedStudents.forEach(student => {
                output += `${student.name} reprobo: ${student.failedGrades.join(", ")}\n`;
            });
        } else {
            output += `\n**Ningún alumno reprobó**\n`;
        }

        output += `\n**Distribución de Promedios**:\n`;
        for (const range in data.gradeDistribution) {
            output += `${range}: ${data.gradeDistribution[range]} alumnos\n`;
        }

        output += `\n**Tabla de Calificaciones**:\n${data.gradesTable}`;

        document.getElementById('output').textContent = output;

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('output').textContent = 'Ocurrió un error al obtener los datos.';
    }
});
