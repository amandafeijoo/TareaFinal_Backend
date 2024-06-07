const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },

  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
  },
  tipo: {
    type: String,
    enum: ['yoga', 'pilates', 'boxeo', 'fuerza', 'cardio'],
    required: true,
  },
  horario: {
    type: String,
    required: true,
  },
  dias: {
    type: [String],
    required: true,
  },
  capacidadMaxima: {
    type: Number,
    required: true,
  },
});


const Class = mongoose.model('Class', classSchema);

module.exports = Class;