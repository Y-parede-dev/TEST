const express = require('express');
const router = express.Router();
const postCtrl = require('../controleurs/post');
const multer = require('../middlleware/multer-config-post');

const auth = require('../middlleware/auth');

router.post('/', auth, multer, postCtrl.newPost);
router.get('/', postCtrl.getAllPost);
router.get('/:id/like', postCtrl.getLikePost);
router.get('/:id', postCtrl.getOneUserPost);
router.put('/:id', auth, multer, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deletePost);


module.exports = router;