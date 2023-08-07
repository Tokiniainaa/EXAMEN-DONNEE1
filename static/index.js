async function redirect() {
    fetch('/redirection')
        .then(response => {
            if (response.ok) {
                window.location.href = '/contact';
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

            redirect();

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


document.getElementById("formLogin").addEventListener("submit", handleInsert)