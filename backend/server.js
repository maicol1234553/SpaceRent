const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "spacerent"
});

// Verificación de la conexión a la base de datos
db.connect(err => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
    // Si hay error en la conexión, cerramos el servidor
    process.exit(1); // Esto terminará el proceso si la conexión falla
  }
  console.log("Conectado a MySQL");
});

// Servir archivos estáticos desde "frontend"
app.use(express.static(path.join(__dirname, "../frontend")));

// Ruta principal que carga index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Ruta para verificar si la base de datos está conectada
app.get("/check-db", (req, res) => {
  db.query("SELECT 1", (err, results) => {
    if (err) {
      console.error("No se pudo verificar la conexión con la base de datos:", err);
      return res.status(500).json({ success: false, message: "Error de conexión con la base de datos" });
    }
    res.json({ success: true, message: "Conexión con la base de datos exitosa" });
  });
});

// Ruta para registrar usuarios
app.post("/registro", (req, res) => {
  const { nombre, email, password, rol } = req.body;
  const sql = "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)";
  
  db.query(sql, [nombre, email, password, rol], (err, result) => {
    if (err) {
      console.error("Error en el registro:", err);
      return res.status(500).json({ message: "Error al registrar usuario" });
    }
    res.json({ message: "Usuario registrado exitosamente" });
  });
});

// Ruta para el inicio de sesión
app.post("/iniciosesion", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM usuarios WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, results) => {
      if (err) {
          console.error("Error en la consulta:", err);
          return res.status(500).json({ success: false, message: "Error interno" });
      }
      if (results.length > 0) {
        const usuario = results[0];
        res.json({
            success: true,
            message: "Credenciales correctas",
            rol: usuario.rol,
            nombre: usuario.nombre
        });
    }
    
  });
});

 
// ruta para propiedades 
app.post("/subir-propiedad", (req, res) => {
  const { titulo, descripcion, imagen, vendedor_email } = req.body;
  const sql = "INSERT INTO propiedades (titulo, descripcion, imagen_url, vendedor_email) VALUES (?, ?, ?, ?)";
  
  db.query(sql, [titulo, descripcion, imagen, vendedor_email], (err, result) => {
    if (err) {
      console.error("Error al subir propiedad:", err);
      return res.status(500).json({ success: false, message: "Error al guardar propiedad" });
    }
    res.json({ success: true, message: "Propiedad publicada exitosamente" });
  });
});

// ✅ Ruta para obtener todas las propiedades
app.get("/propiedades", (req, res) => {
  db.query("SELECT * FROM propiedades", (err, results) => {
    if (err) {
      console.error("Error al obtener propiedades:", err);
      return res.status(500).json({ success: false, message: "Error al consultar propiedades" });
    }
    res.json(results);
  });
});



// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
