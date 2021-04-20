const express = require('express');
const app = express();
const connection = require('./database/database');
const session = require('express-session');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/usersController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./users/User');

//view engine
app.set('view engine','ejs');

//sessions
app.use(session({
	secret: 'omaehamoshindeiruytu',
	cookie: { maxAge: 30000000}
}))

//Static
app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//database
connection.authenticate()
	.then(() => {
		console.log('successful connection');
	}).catch((error) => {
		console.log(error);
	})

app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);

app.get('/session', (req, res) => {
	req.session.training = 'nodejs'

	res.send('session was generated!');
});

app.get('/reading', (req, res) => {
	res.json({
		training:req.session.training, 

	})

});

app.get('/', (req,res) => {
	Article.findAll({
		order:[
			['id', 'DESC']
		],
		limit: 4
	}).then(articles => {

		Category.findAll().then(categories => {
			res.render('index', {articles: articles, categories: categories});
		})

	});
});

app.get('/:slug', (req, res) => {
	const slug = req.params.slug;
	Article.findOne({
		where: {
			slug: slug
		}
	}).then(article => {
		if(article != undefined){
			Category.findAll().then(categories => {
				res.render('article', {article: article, categories: categories});
			});
		} else {
			res.redirect('/');
		}
	}).catch( err => {
		res.redirect('/');
	})
})

app.get('/category/:slug', (req, res) => {
	const slug = req.params.slug;
	Category.findOne({
		where: {
			slug: slug
		},
		include: [{model: Article}]
	}).then(category => {
		if(category != undefined){

			Category.findAll().then(categories => {
				res.render('index', {articles: category.articles, categories: categories});
			})
		}else{
			res.redirect('/');
		}
	}).catch( err => {
		res.redirect('/');
	})
})

app.listen(8080, () =>{
	console.log('app working!');
})