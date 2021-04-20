const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/users', adminAuth.authenticate, (req, res) => {
	User.findAll().then(users => {
		res.render('admin/users/index', {users: users});
	});
});

router.get('/admin/users/create', adminAuth.authenticate, (req, res) => {
	res.render('admin/users/create');
});

router.post('/users/create', (req, res) => {
	const email = req.body.email;
	const password = req.body.password; 

	User.findOne({
		where: {email: email}
	}).then(user => {
		if(user == undefined){

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

		}else{
			res.redirect('/admin/users/create');
		}
	})

	
});

router.get('/login', (req, res) => {
	res.render('admin/users/login');
});

router.post('/authenticate', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	User.findOne({where:{email:email}}).then(user => {
		if(user != undefined){//if there's a user with this email
			//password validation
			const correct = bcrypt.compareSync(password, user.password);

			if(correct){
				req.session.user = {
					id: user.id,
					email: user.email
				}
				res.redirect('/admin/articles');
			}else{
				res.redirect('/login');
			}

		}else{
			res.redirect('/login');
		}
	})
})

router.get('/logout', (req, res) => {
	req.session.user = undefined;
	res.redirect('/');
})

module.exports = router;