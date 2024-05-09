const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const userRouter = require("./src/routes/api");
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running  at http://localhost:${PORT}`);
});
