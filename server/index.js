const express = require("express");
const https = require("https");
const socketIO = require("socket.io");
const path = require("path");
const fs = require("fs");

const app = express();

// Lee los archivos de certificado
const privateKey = fs.readFileSync('certs/server-key.pem', 'utf8');
const certificate = fs.readFileSync('certs/server-cert.pem', 'utf8');
const ca = fs.readFileSync('certs/server-csr.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

const server = https.createServer(credentials, app);
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

const peers = { broadcasters: {}, monitors: {} };

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("join", (role) => {
    if (!peers[role]) {
      peers[role] = {};
    }
    peers[role][socket.id] = socket;
    if (role === "broadcaster") {
      for (const monitorId in peers.monitors) {
        socket.emit("otherPeer", monitorId);
        peers.monitors[monitorId].emit("otherPeer", socket.id);
      }
    }
  });

  socket.on("signal", (data) => {
    const otherPeer = peers[data.role][data.targetSocketId];
    if (otherPeer) {
      otherPeer.emit("signal", { ...data, senderSocketId: socket.id });
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
    if (peers.broadcasters[socket.id]) delete peers.broadcasters[socket.id];
    if (peers.monitors[socket.id]) delete peers.monitors[socket.id];
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Servidor escuchando en https://localhost:${PORT}`);
});
