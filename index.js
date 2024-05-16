const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const PORT = process.env.PORT || 3000;
const app = express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Open API Coding Blog ",
      version: "1.0.11",
    },
    servers: [
      {
        url: "https://ecommercebackend-953d.up.railway.app/api",
      },
      {
        url: "http://localhost:3000/api",
      },
    ],
  },
  apis: ["./swagger/*.yaml"],
};

const openapiSpecification = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

routes(app);

app.use((req, res) => {
  return res.status(500).send({
    success: false,
    status: 500,
    message: "Internal Server Error",
  });
});
app.listen(PORT, () => {
  console.log(`Server is running  at http://localhost:${PORT}`);
});
