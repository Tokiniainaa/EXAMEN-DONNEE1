function redirects(destination) {
    // Effectuer une requête vers la route de redirection
    fetch(`/redirection?destination=${encodeURIComponent(destination)}`)
        .then(response => {
            if (response.ok) {
                // Redirection côté client si la requête a réussi
                window.location.href = destination;
            }
        })
        .catch(error => {
            console.error('Error redirecting:', error);
        });
}


const user = {};
async function handleInsert(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const name = formData.get("name");
    const lname = formData.get("lname");
    const mail = formData.get("mail");
    const gender = formData.get("gender");
    const phone_number = formData.get("phone_number");
    const emergency = formData.get("emergency");
    const nation = formData.get("nation");
    const password = formData.get("password");

    try {

        const response = await fetch('/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, lname, mail, gender, phone_number, emergency, nation, password })
        });

        if (response.ok) {

            user.name = name;
            user.lastname = lname;
            user.email = mail;
            user.password = password;

            redirects('/');

            const signTitle = document.getElementById("toggle-sign");
            console.log(signTitle);
            signTitle.classList.remove("sign");
            signTitle.innerHTML = "logout";

        } else {
            alert('Erreur lors de l\'insertion.');
        }
    } catch (error) {
        console.error('Erreur lors de la soumission du formulaire :', error);
    }
}



async function logAdmin(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const pass = formData.get("pass");

    try {

        const response = await fetch('/checkAdmin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pass }),
        });

        if (response.ok) {
            // Authentification réussie, rediriger ou effectuer d'autres actions
            redirects('/list_user');
        } else {
            event.target.reset();
            alert("Access denied");
            const data = await response.json();
            alert(data.error);
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        messageDiv.textContent = 'Erreur de connexion';
    }
}


let reservations = []

async function book(event) {

    event.preventDefault();

    const start_date = document.querySelector("input[name='start_date']").value;
    const end_date = document.querySelector("input[name='end_date']").value;
    const room_conf = document.querySelector("#type-reservation").value;
    const city = document.querySelector("select[name='city']").value;

    // Convertir les dates en objets Date pour comparaison
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);

    if (startDateObj > endDateObj) {
        alert("Start date should be before end date.");
        return;
    }

    console.log("Start Date:", start_date);
    console.log("End Date:", end_date);
    console.log("Room Configuration:", room_conf);
    console.log("City:", city);


    try {

        const response = await fetch('/reserve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ room_conf, city }),
        });

        if (response.ok) {
            // Authentification réussie, rediriger ou effectuer d'autres actions

            const data = await response.json();
            console.log(data);

            reservations.push(
                {
                    type: room_conf,
                    start: start_date,
                    end: end_date,
                    city: city,
                    subject: user
                }
            )

            redirects("/accomodation");

        } else {
            alert("error");
            const data = await response.json();
            alert(data.error);
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        messageDiv.textContent = 'Erreur de connexion';
    }

}