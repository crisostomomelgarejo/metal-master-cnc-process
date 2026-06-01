const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

console.log('Inicializando la base de datos...');

// Crear tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS Usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    rol TEXT CHECK(rol IN ('Diseño', 'Admin', 'Gerencia')) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Trenes_Trabajo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Proyectos_Piezas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orden_id TEXT UNIQUE,
    orden_secuencial INTEGER,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    fecha_solicitud TEXT,
    cantidad_piezas INTEGER,
    en_inventario BOOLEAN,
    herramientas_requeridas TEXT,
    suplementos TEXT,
    referencia_original TEXT,
    numero_fabricacion TEXT,
    material_solicitado TEXT,
    materiales_alternativos TEXT,
    estado TEXT DEFAULT 'RECEPCION',
    horas_cnc REAL,
    horas_torno REAL,
    horas_laser REAL,
    horas_perforadora REAL,
    horas_diseno REAL,
    dim_largo_final REAL,
    dim_ancho_final REAL,
    dim_alto_final REAL,
    dim_largo_bruto REAL,
    dim_ancho_bruto REAL,
    dim_alto_bruto REAL,
    costo_material_bruto REAL,
    costo_lote_diseno REAL,
    costo_lote_prefabricacion REAL,
    costo_lote_armado REAL,
    costo_lote_pulido REAL,
    costo_lote_grabado REAL,
    unidad TEXT DEFAULT 'in',
    kerf REAL DEFAULT 0.125,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Ordenes_Trabajo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proyecto_id INTEGER,
    tren_id INTEGER,
    usuario_id INTEGER,
    estado TEXT DEFAULT 'Pendiente',
    notas TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(proyecto_id) REFERENCES Proyectos_Piezas(id),
    FOREIGN KEY(tren_id) REFERENCES Trenes_Trabajo(id),
    FOREIGN KEY(usuario_id) REFERENCES Usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS Configuracion_Tarifas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_tren TEXT NOT NULL,
    costo_hora REAL NOT NULL
  );
`);

try {
  // Patches for existing database
  db.exec(`ALTER TABLE Proyectos_Piezas ADD COLUMN orden_secuencial INTEGER;`);
} catch (e) {
  // Ignore if column already exists
}

try {
  const newCols = [
    'horas_cnc', 'horas_torno', 'horas_laser', 'horas_perforadora', 'horas_diseno',
    'dim_largo_final', 'dim_ancho_final', 'dim_alto_final',
    'dim_largo_bruto', 'dim_ancho_bruto', 'dim_alto_bruto',
    'costo_material_bruto',
    'costo_lote_diseno', 'costo_lote_prefabricacion', 'costo_lote_armado', 'costo_lote_pulido', 'costo_lote_grabado'
  ];
  for (const col of newCols) {
    try {
      db.exec(`ALTER TABLE Proyectos_Piezas ADD COLUMN ${col} REAL;`);
    } catch (e) {}
  }

  const defaultCols = [
    { name: 'unidad', type: "TEXT DEFAULT 'in'" },
    { name: 'kerf', type: "REAL DEFAULT 0.125" }
  ];
  for (const col of defaultCols) {
    try {
      db.exec(`ALTER TABLE Proyectos_Piezas ADD COLUMN ${col.name} ${col.type};`);
    } catch (e) {}
  }
} catch (e) {
  console.error(e);
}

try {
  db.exec(`ALTER TABLE Proyectos_Piezas ADD COLUMN estado TEXT DEFAULT 'RECEPCION';`);
  db.exec(`UPDATE Proyectos_Piezas SET estado = 'RECEPCION' WHERE estado IS NULL;`);
} catch (e) {
  // Ignore if column already exists
}

console.log('Tablas creadas con éxito.');

// Seed data
const insertTren = db.prepare('INSERT INTO Trenes_Trabajo (nombre) VALUES (?)');

const trenes = [
  '1. Tren de Diseño',
  '2. CNC Tormach 1100MX',
  '3. Perforadora Vertical Manual',
  '4. Torno Horizontal Manual',
  '5. Cortadora Láser'
];

try {
  db.prepare('BEGIN').run();
  
  // Limpiar antes de insertar para evitar duplicados en la prueba
  db.exec('DELETE FROM Trenes_Trabajo');
  db.exec("DELETE FROM sqlite_sequence WHERE name='Trenes_Trabajo'");

  for (const tren of trenes) {
    insertTren.run(tren);
  }

  // Seed Configuracion_Tarifas
  db.exec('DELETE FROM Configuracion_Tarifas');
  db.exec("DELETE FROM sqlite_sequence WHERE name='Configuracion_Tarifas'");
  
  const insertTarifa = db.prepare('INSERT INTO Configuracion_Tarifas (nombre_tren, costo_hora) VALUES (?, ?)');
  const tarifas = [
    { nombre: 'Diseño CAD', costo: 100 },
    { nombre: 'CNC Tormach', costo: 75 },
    { nombre: 'Torno Manual', costo: 60 },
    { nombre: 'Perforadora', costo: 40 },
    { nombre: 'Cortadora Láser', costo: 50 }
  ];

  for (const tarifa of tarifas) {
    insertTarifa.run(tarifa.nombre, tarifa.costo);
  }

  db.prepare('COMMIT').run();
  console.log('Trenes de trabajo insertados correctamente.');
} catch (error) {
  db.prepare('ROLLBACK').run();
  console.error('Error insertando datos iniciales:', error);
}

db.close();
console.log('Configuración de la base de datos completada.');
