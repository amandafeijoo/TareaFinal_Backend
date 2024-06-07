const Class = require('../models/Class');
const Instructor = require('../models/Instructor');

exports.createClase = async (req, res) => {
  try {
    const clase = new Class(req.body);
    await clase.save();
    res.status(201).json(clase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getClase = async (req, res) => {
    try {
        const { id } = req.params;
        const clase = await Class.findById(id);
        if (!clase) {
            return res.status(404).json({ error: 'Clase no encontrada' });
        }
        res.status(200).json(clase);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getClases = async (req, res) => {
    try {
        const clases = await Class.find();
        res.status(200).json(clases);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteClase = async (req, res) => {
    try {
      const { id } = req.params;
      const clase = await Class.findById(id);
      if (!clase) {
        return res.status(404).json({ error: 'Clase no encontrada' });
      }
      await Class.deleteOne({ _id: id });
      res.status(200).json({ message: 'Clase eliminada con éxito' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  
exports.updateClase = async (req, res) => {
    try {
      const { id } = req.params;
      const clase = await Class.findByIdAndUpdate(id, req.body, { new: true });
      if (!clase) {
        return res.status(404).json({ error: 'Clase no encontrada' });
      }
      res.status(200).json(clase);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

