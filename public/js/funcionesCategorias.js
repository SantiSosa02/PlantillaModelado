const url = "http://localhost:8080/api/categoria";
const validarFormulario = () => {
  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value;

  const expresionNombre = /^[a-zA-Z]+ *[a-zA-Z]*$/;
  const expresionDescripcion = /^[a-zA-Z ]{5,150}$/;

  let mensajeNombre = "";
  let mensajeDescripcion = "";

  if (!expresionNombre.test(nombre)) {
    mensajeNombre = "El nombre solo puede incluir letras";
  }

  if (!expresionDescripcion.test(descripcion)) {
    mensajeDescripcion = "La descripción solo puede incluir letras";
  }

  const alertElementNombre = document.getElementById("texto");
  const alertElementDescripcion = document.getElementById("texto1");

  alertElementNombre.innerHTML = mensajeNombre;
  alertElementDescripcion.innerHTML = mensajeDescripcion;

  alertElementNombre.style.display = mensajeNombre ? "block" : "none";
  alertElementDescripcion.style.display = mensajeDescripcion ? "block" : "none";
};

const listarDatos = async () => {
  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });

    if (response.ok) {
      const data = await response.json();
      const categorias = data.categorias;

      let respuesta = "";
      const body = document.getElementById("contenido");

      categorias.forEach((categoria) => {
        respuesta += `<tr>
          <td>${categoria._id}</td>
          <td>${categoria.nombre}</td>
          <td>${categoria.descripcion}</td>
          <td>${categoria.estado}</td>
          <td>
              <a onclick='editar(${JSON.stringify(categoria)})' ><button class="btn btn-warning" ><i class="fas fa-pen"></i></button></a>
              <a href="#"><button class="btn btn-info"><i class="fas fa-eye"></i></button></a>
              <label class="switch"><input type="checkbox" id="toggleSwitch"><span class="slider round"></span>
              </label>
              <button class="btn btn-danger" onclick="eliminar('${categoria._id}')"><i class="fas fa-trash"></i></button>
        </td>
          </td>
        </tr>`;
      });

      body.innerHTML = respuesta;
    } else {
      console.error("Error al obtener la lista de productos:", response.status);
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
  }
};

const registrar = async () => {
  const _nombre = document.getElementById("nombre").value;
  const _descripcion = document.getElementById("descripcion").value;
  const _estado = document.getElementById("estado").value;

  // Validar los campos del producto
  validarFormulario();

  const alertElementNombre = document.getElementById("texto");
  const alertElementDescripcion = document.getElementById("texto1");

  // Verificar si hay mensajes de error en las validaciones
  if (
    alertElementNombre.innerHTML ||
    alertElementDescripcion.innerHTML
  ) {
    // Si hay mensajes de error, no continuar con el registro
    return;
  }

  let categoria = {
    nombre: _nombre,
    descripcion: _descripcion,
    estado: _estado,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify(categoria),
    });

    if (response.ok) {
      // Mostrar Sweet Alert de registro exitoso y cerrarlo automáticamente después de 1000 ms
      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "La categoria se ha registrado correctamente.",
        timer: 1000, // Tiempo en milisegundos (1 segundo)
        showConfirmButton: false, // Ocultar el botón de confirmación
      }).then(() => {
        listarDatos(); // Actualizar la lista de servicios
        window.location.href = "/categorias";
      });
    } else {
      console.error("Error al agregar la categoria:", response.status);
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
  }
};

const editar = (categoria) => {
  var url = "/editarCategoria?categoria=" + encodeURIComponent(categoria._id);
  window.location.href = url;

};

const consultarCategoria = (categoria) => {

  const url2 = url + '?_id=' + categoria.toString();
  fetch(url2+ "", {
    method: 'GET',
    mode: 'cors',
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
    .then((resp) => resp.json())
    .then(function (data) {

      let categoria = data.categorias;
      document.getElementById('_id').value = categoria._id;
      document.getElementById('nombre').value = categoria.nombre;
      document.getElementById('descripcion').value = categoria.descripcion;
      document.getElementById('estado').value = categoria.estado;
    });
}


const modificar = async () => {

  let id = document.getElementById('_id').value;
  let nombre = document.getElementById('nombre').value;
  let descripcion = document.getElementById('descripcion').value;
  let estado = document.getElementById('estado').value;

   // Validar los campos del producto
   validarFormulario();

   const alertElementNombre = document.getElementById("texto");
   const alertElementDescripcion = document.getElementById("texto1");
 
   // Verificar si hay mensajes de error en las validaciones
   if (
     alertElementNombre.innerHTML ||
     alertElementDescripcion.innerHTML
   ) {
     // Si hay mensajes de error, no continuar con el registro
     return;
   }

  let categoria = {
    nombre: nombre,
    descripcion: descripcion,
    estado: estado,
  };

  fetch(url + `?id=${id}`, {
    method: 'PUT',
    mode: 'cors',
    body: JSON.stringify(categoria),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
  .then((resp) => resp.json())
  .then(json => {
    if (json.msg) {
      // Mostrar Sweet Alert de éxito
      Swal.fire({
        icon: 'success',
        title: 'Categoria modificada correctamente',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        // Redirigir a la página de usuarios
        window.location.href = "/categorias";
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
      let categoria = {
        _id: _id
      };

      fetch(url, {
        method: "DELETE",
        mode: "cors",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(categoria),
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

const buscarCategoria = async () => {
  const buscarCategoria = document.getElementById("buscarCategoria").value;

  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });

    if (response.ok) {
      const data = await response.json();
      const categorias = data.categorias;

      let respuesta = "";
      const body = document.getElementById("contenido");

      categorias.forEach((categoria) => {
        if (
          categoria.nombre.toLowerCase().includes(buscarCategoria.toLowerCase()) ||
          categoria.estado.toLowerCase() === buscarCategoria.toLowerCase()
        ) {
          respuesta += `<tr>
            <td>${categoria._id}</td>
            <td>${categoria.nombre}</td>
            <td>${categoria.descripcion}</td>
            <td>${categoria.estado}</td>
            <td>
                <a href='/editarCategoria?_id=${categoria._id}'><button class="btn btn-warning" ><i class="fas fa-pen"></i></button></a>
                <a href="#"><button class="btn btn-info"><i class="fas fa-eye"></i></button></a>
                <label class="switch"><input type="checkbox" id="toggleSwitch"><span class="slider round"></span>
                </label>
                <button class="btn btn-danger" onclick="eliminar('${categoria._id}')"><i class="fas fa-trash"></i></button>
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


if(document.querySelector("#btnRegistrarCategoria")){
  document.querySelector("#btnRegistrarCategoria").addEventListener('click',registrar)
}


if(document.querySelector("#btnBuscarCategoria")){
  document.querySelector("#btnBuscarCategoria").addEventListener('click',buscarCategoria)
}

  // Evento que se carga de primero cuando se redirecciona a una vista 
  document.addEventListener("DOMContentLoaded", function () {
    // Obtener la URL actual
    var url = window.location.href;
  
    if (url.includes("/editarCategoria")) {
      // Analizar la cadena de consulta de la URL
      var queryString = url.split('?')[1];
      var params = new URLSearchParams(queryString);
      // Leer el valor del parámetro "parametro1"
      var categoria = params.get('categoria');
      consultarCategoria (categoria);
    }
  });
  
  




