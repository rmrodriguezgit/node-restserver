
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(role = '') => {
    const existeRol = await Role.findOne({ role });
    if (!existeRol) {
        throw new Error(`El rol ${ role } no está registrado en la BD`)
    }
}

const emailExiste = async(email = '') => {
    const existeEmail = await Usuario.findOne({ email });

    if (existeEmail) {
        throw new Error(`El email ${ email } ya está registrado en la BD`)
    }
}

const existeUsuarioPorId = async( id ) => {
    const existeUsuario = await Usuario.findById( id );

    if (!existeUsuario) {
        throw new Error(`El usuario ${ id } no está registrado en la BD`)
    }
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}