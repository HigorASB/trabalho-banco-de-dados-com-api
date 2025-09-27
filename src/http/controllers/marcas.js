import { database } from "../../database/index.js";

export async function list(request, reply) {
  try {
    const marcas = await database("marcas").select();
    return reply.status(200).send({
      message: "Dados consultados com sucesso.",
      data: marcas,
      error: false,
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      message: "Ocorreu um erro interno.",
      data: [],
      error: true,
    });
  }
}

export async function listById(request, reply) {
  try {
    const { id } = request.params;
    const marca = await database("marcas").where({ id: id }).first();

    if (!marca) {
      return reply.status(404).send({
        message: "Dados não encontrados.",
        data: [],
        error: true,
      });
    }

    return reply.status(200).send({
      message: "Dados consultados com sucesso.",
      data: marca,
      error: false,
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      message: "Ocorreu um erro interno.",
      data: [],
      error: true,
    });
  }
}

export async function deleteById(request, reply) {
  try {
    const { id } = request.params;
    const marca = await database("marcas").where({ id: id }).del();

    if (!marca) {
      return reply.status(404).send({
        message: "Dados não encontrados.",
        data: [],
        error: true,
      });
    }

    return reply.status(200).send({
      message: "Dados deletados com sucesso.",
      data: [],
      error: false,
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      message: "Ocorreu um erro interno.",
      data: [],
      error: true,
    });
  }
}
