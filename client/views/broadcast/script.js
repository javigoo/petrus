const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

// Añade aquí la lógica para capturar video y configurar WebRTC y Socket.IO
const videoElement = document.createElement("video");
videoElement.setAttribute("autoplay", "");
videoElement.setAttribute("muted", "");
videoElement.setAttribute("playsinline", "");
videoElement.setAttribute("controls", ""); 
document.body.appendChild(videoElement);

async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
      },
    });
    videoElement.srcObject = stream;
  } catch (err) {
    console.error("Error al acceder a la cámara: ", err);
  }
}

startVideo();

const socket = io();

socket.on("connect", () => {
  console.log("Conectado al servidor");
});

socket.on("disconnect", () => {
  console.log("Desconectado del servidor");
});
