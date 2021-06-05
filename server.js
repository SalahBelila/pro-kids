const express = require('express');
const {connectConfig} = require('./config.js');
const {Pool} = require('pg');

const router = express.Router();

const app = express();

app.use(express.static('client'))
app.use(express.static('client/src'));

app.use(express.urlencoded({
    extended: true
}));

// Establish a connection pool with the database server.
pool = new Pool({
	user: connectConfig.user,
	database: connectConfig.database,
	host: connectConfig.host,
	port: connectConfig.port,
	password: connectConfig.password,
});

module.exports = {pool};

//ROUTES:
app.use('/api/user', require('./routes/user.js'));

PORT = 3000;
app.listen(PORT, () => console.log(`Server Listening at port ${PORT}`))