const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./database/connect');
const bcrypt = require('bcryptjs');


// node setup.js en el terminal para ejecutar este script//

connectDB();



const newUser = new User({
  nombre: 'Admin',
  correo: 'fitlife.uem@gmail.com',
  password: 'fitlifegym23',
  telefono: '+15513776949',
  suscripcion: 'Abono Gold',
  isAdmin: true
});

bcrypt.hash('fitlifegym23', 10, (err, hashedPassword) => {
  if (err) {
    console.log(err);
    return;
  }

  newUser.password = hashedPassword;

newUser.save()
  .then(() => {
    console.log('Nuevo usuario administrador creado con éxito');
  })
  .catch(err => {
    console.log(err);
  });
});


// User.findOneAndDelete({ correo: 'fitlife.uem@gmail.com' })
//   .then(user => {
//     if (user) {
//       console.log('Usuario administrador eliminado con éxito', user);
//     } else {
//       console.log('Usuario administrador no encontrado');
//     }
//   })
//   .catch(err => {
//     console.log(err);
//   });


// User.findOne({ correo: 'fitlife.uem@gmail.com' })
//   .then(user => {
//     if (user) {
//       console.log('Usuario administrador encontrado:', user);
//     } else {
//       console.log('Usuario administrador no encontrado');
//     }
//   })
//   .catch(err => {
//     console.log(err);
//   });


