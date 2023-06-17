
const url = "http://localhost:8080/api/usuario";


const validarUsuario=() =>{
    const expresionNombres= /^[a-zA-Z]+ *[a-zA-Z]*$/;
    const expresionApellidos= /^[a-zA-Z]+ *[a-zA-Z]*$/;
    const expresionCorreo= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const expresionPassword =/^(?=.*[A-Z])(?=.*\d{2,})[A-Za-z\d]{6,}$/

    const nombres=document.getElementById("nombres").value;
    const apellidos=document.getElementById("apellidos").value;
    const correo=document.getElementById("correo").value;
    const password=document.getElementById("password").value;
    const confirmPassword=document.getElementById("confirmPass").value;

    let mensajeNombres="";
    let mensajeApellidos="";
    let mensajeCorreo="";
    let mensajePassword="";
    let mensajeConfirm="";

    if(!expresionNombres.test(nombres)){
        mensajeNombres ="* El nombre solo debe incluir letras";
    }
    if(!expresionApellidos.test(apellidos)){
        mensajeApellidos="* El apellido solo puede tener letras ";
    }
    if(!expresionCorreo.test(correo)){
        mensajeCorreo="* El correo debe llevar este orden ejemplo@gmail.com "
    }
    if(!expresionPassword.test(password)){
        mensajePassword="* La contraseña debe contener al menos una mayuscula, minimo un numero <br>Ejemplo : Pass123word ";  
    }
    if(confirmPassword !== password){
        mensajeConfirm="Las contraseñas no coinciden";
    }
    const alertElementNombres = document.getElementById("texto");
    const alertElementApellidos = document.getElementById("texto1");
    const alertElementCorreo = document.getElementById("texto2");
    const alertElementPassword = document.getElementById("texto3");
    const alertElementConfirmPassword = document.getElementById("texto4");

  alertElementNombres.innerHTML=mensajeNombres;
  alertElementApellidos.innerHTML=mensajeApellidos;
  alertElementCorreo.innerHTML=mensajeCorreo;
  alertElementPassword.innerHTML=mensajePassword;
  alertElementConfirmPassword.innerHTML=mensajeConfirm;
 

  alertElementNombres.style.display = mensajeNombres ?"block" : "none"; 
  alertElementApellidos.style.display = mensajeApellidos ?"block" : "none"; 
  alertElementCorreo.style.display = mensajeCorreo ?"block" : "none"; 
  alertElementPassword.style.display = mensajePassword ?"block" : "none"; 
  alertElementConfirmPassword.style.display = mensajeConfirm ?"block" : "none"; 
}



const listarDatos = async () => {
  let respuesta = '';
  let body = document.getElementById('contenido');

  fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
    .then((resp) => resp.json())
    .then(function (data) {
      let listaUsuarios = data.usuarios;
      datos = listaUsuarios.map(function (usuario) {
        const row = document.createElement('tr');
        const estadoCell = document.createElement('td');
        const accionesCell = document.createElement('td');
        const accionesDiv = document.createElement('div');
        const editarIcon = document.createElement('a');
        const eliminarIcon = document.createElement('a');
        const switchLabel = document.createElement('label');
        const switchInput = document.createElement('input');
        const switchSpan = document.createElement('span');

        estadoCell.textContent = usuario.estado === 'true' ? 'activo' : 'inactivo';
        switchInput.type = 'checkbox';
        switchInput.checked = usuario.estado === 'true'; // Establecer el estado del checkbox en función del valor actual

        switchInput.addEventListener('change', function() {
          console.log('Cambio de estado detectado');

          Swal.fire({
            title: '¿Estás seguro de cambiar el estado?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              console.log('Confirmación aceptada');

              const usuarioId = row.getAttribute('data-id');
              const newEstado = this.checked ? 'true' : 'false'; // Actualizar el nuevo estado basado en el checkbox

              console.log('Producto ID:', usuarioId);
              console.log('Nuevo estado:', newEstado);

              fetch(url + '?id=' + usuarioId, {
                method: 'PUT',
                mode: 'cors',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                  estado: newEstado
                })
              })
                .then((resp) => resp.json())
                .then(function (data) {
                  console.log('Respuesta del servidor:', data);

                  estadoCell.textContent = newEstado === 'true' ? 'activo' : 'inactivo';
                  usuario.estado = newEstado;
                  console.log('Estado actualizado:', usuario.estado);
                })
                .catch(function (error) {
                  console.error('Error en la solicitud:', error);
                });
            } else {
              console.log('Confirmación rechazada');

              this.checked = !this.checked;
            }
          });
        });

        accionesDiv.classList.add('acciones');
        editarIcon.classList.add('btn', 'btn-warning', 'mr-2');
        editarIcon.innerHTML = '<i class="fas fa-pen"></i>';
        eliminarIcon.classList.add('btn', 'btn-danger', 'mr-2');
        eliminarIcon.innerHTML='<i class="fas fa-trash"></i>';
        switchLabel.classList.add('switch');
        switchSpan.classList.add('slider');
        switchSpan.classList.add('round');

        editarIcon.onclick = function() {
          editar(usuario);
        };

        eliminarIcon.onclick = function() {
          eliminar(usuario._id);
        };

        switchLabel.appendChild(switchInput);
        switchLabel.appendChild(switchSpan);
        accionesDiv.appendChild(editarIcon);
        accionesDiv.appendChild(eliminarIcon);
        accionesDiv.appendChild(switchLabel);
        accionesCell.appendChild(accionesDiv);

        row.setAttribute('data-id', usuario._id); // Agregar el ID del producto como atributo

        row.innerHTML = `<td>${usuario._id}</td>` +
          `<td>${usuario.nombres}</td>` +
          `<td>${usuario.apellidos}</td>` +
          `<td>${usuario.correo}</td>`;

        row.appendChild(estadoCell);
        row.appendChild(accionesCell);
        body.appendChild(row);
      });
    });
};

const registrar = async () => {
  const _password = document.getElementById("password").value;
  const _confirmPass = document.getElementById("confirmPass").value;
  const _nombres = document.getElementById("nombres").value;
  const _apellidos = document.getElementById("apellidos").value;
  const _correo = document.getElementById("correo").value;
  const _estado = document.getElementById("estado").value;

  // Validar los campos del usuario
  validarUsuario();

  const alertElementNombres = document.getElementById("texto");
  const alertElementApellidos = document.getElementById("texto1");
  const alertElementCorreo = document.getElementById("texto2");
  const alertElementPassword = document.getElementById("texto3");
  const alertElementConfirmPassword = document.getElementById("texto4");

  // Verificar si hay mensajes de error en las validaciones
  if (
    alertElementNombres.innerHTML ||
    alertElementApellidos.innerHTML ||
    alertElementCorreo.innerHTML ||
    alertElementPassword.innerHTML ||
    alertElementConfirmPassword.innerHTML
  ) {
    // Si hay mensajes de error, no continuar con el registro
    return;
  }

  if (_password.length > 0 && _confirmPass.length > 0 && _password === _confirmPass) {
    let usuario = {
      nombres: _nombres,
      apellidos: _apellidos,
      correo: _correo,
      password: _password,
      estado: _estado,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(usuario),
      });

      if (response.ok) {
        // Mostrar Sweet Alert de registro exitoso
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "El usuario se ha registrado correctamente.",
          timer:1000,
          showConfirmButton:false,
        }).then(() => {
          listarDatos(); // Actualizar la lista de usuarios
          window.location.href = "/usuarios";
        });
      } else {
        console.error("Error al agregar el usuario:", response.status);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  } else {
    alert("El password y la confirmación no coinciden");
  }
};


  const editar = (usuario) => {
    var url = "/editarUsuario?usuario=" + encodeURIComponent(usuario._id);
    window.location.href = url;
  
  };

  const consultarUsuario = (usuario) => {

    const url2 = url + '?_id=' + usuario.toString();
    fetch(url2+ "", {
      method: 'GET',
      mode: 'cors',
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
      .then((resp) => resp.json())
      .then(function (data) {
  
        let usuario = data.usuarios;
        document.getElementById('_id').value = usuario._id;
        document.getElementById('nombres').value = usuario.nombres;
        document.getElementById('apellidos').value = usuario.apellidos;
        document.getElementById('correo').value = usuario.correo;
        document.getElementById('estado').value = usuario.estado;
      });
  
  }

  const modificar = async () => {
    let id = document.getElementById('_id').value;
    let nombres = document.getElementById('nombres').value;
    let apellidos = document.getElementById('apellidos').value;
    let correo = document.getElementById('correo').value;
    let estado = document.getElementById('estado').value;
  
    // Validar los campos del usuario, excluyendo la validación de contraseña
    const expresionNombres= /^[a-zA-Z]+ *[a-zA-Z]*$/;
    const expresionApellidos= /^[a-zA-Z]+ *[a-zA-Z]*$/;
    const expresionCorreo= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    let mensajeNombres = "";
    let mensajeApellidos = "";
    let mensajeCorreo = "";
  
    if (!expresionNombres.test(nombres)) {
      mensajeNombres = "* El nombre solo debe incluir letras";
    }
    if (!expresionApellidos.test(apellidos)) {
      mensajeApellidos = "* El apellido solo puede tener letras ";
    }
    if (!expresionCorreo.test(correo)) {
      mensajeCorreo = "* El correo debe llevar este orden ejemplo@gmail.com ";
    }
  
    const alertElementNombres = document.getElementById("texto");
    const alertElementApellidos = document.getElementById("texto1");
    const alertElementCorreo = document.getElementById("texto2");
  
    alertElementNombres.innerHTML = mensajeNombres;
    alertElementApellidos.innerHTML = mensajeApellidos;
    alertElementCorreo.innerHTML = mensajeCorreo;
  
    alertElementNombres.style.display = mensajeNombres ? "block" : "none";
    alertElementApellidos.style.display = mensajeApellidos ? "block" : "none";
    alertElementCorreo.style.display = mensajeCorreo ? "block" : "none";
  
    // Verificar si hay mensajes de error en las validaciones
    if (
      alertElementNombres.innerHTML ||
      alertElementApellidos.innerHTML ||
      alertElementCorreo.innerHTML
    ) {
      // Si hay mensajes de error, no continuar con la modificación
      return;
    }
  
    let usuario = {
      nombres: nombres,
      apellidos: apellidos,
      correo: correo,
      estado: estado,
    };
  
    fetch(url + `?id=${id}`, {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(usuario),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then((resp) => resp.json())
    .then(json => {
      if (json.msg) {
        // Mostrar Sweet Alert de éxito
        Swal.fire({
          icon: 'success',
          title: 'Usuario modificado correctamente',
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          // Redirigir a la página de usuarios
          window.location.href = "/usuarios";
        });
      }
    });
  };
  
  
  
  const eliminar = (_id) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Está seguro de que desea eliminar el usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        let usuario = {
          _id: _id
        };
  
        fetch(url, {
          method: "DELETE",
          mode: "cors",
          headers: { "Content-type": "application/json; charset=UTF-8" },
          body: JSON.stringify(usuario),
        })
          .then((resp) => resp.json())
          .then(json => {
            Swal.fire({
              title: 'Eliminado',
              text: json.msg,
              icon: 'success'
            });
            location.reload();
          })
          .catch(error => {
            Swal.fire({
              title: 'Error',
              text: 'Error al eliminar el usuario',
              icon: 'error'
            });
            console.error('Error al eliminar el usuario:', error);
          });
      }
    });
  };

  const buscarUsuario = async () => {
    const buscarUsuario = document.getElementById("buscarUsuario").value;
  
    try {
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
  
      if (response.ok) {
        const data = await response.json();
        const usuarios = data.usuarios;
  
        let respuesta = "";
        const body = document.getElementById("contenido");
  
        usuarios.forEach((usuario) => {
          if (
            usuario.nombres.toLowerCase().includes(buscarUsuario.toLowerCase()) ||
            usuario.apellidos.toLowerCase().includes(buscarUsuario.toLowerCase()) ||
            usuario.correo.toLowerCase().includes(buscarUsuario.toLowerCase()) ||
            usuario.estado.toLowerCase() === buscarUsuario.toLowerCase()
          ) {
            respuesta += `<tr>
              <td>${usuario._id}</td>
              <td>${usuario.nombres}</td>
              <td>${usuario.apellidos}</td>
              <td>${usuario.correo}</td>
              <td>${usuario.estado}</td>
              <td>
                <a onclick='editar(${JSON.stringify(usuario)})' ><button class="btn btn-warning" ><i class="fas fa-pen"></i></button></a> 
                <label class="switch"><input type="checkbox" id="toggleSwitch"><span class="slider round"></span>
                </label>
                <button class="btn btn-danger" onclick="eliminar('${usuario._id}')"><i class="fas fa-trash"></i></button>
              </td>
            </tr>`;
          }
        });
  
        body.innerHTML = respuesta;
      } else {
        console.error("Error al obtener la lista de usuarios:", response.status);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  // Asignar el evento click al botón de registro
  if (document.querySelector("#btnRegistrarUsuario")) {
    document.querySelector("#btnRegistrarUsuario").addEventListener("click", registrar);
  }
  


  if (document.querySelector("#btnBuscarUsuario")) {
    document.querySelector("#btnBuscarUsuario").addEventListener("click", buscarUsuario);
  }
  
  // Evento que se carga de primero cuando se redirecciona a una vista 
document.addEventListener("DOMContentLoaded", function () {
  // Obtener la URL actual
  var url = window.location.href;

  if (url.includes("/editarUsuario")) {
    // Analizar la cadena de consulta de la URL
    var queryString = url.split('?')[1];
    var params = new URLSearchParams(queryString);
    // Leer el valor del parámetro "parametro1"
    var usuario = params.get('usuario');
    consultarUsuario(usuario);
  }
});


