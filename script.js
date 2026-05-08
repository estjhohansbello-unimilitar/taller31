// canvas 
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//constantes de la region
const INSIDE = 0;
const LEFT = 1;
const RIGHT = 2;
const BOTTOM = 4;
const TOP = 8;
// visualizacion del viewport 
let xmin = 150;
let ymin = 100;
let xmax = 450;
let ymax = 300;
//Escenas 
const escenas = [

    {
        nombre: "Caso 1: Línea completamente dentro",
        tipo: "dentro"
    },

    {
        nombre: "Caso 2: Línea completamente fuera",
        tipo: "fuera"
    },

    {
        nombre: "Caso 3: Línea entrando por izquierda",
        tipo: "izquierda"
    },

    {
        nombre: "Caso 4: Línea entrando por derecha",
        tipo: "derecha"
    },

    {
        nombre: "Caso 5: Línea atravesando viewport",
        tipo: "atravesando"
    }
];

let indiceEscena = 0;
// FUNCION 1 para el viewport 
function convertirY(y) {

    return canvas.height - y;
}

function dibujarViewport(xmin, ymin, xmax, ymax) {

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;

    ctx.strokeRect(
        xmin,
        convertirY(ymax),
        xmax - xmin,
        ymax - ymin
    );
}
// FUNCION 2 para dibuar las lineas
function dibujarLinea(x1, y1, x2, y2, color = "black", grosor = 2) {

    ctx.beginPath();
    ctx.moveTo(x1, convertirY(y1));
    ctx.lineTo(x2, convertirY(y2));

    ctx.strokeStyle = color;
    ctx.lineWidth = grosor;

    ctx.stroke();
}
// Funcion para calcular el codigo de region, en que parte del plano se encuentra el punto
function calcularCodigo(x, y) {

    let codigo = INSIDE;

    if (x < xmin) {
        codigo |= LEFT;
    }
    else if (x > xmax) {
        codigo |= RIGHT;
    }

    if (y < ymin) {
        codigo |= TOP;
    }
    else if (y > ymax) {
        codigo |= BOTTOM;
    }

    return codigo;
}
// Funcion para el algoritmo de Cohen Sutherland 
function cohenSutherland(x1, y1, x2, y2) {

    let codigo1 = calcularCodigo(x1, y1);
    let codigo2 = calcularCodigo(x2, y2);

    let aceptada = false;

    while (true) {

        // ACEPTACIÓN TRIVIAL
        if ((codigo1 === 0) && (codigo2 === 0)) {

            aceptada = true;
            break;
        }

        // RECHAZO TRIVIAL
        else if (codigo1 & codigo2) {

            break;
        }

        // RECORTE
        else {

            let codigoExterno;
            let x;
            let y;

            if (codigo1 !== 0) {
                codigoExterno = codigo1;
            }
            else {
                codigoExterno = codigo2;
            }

            // ARRIBA
            if (codigoExterno & TOP) {

                x = x1 + (x2 - x1) * (ymin - y1) / (y2 - y1);
                y = ymin;
            }

            // ABAJO
            else if (codigoExterno & BOTTOM) {

                x = x1 + (x2 - x1) * (ymax - y1) / (y2 - y1);
                y = ymax;
            }

            // DERECHA
            else if (codigoExterno & RIGHT) {

                y = y1 + (y2 - y1) * (xmax - x1) / (x2 - x1);
                x = xmax;
            }

            // IZQUIERDA
            else if (codigoExterno & LEFT) {

                y = y1 + (y2 - y1) * (xmin - x1) / (x2 - x1);
                x = xmin;
            }

            // REEMPLAZAR PUNTO
            if (codigoExterno === codigo1) {

                x1 = x;
                y1 = y;

                codigo1 = calcularCodigo(x1, y1);
            }
            else {

                x2 = x;
                y2 = y;

                codigo2 = calcularCodigo(x2, y2);
            }
        }
    }

    return {
        aceptada,
        x1,
        y1,
        x2,
        y2
    };
} 
// se agrega una nueva funcion para obtener las coordenadas de la linea segun el caso a evaluar, esta funcion se utiliza para cada escena y se muestra el resultado del algoritmo de Cohen Sutherland en cada caso. 
function obtenerLineaSegunCaso(tipo) {

    switch (tipo) {

        // COMPLETAMENTE DENTRO
        case "dentro":

            return {
                x1: xmin + 50,
                y1: ymin + 50,
                x2: xmax - 50,
                y2: ymax - 50
            };

        // COMPLETAMENTE FUERA
        case "fuera":

            return {
                x1: xmin - 120,
                y1: ymin - 120,
                x2: xmin - 40,
                y2: ymin - 40
            };

        // ENTRANDO POR IZQUIERDA
        case "izquierda":

            return {
                x1: xmin - 120,
                y1: (ymin + ymax) / 2,
                x2: xmin + 120,
                y2: (ymin + ymax) / 2
            };

        // ENTRANDO POR DERECHA
        case "derecha":

            return {
                x1: xmax - 120,
                y1: (ymin + ymax) / 2,
                x2: xmax + 120,
                y2: (ymin + ymax) / 2
            };

        // ATRAVESANDO VIEWPORT
        case "atravesando":

            return {
                x1: xmin - 100,
                y1: ymin - 100,
                x2: xmax + 100,
                y2: ymax + 100
            };
    }
}
// mostrar la escena 
function mostrarEscena() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dibujarViewport(xmin, ymin, xmax, ymax);

    const escena = escenas[indiceEscena];

    // GENERAR LÍNEA DINÁMICA
    const linea = obtenerLineaSegunCaso(escena.tipo);

    // LÍNEA ORIGINAL
    dibujarLinea(
        linea.x1,
        linea.y1,
        linea.x2,
        linea.y2,
        "red",
        1
    );

    // RECORTE
    const resultado = cohenSutherland(
        linea.x1,
        linea.y1,
        linea.x2,
        linea.y2
    );

    // LÍNEA RECORTADA
    if (resultado.aceptada) {

        dibujarLinea(
            resultado.x1,
            resultado.y1,
            resultado.x2,
            resultado.y2,
            "green",
            3
        );
    }

    document.getElementById("infoCaso").innerText = escena.nombre;
}

// se añade la funcion siguientEscena para evaluar cada caso y mostrar el resultado del algoritmo de Cohen Sutherland, 
// se añade la funcion anteriorEscena para volver a la escena anterior y evaluar el resultado del algoritmo en cada caso.
function siguienteEscena() {

    indiceEscena++;

    if (indiceEscena >= escenas.length) {
        indiceEscena = 0;
    }

    mostrarEscena();
}

function anteriorEscena() {

    indiceEscena--;

    if (indiceEscena < 0) {
        indiceEscena = escenas.length - 1;
    }

    mostrarEscena();
}

// =====================================================
// ACTUALIZAR VIEWPORT
// =====================================================

function actualizarViewport() {

    xmin = parseInt(document.getElementById("xmin").value);
    ymin = parseInt(document.getElementById("ymin").value);
    xmax = parseInt(document.getElementById("xmax").value);
    ymax = parseInt(document.getElementById("ymax").value);

    mostrarEscena();
}

// =====================================================
// INICIO
// =====================================================

mostrarEscena();