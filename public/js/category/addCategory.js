let token = localStorage.getItem("token");
let categoryName = document.getElementById("categoryName");
let categoryImage = document.getElementById("categoryImage");
let data;
apiBaseUrl = "https://oshops-app.herokuapp.com/";


function clearForm() {
    categoryName.value = "";
    categoryImage.value = "";
}


categoryImage.addEventListener("change", (e) => {
    const img = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        data = JSON.stringify({
            "categoryName": categoryName.value, "categoryImageURL": {
                "data": base64String,
                "name": img.name
            }
        });
    }
    reader.readAsDataURL(e.target.files[0]);
})


function addCategory() {
    if (categoryImage.files.length == 0) {
        data = JSON.stringify({ "categoryName": categoryName.value });
    }
    let msg = '';
    var xhr = new XMLHttpRequest();
    var url = `${apiBaseUrl}addCategory`;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if (json.status == 200) {
                msg = `<div class="alert alert-success" role="alert">
                ${json.message}
                </div>`
                setTimeout(() => {
                    msg = ``;
                    document.getElementById('msg').innerHTML = msg;
                    location.reload();
                }, 2000);
                document.getElementById('msg').innerHTML = msg;
               
            }
            else {
                msg = `<div class="alert alert-danger" role="alert">
                ${json.message}
            </div>`;
                setTimeout(() => {
                    msg = ``;
                    document.getElementById('msg').innerHTML = msg;
                    location.reload();
                }, 2000);
                document.getElementById('msg').innerHTML = msg;
            }
        }
    }
    xhr.send(data);
}


function getCurrentAdmin() {
    let getCurrentAdmin = ``;
    let permission = ``;
    var xhr = new XMLHttpRequest();
    var url = `${apiBaseUrl}getCurrentAdmin`;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            getCurrentAdmin = `<h5>${json.userData.firstName} ${json.userData.lastName}</h5>
                            <small>${json.userData.role}</small>`;
            if (json.userData.role == 'superAdmin') {
                permission = `<a href="./admin.html"><i class="fas fa-user-cog"></i>
                <span>Admins</span>
            </a>`;
            }
            document.getElementById("permission").innerHTML = permission;
            document.getElementById("getCurrentAdmin").innerHTML = getCurrentAdmin;
        }
    };
    var data = JSON.stringify({ "token": token });
    xhr.send(data);
}


function logOut() {
    window.location = "../../html/login.html";
    localStorage.clear();
}


if (token == undefined || token == null) {
    window.location.href = "../../html/login.html";
    localStorage.clear();
}


getCurrentAdmin();
document.getElementById("saveBtn").addEventListener("click", addCategory)


