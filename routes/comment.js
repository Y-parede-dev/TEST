const express = require("express");
const router = express.Router();
const commentCtrl = require("../controleurs/comment");
const auth = require('../middlleware/auth');

router.post('/', auth, commentCtrl.postComment);
router.get('/',commentCtrl.getComment);
router.get('/:id', commentCtrl.getCommentOnePost);
router.put('/:id', auth, commentCtrl.modifyComment);
router.delete('/:id',auth,  commentCtrl.deleteComment);
module.exports = router;