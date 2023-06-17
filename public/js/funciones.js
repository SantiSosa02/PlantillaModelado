const url = "http://localhost:8080/api/usuario";

const listarDatos = async () => {
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
        respuesta += `<tr>
          <td>${usuario._id}</td>
          <td>${usuario.nombre}</td>
          <td>${usuario.rol}</td>
          <td>${usuario.estado}</td>
          <td>
            <button class="btn waves-effect waves-light" type="button" onclick="eliminarUsuario('${usuario._id}')">Eliminar</button>
          </td>
          <td>
           <a href="actualizarUsuario.html?id=${usuario.nombre}">Modificar</a>
          </td>
        </tr>`;
      });

      body.innerHTML = respuesta;
    } else {
      console.error("Error al obtener la lista de usuarios:", response.status);
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
  }
};

const eliminarUsuario = async (_id) => {
  const url = `http://localhost:8080/api/usuario/${_id}`; // Agrega el parámetro de identificación '_id'

  const confirmacion=confirm("Esta seguro de que desea eliminar el usuario?");
  if(!confirmacion){
    return;
  }
  try {
    const response = await fetch(url, {
      method: "DELETE",
      mode: "cors",
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });

    if (response.ok) {
      console.log("Usuario eliminado exitosamente");
      listarDatos(); // Actualizar la lista de usuarios
    } else {
      console.error("Error al eliminar el usuario:", response.status);
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
  }
};

const modificar = async () => {
  let _password = document.getElementById("password").value;
  let _confirmPass = document.getElementById("confirmPass").value;

  let _nombre = document.getElementById("nombre").value;
  let _rol = document.getElementById("rol").value;
  let _estado = document.getElementById("estado").value;

  if (_password.length > 0 && _confirmPass.length > 0 && _password === _confirmPass) {
    let usuario = {
      nombre: _nombre,
      rol: _rol,
      estado: _estado,
      password: _password,
    };

    try {
      const response = await fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(usuario),
      });

      if (response.ok) {
        console.log("Usuario agregado exitosamente");
        listarDatos(); // Actualizar la lista de usuarios
        location.reload();
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


const registrar = async () => {
  let _password = document.getElementById("password").value;
  let _confirmPass = document.getElementById("confirmPass").value;

  let _nombres = document.getElementById("nombre").value;
  let _estado = document.getElementById("estado").value;

  if (_password.length > 0 && _confirmPass.length > 0 && _password === _confirmPass) {
    let usuario = {
      nombres: _nombres,
      rol: _rol,
      estado: _estado,
      password: _password,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(usuario),
      });

      if (response.ok) {
        console.log("Usuario agregado exitosamente");
        listarDatos(); // Actualizar la lista de usuarios
        window.location.href="/usuarios";
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


if(document.querySelector("#btnRegistrar")){
  document.querySelector("#btnRegistrar").addEventListener("click", registrar);
}


