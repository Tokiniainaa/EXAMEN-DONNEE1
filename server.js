const express = require("express");
const pkg = require("pg");
const { Pool } = pkg;
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

const socketIO = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketIO(server);

const cors = require("cors");

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


io.on("connection", (socket) => {
    console.log("connexion....");
    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté');
    });
})


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
    const { name, lname, mail, gender, phone_number, emergency, nation, password } = req.body;

    try {

        const query = `INSERT INTO customer 
        (customer_firstname,  customer_lastname, gender, phone_number, emergency_contact, email, nationality, customer_password)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
        const values = [name, lname, gender, phone_number, emergency, mail, nation, password]
        await client.query(query, values);

        res.sendStatus(200);

    } catch (error) {
        console.error('Erreur lors de l\'insertion :', error);
        res.sendStatus(500);
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



app.post('/reserve', async (req, res) => {
    console.log(req.body);
    const { room_conf, city } = req.body;

    try {
        let query;
        if (room_conf === "room") {
            query = `SELECT * FROM hotel WHERE hotel_city='${city}'`;
        } else {
            query = `SELECT floor_area, price_for_one_hour FROM conference_room`;
        }

        const result = await client.query(query);

        console.log(result.rows);

        res.json(result.rows); // Renvoyer les résultats au client

    } catch (error) {
        console.error('Erreur lors de l\'insertion :', error);
        res.sendStatus(500); // Renvoyer une réponse d'erreur au client
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
app.get('/list_user', (req, res) => {
    res.sendFile(__dirname + "/static/STELLAR/intranet/list_user.html");
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
app.get('/api/getUserData', async (req, res) => {
    try {
        const userData = await client.query('SELECT * FROM "user"');
        res.json(userData.rows);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/api/getCustomerData', async (req, res) => {
    try {
        const customerData = await client.query('SELECT * FROM customer');
        res.json(customerData.rows);
    } catch (error) {
        console.error('Error fetching customer data:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(4321, () => {
    console.log("server demmarer");
})