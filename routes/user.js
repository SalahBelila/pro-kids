const {pool} = require('../server.js');
const router = require('express').Router();

// SIGN UP
router.post('/signup', async (req, res) => {
    errorList = [];

    users = await pool.query('SELECT username FROM "user" WHERE username = $1', [req.body.username]);
    if (users.rowCount > 0) {
        errorList.push({msg: `A user with the username ${req.body.username} already exists.`});
    }

    users = await pool.query('SELECT username FROM "user" WHERE email = $1', [req.body.email]);
    if (users.rowCount > 0) {
        errorList.push({msg: `A user with the email ${req.body.email} already exists.`});
    }

    if (!(req.body.password === req.body.cpassword)) {
        errorList.push({msg: "The entered passwords did not match."});
    }

    if (errorList.length > 0) {
        res.status(400).send(errorList);
        return;
    }

    sqlQuery = 'INSERT INTO "user" (username, name, email, password)  VALUES ($1, $2, $3, $4)';
    sqlValues = [req.body.username, req.body.name, req.body.email, req.body.password];
    try {
        await pool.query(sqlQuery, sqlValues);
        res.redirect('/');
    } catch (e) {
        res.sendStatus(500).end();
        console.log(e);
    }
});

module.exports = router;