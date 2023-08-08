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
    const password = formData.get("password");
    

    try {

        const response = await fetch('/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, lname, mail, password })
        });

        if (response.ok) {

            redirects("/");

            user.name = name;
            user.lastname = lname;
            user.email = mail;
            user.password = password;

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

