const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Sirve los archivos estáticos de la carpeta "client"
app.use("/client", express.static(path.join(__dirname, "../client")));

// Sirve el archivo index.html en la ruta raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

// Configura el servidor Socket.IO
io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
