const url = "http://localhost:8080/api/servicio";
const validarServicios=()=>{
    const expresionNombre=/^[a-zA-Z]+ *[a-zA-Z]*$/;
    const expresionPrecioVenta=/^\d{1,3}(?:\.\d{3})*(?:\.\d+)?$/;

    const nombre=document.getElementById("nombre").value;
    const precioVenta=document.getElementById("precioVenta").value;

    let mensajeNombre="";
    let mensajePrecioVenta="";

    if(!expresionNombre.test(nombre)){
        mensajeNombre =" El nombre solo puede incluir letras<br><br>"
    }
    if(!expresionPrecioVenta.test(precioVenta)){
        mensajePrecioVenta =" El precio de la venta solo incluye numeros ejemplo<br>* 60.000";
    }
    const alertElementNombre=document.getElementById("texto");
    const alertElementPrecioVenta=document.getElementById("texto1");

    alertElementNombre.innerHTML=mensajeNombre;
    alertElementPrecioVenta.innerHTML=mensajePrecioVenta;

    alertElementNombre.style.display=mensajeNombre ? "block" : "none";
    alertElementPrecioVenta.style.display=mensajePrecioVenta ? "block" : "none";

}

const listarDatos = async () => {
    try {
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
  
      if (response.ok) {
        const data = await response.json();
        const servicios = data.servicios;
  
        let respuesta = "";
        const body = document.getElementById("contenido");
  
        servicios.forEach((servicio) => {
          respuesta += `<tr>
            <td>${servicio._id}</td>
            <td>${servicio.nombre}</td>
            <td>${servicio.precioVenta}</td>
            <td>${servicio.estado}</td>
            <td>
                <a onclick='editar(${JSON.stringify(servicio)})'><button class="btn btn-warning" ><i class="fas fa-pen"></i></button></a>
                <a href="#"><button class="btn btn-info"><i class="fas fa-eye"></i></button></a>
                <label class="switch"><input type="checkbox" id="toggleSwitch"><span class="slider round"></span>
                </label>
                <button class="btn btn-danger" onclick="eliminar('${servicio._id}')"><i class="fas fa-trash"></i></button>
          </td>
            </td>
          </tr>`;
        });
  
        body.innerHTML = respuesta;
      } else {
        console.error("Error al obtener la lista de servicios:", response.status);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const registrar = async () => {
  
    const _nombre = document.getElementById("nombre").value;
    const _precioVenta = document.getElementById("precioVenta").value;
    const _estado = document.getElementById("estado").value;
  
    // Validar los campos del usuario
    validarServicios();
  
    const alertElementNombre=document.getElementById("texto");
    const alertElementPrecioVenta=document.getElementById("texto1");
  
    // Verificar si hay mensajes de error en las validaciones
    if (
      alertElementNombre.innerHTML ||
      alertElementPrecioVenta.innerHTML 
    ) {
      // Si hay mensajes de error, no continuar con el registro
      return;
    }

      let servicio = {
        nombre: _nombre,
        precioVenta: _precioVenta,
        estado: _estado,
      };
  
      try {
        const response = await fetch(url, {
          method: "POST",
          mode: "cors",
          headers: { "Content-type": "application/json; charset=UTF-8" },
          body: JSON.stringify(servicio),
        });
  
        if (response.ok) {
          // Mostrar Sweet Alert de registro exitoso y cerrarlo automáticamente después de 1000 ms
          Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            text: "El servicio se ha registrado correctamente.",
            timer: 1000, // Tiempo en milisegundos (1 segundo)
            showConfirmButton: false, // Ocultar el botón de confirmación
          }).then(() => {
            listarDatos(); // Actualizar la lista de servicios
            window.location.href = "/servicios";
          });
        } else {
          console.error("Error al agregar el servicio:", response.status);
        }
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
      }
  };

  const editar = (servicio) => {
    var url = "/editarServicio?servicio=" + encodeURIComponent(servicio._id);
    window.location.href = url;
  };

  const consultarServicio = (servicio) => {

    const url2 = url + '?_id=' + servicio.toString();
    fetch(url2+ "", {
      method: 'GET',
      mode: 'cors',
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
      .then((resp) => resp.json())
      .then(function (data) {
  
        let servicio = data.servicios;
        document.getElementById('_id').value = servicio._id;
        document.getElementById('nombre').value = servicio.nombre;
        document.getElementById('precioVenta').value = servicio.precioVenta;
        document.getElementById('estado').value = servicio.estado;
      });
  
  }


  const modificar = async () => {

    let id = document.getElementById('_id').value;
    let nombre = document.getElementById('nombre').value;
    let precioVenta = document.getElementById('precioVenta').value;
    let estado = document.getElementById('estado').value;

     // Validar los campos del usuario
     validarServicios();
  
     const alertElementNombre=document.getElementById("texto");
     const alertElementPrecioVenta=document.getElementById("texto1");
   
     // Verificar si hay mensajes de error en las validaciones
     if (
       alertElementNombre.innerHTML ||
       alertElementPrecioVenta.innerHTML 
     ) {
       // Si hay mensajes de error, no continuar con el registro
       return;
     }
  
    let servicio = {
      nombre: nombre,
      precioVenta: precioVenta,
      estado: estado,
    };
  
    fetch(url + `?id=${id}`, {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(servicio),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then((resp) => resp.json())
    .then(json => {
      if (json.msg) {
        // Mostrar Sweet Alert de éxito
        Swal.fire({
          icon: 'success',
          title: 'Servicio modificado correctamente',
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          // Redirigir a la página de usuarios
          window.location.href = "/servicios";
        });
      }
    });
  };


    const eliminar = (_id) => {
        Swal.fire({
          title: '¿Está seguro?',
          text: '¿Está seguro de que desea eliminar el servicio?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.isConfirmed) {
            let servicio = {
              _id: _id
            };
      
            fetch(url, {
              method: "DELETE",
              mode: "cors",
              headers: { "Content-type": "application/json; charset=UTF-8" },
              body: JSON.stringify(servicio),
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


      const buscarServicio = async () => {
        const buscarServicio = document.getElementById("buscarServicio").value;
      
        try {
          const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            headers: { "Content-type": "application/json; charset=UTF-8" },
          });
      
          if (response.ok) {
            const data = await response.json();
            const servicios = data.servicios;
      
            let respuesta = "";
            const body = document.getElementById("contenido");
      
            servicios.forEach((servicio) => {
              if (
                servicio.nombre.toLowerCase().includes(buscarServicio.toLowerCase()) ||
                servicio.estado.toLowerCase() === buscarServicio.toLowerCase()
              ) {
                respuesta += `<tr>
                  <td>${servicio._id}</td>
                  <td>${servicio.nombre}</td>
                  <td>${servicio.precioVenta}</td>
                  <td>${servicio.estado}</td>
                  <td>
                      <a href='/editarServicio?_id=${servicio._id}'><button class="btn btn-warning" ><i class="fas fa-pen"></i></button></a>
                      <a href="#"><button class="btn btn-info"><i class="fas fa-eye"></i></button></a>
                      <label class="switch"><input type="checkbox" id="toggleSwitch"><span class="slider round"></span>
                      </label>
                      <button class="btn btn-danger" onclick="eliminar('${servicio._id}')"><i class="fas fa-trash"></i></button>
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
      

  if(document.querySelector("#btnRegistrarServicio")){
    document.querySelector("#btnRegistrarServicio").addEventListener('click', registrar)
  }


  if(document.querySelector("#btnBuscarServicio")){
    document.querySelector("#btnBuscarServicio").addEventListener('click', buscarServicio)
  }

  // Evento que se carga de primero cuando se redirecciona a una vista 
  document.addEventListener("DOMContentLoaded", function () {
    // Obtener la URL actual
    var url = window.location.href;
  
    if (url.includes("/editarServicio")) {
      // Analizar la cadena de consulta de la URL
      var queryString = url.split('?')[1];
      var params = new URLSearchParams(queryString);
      // Leer el valor del parámetro "parametro1"
      var servicio = params.get('servicio');
      consultarServicio (servicio);
    }
  });
  