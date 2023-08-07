const express = require("express");
const pkg = require("pg");
const { Pool } = pkg;
const path = require("path");

const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const client = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'exam2',
    password: 'toky',
    port: 5432
});


client.connect();


app.use(express.static(__dirname + '/static'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/static/STELLAR/index.html");
});

app.get("/contact", (req, res) => {
    res.sendFile(__dirname + "/static/STELLAR/contact.html");
})

app.get('/redirection', (req, res) => {
    res.redirect("/contact");
});

///insert
app.post('/insert', async (req, res) => {
    console.log(req.body);
    const { name, lname, mail, password } = req.body;

    try {

        const query = 'INSERT INTO "user" (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)';
        await client.query(query, [name, lname, mail, password]);

        res.sendStatus(200);
    } catch (error) {
        console.error('Erreur lors de l\'insertion :', error);
        res.sendStatus(500);
    }
});


//select
app.get('/users', async (req, res) => {
    try {

        const query = 'SELECT * FROM users';
        const result = await client.query(query);
        console.log(result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(4321, () => {
    console.log("server demmarer");
})