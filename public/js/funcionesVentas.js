const url = "http://localhost:8080/api/venta";

const valirVentas=()=>{
    const expresionNumeroFactura= /^\d{1,500}$/
    const expresionCantidad= /^\d{1,500}$/
    const expresionValorFactura=/^\d{1,3}(?:\.\d{3})*(?:\.\d+)?$/

    const numeroFactura=document.getElementById("numeroFactura").value;
    const valorFactura=document.getElementById("valorFactura").value;
    const cantidad=document.getElementById("cantidadProducto").value;

    let mensajeNumeroFactura="";
    let mensajeCantidad="";
    let mensajeValorFactura="";

    if(!expresionNumeroFactura.test(numeroFactura)){
        mensajeNumeroFactura = "El numero solo puede incluir numeros";
    }
    if(!expresionCantidad.test(cantidad)){
        mensajeCantidad = "La cantidad solo puede incluir numeros";
    }
    if(!expresionValorFactura.test(valorFactura)){
        mensajeValorFactura = "El valor de la factura solo incluye numeros ejemplo<br> * 60.000";
    }

    const alertElementNumeroFactura=document.getElementById("texto");
    const alertElementCantidadProducto=document.getElementById("texto2");
    const alertElementValorFactura=document.getElementById("texto1");
    const alertElementCantidadServicio=document.getElementById("texto3");

    alertElementNumeroFactura.innerHTML=mensajeNumeroFactura;
    alertElementCantidadProducto.innerHTML=mensajeCantidad;
    alertElementCantidadServicio.innerHTML=mensajeCantidad;
    alertElementValorFactura.innerHTML=mensajeValorFactura;

    alertElementNumeroFactura.style.display=mensajeNumeroFactura ? "block" : "none";
    alertElementCantidadProducto.style.display=mensajeCantidad ? "block" : "none";
    alertElementCantidadServicio.style.display=mensajeCantidad ? "block" : "none";
    alertElementValorFactura.style.display=mensajeValorFactura ? "block" : "none";
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
    .then(async function (data) {
      let listaVentas = data.ventas;
      const clientes = await obtenerClientes(); // Obtener las categorías

      listaVentas.forEach((venta) => {
        const row = document.createElement('tr');
        const estadoCell = document.createElement('td');
        const accionesCell = document.createElement('td');
        const accionesDiv = document.createElement('div');
        const editarIcon = document.createElement('a');
        const eliminarIcon = document.createElement('a');
        const switchLabel = document.createElement('label');
        const switchInput = document.createElement('input');
        const switchSpan = document.createElement('span');

        estadoCell.textContent = venta.estado === 'true' ? 'activo' : 'inactivo';
        switchInput.type = 'checkbox';
        switchInput.checked = venta.estado === 'true'; // Establecer el estado del checkbox en función del valor actual

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

              const ventaId = venta._id;
              const newEstado = this.checked ? 'true' : 'false'; // Actualizar el nuevo estado basado en el checkbox

              console.log('Producto ID:', ventaId);
              console.log('Nuevo estado:', newEstado);

              fetch(url + '?id=' + ventaId, {
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
                  venta.estado = newEstado;
                  console.log('Estado actualizado:', venta.estado);
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
          editar(venta);
        };

        eliminarIcon.onclick = function() {
          eliminar(venta._id);
        };

        switchLabel.appendChild(switchInput);
        switchLabel.appendChild(switchSpan);
        accionesDiv.appendChild(editarIcon);
        accionesDiv.appendChild(eliminarIcon);
        accionesDiv.appendChild(switchLabel);
        accionesCell.appendChild(accionesDiv);

        row.setAttribute('data-id', venta._id); // Agregar el ID del producto como atributo

        // Buscar el nombre de la categoría correspondiente al ID
        const cliente = clientes.find((cat) => cat._id === venta.cliente);
        const nombreCliente = cliente ? cliente.nombres : "";

        row.innerHTML = `<td>${venta._id}</td>` +
          `<td>${nombreCliente}</td>` +
          `<td>${venta.fecha}</td>` +
          `<td>${venta.numeroFactura}</td>` +
          `<td>${venta.metodoPago}</td>` +
          `<td>${venta.valorFactura}</td>`;

        row.appendChild(estadoCell);
        row.appendChild(accionesCell);
        body.appendChild(row);
      });
    })
    .catch(function (error) {
      console.error('Error en la solicitud:', error);
    });
}


  const registrar = async () => {
const _cliente=document.getElementById("cliente").value;
const _fecha=document.getElementById("fecha").value;
const _numeroFactura=document.getElementById("numeroFactura").value;
const _metodoPago=document.getElementById("metodoPago").value;
const _valorFactura=document.getElementById("valorFactura").value;



    // Validar los campos del usuario
    valirVentas();
  
    const alertElementNumeroFactura=document.getElementById("texto");
    const alertElementCantidadProducto=document.getElementById("texto2");
    const alertElementValorFactura=document.getElementById("texto1");
    const alertElementCantidadServicio=document.getElementById("texto3");

    // Verificar si hay mensajes de error en las validaciones
    if (
      alertElementNumeroFactura.innerHTML ||
      alertElementCantidadProducto.innerHTML ||
      alertElementValorFactura.innerHTML ||
      alertElementCantidadServicio.innerHTML 
    ) {
      // Si hay mensajes de error, no continuar con el registro
      return;
    }
  

      let venta = {
        cliente: _cliente,
        fecha: _fecha,
        numeroFactura: _numeroFactura,
        metodoPago: _metodoPago,
        valorFactura: _valorFactura,
      };
  
      try {
        const response = await fetch(url, {
          method: "POST",
          mode: "cors",
          headers: { "Content-type": "application/json; charset=UTF-8" },
          body: JSON.stringify(venta),
        });
  
        if (response.ok) {
          // Mostrar Sweet Alert de registro exitoso y cerrarlo automáticamente después de 1000 ms
          Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            text: "La venta se ha registrado correctamente.",
            timer: 1000, // Tiempo en milisegundos (1 segundo)
            showConfirmButton: false, // Ocultar el botón de confirmación
          }).then(() => {
            listarDatos(); // Actualizar la lista de servicios
            window.location.href = "/ventas";
          });
        } else {
          console.error("Error al agregar la venta:", response.status);
        }
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
      }
  };

  const obtenerClientes = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/cliente", {
        method: "GET",
        mode: "cors",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
  
      if (response.ok) {
        const data = await response.json();
        const clientes = data.clientes;
        generarOpcionesClientes(clientes); // Generar opciones del campo de selección
        return clientes;
      } else {
        console.error("Error al obtener la lista de clientes:", response.status);
        return [];
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      return [];
    }
  };
  const generarOpcionesClientes = (clientes) => {
    const selectCliente = document.getElementById("cliente");
  
    if (selectCliente) {
      // Crear un conjunto para almacenar las categorías únicas
      const clienteUicos = new Set();
  
      clientes.forEach((cliente) => {
        clienteUicos.add(cliente._id);
      });
  
      // Limpiar las opciones existentes en el select
      selectCliente.innerHTML = "";
  
      // Crear las opciones en el select con las categorías únicas
      clienteUicos.forEach((clienteId) => {
        const cliente = clientes.find((c) => c._id === clienteId);
  
        if (cliente) {
          const option = document.createElement("option");
          option.value = cliente._id;
          option.textContent = cliente.nombres;
          selectCliente.appendChild(option);
        }
      });
    }
  };

  const obtenerProductos = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/producto", {
        method: "GET",
        mode: "cors",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
  
      if (response.ok) {
        const data = await response.json();
        const productos = data.productos;
        generarOpcionesProductos(productos); // Generar opciones del campo de selección
        return productos;
      } else {
        console.error("Error al obtener la lista de productos:", response.status);
        return [];
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      return [];
    }
  };

  const generarOpcionesProductos = (productos) => {
    const selectProductos = document.getElementById("productos");
  
    if (selectProductos) {
      // Limpiar las opciones existentes en el select
      selectProductos.innerHTML = "";
  
      // Crear las opciones en el select con los productos
      productos.forEach((producto) => {
        const option = document.createElement("option");
        option.value = producto._id;
        option.textContent = producto.nombre;
        selectProductos.appendChild(option);
      });
    }
  };

  const obtenerServicios = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/servicio", {
        method: "GET",
        mode: "cors",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
  
      if (response.ok) {
        const data = await response.json();
        const servicios = data.servicios;
        generarOpcionesServicios(servicios); // Generar opciones del campo de selección
        return servicios;
      } else {
        console.error("Error al obtener la lista de productos:", response.status);
        return [];
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      return [];
    }
  };

  const generarOpcionesServicios = (servicios) => {
    const selectServicios = document.getElementById("servicios");
  
    if (selectServicios) {
      // Limpiar las opciones existentes en el select
      selectServicios.innerHTML = "";
  
      // Crear las opciones en el select con los productos
      servicios.forEach((servicio) => {
        const option = document.createElement("option");
        option.value = servicio._id;
        option.textContent = servicio.nombre;
        selectServicios.appendChild(option);
      });
    }
  };

  const eliminar = (_id) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Está seguro de que desea eliminar la venta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        let venta = {
          _id: _id
        };
  
        fetch(url, {
          method: "DELETE",
          mode: "cors",
          headers: { "Content-type": "application/json; charset=UTF-8" },
          body: JSON.stringify(venta),
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
              text: 'Error al eliminar la venta',
              icon: 'error'
            });
            console.error('Error al eliminar el usuario:', error);
          });
      }
    });
  };

  const buscarVenta = async () => {
    const buscarVenta = document.getElementById("buscarVenta").value;
  
    try {
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
  
      if (response.ok) {
        const data = await response.json();
        const ventas = data.ventas;
  
        let respuesta = "";
        const body = document.getElementById("contenido");

        const clientes = await obtenerClientes(); 
  
        ventas.forEach((venta) => {
          const cliente = clientes.find((clie) => clie._id === venta.cliente);
            const nombreCliente = cliente ? cliente.nombres : "";
 
          if (
            venta.numeroFactura.toLowerCase().includes(buscarVenta.toLowerCase()) ||
            nombreCliente.toLowerCase().includes(buscarVenta.toLowerCase()) ||
            venta.estado.toLowerCase() === buscarVenta.toLowerCase()
          ) {
            respuesta += `<tr>
              <td>${venta._id}</td>
              <td>${nombreCliente}</td>
              <td>${venta.fecha}</td>
              <td>${venta.numeroFactura}</td>
              <td>${venta.metodoPago}</td>
              <td>${venta.valorFactura}</td>
              <td>${venta.estado}</td>
              <td>
                  <a href="#"><button class="btn btn-info"><i class="fas fa-eye"></i></button></a>
                  <label class="switch"><input type="checkbox" id="toggleSwitch"><span class="slider round"></span>
                  </label>
                  <button class="btn btn-danger" onclick="eliminar('${venta._id}')"><i class="fas fa-trash"></i></button>
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

  function obtenerPrecioProducto(productoId) {
    // Realizar una solicitud AJAX para obtener el precio del producto desde la base de datos
    // Supongamos que estás utilizando jQuery para simplificar la llamada AJAX
  
    $.ajax({
      url: "http://localhost:8080/api/producto",
      method: 'GET',
      data: { productoId: productoId },
      success: function(response) {
        // La respuesta de la solicitud contiene el precio del producto
        const precio = response.precioVenta; // Actualizar el campo "precioVenta"
  
        // Realizar la acción necesaria con el precio (por ejemplo, mostrarlo en la interfaz de usuario)
        console.log('Precio del producto:', precio);
      },
      error: function(error) {
        console.error('Error al obtener el precio del producto:', error);
      }
    });
  }
  
  
  function agregarProducto() {
    // Obtener el producto seleccionado y la cantidad ingresada
    const selectProductos = document.getElementById("productos");
    const cantidadInput = document.getElementById("cantidadProducto");
    const productoSeleccionado = selectProductos.value;
    const cantidad = cantidadInput.value;
  
    // Obtener el texto del producto seleccionado
    const productoTexto = selectProductos.options[selectProductos.selectedIndex].text;
  
    // Realizar una solicitud al servicio para obtener el precio del producto seleccionado
    obtenerPrecioProducto(productoSeleccionado, function(precioProducto) {
      // Calcular el precio total
      const precioTotal = precioProducto * cantidad;
  
      // Crear una nueva fila en la tabla con los datos del producto y la cantidad
      const tablaProductos = document.getElementById("contenidoProductos");
      const nuevaFila = document.createElement("tr");
      nuevaFila.innerHTML = `
        <td>${productoSeleccionado}</td>
        <td>${productoTexto}</td>
        <td>${cantidad}</td>
        <td>${precioProducto}</td>
        <td>${precioTotal}</td>
        <td>
          <button onclick="editarProducto(this)">Editar</button>
          <button onclick="eliminarProducto(this)">Eliminar</button>
        </td>
      `;
      tablaProductos.appendChild(nuevaFila);
  
      // Limpiar los campos de producto y cantidad
      selectProductos.selectedIndex = 0;
      cantidadInput.value = "";
    });
  }
  
  function obtenerPrecioProducto(productoId, callback) {
    // Realizar una solicitud AJAX para obtener el precio del producto desde el servicio
    // Supongamos que estás utilizando jQuery para simplificar la llamada AJAX
  
    $.ajax({
      url: "http://localhost:8080/api/producto",
      method: 'GET',
      data: { productoId: productoId },
      success: function(response) {
        // La respuesta de la solicitud contiene el precio del producto
        const precio = response.precioVenta;
  
        // Llamar al callback con el precio obtenido
        callback(precio);
      },
      error: function(error) {
        console.error('Error al obtener el precio del producto:', error);
      }
    });
  }

  function agregarServicio() {
    // Obtener el servicio seleccionado y la cantidad ingresada
    const selectServicios = document.getElementById("servicios");
    const cantidadInput = document.getElementById("cantidadServicio");
    const servicioSeleccionado = selectServicios.value;
    const cantidad = parseInt(cantidadInput.value); // Convertir a número entero
    
    // Obtener el texto del servicio seleccionado
    const servicioTexto = selectServicios.options[selectServicios.selectedIndex].text;
    
    // Realizar una solicitud al servicio para obtener el precio del servicio seleccionado
    obtenerPrecioServicio(servicioSeleccionado, function(precioServicio) {
      // Calcular el precio total
      const precioTotal = precioServicio * cantidad;
    
      // Crear una nueva fila en la tabla con los datos del servicio y la cantidad
      const tablaServicios = document.getElementById("contenidoServicios");
      const nuevaFila = document.createElement("tr");
      nuevaFila.innerHTML = `
        <td>${servicioSeleccionado}</td>
        <td>${servicioTexto}</td>
        <td>${cantidad}</td>
        <td>${precioServicio}</td>
        <td>${precioTotal}</td>
        <td>
          <button onclick="editarServicio(this)">Editar</button>
          <button onclick="eliminarServicio(this)">Eliminar</button>
        </td>
      `;
      tablaServicios.appendChild(nuevaFila);
    
      // Limpiar los campos de servicio y cantidad
      selectServicios.selectedIndex = 0;
      cantidadInput.value = "";
    });
  }
  
  function obtenerPrecioServicio(servicioId, callback) {
    // Realizar una solicitud AJAX para obtener el precio del servicio desde el servicio
    // Supongamos que estás utilizando jQuery para simplificar la llamada AJAX
  
    $.ajax({
      url: "http://localhost:8080/api/servicio",
      method: 'GET',
      data: { servicioId: servicioId },
      success: function(response) {
        // La respuesta de la solicitud contiene el precio del servicio
        const precio = response.precioVenta;
  
        // Llamar al callback con el precio obtenido
        callback(precio);
      },
      error: function(error) {
        console.error('Error al obtener el precio del servicio:', error);
      }
    });
  }
  
  
  
  



  document.addEventListener("DOMContentLoaded", () => {
    obtenerClientes();
    obtenerProductos();
    obtenerServicios();
  });


  if(document.querySelector("#btnRegistrarVenta")){
    document.querySelector("#btnRegistrarVenta").addEventListener('click',registrar)
  }

  if(document.querySelector("#btnBuscarVenta")){
    document.querySelector("#btnBuscarVenta").addEventListener('click',buscarVenta)
  }

  
  