const express = require("express");
const cors = require("cors");
const { db } = require("../db/config");
const fileUpload = require("express-fileupload");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      auth: "/api/auth",
      category: "/api/category",
      users: "/api/users",
      products: "/api/products",
      seeker: "/api/seeker",
      uploads: "/api/uploads",
    };

    this.connectDB();
    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  async connectDB() {
    await db();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio Público
    this.app.use(express.static("public"));

    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.category, require("./../routes/category"));
    this.app.use(this.paths.users, require("../routes/users"));
    this.app.use(this.paths.products, require("../routes/products"));
    this.app.use(this.paths.seeker, require("../routes/seeker"));
    this.app.use(this.paths.uploads, require("./../routes/uploads"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
