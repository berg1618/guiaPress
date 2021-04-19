const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');

router.get('/admin/users', (req, res) => {
	res.send('hello user');
});

router.get('/admin/users/create', (req, res) => {
	res.render('admin/users/create');
});

router.post('/users/create', (req, res) => {
	const email = req.body.email;
	const password = req.body.password; 

	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password);

	User.create({
		email: email,
		password: hash
	}).then(() => {
		res.redirect('/');
	}).catch( (err) => {
		res.redirect('/');
	})
});

module.exports = router;