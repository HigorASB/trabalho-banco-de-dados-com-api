import { database } from "../../database/index.js";

export async function list(request, reply) {
  try {
    const pedidos = await database
      .select(
        "p.id",
        "c.nome as nome_cliente",
        "c.id as id_cliente",
        "c.cidade as cidade_destino",
        "p.data_pedido",
        "p.valor_total",
        database.raw(
          "JSON_ARRAYAGG(JSON_OBJECT('id_produto', pr.id, 'nome', pr.nome," +
            "'marca', m.nome, 'preco', pr.preco, 'quantidade', ip.quantidade)) AS itens"
        ),
        "p.created_at",
        "p.updated_at",
        "p.deleted_at"
      )
      .from("pedidos as p")
      .leftJoin("itens_pedidos as ip", "p.id", "ip.id_pedido")
      .leftJoin("produtos as pr", "pr.id", "ip.id_produto")
      .leftJoin("marcas as m", "m.id", "pr.id_marca")
      .leftJoin("clientes as c", "c.id", "p.id_cliente")
      .groupBy("p.id");
    return reply.status(200).send({
      message: "Dados consultados com sucesso.",
      data: pedidos,
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
    const pedido = await database
      .select(
        "p.id",
        "c.nome as nome_cliente",
        "c.id as id_cliente",
        "c.cidade as cidade_destino",
        "p.data_pedido",
        "p.valor_total",
        database.raw(
          "JSON_ARRAYAGG(JSON_OBJECT('id_produto', pr.id, 'nome', pr.nome," +
            "'marca', m.nome, 'preco', pr.preco)) AS itens"
        ),
        "p.created_at",
        "p.updated_at",
        "p.deleted_at"
      )
      .from("pedidos as p")
      .leftJoin("itens_pedidos as ip", "p.id", "ip.id_pedido")
      .leftJoin("produtos as pr", "pr.id", "ip.id_produto")
      .leftJoin("marcas as m", "m.id", "pr.id_marca")
      .leftJoin("clientes as c", "c.id", "p.id_cliente")
      .groupBy("p.id")
      .where({ ["p.id"]: id })
      .first();

    if (!pedido) {
      return reply.status(404).send({
        message: "Dados não encontrados.",
        data: [],
        error: true,
      });
    }

    return reply.status(200).send({
      message: "Dados consultados com sucesso.",
      data: pedido,
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

export async function listByCity(request, reply) {
  try {
    const { cidade } = request.params;
    const pedido = await database
      .select(
        "p.id",
        "c.nome as nome_cliente",
        "c.id as id_cliente",
        "c.cidade as cidade_destino",
        "p.data_pedido",
        "p.valor_total",
        database.raw(
          "JSON_ARRAYAGG(JSON_OBJECT('id_produto', pr.id, 'nome', pr.nome," +
            "'marca', m.nome, 'preco', pr.preco)) AS itens"
        ),
        "p.created_at",
        "p.updated_at",
        "p.deleted_at"
      )
      .from("pedidos as p")
      .leftJoin("itens_pedidos as ip", "p.id", "ip.id_pedido")
      .leftJoin("produtos as pr", "pr.id", "ip.id_produto")
      .leftJoin("marcas as m", "m.id", "pr.id_marca")
      .leftJoin("clientes as c", "c.id", "p.id_cliente")
      .groupBy("p.id")
      .whereILike(["c.cidade"], `${cidade}`)
      .first();

    if (!pedido) {
      return reply.status(404).send({
        message: "Dados não encontrados.",
        data: [],
        error: true,
      });
    }

    return reply.status(200).send({
      message: "Dados consultados com sucesso.",
      data: pedido,
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
    const { idCliente, produtos } = request.body;
    if (!idCliente) {
      return reply.status(400).send({
        message: "Você precisa especificar o idCliente do pedido.",
        data: [],
        error: true,
      });
    }
    if (!produtos?.length) {
      return reply.status(400).send({
        message:
          "Você precisa especificar a chave produtos " +
          "contendo os ids e as quantidades de cada produto do pedido.",
        data: [],
        error: true,
      });
    }
    let valorTotal = 0;
    produtos.forEach((produto) => {
      if (
        !produto.id ||
        (!produto.quantidade && produto.quantidade !== 0) ||
        (!produto.preco && produto.preco !== 0)
      ) {
        return reply.status(400).send({
          message:
            "Você precisa especificar a chave produtos " +
            "contendo os ids e as quantidades de cada produto do pedido.",
          data: [],
          error: true,
        });
      }

      valorTotal += produto.quantidade * produto.preco;
    });

    produtos.forEach(async (p) => {
      const produto = await database("produtos").where({ id: p.id });

      if (!produto) {
        return reply.status(404).send({
          message: "Produto não encontrado.",
          data: [],
          error: true,
        });
      }
    });

    const [idPedido] = await database("pedidos").insert({
      data_pedido: database.fn.now(),
      id_cliente: idCliente,
      valor_total: valorTotal,
    });

    produtos.forEach(async (produto) => {
      await database("itens_pedidos").insert({
        id_pedido: idPedido,
        id_produto: produto.id,
        quantidade: produto.quantidade,
        preco_unitario: produto.preco,
      });
    });

    return reply.status(200).send({
      message: "Dados criados com sucesso.",
      data: {
        id: idPedido,
        id_cliente: idCliente,
        valor_total: valorTotal,
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
