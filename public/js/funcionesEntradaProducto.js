const validarProductos = () => {
    const expresionCantidad = /^\d{1,500}$/;
    const cantidad = document.getElementById("cantidad").value;
    let mensajeCantidad = "";
  
    if (!expresionCantidad.test(cantidad)) {
      mensajeCantidad = "La cantidad solo puede incluir números <br>";
    } else if (cantidad <= 0) {
      mensajeCantidad = "La cantidad tiene que ser mayor a cero";
    }
  
    const alertElementCantidad = document.getElementById("texto");
    alertElementCantidad.innerHTML = mensajeCantidad;
    alertElementCantidad.style.display = mensajeCantidad ? "block" : "none";
  
    return mensajeCantidad === ""; // Devuelve true si no hay mensajes de error, false de lo contrario
  };
  
function agregarEntradaProducto() {
    if (validarProductos()) {
      var cantidad = document.getElementById("cantidad").value;
      var entradaDiv = document.createElement("div");
      entradaDiv.innerHTML = "Cantidad: " + cantidad;
  
      var textoDiv = document.getElementById("texto");
      textoDiv.appendChild(entradaDiv);
  
      document.getElementById("cantidad").value = "";
  
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "La cantidad se agregó correctamente.",
        showConfirmButton: false,
        timer: 700, // Mostrar el mensaje durante 0.7 segundos
      }).then(function () {
        // Redireccionar a otra página después de 0.7 segundos
        setTimeout(function () {
          window.location.href = "/productos"; // Reemplaza '/productos' con la URL de la página a la que deseas redireccionar
        }, 700);
      });
    }
  }
  
  var btnRegistrarProducto = document.getElementById("btnRegistrarProducto");
  btnRegistrarProducto.addEventListener("click", agregarEntradaProducto);