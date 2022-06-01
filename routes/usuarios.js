const { Router } = require('express');
const { check } = require('express-validator');
// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const { 
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole
} = require('../middlewares');


const { usuariosGet, 
        usuariosPatch, 
        usuariosPost, 
        usuariosPut, 
        usuariosDelete 
} = require('../controllers/usuarios');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');






const router = Router();

router.get("/", usuariosGet);

router.put("/:id",[
   check('id', 'No es un ID válido').isMongoId(),
   check('id').custom( existeUsuarioPorId ),
   check('role').custom( esRoleValido ),
   validarCampos
] ,usuariosPut);

router.post("/", [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser mayor a 6 caracteres').isLength({ min: 6 }),
    check('email', 'El correo no es válido').isEmail(),
    //check('role', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('role').custom( esRoleValido ),
    check('email').custom( emailExiste ),
    validarCampos
   ] ,usuariosPost);

  router.delete("/:id",[
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'NOSE_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
  ] ,usuariosDelete);

  router.patch("/", usuariosPatch);













module.exports = router;