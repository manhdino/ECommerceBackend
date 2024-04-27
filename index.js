const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();
const testConnectDB = require("./src/config/connectDB");
testConnectDB();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server is running  at PORT ${PORT}`);
});
