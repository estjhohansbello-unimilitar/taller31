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
        x1: 200,
        y1: 150,
        x2: 350,
        y2: 250
    },

    {
        nombre: "Caso 2: Línea completamente fuera",
        x1: 20,
        y1: 20,
        x2: 80,
        y2: 70
    },

    {
        nombre: "Caso 3: Línea entrando por la izquierda",
        x1: 50,
        y1: 180,
        x2: 300,
        y2: 180
    },

    {
        nombre: "Caso 4: Línea entrando por la derecha",
        x1: 300,
        y1: 220,
        x2: 600,
        y2: 220
    },

    {
        nombre: "Caso 5: Línea atravesando viewport",
        x1: 50,
        y1: 50,
        x2: 600,
        y2: 350
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
// mostrar la escena 
function mostrarEscena() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dibujarViewport(xmin, ymin, xmax, ymax);

    const escena = escenas[indiceEscena];

    // Línea original
    dibujarLinea(
        escena.x1,
        escena.y1,
        escena.x2,
        escena.y2,
        "red",
        1
    );

    // Línea recortada
    const resultado = cohenSutherland(
        escena.x1,
        escena.y1,
        escena.x2,
        escena.y2
    );

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