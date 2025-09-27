import {
  deleteById as deleteMarcaById,
  list as listMarcas,
  listById as listMarcaById,
} from "../controllers/marcas.js";

import {
  list as listProdutos,
  listById as listProdutoById,
  create as createProduto,
} from "../controllers/produtos.js";

import {
  list as listClientes,
  listById as listClienteById,
  create as createCliente,
} from "../controllers/clientes.js";

import {
  list as listPedidos,
  listById as listPedidoById,
  listByCity as listPedidoByCity,
  create as createPedido,
} from "../controllers/pedidos.js";

export const routes = async (app) => {
  app.get("/marcas", listMarcas);
  app.get("/marcas/:id", listMarcaById);
  app.delete("/marcas/:id", deleteMarcaById);

  app.get("/produtos", listProdutos);
  app.get("/produtos/:id", listProdutoById);
  app.post("/produtos", createProduto);

  app.get("/clientes", listClientes);
  app.get("/clientes/:id", listClienteById);
  app.post("/clientes", createCliente);

  app.get("/pedidos", listPedidos);
  app.get("/pedidos/:id", listPedidoById);
  app.get("/pedidos/cidade/:cidade", listPedidoByCity);
  app.post("/pedidos", createPedido);
};
