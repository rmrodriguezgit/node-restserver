const express = require("express");
const cors = require("cors");
const { dbconnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = "/api/usuarios";
    this.authPath = "/api/auth";

    // Conectar a base de datos
    this.conectarDB();

    //Midlewares
    this.middlewares();
    //Rutas de mi app
    this.routes();
  }

  async conectarDB() {
    await dbconnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // lectura y parseo del body
    this.app.use(express.json());
    //Directorio Público
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.authPath, require("../routes/auth"));
    this.app.use(this.usuariosPath, require("../routes/usuarios"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor conectado en puerto", this.port);
    });
  }
}

module.exports = Server;
