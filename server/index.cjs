const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize SQLite database connection
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// GET /api/trenes
app.get('/api/trenes', (req, res) => {
    const query = 'SELECT * FROM Trenes_Trabajo';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// GET /api/tarifas
app.get('/api/tarifas', (req, res) => {
    const query = 'SELECT * FROM Configuracion_Tarifas';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// PUT /api/tarifas/:id
app.put('/api/tarifas/:id', (req, res) => {
    const { costo_hora } = req.body;
    const { id } = req.params;
    
    if (costo_hora === undefined) {
        return res.status(400).json({ error: 'costo_hora es requerido' });
    }
    
    const query = 'UPDATE Configuracion_Tarifas SET costo_hora = ? WHERE id = ?';
    db.run(query, [costo_hora, id], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Tarifa no encontrada' });
        }
        res.json({ message: 'Tarifa actualizada correctamente' });
    });
});


// POST /api/login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // Mock authentication
    if (username && password) {
        // Return dummy token and a role
        res.json({
            token: 'dummy-jwt-token-12345',
            role: 'Supervisor',
            user: { username }
        });
    } else {
        res.status(400).json({ error: 'Username and password required' });
    }
});

// POST /api/piezas
app.post('/api/piezas', (req, res) => {
    const { 
        nombre, en_inventario, herramientas_requeridas, suplementos, 
        referencia_original, numero_fabricacion, material_solicitado, materiales_alternativos,
        fecha_solicitud, cantidad_piezas
    } = req.body;
    
    // First, get the max orden_secuencial
    db.get('SELECT MAX(orden_secuencial) as max_sec FROM Proyectos_Piezas', [], (err, row) => {
        if (err) {
            console.error('Error fetching max_sec:', err);
            return res.status(500).json({ error: err.message });
        }
        
        const next_sec = (row && row.max_sec ? row.max_sec : 0) + 1;
        const orden_id = `ORD-${String(next_sec).padStart(4, '0')}`;
        
        const query = `
            INSERT INTO Proyectos_Piezas (
                orden_id, orden_secuencial, nombre, fecha_solicitud, cantidad_piezas, en_inventario, herramientas_requeridas, suplementos,
                referencia_original, numero_fabricacion, material_solicitado, materiales_alternativos
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.run(query, [
            orden_id, next_sec, nombre, fecha_solicitud, cantidad_piezas, en_inventario, herramientas_requeridas, suplementos,
            referencia_original, numero_fabricacion, material_solicitado, materiales_alternativos
        ], function(err) {
            if (err) {
                console.error('Error inserting pieza:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ id: this.lastID, orden_id, orden_secuencial: next_sec });
        });
    });
});


// GET /api/piezas
app.get('/api/piezas', (req, res) => {
    const query = 'SELECT * FROM Proyectos_Piezas ORDER BY id DESC';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// PUT /api/piezas/:id/estado
app.put('/api/piezas/:id/estado', (req, res) => {
    const { estado } = req.body;
    const { id } = req.params;
    
    if (!estado) {
        return res.status(400).json({ error: 'estado es requerido' });
    }
    
    const query = 'UPDATE Proyectos_Piezas SET estado = ? WHERE id = ?';
    db.run(query, [estado, id], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Pieza no encontrada' });
        }
        res.json({ message: 'Estado actualizado correctamente' });
    });
});

// PUT /api/piezas/:id
app.put('/api/piezas/:id', (req, res) => {
    const { id } = req.params;
    const body = req.body;
    
    const allowedFields = [
        'nombre', 'descripcion', 'cantidad_piezas', 'en_inventario', 
        'herramientas_requeridas', 'suplementos', 'referencia_original', 
        'numero_fabricacion', 'material_solicitado', 'materiales_alternativos',
        'horas_cnc', 'horas_torno', 'horas_laser', 'horas_perforadora', 'horas_diseno',
        'dim_largo_final', 'dim_ancho_final', 'dim_alto_final',
        'dim_largo_bruto', 'dim_ancho_bruto', 'dim_alto_bruto',
        'costo_material_bruto',
        'costo_lote_diseno', 'costo_lote_prefabricacion', 'costo_lote_armado', 
        'costo_lote_pulido', 'costo_lote_grabado', 'estado',
        'unidad', 'kerf', 'lotes_material_comprado'
    ];
    
    const fieldsToUpdate = [];
    const values = [];
    
    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            fieldsToUpdate.push(`${field} = ?`);
            values.push(body[field]);
        }
    }
    
    if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ error: 'No se enviaron campos válidos para actualizar' });
    }
    
    values.push(id);
    const query = `UPDATE Proyectos_Piezas SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
    
    db.run(query, values, function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Pieza no encontrada' });
        }
        res.json({ message: 'Pieza actualizada correctamente' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
