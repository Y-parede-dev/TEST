
const router = require('express').Router({ mergeParams: true });
const auth = require("../middlleware/auth");
const user_ctrl = require('../controleurs/user');
const multer = require('../middlleware/multer-config');

router.post('/signup', user_ctrl.signup); // Inscription

router.get('/account', user_ctrl.getAllAccount); //get tous les comptes


router.get('/account/:id', user_ctrl.getOneAccount); //get un comptes

router.delete('/account/:id', auth, user_ctrl.deleteAccount); // delete 1 compte
  
router.put('/account/:id', auth, multer , user_ctrl.modifyAccount); //modifier 1 compt

router.post('/login', user_ctrl.login); // connection

module.exports = router; 