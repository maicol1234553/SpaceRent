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

db.connect(err => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
    return;
  }
  console.log("Conectado a MySQL");
});

// Servir archivos estáticos desde "frontend"
app.use(express.static(path.join(__dirname, "../frontend")));

// Ruta principal que carga index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
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

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

//inicio sesion 

app.post("/iniciosesion", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM usuarios WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, results) => {
      if (err) {
          console.error("Error en la consulta:", err);
          return res.status(500).json({ success: false, message: "Error interno" });
      }
      if (results.length > 0) {
          res.json({ success: true, message: "Credenciales correctas"}); // Redirige si las credenciales son correctas
      } else {
          res.json({ success: false, message: "Credenciales incorrectas" });
      }
  });
});
