const express = require('express');
const router = express.Router();

router.get('/articles',(req, res) => {
	res.send('rota de articles');
});

router.get('/admin/articles/new',(req, res) => {
	res.send('router to create a new article');
});

module.exports = router;