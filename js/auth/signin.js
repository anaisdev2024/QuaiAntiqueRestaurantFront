const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSignin = document.getElementById("btnSignin");
const signinForm = document.getElementById("signinForm");

btnSignin.addEventListener("click", checkCredentials);

function checkCredentials() {
  let dataForm = new FormData(signinForm);
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({
    "username": dataForm.get("email"),
    "password": dataForm.get("mdp")
  });

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(apiUrl + "login", requestOptions)
    .then(response => {
      return response.text().then(text => {
        if (response.ok) {
          try {
            return JSON.parse(text);
          } catch (e) {
            console.error('Invalid JSON response:', e);
            return null;
          }
        } else {
          mailInput.classList.add("is-invalid");
          passwordInput.classList.add("is-invalid");
          return null;
        }
      });
    })
    .then(result => {
      if (!result) return;
      const token = result.apiToken;
      setToken(token);
      setCookie(RoleCookieName, result.roles?.[0] ?? "", 7);
      window.location.href = "/";
    })
    .catch(error => console.log('error', error));
}

document.getElementById("togglePassword").addEventListener("click", () => {
  const input = document.getElementById("PasswordInput");
  const icon = document.getElementById("togglePasswordIcon");
  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("bi-eye", "bi-eye-slash");
  } else {
    input.type = "password";
    icon.classList.replace("bi-eye-slash", "bi-eye");
  }
});