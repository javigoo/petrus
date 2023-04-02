const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

const videoElement = document.createElement("video");
videoElement.setAttribute("autoplay", "autoplay");
videoElement.setAttribute("muted", "muted");
videoElement.setAttribute("playsinline", "playsinline");
videoElement.setAttribute("controls", "controls");
document.body.appendChild(videoElement);

async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
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
  socket.emit("join", "broadcaster");
});

const peerConnections = {};

socket.on("otherPeer", async (otherSocketId) => {
  const peerConnection = new RTCPeerConnection();
  peerConnections[otherSocketId] = peerConnection;

  peerConnection.onicecandidate = (e) => {
    if (e.candidate) {
      socket.emit("signal", { targetSocketId: otherSocketId, candidate: e.candidate, role: "monitor" });
    }
  };

  videoElement.srcObject.getTracks().forEach((track) => {
    peerConnection.addTrack(track, videoElement.srcObject);
  });

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  socket.emit("signal", { targetSocketId: otherSocketId, description: peerConnection.localDescription, role: "monitor" });
});

socket.on("signal", async (data) => {
  const peerConnection = peerConnections[data.senderSocketId];
  if (data.candidate) {
    await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
  } else if (data.description) {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.description));
    if (data.description.type === "offer") {
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("signal", { targetSocketId: data.senderSocketId, description: peerConnection.localDescription, role: "monitor" });
    }
  }
});

socket.on("disconnect", () => {
  console.log("Desconectado del servidor");
});

videoElement.onloadedmetadata = () => {
  const videoStream = new MediaStream([videoElement.srcObject.getVideoTracks()[0]]);
  const mediaRecorder = new MediaRecorder(videoStream, { mimeType: "video/webm" });
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      socket.emit("broadcastVideo", { senderId: socket.id, videoData: e.data });
    }
  };
  mediaRecorder.start(100); // Enviar cada 100 ms
};