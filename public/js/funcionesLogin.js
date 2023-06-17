const usuarios = [
    {
        "usuario":"santiago",
        "password":"12345"
    },
    {
        "usuario":"carlos",
        "password":"6789"
    },
    {
        "usuario":"Alejandro",
        "password":"alejo12"
    }
]

const validarUsuario = () => {
    let usuario = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    return new Promise((resolve, reject) => {
        for (let i = 0; i < usuarios.length; i++) {
            if (usuarios[i].usuario === usuario && usuarios[i].password === password) {
            window.location.href="/";
        } else {
            reject(`<span style="color: red;">El usuario o la contraseña son incorrectos</span>`);
        }
}});
    };

document.querySelector("#btnVerificarUsuario").addEventListener("click", () => {
    validarUsuario()
        .then(mensaje =>{
            document.getElementById("mensaje").innerHTML=mensaje;
        })
        .catch(error =>{
            document.getElementById("mensaje").innerHTML=error;
        });
});


