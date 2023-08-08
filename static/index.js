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


document.getElementById("formLogin").addEventListener("submit", handleInsert)


const reservation={};
async function getreservation (){
    alert("hghg")
    event.preventDefault();
    const formData = new FormData(event.target);
    const start_date = formData.get("start_date");
    const end_date= formData.get("end_date");
    try {

        const response = await fetch('/reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ start_date,end_date})
        });
    
        if (response.ok) {
           
            reservation.start_date =start_date;
            reservation.end_date = end_date;
            alert("okkk")
    
        } else {
            alert('Erreur lors de l\'insertion.');
        }
    } catch (error) {
        console.error('Erreur lors de la soumission du formulaire :', error);
    }


}
document.getElementById("boutton").addEventListener("submit", getreservation);
