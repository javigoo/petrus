const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configura EJS como el motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Sirve los archivos estáticos de la carpeta "client"
app.use(express.static(path.join(__dirname, "../client")));

// Sirve las páginas utilizando EJS
app.get("/", (req, res) => {
  res.render("layout", { content: "main" });
});

app.get("/broadcast", (req, res) => {
  res.render("layout", { content: "broadcast" });
});

app.get("/canvas", (req, res) => {
  res.render("layout", { content: "canvas" });
});

app.get("/monitor", (req, res) => {
  res.render("layout", { content: "monitor" });
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
