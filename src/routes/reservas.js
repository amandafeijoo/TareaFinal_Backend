const express = require('express');
const reservasController = require('../controllers/reservasController');
const instructoresController = require('../controllers/instructoresController');
const clasesController = require('../controllers/clasesController');
const freeClassController = require('../controllers/freeClassController');
const { authenticate } = require('../middleware/auth');


const router = express.Router();

router.post('/instructores', authenticate, instructoresController.createInstructor);
router.get('/instructores', authenticate, instructoresController.getInstructors);
router.get('/instructores/:id', authenticate, instructoresController.getInstructor);
router.put('/instructores/:id', authenticate, instructoresController.updateInstructor);
router.delete('/instructores/:id', authenticate, instructoresController.deleteInstructor);

// Rutas para clases

router.post('/clases', authenticate, clasesController.createClase);
router.get('/clases', authenticate, clasesController.getClases);
router.get('/clases/:id', authenticate, clasesController.getClase);
router.put('/clases/:id', authenticate, clasesController.updateClase);
router.delete('/clases/:id', authenticate, clasesController.deleteClase);

// Rutas para obtener la disponibilidad de una clase
router.get('/clases/:id/disponibilidad', reservasController.getDisponibilidad);
router.get('/clasesDisponibles', reservasController.clasesDisponibles);

// Rutas para clases gratuitas 
router.post('/free-class-user', freeClassController.createFreeClass);
router.get('/free-class-user/:id', freeClassController.getFreeClass);
router.put('/free-class-user/:id', freeClassController.updateFreeClass);
router.delete('/free-class-user/:id', freeClassController.deleteFreeClass);


// Rutas para Reservas 

router.get('/users/:usuarioId/reservas', reservasController.getReservasUsuario);
router.get('/', reservasController.obtenerReservas);
router.put('/reservas/cancelar/:id', reservasController.cancelarReserva);

// Ruta para crear una nueva reserva
router.post('/', reservasController.createReserva);

// Ruta para obtener la información de una reserva
router.get('/:id', reservasController.getReserva);
router.put('/:id', reservasController.updateReserva);
router.delete('/:id', reservasController.deleteReserva);

module.exports = router;