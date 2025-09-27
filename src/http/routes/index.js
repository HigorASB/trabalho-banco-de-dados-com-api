export const routes = async (app) => {
  app.get("/", (request, reply) => {
    return reply.status(200).send({ message: "API ok!" });
  });
};
