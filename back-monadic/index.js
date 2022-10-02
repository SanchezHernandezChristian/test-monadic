require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGO_DB_CONNECTION)
  .then(() => console.log("Connect MongoDB Atlas"))
  .catch((error) => console.error(error))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const usuarioService = require('./src/routes/usuario.routes');
app.use('/api', usuarioService);

app.listen(port, function () {
  console.log('listening on ' + port);
});
