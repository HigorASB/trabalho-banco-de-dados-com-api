import { database } from "../../database/index.js";

export async function list(request, reply) {
  try {
    const produtos = await database("produtos").select();
    return reply.status(200).send({
      message: "Dados consultados com sucesso.",
      data: produtos,
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
    const produto = await database("produtos").where({ id: id }).first();

    if (!produto) {
      return reply.status(404).send({
        message: "Dados não encontrados.",
        data: produto,
        error: true,
      });
    }

    return reply.status(200).send({
      message: "Dados consultados com sucesso.",
      data: produto,
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

export async function create(request, reply) {
  try {
    const { nome, preco, estoque, idMarca } = request.body;
    if (!nome) {
      return reply.status(400).send({
        message: "Você precisa especificar o nome do produto.",
        data: [],
        error: true,
      });
    }
    if (!preco) {
      return reply.status(400).send({
        message: "Você precisa especificar o preço do produto.",
        data: [],
        error: true,
      });
    }
    if (!estoque) {
      return reply.status(400).send({
        message: "Você precisa especificar o estoque do produto.",
        data: [],
        error: true,
      });
    }
    if (!idMarca) {
      return reply.status(400).send({
        message: "Você precisa especificar o idMarca do produto.",
        data: [],
        error: true,
      });
    }

    const produto = await database("produtos").where({ nome: nome }).first();

    if (produto) {
      return reply.status(409).send({
        message: "Dados existentes.",
        data: [],
        error: true,
      });
    }

    const [id] = await database("produtos").insert({
      nome: nome,
      preco: preco,
      estoque: estoque,
      id_marca: idMarca,
    });

    return reply.status(200).send({
      message: "Dados criados com sucesso.",
      data: {
        id,
        nome,
        preco,
        estoque,
        id_marca: idMarca,
      },
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
