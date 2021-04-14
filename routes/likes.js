const express = require('express');
const router = express.Router();
const likeCtrl = require('../controleurs/likes');

router.post('/post/:id/like', likeCtrl.like);

module.exports = router;