// eslint-disable-next-line @typescript-eslint/no-require-imports
const http = require("http");
const WebSocket = require("ws");

const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Agnos WebSocket Server is running\n');
});

const wss = new WebSocket.Server({ server });

console.log(`WebSocket and HTTP server running on port ${port}`);

const clients = new Set();

wss.on("connection", (socket) => {
  console.log("Client connected");

  socket.role = "unknown";
  socket.inactiveTimer = null;

  clients.add(socket);

  socket.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      console.log("Message received, type:", data.type);

      if (data.type === "staff:join") {
        socket.role = "staff";

        const isPatientActive = Array.from(clients).some(
          (client) =>
            client.role === "patient" &&
            client.readyState === WebSocket.OPEN
        );

        if (isPatientActive) {
          socket.send(
            JSON.stringify({
              type: "patient:status",
              status: "Inactive",
            })
          );
        }
      }

      else if (data.type === "patient:join") {
        socket.role = "patient";

        broadcastToStaff({
          type: "patient:status",
          status: "Inactive",
        });
      }

      else if (data.type === "patient:typing") {
        broadcastToStaff(data);

        broadcastToStaff({
          type: "patient:status",
          status: "Active",
        });

        clearTimeout(socket.inactiveTimer);

        socket.inactiveTimer = setTimeout(() => {
          broadcastToStaff({
            type: "patient:status",
            status: "Inactive",
          });
        }, 2000);
      }

      else if (data.type === "patient:submitted") {
        clearTimeout(socket.inactiveTimer);

        broadcastToStaff(data);

        broadcastToStaff({
          type: "patient:status",
          status: "Submitted",
        });
      } else {
        console.warn("Unknown message type:", data.type);
      }
    } catch (error) {
      console.error("Invalid message received:", error);
      socket.send(
        JSON.stringify({
          type: "error",
          message: "Invalid message received",
        })
      );
    }
  });

  socket.on("close", () => {
    console.log("Client disconnected");

    clearTimeout(socket.inactiveTimer);

    clients.delete(socket);

    if (socket.role === "patient") {
      broadcastToStaff({
        type: "patient:status",
        status: "Disconnected / Inactive",
      });
    }
  });

  function broadcastToStaff(messageData) {
    clients.forEach((client) => {
      if (
        client.role === "staff" &&
        client.readyState === WebSocket.OPEN
      ) {
        client.send(JSON.stringify(messageData));
      }
    });
  }
});
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
