export function dateForm(dateInput) {
  const meses = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];

  const monthIg = {
    Jan:"ENE", Feb:"FEB", Mar:"MAR", Apr:"ABR", May:"MAY", Jun:"JUN",
    Jul:"JUL", Aug:"AGO", Sep:"SEP", Oct:"OCT", Nov:"NOV", Dec:"DIC"
  };

  const mesesMap = {
    ENE: 1, ENERO: 1,
    FEB: 2, FEBRERO: 2,
    MAR: 3, MARZO: 3,
    ABR: 4, ABRIL: 4,
    MAY: 5, MAYO: 5,
    JUN: 6, JUNIO: 6,
    JUL: 7, JULIO: 7,
    AGO: 8, AGOSTO: 8,
    SEP: 9, SEPT: 9, SEPTIEMBRE: 9,
    OCT: 10, OCTUBRE: 10,
    NOV: 11, NOVIEMBRE: 11,
    DIC: 12, DICIEMBRE: 12
  };

  let dateStr = "";

  // Si es Date, convertir a string
  if (dateInput instanceof Date) {
    dateStr = dateInput.toDateString(); // ejemplo: "Fri Sep 19 2025"
  } else if (typeof dateInput === "string") {
    dateStr = dateInput;
  } else {
    throw new Error("dateForm: input inválido, debe ser string o Date");
  }

  const clean = dateStr.trim().toUpperCase().replace(/[-/]/g, " ");
  const partes = clean.split(/\s+/);

  let dia, mes, anio;

  if (partes.length === 5) throw new Error("Formato de fecha no reconocido");

  // YYYY MM DD
  if (partes[0].length === 4 && !isNaN(partes[0])) {
    anio = parseInt(partes[0], 10);
    mes = isNaN(partes[1]) ? mesesMap[partes[1]] : parseInt(partes[1], 10);
    dia = parseInt(partes[2], 10);
  }
  // DD MES YYYY
  else if (isNaN(partes[1]) && partes[2].length === 4) {
    dia = parseInt(partes[0], 10);
    mes = mesesMap[partes[1]];
    anio = parseInt(partes[2], 10);
  }
  // DD MM YYYY
  else if (!isNaN(partes[1]) && partes[2].length === 4) {
    dia = parseInt(partes[0], 10);
    mes = parseInt(partes[1], 10);
    anio = parseInt(partes[2], 10);
  }
  // DD MM YY
  else if (!isNaN(partes[1]) && partes[2].length === 2) {
    dia = parseInt(partes[0], 10);
    mes = parseInt(partes[1], 10);
    anio = 2000 + parseInt(partes[2], 10);
  }
  // Ejemplo: ["FRI","AUG","29","2025"]
  else if (partes.length === 4) {
    dia = parseInt(partes[2], 10);
    mes = mesesMap[partes[1]] || monthIg[partes[1].slice(0,3)];
    anio = parseInt(partes[3], 10);
  }
  else {
    throw new Error("Formato de fecha no reconocido");
  }

  if (!dia || !mes || !anio || mes < 1 || mes > 12) throw new Error("Fecha inválida");

  return `${String(dia).padStart(2,"0")} ${meses[mes-1]} ${anio.toString().slice(-2)}`;
}
