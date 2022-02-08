const {response, request} = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async(req = request, res = response) => {
    
    const { limite = 5, desde = 0 } = req.query; 
    const query = { estado: true};

    const [ total, usuarios ] = await Promise.all([
      Usuario.countDocuments( query ),
      Usuario.find( query )
             .skip( Number(desde) )
             .limit( Number(limite) )
    ]);

      res.json({
        total,
        usuarios
      });
    }


const usuariosPost = async(req, res = response) => {

    const {nombre, email, password, role} = req.body;
    const usuario = new Usuario( { nombre, email, password, role } );

    // Verificar si el correo existe
    // const existeEmail = await Usuario.findOne({ email });
    // if ( existeEmail ) {
    //   return res.status(400).json({
    //       msg: 'Ese correo ya está registrado'
    //   })
    // }
    // Encriptar la contraseña
    usuario.password = bcrypt.hashSync(password, 10);
    // Guardar en BD
    await usuario.save();

    res.json({
      msg: "post API - Controlador",
      usuario
    });
  }

  const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const {_id, password, google, email,  ...resto } = req.body;

    //TODO validar contra base de datos
    if ( password ) {
         resto.password = bcrypt.hashSync(password, 10);
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json({
      usuario
    });
  }


const usuariosDelete = async (req, res = response) => {

  const { id } = req.params;

  //const uid = req.uid;
  // Borrado físico
  //const usuario = await Usuario.findByIdAndDelete( id );

  const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );
  const usuarioAutenticado = req.usuario; 

    res.json({
      usuario, 
      usuarioAutenticado
    });
  }

const usuariosPatch = (req, res) => {
    res.json({
      msg: "patch API - Controlador",
    });
  }


  module.exports = {
      usuariosGet,
      usuariosPut,
      usuariosPost,
      usuariosDelete,
      usuariosPatch
  }