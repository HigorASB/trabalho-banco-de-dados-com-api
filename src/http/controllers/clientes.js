import { database } from "../../database/index.js";

export async function list(request, reply) {
  try {
    const produtos = await database("clientes").select();
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
    const cliente = await database("clientes").where({ id: id }).first();

    if (!cliente) {
      return reply.status(404).send({
        message: "Dados não encontrados.",
        data: cliente,
        error: true,
      });
    }

    return reply.status(200).send({
      message: "Dados consultados com sucesso.",
      data: cliente,
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
    const { nome, email, cidade } = request.body;
    if (!nome) {
      return reply.status(400).send({
        message: "Você precisa especificar o nome do cliente.",
        data: [],
        error: true,
      });
    }
    if (!email) {
      return reply.status(400).send({
        message: "Você precisa especificar o email do cliente.",
        data: [],
        error: true,
      });
    }
    if (!cidade) {
      return reply.status(400).send({
        message: "Você precisa especificar a cidade do cliente.",
        data: [],
        error: true,
      });
    }

    const cliente = await database("clientes")
      .where({ nome: nome })
      .orWhere({ email: email })
      .first();

    if (cliente) {
      return reply.status(409).send({
        message: "Dados existentes.",
        data: [],
        error: true,
      });
    }

    const [id] = await database("clientes").insert({
      nome: nome,
      email: email,
      cidade: cidade,
    });

    return reply.status(200).send({
      message: "Dados criados com sucesso.",
      data: {
        id,
        nome,
        email,
        cidade,
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
