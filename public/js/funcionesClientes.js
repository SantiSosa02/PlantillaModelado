//const url = "https://plantillaapi.onrender.com/api/cliente";
const url = "http://localhost:8080/api/cliente";

const validarClientes=() =>{
    const expresionNombres= /^[a-zA-Z]+ *[a-zA-Z]*$/;
    const expresionApellidos= /^[a-zA-Z]+ *[a-zA-Z]*$/;
    const expresionCorreo= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const expresionTelefono = /^\d{5,15}$/

    const nombres=document.getElementById("nombres").value;
    const apellidos=document.getElementById("apellidos").value;
    const correo=document.getElementById("correo").value;
    const telefono=document.getElementById("telefono").value;

    let mensajeNombres="";
    let mensajeApellidos="";
    let mensajeTelefono="";
    let mensajeCorreo=""

    if(!expresionNombres.test(nombres)){
        mensajeNombres =" El nombre solo debe incluir letras<br><br>";
    }
    if(!expresionApellidos.test(apellidos)){
        mensajeApellidos =" El apellido solo puede tener letras <br><br>";
    }
    if(!expresionCorreo.test(correo)){
        mensajeCorreo =" El correo debe llevar este orden ejemplo@gmail.com <br><br>"
    }
    if(!expresionTelefono.test(telefono)){
        mensajeTelefono =" El celular solo debe contener numeros <br><br>";
    }

    const alertElementNombres = document.getElementById("texto");
    const alertElementApellidos = document.getElementById("texto1");
    const alertElementTelefono = document.getElementById("texto2");
    const alertElementCorreo = document.getElementById("texto3");

    alertElementNombres.innerHTML=mensajeNombres;
    alertElementApellidos.innerHTML=mensajeApellidos;
    alertElementTelefono.innerHTML=mensajeTelefono;
    alertElementCorreo.innerHTML=mensajeCorreo;

    alertElementNombres.style.display = mensajeNombres ? "block" : "none";
    alertElementApellidos.style.display = mensajeApellidos ? "block" : "none";
    alertElementTelefono.style.display = mensajeTelefono ? "block" : "none";
    alertElementCorreo.style.display = mensajeCorreo ? "block" : "none";


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
      let listaClientes = data.clientes;
      datos = listaClientes.map(function (cliente) {
        const row = document.createElement('tr');
        const estadoCell = document.createElement('td');
        const accionesCell = document.createElement('td');
        const accionesDiv = document.createElement('div');
        const editarIcon = document.createElement('a');
       // const eliminarIcon = document.createElement('a');
        const switchLabel = document.createElement('label');
        const switchInput = document.createElement('input');
        const switchSpan = document.createElement('span');

        estadoCell.textContent = cliente.estado === 'true' ? 'activo' : 'inactivo';
        switchInput.type = 'checkbox';
        switchInput.checked = cliente.estado === 'true'; // Establecer el estado del checkbox en función del valor actual

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

              const clienteId = row.getAttribute('data-id');
              const newEstado = this.checked ? 'true' : 'false'; // Actualizar el nuevo estado basado en el checkbox

              console.log('Producto ID:', clienteId);
              console.log('Nuevo estado:', newEstado);

              fetch(url + '?id=' + clienteId, {
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
                  cliente.estado = newEstado;
                  console.log('Estado actualizado:', cliente.estado);
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
        //eliminarIcon.classList.add('btn', 'btn-danger', 'mr-2');
        //eliminarIcon.innerHTML='<i class="fas fa-trash"></i>';
        switchLabel.classList.add('switch');
        switchSpan.classList.add('slider');
        switchSpan.classList.add('round');

        editarIcon.onclick = function() {
          editar(cliente);
        };

        /*eliminarIcon.onclick = function() {
          eliminar(cliente._id);
        };*/

        switchLabel.appendChild(switchInput);
        switchLabel.appendChild(switchSpan);
        accionesDiv.appendChild(editarIcon);
        //accionesDiv.appendChild(eliminarIcon);
        accionesDiv.appendChild(switchLabel);
        accionesCell.appendChild(accionesDiv);

        row.setAttribute('data-id', cliente._id); // Agregar el ID del producto como atributo

        row.innerHTML = `<td>${cliente._id}</td>` +
          `<td>${cliente.nombres}</td>` +
          `<td>${cliente.apellidos}</td>`+
          `<td>${cliente.telefono}</td>`+
          `<td>${cliente.correo}</td>`;


        row.appendChild(estadoCell);
        row.appendChild(accionesCell);
        body.appendChild(row);
      });
    });
};

  const registrar = async () => {

    const _nombres = document.getElementById("nombres").value;
    const _apellidos = document.getElementById("apellidos").value;
    const _correo = document.getElementById("correo").value;
    const _telefono = document.getElementById("telefono").value;
    const _estado = document.getElementById("estado").value;
  
    // Validar los campos del usuario
    validarClientes();
  
    const alertElementNombres = document.getElementById("texto");
    const alertElementApellidos = document.getElementById("texto1");
    const alertElementTelefono = document.getElementById("texto2");
    const alertElementCorreo = document.getElementById("texto3");
  
    console.log(alertElementNombres)
    // Verificar si hay mensajes de error en las validaciones
    if (
      alertElementNombres.innerHTML ||
      alertElementApellidos.innerHTML ||
      alertElementTelefono.innerHTML ||
      alertElementCorreo.innerHTML 

    ) {
      // Si hay mensajes de error, no continuar con el registro
      return;
    }
  
    
      let cliente = {
        nombres: _nombres,
        apellidos: _apellidos,
        telefono:_telefono,
        correo: _correo,
        estado: _estado,
      };
  
      try {
        const response = await fetch(url, {
          method: "POST",
          mode: "cors",
          headers: { "Content-type": "application/json; charset=UTF-8" },
          body: JSON.stringify(cliente),
        });
  
        if (response.ok) {
          // Mostrar Sweet Alert de registro exitoso y cerrarlo automáticamente después de 1000 ms
          Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            text: "El cliente se ha registrado correctamente.",
            timer: 1000, // Tiempo en milisegundos (1 segundo)
            showConfirmButton: false, // Ocultar el botón de confirmación
          }).then(() => {
            listarDatos(); // Actualizar la lista de servicios
            window.location.href = "/clientes";
          });
        } else {
          console.error("Error al agregar el cliente:", response.status);
        }
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
      }
  };

  const editar = (cliente) => {
    var url = "/editarCliente?cliente=" + encodeURIComponent(cliente._id);
    window.location.href = url;
  
  };

  const consultarCliente = (cliente) => {

    const url2 = url + '?_id=' + cliente.toString();
    fetch(url2+ "", {
      method: 'GET',
      mode: 'cors',
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
      .then((resp) => resp.json())
      .then(function (data) {
  
        let cliente = data.clientes;
        document.getElementById('_id').value = cliente._id;
        document.getElementById('nombres').value = cliente.nombres;
        document.getElementById('apellidos').value = cliente.apellidos;
        document.getElementById('telefono').value = cliente.telefono;
        document.getElementById('correo').value = cliente.correo;
        document.getElementById('estado').value = cliente.estado;
      });
  
  }

  const modificar = async () => {

    let id = document.getElementById('_id').value;
    let nombres = document.getElementById('nombres').value;
    let apellidos = document.getElementById('apellidos').value;
    let telefono = document.getElementById('telefono').value;
    let correo = document.getElementById('correo').value;
    let estado = document.getElementById('estado').value;

     // Validar los campos del usuario
     validarClientes();
  
     const alertElementNombres = document.getElementById("texto");
     const alertElementApellidos = document.getElementById("texto1");
     const alertElementTelefono = document.getElementById("texto2");
     const alertElementCorreo = document.getElementById("texto3");
   
     console.log(alertElementNombres)
     // Verificar si hay mensajes de error en las validaciones
     if (
       alertElementNombres.innerHTML ||
       alertElementApellidos.innerHTML ||
       alertElementTelefono.innerHTML ||
       alertElementCorreo.innerHTML 
 
     ) {
       // Si hay mensajes de error, no continuar con el registro
       return;
     }

  
    let cliente = {
      nombres: nombres,
      apellidos: apellidos,
      telefono:telefono,
      correo: correo,
      estado: estado,
    };
  
    fetch(url + `?id=${id}`, {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(cliente),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then((resp) => resp.json())
    .then(json => {
      if (json.msg) {
        // Mostrar Sweet Alert de éxito
        Swal.fire({
          icon: 'success',
          title: 'Cliente modificado correctamente',
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          // Redirigir a la página de usuarios
          window.location.href = "/clientes";
        });
      }
    });
  };

 /* const eliminar = (_id) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Está seguro de que desea eliminar el cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      showLoaderOnConfirm: true
    }).then((result) => {
      if (result.isConfirmed) {
        let cliente = {
          _id: _id
        };
  
        fetch(url, {
          method: "DELETE",
          mode: "cors",
          headers: { "Content-type": "application/json; charset=UTF-8" },
          body: JSON.stringify(cliente),
        })
          .then((resp) => resp.json())
          .then(json => {
            Swal.fire({
              title: 'Eliminado',
              text: json.msg,
              icon: 'success',
              timer: 1000,
              showConfirmButton: false
            });
  
            setTimeout(() => {
              location.reload(); // Recargar la página
            }, 1000);
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
  };*/
  
      const buscarCliente = async () => {
        const buscarCliente = document.getElementById("buscarCliente").value;
      
        try {
          const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            headers: { "Content-type": "application/json; charset=UTF-8" },
          });
      
          if (response.ok) {
            const data = await response.json();
            const clientes = data.clientes;
      
            let respuesta = "";
            const body = document.getElementById("contenido");
      
            clientes.forEach((cliente) => {
              if (
                cliente.nombres.toLowerCase().includes(buscarCliente.toLowerCase()) ||
                cliente.apellidos.toLowerCase().includes(buscarCliente.toLowerCase()) ||
                cliente.telefono.toLowerCase().includes(buscarCliente.toLowerCase()) ||
                cliente.estado.toLowerCase() === buscarCliente.toLowerCase()
              ) {
                respuesta += `<tr>
                  <td>${cliente._id}</td>
                  <td>${cliente.nombres}</td>
                  <td>${cliente.apellidos}</td>
                  <td>${cliente.telefono}</td>
                  <td>${cliente.correo}</td>
                  <td>${cliente.estado}</td>
                  <td>
                      <a href='/editarCliente?_id=${cliente._id}'><button class="btn btn-warning" ><i class="fas fa-pen"></i></button></a>
                      <a href="#"><button class="btn btn-info"><i class="fas fa-eye"></i></button></a>
                      <label class="switch"><input type="checkbox" id="toggleSwitch"><span class="slider round"></span>
                      </label>
                      <button class="btn btn-danger" onclick="eliminar('${cliente._id}')"><i class="fas fa-trash"></i></button>
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

  if(document.querySelector("#btnRegistrarCliente")){
    document.querySelector("#btnRegistrarCliente").addEventListener('click', registrar)
  }

  if(document.querySelector("#btnBuscarCliente")){
    document.querySelector("#btnBuscarCliente").addEventListener('click', buscarCliente)
  }

    // Evento que se carga de primero cuando se redirecciona a una vista 
document.addEventListener("DOMContentLoaded", function () {
  // Obtener la URL actual
  var url = window.location.href;

  if (url.includes("/editarCliente")) {
    // Analizar la cadena de consulta de la URL
    var queryString = url.split('?')[1];
    var params = new URLSearchParams(queryString);
    // Leer el valor del parámetro "parametro1"
    var cliente = params.get('cliente');
    consultarCliente (cliente);
  }
});


