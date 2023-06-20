const url = "https://plantillaapi.onrender.com/api/abono";

const validarAbono = () => {
    const expresionValorAbono = /^\d{1,3}(?:\.\d{3})*(?:\.\d+)?$/

    const valorAbono = document.getElementById("valorAbono").value;
    const fechaAbono = new Date(document.getElementById("fechaAbono").value);
    const fechaActual = new Date();

    let mensajeValor = "";
    let mensajeFecha = "";

    console.log(fechaAbono.toDateString()); // Imprimir fechaAbono en la consola
    console.log(fechaActual.toDateString()); 

    if (!expresionValorAbono.test(valorAbono)) {
        mensajeValor = "El valor del abono solo incluye números. Ejemplo: 60.000";
    }
    
    if (fechaAbono.toDateString() !== fechaActual.toDateString()) {
        mensajeFecha = "La fecha del abono debe ser igual a la fecha actual";
    }

    const alertElementValorAbono = document.getElementById("texto2");
    const alertElementFechaAbono = document.getElementById("texto1");

    alertElementValorAbono.innerHTML = mensajeValor;
    alertElementFechaAbono.innerHTML = mensajeFecha;

    alertElementValorAbono.style.display = mensajeValor ? "block" : "none";
    alertElementFechaAbono.style.display = mensajeFecha ? "block" : "none";
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
        const abonos = data.abonos;
  
        let respuesta = "";
        const body = document.getElementById("contenido");
  
        abonos.forEach((abono) => {
          respuesta += `<tr>
            <td>${abono._id}</td>
            <td>${abono.numeroFactura}</td>
            <td>${abono.fechaAbono}</td>
            <td>${abono.valorAbono}</td>
            <td>${abono.valorRestante}</td>
            <td>${abono.estado}</td>
            <td>
                <a href="/detalleAbono"><button class="btn btn-info"><i class="fas fa-eye"></i></button></a>
                <button class="btn btn-danger" onclick="eliminar('${abono._id}')"><i class="fas fa-trash"></i></button>
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
    
    const _numeroFactura = document.getElementById("numeroFactura").value;
    const _fechaAbono = document.getElementById("fechaAbono").value;
    const _valorAbono = document.getElementById("valorAbono").value;
    const _estado = document.getElementById("estado").value;
  
    // Validar los campos del producto
    validarAbono();
  
    const alertElementValorAbono = document.getElementById("texto2");
    const alertElementFechaAbono = document.getElementById("texto1");
  
    // Verificar si hay mensajes de error en las validaciones
    if (
      alertElementValorAbono.innerHTML ||
      alertElementFechaAbono.innerHTML 

    ) {
      // Si hay mensajes de error, no continuar con el registro
      return;
    }
  
    let abono = {
      numeroFactura: _numeroFactura,
      fechaAbono: _fechaAbono,
      valorAbono: _valorAbono,
      estado: _estado,
    };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(abono),
      });
  
      if (response.ok) {
        // Mostrar Sweet Alert de registro exitoso y cerrarlo automáticamente después de 1000 ms
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "El abono se ha registrado correctamente.",
          timer: 1000, // Tiempo en milisegundos (1 segundo)
          showConfirmButton: false, // Ocultar el botón de confirmación
        }).then(() => {
          listarDatos(); // Actualizar la lista de servicios
          window.location.href = "/abonos";
        });
      } else {
        console.error("Error al agregar el abono:", response.status);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };
  

  const eliminar = (_id) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Está seguro de que desea eliminar el abono?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        let abono = {
          _id: _id
        };
  
        fetch(url, {
          method: "DELETE",
          mode: "cors",
          headers: { "Content-type": "application/json; charset=UTF-8" },
          body: JSON.stringify(abono),
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


  const obtenerNumerosFacturaVentas = async () => {
    try {
      const response = await fetch("https://plantillaapi.onrender.com/api/venta", {
        method: "GET",
        mode: "cors",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
  
      if (response.ok) {
        const data = await response.json();
        const ventas = data.ventas;
  
        // Obtener los números de factura de las ventas
        const numerosFactura = ventas.map(venta => venta.numeroFactura);
  
        // Obtener el elemento select
        const selectNumeroFactura = document.getElementById("numeroFactura");
  
        // Limpiar las opciones existentes
        selectNumeroFactura.innerHTML = "";
  
        // Agregar las opciones de número de factura al select
        numerosFactura.forEach(numero => {
          const option = document.createElement("option");
          option.value = numero;
          option.text = numero;
          selectNumeroFactura.appendChild(option);
        });
      } else {
        console.error("Error al obtener la lista de ventas:", response.status);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };
  

  if (document.querySelector("#btnRegistrarAbono")) {
    document.querySelector("#btnRegistrarAbono").addEventListener("click", registrar);
  }

