const socket = io();
const videosContainer = document.getElementById("videosContainer");
const remoteVideo = document.createElement("video");
remoteVideo.setAttribute("autoplay", "autoplay");
remoteVideo.setAttribute("playsinline", "playsinline");
remoteVideo.setAttribute("controls", "controls");
videosContainer.appendChild(remoteVideo);

socket.on("connect", () => {
  console.log("Conectado al servidor");
  socket.emit("join", "monitor");
});

socket.on("otherPeer", async (otherSocketId) => {
  const peerConnection = new RTCPeerConnection();

  peerConnection.onicecandidate = (e) => {
    if (e.candidate) {
      socket.emit("signal", { targetSocketId: otherSocketId, candidate: e.candidate });
    }
  };

  peerConnection.ontrack = (e) => {
    remoteVideo.srcObject = e.streams[0];
  };

  socket.on("signal", async (data) => {
    if (data.candidate) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    } else if (data.description) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.description));
      if (data.description.type === "offer") {
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit("signal", { targetSocketId: data.senderSocketId, description: peerConnection.localDescription, role: "broadcaster" });
      }
    }
  });
});

socket.on("disconnect", () => {
  console.log("Desconectado del servidor");
});
