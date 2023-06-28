const correos = [
    {
        "correo": "santiago@gmail.com",
    },
    {
        "correo": "carlos@gmail.com",

    }
]

const validarRecuperar = () => {
    let correo = document.getElementById("correo").value;

    return new Promise((resolve, reject) => {
        for (let i = 0; i < correos.length; i++) {
            if (correos[i].correo === correo) {
                resolve('<span style="color: green;">El código se envió satisfactoriamente</span>');
                setTimeout(() => {
                    
                    window.location.href = "/nueva";
                }, 2000); // Retraso de 2 segundos (2000 milisegundos)
                return; // Agregar un return para salir del bucle si se encuentra el correo
            }
        }
        reject('<span style="color: red;">El usuario no existe en la base de datos</span>');
    });
};

document.querySelector("#btnEnviarCodigo").addEventListener("click", () => {
    validarRecuperar()
        .then(mensaje => {
            document.getElementById("mensaje").innerHTML = mensaje;
        })
        .catch(error => {
            document.getElementById("mensaje").innerHTML = error;
        });
});


