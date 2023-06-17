const descargarPDFServicios = () => {
    console.log("Función descargarPDFServicios llamada");
    const url = "http://localhost:8080/api/servicio";
  
    fetch(url, {
      method: "GET",
      mode: "cors",
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error al obtener la lista de servicios: " + response.status);
        }
      })
      .then(data => {
        const servicios = data.servicios;
  
        // Eliminar el campo _id y __v de cada servicio
        const serviciosSinIdV = servicios.map(servicio => {
          const { _id, __v, ...servicioSinIdV } = servicio;
          return servicioSinIdV;
        });
  
        // Crear un nuevo documento PDF
        const doc = new window.jspdf.jsPDF();
  
        // Establecer el encabezado del PDF
        doc.setFontSize(20);
        doc.text("Servicios", doc.internal.pageSize.getWidth() / 2, 15 - 8, { align: "center" });
  
        // Agregar los datos de los servicios al PDF
        const columns = Object.keys(serviciosSinIdV[0]);
        const rows = serviciosSinIdV.map(servicio => Object.values(servicio));
        doc.autoTable({ head: [columns], body: rows });
  
        // Descargar el archivo PDF
        doc.save("servicios.pdf");
  
        console.log('Archivo PDF de servicios generado y descargado exitosamente');
      })
      .catch(error => {
        console.error("Error al realizar la solicitud:", error);
      });
  };
  
  // Agregar el evento de clic al botón de generación de PDF de servicios
  if (document.querySelector("#btnGenerarPDF")) {
    document.querySelector("#btnGenerarPDF").addEventListener("click", descargarPDFServicios);
  }
  