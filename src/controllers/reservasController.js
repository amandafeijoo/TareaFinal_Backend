const Reserva = require('../models/Reserva');
const User = require('../models/User');
const Class = require('../models/Class');
const Instructor = require('../models/Instructor');
const { sendReservationEmail, sendTelegramNotification, sendSms } = require('./notificationService'); // Asegúrate de que la ruta al archivo notificationService.js sea correcta




  exports.createReserva = async (req, res) => {
    try {
      const { usuarioId, claseId, instructorId, fecha, hora } = req.body;
  
      const usuario = await User.findById(usuarioId).lean();
      const clase = await Class.findById(claseId).lean();
      if (!clase) {
        return res.status(404).json({ error: 'Clase no encontrada' });
  }

      // Comprueba si la clase ya ha alcanzado su capacidad máxima
    const existingReservations = await Reserva.find({ clase: claseId }).countDocuments();
    if (existingReservations >= clase.capacidadMaxima) {
        return res.status(400).json({ error: 'La clase ya ha alcanzado su capacidad máxima' });
  }
  
      let instructor;
      if (instructorId) {
        instructor = await Instructor.findById(instructorId);
      } else {
        // Selecciona un instructor al azar si no se proporciona un instructorId
        const instructores = await Instructor.find();
        instructor = instructores[Math.floor(Math.random() * instructores.length)];
      }
  
      if (!usuario || !clase || !instructor) {
        return res.status(404).json({ error: 'Usuario, clase o instructor no encontrado' });
      }
  
      const reserva = new Reserva({
        usuario: usuarioId,
        clase: claseId,
        instructor: instructor._id,
        fecha,
        hora
      });
  
      await reserva.save();
      await sendReservationEmail(usuario.email, usuario.name, clase.nombre, fecha, hora);
      await sendTelegramNotification(usuario.telegramId, reserva._id);
      await sendSms(usuarioId, usuario.name, clase.nombre, fecha, hora);
    
      res.status(201).json(reserva);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  exports.obtenerReservas = async (req, res) => {
    try {
      const reservas = await Reserva.find().populate('usuario clase instructor');
      res.status(200).json(reservas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.getReserva = async (req, res) => {
      try {
        const { id } = req.params;
        const reserva = await Reserva.findById(id);
        if (!reserva) {
          return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        res.status(200).json(reserva);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };


exports.updateReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId, claseId, instructorId, fecha, hora } = req.body;

    const update = {};
    if (usuarioId) update.usuarioId = usuarioId;
    if (claseId) update.claseId = claseId;
    if (instructorId) update.instructorId = instructorId;
    if (fecha) update.fecha = fecha;
    if (hora) update.hora = hora;

    const reserva = await Reserva.findByIdAndUpdate(id, update, { new: true });
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.status(200).json(reserva);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  
exports.deleteReserva = async (req, res) => {
    try {
      const { id } = req.params;
      const reserva = await Reserva.findByIdAndDelete(id);
      if (!reserva) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }
      res.status(200).json({ message: 'Reserva eliminada', reserva });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  exports.cancelarReserva = async (req, res) => {
    try {
      const { id } = req.params;
      const reserva = await Reserva.findById(id);
  
      if (!reserva) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }
  
      reserva.cancelada = true;
      await reserva.save();
  
      const usuario = await User.findById(reserva.usuario);
      const clase = await Class.findById(reserva.clase); 
        if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      if (!clase) {
        return res.status(404).json({ error: 'Clase no encontrada' });
      }
  
      // Llama a las funciones de notificación 
    await sendReservationEmail(usuario.email, usuario.name, clase.nombre, reserva.fecha, reserva.hora, "Tu reserva ha sido cancelada con éxito.");
    await sendTelegramNotification(usuario.telegramId, "Tu reserva ha sido cancelada con éxito. Los detalles de tu reserva eran: Clase: " + clase.nombre + ", Fecha: " + reserva.fecha + ", Hora: " + reserva.hora + ".");
    await sendSms(usuario._id, usuario.name, clase.nombre, reserva.fecha, reserva.hora, "Tu reserva ha sido cancelada con éxito."); // Cambia esto
  
      res.status(200).json({ message: 'La reserva ha sido cancelada', reserva });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



  exports.getDisponibilidad = async (req, res) => {
    try {
      const { id } = req.params;
  
      const clase = await Class.findById(id);
      if (!clase) {
        return res.status(404).json({ error: 'Clase no encontrada' });
      }
  
      const existingReservations = await Reserva.find({ clase: id }).countDocuments();
  
      res.json({
        capacidadMaxima: clase.capacidadMaxima,
        reservasExistentes: existingReservations,
        disponibilidad: clase.capacidadMaxima - existingReservations
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.clasesDisponibles = async (req, res) => {
    try {
        const clases = await Class.find().lean();

        //  cuenta las reservas existentes y calcula la disponibilidad por clase
        const clasesConDisponibilidad = await Promise.all(clases.map(async (clase) => {
            const reservasExistentes = await Reserva.find({ clase: clase._id }).countDocuments();
            const disponibilidad = clase.capacidadMaxima - reservasExistentes;

            
            return {
                ...clase,
                disponibilidad,
            };
        }));

        res.status(200).json(clasesConDisponibilidad);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.getReservasUsuario = async (req, res) => {
    try {
      const { usuarioId } = req.params;
  
      const usuario = await User.findById(usuarioId);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      const reservas = await Reserva.find({ usuario: usuarioId, cancelada: false }, 'fecha hora _id usuario') // selecciona solo ciertos campos de la reserva
        .populate('clase', 'nombre') 
        .populate('instructor', 'nombre') 
  
      res.json(reservas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };