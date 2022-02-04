const mongoose = require('mongoose');


const dbconnection = async() => {

     try {
         
         await mongoose.connect( process.env.MONGODB_ATLAS);

         console.log('Base de datos onlinea');

     } catch (error) {
         console.log(error);
         throw new Error('Error al a hora de iniciar la base de datos');
     }
}


module.exports = {
    dbconnection
}