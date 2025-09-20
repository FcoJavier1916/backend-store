const fs = require('fs');
const path = require('path');

const inputFile = 'C:/Users/FCO1916/Desktop/app_aapSTORE/backEndStore/utils/mis_zonas.txt';
const outputDir = path.join(__dirname, 'output');
const outputFile = path.join(outputDir, 'zonas_excel_lista.txt');

// Crear carpeta "output" si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const data = fs.readFileSync(inputFile, 'utf-8');
const lines = data.split(/\r?\n/).filter(line => line.trim() !== '');

// Cada 3 líneas = zona, tipo, precio
const zonas = [];
for (let i = 0; i < lines.length; i += 3) {
  const zona = lines[i].trim();
  const precio = parseFloat(lines[i + 2].replace(/[^0-9.]/g, '')).toFixed(2);
  zonas.push({ zona, precio });
}

// Generar fila con hasta 4 zonas
const maxZonas = 4;
const fila = [];
for (let i = 0; i < maxZonas; i++) {
  if (zonas[i]) {
    fila.push(zonas[i].zona, zonas[i].precio);
  } else {
    fila.push('', '');
  }
}

// Guardar solo la fila (sin encabezados)
fs.writeFileSync(outputFile, fila.join('\t'));

console.log('✅ Archivo limpio generado en:', outputFile);
