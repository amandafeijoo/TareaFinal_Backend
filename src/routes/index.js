const express = require('express');
const reservasRoutes = require('./reservas');
const userRoutes = require('./userRoutes');
const router = express.Router();

router.use('/users', userRoutes);
router.use('/', reservasRoutes);


module.exports = router;