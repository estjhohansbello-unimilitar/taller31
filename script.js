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