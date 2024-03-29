
const log = console.log
const form = document.getElementById('form').elements
const firstname = form.firstname
const lastname = form.lastname
const password = form.password
const registerBtn = form.regbtn
const dataBaseUrl = 'https://learn-js-personal-default-rtdb.asia-southeast1.firebasedatabase.app/'

// POST request
function register (event) {

    event.preventDefault()

    // checked empty field
    if (firstname.value && lastname.value  && password.value) {

        const userData = {
            firstname: firstname.value,
            lastname: lastname.value,
            password: password.value,
        }

        fetch(dataBaseUrl + 'users.json',{
            method: "POST",
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(userData)
        })
        .then(res => {
            if (res.ok === true){
                clearValue()
                log("POST successful")
            }
        })
        .catch(() => console.error(new Error("Failed to connect Firebase DB")))
    }

}

function clearValue () {

    firstname.value = ''
    lastname.value = ''
    password.value = ''

}

registerBtn.addEventListener("click", register)