const bcryptjs = require("bcryptjs");
const { response } = require("express");

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const Usuario = require('../models/usuario');




const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        // verificar si email existe
           const usuario = await Usuario.findOne({ email });
           if ( !usuario ) {
               return res.status(400).json({
                   msg: 'Usuario/Password no son correctos - email'
               });
           }
        // verificar si esta activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - estado:false'
            });
        }
        //verificar contras
        const validPassword = bcryptjs.compareSync( password, usuario.password)
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - password'
            });
        }
        //generar jwt
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const googleSignIn = async ( req, res = response) => {

    const { id_token } = req.body;

    try {
        const { email, nombre, img } = await googleVerify( id_token );
        
        let usuario = await Usuario.findOne({ email });

        if ( !usuario ) {
            // tengo que crearlo
            const data = {
                nombre,
                email,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }
        // Si el usuario en DB
        if ( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }
        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });

    } catch (error) {

        res.status(400).json({
            ok: false,
            msg: 'Token de Google no es válido'
        })
    }

   
}


module.exports = {
    login,
    googleSignIn
}