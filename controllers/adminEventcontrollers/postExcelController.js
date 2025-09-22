const Event = require('../../models/EventsModel');
const XLSX = require('xlsx');

const postExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Debes enviar un archivo Excel' });
        }

        // Leer Excel desde buffer
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(sheet);

        if (!rows.length) return res.status(400).json({ message: 'El Excel está vacío' });

        // Mapear filas a eventos
        const eventsArray = rows.map(row => {
            const zonas = [];
            for (let i = 1; i <= 100; i++) {
                const nombreKey = `zona${i}_nombre`;
                const precioKey = `zona${i}_precio`;
                if (row[nombreKey] && row[precioKey]) {
                    zonas.push({ zona: row[nombreKey], precio: Number(row[precioKey]) });
                }
            }
            return {
                titulo: row.titulo,
                tour: row.tour,
                fecha: row.fecha,
                estado: row.estado,
                recinto: row.recinto,
                boletera: row.boletera,
                disponibilidad: row.disponibilidad,
                categoria: row.categoria,
                imgUrlEvent: row.imgUrlEvent || '',
                imgUrlMap: row.imgUrlMap || '',
                zonas
            };
        });

        const insertedEvents = await Event.insertMany(eventsArray);

        res.status(201).json({
            message: `✅ Se subieron ${insertedEvents.length} eventos desde Excel`,
            eventos: insertedEvents
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al subir eventos desde Excel', error: error.message || error });
    }
};

module.exports = postExcel;
