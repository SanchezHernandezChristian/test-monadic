const mongoose = require('mongoose')
const usuarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  estatus: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('User', usuarioSchema);
