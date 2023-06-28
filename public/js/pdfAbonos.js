const descargarPDFAbonos = () => {
  console.log("Función descargarPDFProductos llamada");
  const urlAbonos = "https://plantillaapi.onrender.com/api/abono";
  const urlVentas = "https://plantillaapi.onrender.com/api/venta";

  // Obtener los abonos
  fetch(urlAbonos, {
    method: "GET",
    mode: "cors",
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then(responseAbonos => {
      if (responseAbonos.ok) {
        return responseAbonos.json();
      } else {
        throw new Error("Error al obtener la lista de abonos: " + responseAbonos.status);
      }
    })
    .then(dataAbonos => {
      const abonos = dataAbonos.abonos;

      // Obtener las ventas
      fetch(urlVentas, {
        method: "GET",
        mode: "cors",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
        .then(responseVentas => {
          if (responseVentas.ok) {
            return responseVentas.json();
          } else {
            throw new Error("Error al obtener la lista de ventas: " + responseVentas.status);
          }
        })
        .then(dataVentas => {
          const ventas = dataVentas.ventas;

          // Mapear los abonos y asignar el número de factura
          const abonosConNumeroFactura = abonos.map(abono => {
            const { _id, __v, ...abonoSinIdV } = abono;
            const ventaEncontrada = ventas.find(venta => venta._id === abonoSinIdV.venta);
            const numeroFactura = ventaEncontrada ? ventaEncontrada.numeroFactura : "1";
            return { ...abonoSinIdV, numeroFactura };
          });

          // Crear un nuevo documento PDF
          const doc = new window.jspdf.jsPDF();

          // Establecer el encabezado del PDF
          doc.setFontSize(20);
          doc.text("Abonos", doc.internal.pageSize.getWidth() / 2, 15 - 8, { align: "center" });

          // Agregar los datos de los abonos al PDF
          const columns = Object.keys(abonosConNumeroFactura[0]);
          const rows = abonosConNumeroFactura.map(abono => Object.values(abono));
          doc.autoTable({ head: [columns], body: rows });

          // Descargar el archivo PDF
          doc.save("abonos.pdf");

          console.log('Archivo PDF de abonos generado y descargado exitosamente');
        })
        .catch(error => {
          console.error("Error al obtener las ventas:", error);
        });
    })
    .catch(error => {
      console.error("Error al obtener los abonos:", error);
    });
};

// Agregar el evento de clic al botón de generación de PDF de abonos
if (document.querySelector("#btnGenerarPDF")) {
  document.querySelector("#btnGenerarPDF").addEventListener("click", descargarPDFAbonos);
}
