import { app } from "./app.js";
import cors from "@fastify/cors";

const PORT = process.env.PORT || 3333;

async function server() {
  app.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app
    .listen({
      host: "0.0.0.0",
      port: PORT,
    })
    .then(() => {
      console.log(`HTTP Server is running on Port: ${PORT}`);
    });
}

server();
