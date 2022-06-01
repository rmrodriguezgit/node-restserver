const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { generarJWT } = require("../helpers/generar-jwt");
const Usuario = require('../models/usuario');




const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        // veirficar si email existe
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
        })
    }
    

}



module.exports = {
    login
}