const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSignin = document.getElementById("btnSignin");

btnSignin.addEventListener("click", checkCredentials);

function checkCredentials() {
    //Ici il faudra appeler une API pour vérifier les identifiants de l'utilisateur
    if(mailInput.value == "test@orange.fr" && passwordInput.value == "123"){
    alert("Vous êtes connecté !");

    //Il faudra récupérer le vrai token

        const token = "lkjsdngfljsqdnglkjsdbglkjqskjgkfjgbqslkfdgbskldfgdfgsdgf";
     
    
    //placer ce token en cookie
    setToken(token);

    setCookie(RoleCookieName, "admin", 7);
    window.location.replace("/");
}
    else{
        mailInput.classList.add("is-invalid");
        passwordInput.classList.add("is-invalid");
    }     
}  