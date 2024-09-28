const express = require('express');
const cors = require('cors'); // Importar el módulo cors
const app = express();
const PORT = 3000;

// Middleware para CORS
app.use(cors());

// Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(express.json());

// Endpoint para generar la matriz de 5x5
app.get('/matrix/generate', (req, res) => {
    const matrix = [];
    const zeroCounts = [];

    // Generar la matriz y contar los ceros en cada fila
    for (let i = 0; i < 5; i++) {
        let row = [];
        let zeroCount = 0;

        for (let j = 0; j < 5; j++) {
            const num = Math.floor(Math.random() * 11); // Genera un número del 0 al 10
            row.push(num);

            if (num === 0) {
                zeroCount++;
            }
        }

        matrix.push(row);
        zeroCounts.push(`Fila ${i + 1}: ${zeroCount} ceros`);
    }

    // Enviar la respuesta con la matriz y la cantidad de ceros por fila
    res.json({
        matrix: matrix,
        zeroCounts: zeroCounts
    });
});

// Endpoint para verificar si una matriz 3x3 es un cuadro mágico
app.post('/check-magic-square', (req, res) => {
    try {
        // Verificar si se envió un cuerpo de solicitud y contiene una matriz
        const matrix = req.body.matrix;

        // Mensaje de error si no se envía la matriz en el formato correcto
        if (!matrix || !Array.isArray(matrix) || matrix.length !== 3 || !matrix.every(row => Array.isArray(row) && row.length === 3)) {
            return res.status(400).json({ message: 'La matriz debe ser de 3x3.' });
        }

        // Función para verificar si es un cuadro mágico
        function isMagicSquare(matrix) {
            const magicConstant = 15;

            // Suma de filas
            for (let i = 0; i < 3; i++) {
                let rowSum = matrix[i].reduce((a, b) => a + b, 0);
                if (rowSum !== magicConstant) return false;
            }

            // Suma de columnas
            for (let i = 0; i < 3; i++) {
                let colSum = matrix[0][i] + matrix[1][i] + matrix[2][i];
                if (colSum !== magicConstant) return false;
            }

            // Suma de diagonales
            let diagonal1 = matrix[0][0] + matrix[1][1] + matrix[2][2];
            let diagonal2 = matrix[0][2] + matrix[1][1] + matrix[2][0];
            if (diagonal1 !== magicConstant || diagonal2 !== magicConstant) return false;

            return true;
        }

        // Verificar si es un cuadro mágico y responder
        if (isMagicSquare(matrix)) {
            res.json({ message: 'Es un cuadro mágico.', magicConstant: 15, matrix });
        } else {
            res.json({ message: 'No es un cuadro mágico.', matrix });
        }

    } catch (error) {
        // Si hay un error, responder con un estado 500 y el mensaje de error
        console.error('Error en el servidor:', error);
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
});



//-----------------operaciones con matrices de 2x2 ------------------------///

// Endpoint para realizar operaciones con matrices 2x2
app.post('/matrix/operations', (req, res) => {
    try {
        // Desestructurar los valores de cada matriz del cuerpo de la solicitud
        const { a, b, c, d, e, f, g, h } = req.body;

        // Validar que todos los valores sean números
        if ([a, b, c, d, e, f, g, h].some(value => typeof value !== 'number')) {
            return res.status(400).json({ message: 'Todos los valores deben ser números.' });
        }

        // Construir las matrices a partir de los valores recibidos
        const matrix1 = [
            [a, b],
            [c, d]
        ];

        const matrix2 = [
            [e, f],
            [g, h]
        ];

        // Suma de matrices
        const sumMatrix = [
            [
                matrix1[0][0] + matrix2[0][0],
                matrix1[0][1] + matrix2[0][1]
            ],
            [
                matrix1[1][0] + matrix2[1][0],
                matrix1[1][1] + matrix2[1][1]
            ]
        ];

        // Resta de matrices
        const diffMatrix = [
            [
                matrix1[0][0] - matrix2[0][0],
                matrix1[0][1] - matrix2[0][1]
            ],
            [
                matrix1[1][0] - matrix2[1][0],
                matrix1[1][1] - matrix2[1][1]
            ]
        ];

        // Producto de matrices
        const productMatrix = [
            [
                matrix1[0][0] * matrix2[0][0] + matrix1[0][1] * matrix2[1][0],
                matrix1[0][0] * matrix2[0][1] + matrix1[0][1] * matrix2[1][1]
            ],
            [
                matrix1[1][0] * matrix2[0][0] + matrix1[1][1] * matrix2[1][0],
                matrix1[1][0] * matrix2[0][1] + matrix1[1][1] * matrix2[1][1]
            ]
        ];

        // División simple de matrices (elemento por elemento)
        const divMatrix = [
            [
                matrix2[0][0] !== 0 ? (matrix1[0][0] / matrix2[0][0]) : null,
                matrix2[0][1] !== 0 ? (matrix1[0][1] / matrix2[0][1]) : null
            ],
            [
                matrix2[1][0] !== 0 ? (matrix1[1][0] / matrix2[1][0]) : null,
                matrix2[1][1] !== 0 ? (matrix1[1][1] / matrix2[1][1]) : null
            ]
        ];

        // Enviar la respuesta con todas las matrices y resultados
        res.json({
            matrix1,
            matrix2,
            sumMatrix,
            diffMatrix,
            productMatrix,
            divMatrix
        });

    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
});


///----------- DIAGONAL PRINCIPAL---------------////



app.post('/matrix/transform', (req, res) => {
    const { n } = req.body;

    if (!n || n <= 0) {
        return res.status(400).json({ message: "El tamaño de la matriz debe ser un número entero positivo." });
    }

    // Generar una matriz cuadrada de n x n con números enteros aleatorios entre 1 y 10
    let matrix = Array.from({ length: n }, () => 
        Array.from({ length: n }, () => Math.floor(Math.random() * 10) + 1)
    );

    // Guardar la matriz original
    const originalMatrix = JSON.parse(JSON.stringify(matrix));
    
    // Lista para almacenar cada estado de la matriz
    const transformationSteps = [JSON.parse(JSON.stringify(matrix))];
    
    // Transformar la matriz paso a paso hacia la matriz identidad
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === j) {
                matrix[i][j] = 1; // Asignar 1 a la diagonal principal
            } else {
                matrix[i][j] = 0; // Asignar 0 al resto de elementos
            }
            // Almacenar el estado actual de la matriz
            transformationSteps.push(JSON.parse(JSON.stringify(matrix)));
        }
    }

    // Responder con la matriz original, la matriz transformada y los pasos de transformación
    res.json({
        originalMatrix,
        transformedMatrix: matrix,
        steps: transformationSteps
    });
});


//----- llenar la matriz ------///


app.post('/matrix/sum-average', (req, res) => {
    // Generar matriz aleatoria de 5x10 con valores entre 1 y 100
    const matrix = Array.from({ length: 5 }, () => 
        Array.from({ length: 10 }, () => Math.floor(Math.random() * 9) + 1)
    );

    // Matriz 5x2 para almacenar la suma y el promedio de cada fila de la matriz original
    const sumAvgMatrix = matrix.map(row => {
        const sum = row.reduce((acc, num) => acc + num, 0); // Calcular suma
        const avg = sum / row.length; // Calcular promedio
        return [sum, avg.toFixed(2)]; // Devolver suma y promedio con 2 decimales
    });

    // Responder con la matriz generada y la matriz con sumas y promedios
    res.json({
        generatedMatrix: matrix,
        sumAverageMatrix: sumAvgMatrix
    });
});


///-----ventas ------////

// Definición de la matriz
const ventas = [
    [5, 16, 10, 12, 24],
    [40, 55, 10, 11, 18],
    [15, 41, 78, 14, 51],
    [35, 22, 81, 15, 12],
    [50, 12, 71, 10, 20],
    [70, 40, 60, 28, 22],
    [50, 50, 50, 36, 25],
    [40, 70, 40, 11, 20],
    [20, 20, 30, 12, 18],
    [10, 40, 32, 13, 16],
    [50, 3, 24, 15, 82],
    [40, 46, 15, 46, 22]
];



// Endpoint para mostrar las ventas
app.get('/ventas', (req, res) => {
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 
        'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 
        'Noviembre', 'Diciembre'
    ];
    
    let menorVenta = Number.MAX_VALUE;
    let mayorVenta = Number.MIN_VALUE;
    let totalVentas = 0;

    // Almacenar las posiciones de las menores y mayores ventas
    const menoresPosiciones = [];
    const mayoresPosiciones = [];

    // Iterar sobre la matriz para calcular las ventas
    for (let mes = 0; mes < ventas.length; mes++) {
        for (let dia = 0; dia < ventas[mes].length; dia++) {
            const venta = ventas[mes][dia];
            totalVentas += venta;

            // Comprobar menor venta
            if (venta < menorVenta) {
                menorVenta = venta;
                menoresPosiciones.length = 0; // Limpiar posiciones anteriores
                menoresPosiciones.push({ dia: dias[dia], mes: meses[mes], venta });
            } else if (venta === menorVenta) {
                menoresPosiciones.push({ dia: dias[dia], mes: meses[mes], venta });
            }

            // Comprobar mayor venta
            if (venta > mayorVenta) {
                mayorVenta = venta;
                mayoresPosiciones.length = 0; // Limpiar posiciones anteriores
                mayoresPosiciones.push({ dia: dias[dia], mes: meses[mes], venta });
            } else if (venta === mayorVenta) {
                mayoresPosiciones.push({ dia: dias[dia], mes: meses[mes], venta });
            }
        }
    }

    // Formatear la salida
    const resultado = {
        menorVenta: {
            valor: menorVenta,
            posiciones: menoresPosiciones
        },
        mayorVenta: {
            valor: mayorVenta,
            posiciones: mayoresPosiciones
        },
        totalVentas,
        detallesVentas: []
    };

    // Detallar las ventas por día y mes
    for (let mes = 0; mes < ventas.length; mes++) {
        for (let dia = 0; dia < ventas[mes].length; dia++) {
            resultado.detallesVentas.push({
                dia: dias[dia],
                mes: meses[mes],
                venta: ventas[mes][dia]
            });
        }
    }

    // Enviar respuesta JSON
    res.json(resultado);
});







///------------promedios-----------------------------------/////

// Datos de los alumnos y sus calificaciones

app.get('/students/averages', (req, res) => {
    const students = [
        { name: "Alumno 1", grades: [5.5, 8.6, 10] },
        { name: "Alumno 2", grades: [8.0, 5.5, 10] },
        { name: "Alumno 3", grades: [9.0, 4.1, 7.8] },
        { name: "Alumno 4", grades: [10, 2.2, 8.1] },
        { name: "Alumno 5", grades: [7.0, 9.2, 7.1] },
        { name: "Alumno 6", grades: [9.0, 4.0, 6.0] },
        { name: "Alumno 7", grades: [6.5, 5.0, 5.0] },
        { name: "Alumno 8", grades: [4.0, 7.0, 4.0] },
        { name: "Alumno 9", grades: [8.0, 8.0, 9.0] },
        { name: "Alumno 10", grades: [10, 9.0, 9.2] },
        { name: "Alumno 11", grades: [5.0, 10, 8.4] },
        { name: "Alumno 12", grades: [9.0, 4.6, 7.5] }
    ];

    let totalStudents = students.length;
    let overallAverages = students.map(student => {
        const average = (student.grades.reduce((acc, grade) => acc + grade, 0) / student.grades.length).toFixed(2);
        return { name: student.name, average: parseFloat(average) };
    });

    let highestAverage = overallAverages.reduce((prev, current) => (prev.average > current.average) ? prev : current);
    let lowestAverage = overallAverages.reduce((prev, current) => (prev.average < current.average) ? prev : current);

    let failedStudents = students.filter(student => student.grades.some(grade => grade < 7))
        .map(student => ({
            name: student.name,
            failedGrades: student.grades
                .map((grade, index) => (grade < 7 ? `Parcial ${index + 1}` : null))
                .filter(Boolean)
        }));

    // Distribución de promedios
    let gradeDistribution = {
        "0-4.9": 0,
        "5.0-5.9": 0,
        "6.0-6.9": 0,
        "7.0-7.9": 0,
        "8.0-8.9": 0,
        "9.0-10": 0
    };

    overallAverages.forEach(({ average }) => {
        if (average < 5) gradeDistribution["0-4.9"]++;
        else if (average < 6) gradeDistribution["5.0-5.9"]++;
        else if (average < 7) gradeDistribution["6.0-6.9"]++;
        else if (average < 8) gradeDistribution["7.0-7.9"]++;
        else if (average < 9) gradeDistribution["8.0-8.9"]++;
        else gradeDistribution["9.0-10"]++;
    });

    // Crear la tabla de calificaciones
    const gradesTable = students.map(student => {
        return `${student.name}: [${student.grades.join(", ")}] - Promedio: ${((student.grades.reduce((acc, grade) => acc + grade, 0) / student.grades.length).toFixed(2))}`;
    }).join('\n');

    // Enviar respuesta estructurada
    res.json({
        overallAverages,
        highestAverage,
        lowestAverage,
        failedStudents,
        gradeDistribution,
        gradesTable
    });
});









//-----------------------------------------------////





// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
