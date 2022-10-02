const usuarioSchema = require('../models/usuario.model')

exports.findAll = function (req, res) {
  usuarioSchema
    .find()
    .then((data) => { res.json(data) })
    .catch((error) => res.status(404).json({ message: error }))

};

exports.create = function (req, res) {
  if (req.body.nombre == '') return res.status(404)
  const newUser = usuarioSchema(req.body);
  newUser.save()
    .then((data) => res.json(data))
    .catch((error) => res.status(404).json({ message: error }))
};

exports.update = function (req, res) {
  if (req.body.nombre == '') res.status(404)
  const { id } = req.params
  const { nombre, fecha, estatus } = req.body
  usuarioSchema
    .updateOne({ _id: id }, { $set: { nombre, fecha, estatus } })
    .then((data) => res.json(data))
    .catch((error) => res.status(404).json({ message: error }))
};


exports.delete = function (req, res) {
  const { id } = req.params
  usuarioSchema
    .remove({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.status(404).json({ message: error }))
};

exports.findByStatus = function (req, res) {
  const { estatus } = req.params
  usuarioSchema
    .find({ estatus: estatus })
    .then((data) => { res.json(data) })
    .catch((error) => res.status(404).json({ message: error }))

};

