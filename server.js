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
    database: 'donne',
    password: 'Barth123',
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
app.get("/gallery", (req, res) => {
    res.sendFile(__dirname + "/static/STELLAR/gallery.html");
})
app.get("/accomodation", (req, res) => {
    res.sendFile(__dirname + "/static/STELLAR/accomodation.html");
})
app.get("/about", (req, res) => {
    res.sendFile(__dirname + "/static/STELLAR/about.html");
})
app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/static/STELLAR/login/login.html");
})


app.get('/redirection', (req, res) => {
    const destination = req.query.destination;
    res.redirect(destination);
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

app.get('/api/getData', async (req, res) => {
    try {
        // Fetch user and customer data from your database
        const userData = await client.query('SELECT * FROM "user"');
        const customerData = await client.query('SELECT * FROM customer');

        // Combine and format the data as needed
        const combinedData = [...userData.rows, ...customerData.rows];

        // Send the data as JSON response
        res.json(combinedData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
app.get('/intranet', (req, res) => {
    res.sendFile(__dirname + "/static/STELLAR/intranet.html");
});
//select
app.get('/users', async (req, res) => {
    try {

        const query = 'SELECT * FROM user';
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