const codigos = [
    {
        "codigo": "123",
    },
    {
        "codigo": "456",

    }
]
const validarRecuperar = () => {
    let codigo = document.getElementById("codigo").value;
    let password = document.getElementById("nuevaContraseña").value;
    let confirmPass = document.getElementById("confirmContraseña").value;

    if (codigo === "" || password === "" || confirmPass === "") {
        return Promise.reject('<span style="color: red;">Por favor, complete todos los campos</span>');
    }

    return new Promise((resolve, reject) => {
        let codigoValido = false;

        for (let i = 0; i < codigos.length; i++) {
            if (codigos[i].codigo === codigo) {
                codigoValido = true;
                break;
            }
        }

        if (codigoValido) {
            if (password === confirmPass) {
                resolve('<span style="color: green;">El código y la contraseña son válidos</span>');
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000); // Retraso de 2 segundos (2000 milisegundos)
            } else {
                reject('<span style="color: red;">La contraseña y la confirmación de contraseña no coinciden</span>');
            }
        } else {
            reject('<span style="color: red;">El código ingresado no es válido</span>');
        }
    });
};

document.querySelector("#btnNuevaContraseña").addEventListener("click", () => {
    validarRecuperar()
        .then(mensaje => {
            document.getElementById("mensaje").innerHTML = mensaje;
        })
        .catch(error => {
            document.getElementById("mensaje").innerHTML = error;
        });
});


