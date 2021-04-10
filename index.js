const express = require('express');
const app = express();
const connection = require('./database/database');

//view engine
app.set('view engine','ejs');

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

app.get('/', (req,res) => {
	res.render('index');
});

app.listen(8080, () =>{
	console.log('app working!');
})