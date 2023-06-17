const url = "http://localhost:8080/api/producto";

const validarProductos=() =>{
    const expresionNombres= /^[a-zA-Z]+ *[a-zA-Z]*$/;
    const expresionCantidad= /^\d{1,500}$/
    const expresionPrecioVenta=/^\d{1,3}(?:\.\d{3})*(?:\.\d+)?$/
 
    const nombre=document.getElementById("nombre").value;
    const cantidad=document.getElementById("cantidad").value;
    const stockMinimo=document.getElementById("stockMinimo").value;
    const precioVenta=document.getElementById("precioVenta").value;


    let mensajeNombre="";
    let mensajeCantidad="";
    let mensajeStockMinimo="";
    let mensajePrecio="";
    
    if(!expresionNombres.test(nombre)){
        mensajeNombre ="* El nombre solo debe incluir letras<br><br>";
    }
    if(!expresionCantidad.test(cantidad)){
        mensajeCantidad =" La cantidad solo puede incluir numeros <br><br>";
    }
    if(!expresionPrecioVenta.test(precioVenta)){
        mensajePrecio=" El precio de la venta solo incluye numeros ejemplo<br> * 60.000";
    }
    if(!expresionCantidad.test(stockMinimo)){
        mensajeStockMinimo=" El stock minmo solo puede incluir numeros <br><br>"
    }
   
    const alertElementNombre = document.getElementById("texto");
    const alertElementStockMinimo = document.getElementById("texto1");
    const alertElementCantidad = document.getElementById("texto2");
    const alertElementPrecio = document.getElementById("texto3");

    alertElementNombre.innerHTML=mensajeNombre;
    alertElementStockMinimo.innerHTML=mensajeStockMinimo;
    alertElementCantidad.innerHTML=mensajeCantidad;
    alertElementPrecio.innerHTML=mensajePrecio;

    alertElementNombre.style.display = mensajeNombre ? "block" : "none";
    alertElementStockMinimo.style.display = mensajeStockMinimo ? "block" : "none";
    alertElementCantidad.style.display = mensajeCantidad ? "block" : "none";
    alertElementPrecio.style.display = mensajePrecio ? "block" : "none";

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
      const productos = data.productos;

      let respuesta = "";
      const body = document.getElementById("contenido");

      const categorias = await obtenerCategorias(); // Obtener las categorías

      productos.forEach((producto) => {
        // Buscar el nombre de la categoría correspondiente al ID
        const categoria = categorias.find((cat) => cat._id === producto.categoria);
        const nombreCategoria = categoria ? categoria.nombre : "";

        respuesta += `<tr>
          <td>${producto._id}</td>
          <td>${producto.nombre}</td>
          <td>${nombreCategoria}</td> 
          <td>${producto.stockMinimo}</td>
          <td>${producto.cantidad}</td>
          <td>${producto.precioVenta}</td>
          <td>${producto.estado}</td>
          <td>
              <a onclick='editar(${JSON.stringify(producto)})'><button class="btn btn-warning" ><i class="fas fa-pen"></i></button></a>
              <label class="switch"><input type="checkbox" id="toggleSwitch"><span class="slider round"></span>
              </label>
              <a href="#"><button class="btn btn-info"><i class="fa-solid fa-plus"></i></button></a>
              <button class="btn btn-danger" onclick="eliminar('${producto._id}')"><i class="fas fa-trash"></i></button>
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
    const _categoria = document.getElementById("categoria").value;
    const _stockMinimo = document.getElementById("stockMinimo").value;
    const _cantidad = document.getElementById("cantidad").value;
    const _precioVenta = document.getElementById("precioVenta").value;
    const _estado = document.getElementById("estado").value;
  
    // Validar los campos del producto
    validarProductos();
  
    const alertElementNombre = document.getElementById("texto");
    const alertElementStockMinimo = document.getElementById("texto1");
    const alertElementCantidad = document.getElementById("texto2");
    const alertElementPrecio = document.getElementById("texto3");
  
    // Verificar si hay mensajes de error en las validaciones
    if (
      alertElementNombre.innerHTML ||
      alertElementStockMinimo.innerHTML ||
      alertElementCantidad.innerHTML ||
      alertElementPrecio.innerHTML
    ) {
      // Si hay mensajes de error, no continuar con el registro
      return;
    }
  
    let producto = {
      nombre: _nombre,
      categoria: _categoria,
      stockMinimo: _stockMinimo,
      cantidad: _cantidad,
      precioVenta: _precioVenta,
      estado: _estado,
    };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(producto),
      });
  
      if (response.ok) {
        // Mostrar Sweet Alert de registro exitoso y cerrarlo automáticamente después de 1000 ms
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "El producto se ha registrado correctamente.",
          timer: 1000, // Tiempo en milisegundos (1 segundo)
          showConfirmButton: false, // Ocultar el botón de confirmación
        }).then(() => {
          listarDatos(); // Actualizar la lista de servicios
          window.location.href = "/productos";
        });
      } else {
        console.error("Error al agregar el producto:", response.status);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const editar = (producto) => {
    var url = "/editarProducto?producto=" + encodeURIComponent(producto._id);
    window.location.href = url;
  
  };

  const consultarProducto = (producto) => {

    const url2 = url + '?_id=' + producto.toString();
    fetch(url2+ "", {
      method: 'GET',
      mode: 'cors',
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
      .then((resp) => resp.json())
      .then(function (data) {
  
        let producto = data.productos;
        document.getElementById('_id').value = producto._id;
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('categoria').value = producto.categoria;
        document.getElementById('stockMinimo').value = producto.stockMinimo;
        document.getElementById('cantidad').value = producto.cantidad;
        document.getElementById('precioVenta').value = producto.precioVenta;
        document.getElementById('estado').value = producto.estado;
      });
  
  }

  const modificar = async () => {

    let id = document.getElementById('_id').value;
    let nombre = document.getElementById('nombre').value;
    let categoria = document.getElementById('categoria').value;
    let stockMinimo = document.getElementById('stockMinimo').value;
    let cantidad = document.getElementById('cantidad').value;
    let precioVenta = document.getElementById('precioVenta').value;
    let estado = document.getElementById('estado').value;

     // Validar los campos del producto
     validarProductos();
  
     const alertElementNombre = document.getElementById("texto");
     const alertElementStockMinimo = document.getElementById("texto1");
     const alertElementCantidad = document.getElementById("texto2");
     const alertElementPrecio = document.getElementById("texto3");
   
     // Verificar si hay mensajes de error en las validaciones
     if (
       alertElementNombre.innerHTML ||
       alertElementStockMinimo.innerHTML ||
       alertElementCantidad.innerHTML ||
       alertElementPrecio.innerHTML
     ) {
       // Si hay mensajes de error, no continuar con el registro
       return;
     }

  
    let producto = {
      nombre: nombre,
      categoria: categoria,
      stockMinimo: stockMinimo,
      cantidad: cantidad,
      precioVenta:precioVenta,
      estado:estado
    };
  
    fetch(url + `?id=${id}`, {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(producto),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then((resp) => resp.json())
    .then(json => {
      if (json.msg) {
        // Mostrar Sweet Alert de éxito
        Swal.fire({
          icon: 'success',
          title: 'Producto modificado correctamente',
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          // Redirigir a la página de usuarios
          window.location.href = "/productos";
        });
      }
    });
  };

    const eliminar = (_id) => {
      Swal.fire({
        title: '¿Está seguro?',
        text: '¿Está seguro de que desea eliminar el producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          let producto = {
            _id: _id
          };
    
          fetch(url, {
            method: "DELETE",
            mode: "cors",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(producto),
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
                text: 'Error al eliminar el producto',
                icon: 'error'
              });
              console.error('Error al eliminar el prodicto:', error);
            });
        }
      });
    };

    const obtenerCategorias = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/categoria", {
          method: "GET",
          mode: "cors",
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
    
        if (response.ok) {
          const data = await response.json();
          const categorias = data.categorias;
          generarOpcionesCategorias(categorias); // Generar opciones del campo de selección
          return categorias;
        } else {
          console.error("Error al obtener la lista de categorías:", response.status);
          return [];
        }
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        return [];
      }
    };
    const generarOpcionesCategorias = (categorias) => {
      const selectCategoria = document.getElementById("categoria");
    
      if (selectCategoria) {
        // Crear un conjunto para almacenar las categorías únicas
        const categoriasUnicas = new Set();
    
        categorias.forEach((categoria) => {
          categoriasUnicas.add(categoria._id);
        });
    
        // Limpiar las opciones existentes en el select
        selectCategoria.innerHTML = "";
    
        // Crear las opciones en el select con las categorías únicas
        categoriasUnicas.forEach((categoriaId) => {
          const categoria = categorias.find((c) => c._id === categoriaId);
    
          if (categoria) {
            const option = document.createElement("option");
            option.value = categoria._id;
            option.textContent = categoria.nombre;
            selectCategoria.appendChild(option);
          }
        });
      }
    };
    
    const buscarProducto = async () => {
      const buscarProducto = document.getElementById("buscarProducto").value;
    
      try {
        const response = await fetch(url, {
          method: "GET",
          mode: "cors",
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
    
        if (response.ok) {
          const data = await response.json();
          const productos = data.productos;
    
          const categorias = await obtenerCategorias(); // Obtener las categorías
    
          let respuesta = "";
          const body = document.getElementById("contenido");
    
          productos.forEach((producto) => {
            // Buscar el nombre de la categoría correspondiente al ID
            const categoria = categorias.find((cat) => cat._id === producto.categoria);
            const nombreCategoria = categoria ? categoria.nombre : "";
    
            if (
              producto.nombre.toLowerCase().includes(buscarProducto.toLowerCase()) ||
              nombreCategoria.toLowerCase().includes(buscarProducto.toLowerCase()) ||
              producto.estado.toLowerCase() === buscarProducto.toLowerCase()
            ) {
              respuesta += `<tr>
                <td>${producto._id}</td>
                <td>${producto.nombre}</td>
                <td>${nombreCategoria}</td> 
                <td>${producto.stockMinimo}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.precioVenta}</td>
                <td>${producto.estado}</td>
                <td>
                    <a href='/editarProducto?_id=${producto._id}'><button class="btn btn-warning" ><i class="fas fa-pen"></i></button></a>
                    <label class="switch"><input type="checkbox" id="toggleSwitch"><span class="slider round"></span>
                    </label>
                    <a href="#"><button class="btn btn-info"><i class="fa-solid fa-plus"></i></button></a>
                    <button class="btn btn-danger" onclick="eliminar('${producto._id}')"><i class="fas fa-trash"></i></button>
                </td>
              </tr>`;
            }
          });
    
          body.innerHTML = respuesta;
        } else {
          console.error("Error al obtener la lista de productos:", response.status);
        }
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
      }
    };
    
  

// Llamar a la función obtenerCategorias cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", obtenerCategorias);

if (document.querySelector("#btnRegistrarProducto")) {
  document.querySelector("#btnRegistrarProducto").addEventListener('click', registrar);
}


if (document.querySelector("#btnBuscarProducto")) {
  document.querySelector("#btnBuscarProducto").addEventListener("click", buscarProducto);
}

  // Evento que se carga de primero cuando se redirecciona a una vista 
  document.addEventListener("DOMContentLoaded", function () {
    // Obtener la URL actual
    var url = window.location.href;
  
    if (url.includes("/editarProducto")) {
      // Analizar la cadena de consulta de la URL
      var queryString = url.split('?')[1];
      var params = new URLSearchParams(queryString);
      // Leer el valor del parámetro "parametro1"
      var producto = params.get('producto');
      consultarProducto (producto);
    }
  });
  
  
  
  
  