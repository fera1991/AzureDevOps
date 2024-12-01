require("dotenv").config(); // Cargar las variables de entorno desde el archivo .env
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");  // Importa el middleware CORS

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());  // Habilita CORS para todas las solicitudes
app.use(express.json());  // Para parsear los JSON en las solicitudes

// Configuración de Cosmos DB para MongoDB usando las variables de entorno
const mongoUrl = process.env.COSMOS_DB_ENDPOINT;
const client = new MongoClient(mongoUrl);
const dbName = process.env.COSMOS_DB_COLLECTION;
let messagesCollection;

// Conectar a Cosmos DB usando la API de MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Conexión exitosa a Cosmos DB");
    const db = client.db(dbName);
    messagesCollection = db.collection("Messages"); // Cambia el nombre de la colección si es necesario
  } catch (error) {
    console.error("Error de conexión:", error);
  }
}

connectToDatabase();

// Ruta para obtener mensajes
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await messagesCollection.find({}).toArray();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
});

// Ruta para agregar un mensaje
app.post("/api/messages", async (req, res) => {
  const { message } = req.body;
  const id = Date.now().toString();  // ID único basado en timestamp
  try {
    const newMessage = { _id: id, message };
    await messagesCollection.insertOne(newMessage);
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar mensaje" });
  }
});

// Nuevo endpoint: Eliminar un mensaje por ID
app.delete("/api/messages/:id", async (req, res) => {
  const { id } = req.params;  // Obtener el ID del mensaje desde los parámetros de la URL
  try {
    const result = await messagesCollection.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Mensaje no encontrado" });
    }
    res.json({ message: "Mensaje eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar mensaje" });
  }
});

let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = { app, server, client }; // Exportar el servidor y el cliente de la base de datos para las pruebas
