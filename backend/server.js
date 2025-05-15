const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
app.use(express.json());
app.use(cors());

// Crear carpeta "uploads" si no existe
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Servir archivos estáticos desde /uploads
app.use("/uploads", express.static(uploadPath));

// Conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "spacerent"
});

db.connect(err => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err);
    process.exit(1);
  }
  console.log("✅ Conectado a MySQL");
});

// Servir frontend
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Verificar conexión a DB
app.get("/check-db", (req, res) => {
  db.query("SELECT 1", (err) => {
    if (err) {
      console.error("❌ Error al verificar la base de datos:", err);
      return res.status(500).json({ success: false, message: "Error de conexión con la base de datos" });
    }
    res.json({ success: true, message: "Conexión con la base de datos exitosa" });
  });
});

// Registro de usuarios
app.post("/registro", (req, res) => {
  const { nombre, email, password, rol } = req.body;
  const sql = "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)";

  db.query(sql, [nombre, email, password, rol], (err) => {
    if (err) {
      console.error("❌ Error en el registro:", err);
      return res.status(500).json({ message: "Error al registrar usuario" });
    }
    res.json({ message: "✅ Usuario registrado exitosamente" });
  });
});

// Inicio de sesión
app.post("/iniciosesion", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM usuarios WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("❌ Error en la consulta:", err);
      return res.status(500).json({ success: false, message: "Error interno" });
    }

    if (results.length > 0) {
      const usuario = results[0];
      res.json({
        success: true,
        message: "✅ Credenciales correctas",
        rol: usuario.rol,
        nombre: usuario.nombre,
        id: usuario.id
      });
    } else {
      res.status(401).json({
        success: false,
        message: "❌ Credenciales incorrectas"
      });
    }
  });
});

// Subir propiedad con imagen
// Subir propiedad con imagen
// Subir propiedad con imagen
app.post("/subir-propiedad", upload.single("imagen"), (req, res) => {
  const { titulo, descripcion, direccion, precio, id_vendedor } = req.body;

if (!req.file) {
  return res.status(400).json({ success: false, message: "❌ Imagen no subida" });
}

const imagen_url = `/uploads/${req.file.filename}`;

// 👇 Agregamos direccion al SQL y los valores
const sql = "INSERT INTO propiedades (titulo, descripcion, direccion, precio, imagen_url, id_vendedor) VALUES (?, ?, ?, ?, ?, ?)";

db.query(sql, [titulo, descripcion, direccion, precio, imagen_url, id_vendedor], (err) => {
  if (err) {
    console.error("❌ Error al subir propiedad:", err);
    return res.status(500).json({ success: false, message: "Error al guardar propiedad" });
  }

  console.log("✅ Propiedad subida:", { titulo, descripcion, direccion, precio, id_vendedor, imagen_url });
  res.json({ success: true, message: "✅ Propiedad publicada exitosamente" });
});
});



// Obtener propiedades
app.get("/propiedades", (req, res) => {
  db.query("SELECT * FROM propiedades", (err, results) => {
    if (err) {
      console.error("❌ Error al obtener propiedades:", err);
      return res.status(500).json({ success: false, message: "Error al consultar propiedades" });
    }
    res.json(results);
  });
});
app.get('/propiedad/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM propiedades WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ error: "Error en la consulta" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }
    console.log('lero', results);
    res.json(results[0]);
  });
});


// Iniciar servidor
app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});