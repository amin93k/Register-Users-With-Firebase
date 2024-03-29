const log = console.log
const usersBox = document.getElementById("wrap-users")
const delModal = document.getElementById("delete-modal")
const editModal = document.getElementById("edit-modal")
const closeEdit = document.querySelector(".close-btn")
const editForm = document.querySelector(".edit-user-form")
const dataBaseUrl = 'https://learn-js-personal-default-rtdb.asia-southeast1.firebasedatabase.app/'
let userID = ""

function getUsers() {

    // GET request
    fetch(dataBaseUrl + "users.json")
        .then(res => {
            // check response ok
            if (res.ok === true) {
                return res.json()
            }
        })
        .then(data => {
            // check exist user in DB
            if (data !== null) {
                // change data to list and send to function
                displayUsers(Object.entries(data))
            }else {
                throw new Error("Data retrieved is null")
            }
        })
        .catch(err => console.error(err))
}

function displayUsers (userList) {
    // empty users from container
    usersBox.innerHTML = ''

    // add users in container
    userList.forEach(item => {
        usersBox.insertAdjacentHTML('beforeend',`                    
                <div class="user">
                    <div class="user-profile-wrap">
                        <img class="user-profile" src="img/noimg.png" alt="default-image">
                        <div class="user-profile-description">
                            <h1 class="user-profile-name">${item[1].firstname} - ${item[1].lastname}<span class="user-age">18</span> </h1>
                            <h3 class="user-explanations">Pass: ${item[1].password}</h3>
                            <h4 class="user-ID">ID: ${item[0]}</h4>
                        </div>
                    </div>
                    <div class="btn-groups-column">
                        <button class="delete-user-btn" data-id="${item[0]}">delete</button>
                        <button class="edit-user-btn" data-id="${item[0]}">edit</button>
                    </div>
                </div>`)
    })
}

function handlerBtn(event) {

    const targetElm = event.target.classList

    // click on delete
    if (targetElm.contains("delete-user-btn")) {
        // Open delete modal
        delModal.classList.add("visible")
        userID = event.target.dataset.id
    }

    // click on edit
    if (targetElm.contains("edit-user-btn")) {
        editModal.classList.add("visible")
        userID = event.target.dataset.id
    }
}

function closeModal(event) {

    const targetElm = event.target.classList

    // detect delete modal or edit modal for close
    if (targetElm.contains("unaccept-btn")) {
        delModal.classList.remove("visible")
    }else{
        editModal.classList.remove("visible")
    }
}

async function deleteUser() {

    // accept delete user and DELETE request
    await fetch(dataBaseUrl + `users/${userID}.json`, {
        method: "DELETE"
    })
        .then(() => getUsers()) // refresh users from firebase DB
        .catch(err => console.error(err))

    // close Modal
    delModal.classList.remove("visible")
}

async function updateUser(e) {
    e.preventDefault()
    let userEdit = null

    if (editForm.firstname.value && editForm.lastname.value && editForm.password.value) {

        userEdit = {
            firstname: editForm.firstname.value,
            lastname: editForm.lastname.value,
            password: editForm.password.value
        }
    }else {
        return
    }

    // update user and PUT request
    await fetch(dataBaseUrl + `users/${userID}.json`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(userEdit)
    })
        .then(res => {
            if (res.ok === true ) {
                closeModal(e)
                getUsers()

                // empty edit form value
                editForm.firstname.value = ""
                editForm.lastname.value = ""
                editForm.password.value = ""

            } else {
                throw new Error("connection is Failed!")
            }
        })
        .catch(err => console.error(err))
}

window.addEventListener("load", getUsers)
usersBox.addEventListener("click", handlerBtn)
closeEdit.addEventListener("click", closeModal)
editForm.editBtn.addEventListener("click", updateUser)