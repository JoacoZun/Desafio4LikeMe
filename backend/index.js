require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Ruta GET para obtener los posts
app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener los posts:", error);
    res.status(500).send("Error al obtener los posts.");
  }
});

// Ruta POST para crear un nuevo post
app.post("/posts", async (req, res) => {
  const { titulo, img, descripcion, likes } = req.body;
  if (!titulo || !img || !descripcion || likes === undefined) {
    return res.status(400).send("Todos los campos son obligatorios.");
  }
  try {
    const query =
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [titulo, img, descripcion, likes];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear el post:", error);
    res.status(500).send("Error al crear el post.");
  }
});

// Ruta para dar "like" a un post
app.put("/posts/:id/like", async (req, res) => {
  const { id } = req.params; 
  console.log(`Solicitud recibida para dar like al post con ID: ${id}`); 

  try {
    const query = "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *";
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      console.log(`No se encontró un post con ID: ${id}`); 
      return res.status(404).send("Post no encontrado.");
    }

    console.log("Post actualizado correctamente:", result.rows[0]); 
    res.json(result.rows[0]); 
  } catch (error) {
    console.error("Error al intentar dar like:", error);
    res.status(500).send("Error al procesar la solicitud.");
  }
});

// Ruta DELETE para eliminar un post
app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).send("Post no encontrado.");
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar el post:", error);
    res.status(500).send("Error al eliminar el post.");
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
