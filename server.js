const express = require("express");
const pkg = require("pg");
const { Pool } = pkg;
const bodyParser = require('body-parser');
const session = require('express-session');

const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'yoursecret', resave: false, saveUninitialized: true }));


const client = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'hotel_donne',
    password: 'rodyandry',
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
app.get("/intranet", (req, res) => {
    res.sendFile(__dirname + "/static/STELLAR/intranet/intranet.html");
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


app.post('/resevation', async (req, res) => {
    console.log(req.body);
    const { start_date,end_date } = req.body;

    try {

        const query = 'INSERT INTO reservation (start_date_of_stay,end_date_of_stay) VALUES ($1, $2)';
        await client.query(query, [start_date,end_date]);

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
        res.json(result.rows);
        console.log(result.rows);

        //res.sendStatus(200);

    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Gestion de la connexion
app.post('/checkAdmin', async (req, res) => {
    const email = req.body.email;
    const password = req.body.pass;
    try {
        // Simulez la vérification des informations d'identification dans la base de données
        const query = `SELECT * FROM "user" WHERE email = '${email}' AND password = '${password}'`; // Notez les guillemets autour des valeurs dans la requête
        const result = await client.query(query);
        console.log(result.rows);

        if (result.rows.length === 1) {
            res.sendStatus(200); // Authentification réussie
        } else {
            res.sendStatus(404); // Utilisateur non trouvé
        }

    } catch (error) {
        console.error(error);
        res.sendStatus(500); // Erreur interne du serveur
    }
});


app.listen(4321, () => {
    console.log("server demmarer");
})