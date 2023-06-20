const descargarPDFVentas = () => {
    console.log("Función descargarPDFVentas llamada");
    const url = "https://plantillaapi.onrender.com/api/venta";
    const urlClientes = "https://plantillaapi.onrender.com/api/cliente";
  
    fetch(url, {
      method: "GET",
      mode: "cors",
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error al obtener la lista de ventas: " + response.status);
        }
      })
      .then(data => {
        const ventas = data.ventas;
  
        // Obtener la información de los clientes
        fetch(urlClientes, {
          method: "GET",
          mode: "cors",
          headers: { "Content-type": "application/json; charset=UTF-8" },
        })
          .then(responseClientes => {
            if (responseClientes.ok) {
              return responseClientes.json();
            } else {
              throw new Error("Error al obtener la lista de clientes: " + responseClientes.status);
            }
          })
          .then(dataClientes => {
            const clientes = dataClientes.clientes;
  
            // Mapear las ventas y reemplazar el ID del cliente por su nombre
            const ventasConNombreCliente = ventas.map(venta => {
              const { _id,__v, ...ventaSinId } = venta;
              const clienteInfo = clientes.find(cliente => cliente._id === venta.cliente);
              const clienteNombre = clienteInfo ? clienteInfo.nombres : "Nombre no encontrado";
              return { ...ventaSinId, cliente: clienteNombre };
            });
  
            // Crear un nuevo documento PDF
            const doc = new window.jspdf.jsPDF();
  
            // Establecer el encabezado del PDF
            doc.setFontSize(20);
            doc.text("Ventas", doc.internal.pageSize.getWidth() / 2, 15 - 8, { align: "center" });
  
            // Agregar los datos de las ventas al PDF
            const columns = Object.keys(ventasConNombreCliente[0]);
            const rows = ventasConNombreCliente.map(venta => Object.values(venta));
            doc.autoTable({ head: [columns], body: rows });
  
            // Descargar el archivo PDF
            doc.save("ventas.pdf");
  
            console.log('Archivo PDF de ventas generado y descargado exitosamente');
          })
          .catch(error => {
            console.error("Error al obtener la lista de clientes:", error);
          });
      })
      .catch(error => {
        console.error("Error al obtener la lista de ventas:", error);
      });
  };
  
  // Agregar el evento de clic al botón de generación de PDF de ventas
  if (document.querySelector("#btnGenerarPDF")) {
    document.querySelector("#btnGenerarPDF").addEventListener("click", descargarPDFVentas);
  }
  