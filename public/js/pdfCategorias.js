const descargarPDFCategorias = () => {
    console.log("Función descargarPDFCategorias llamada");
    const url = "http://localhost:8080/api/categoria";
  
    fetch(url, {
      method: "GET",
      mode: "cors",
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error al obtener la lista de categorías: " + response.status);
        }
      })
      .then(data => {
        const categorias = data.categorias;
  
        // Eliminar el campo _id y __v
        const categoriasSinIdV = categorias.map(categoria => {
          const { _id, __v, ...categoriaSinIdV } = categoria;
          return categoriaSinIdV;
        });
  
        // Crear un nuevo documento PDF
        const doc = new window.jspdf.jsPDF();
  
        // Establecer el encabezado del PDF
        doc.setFontSize(20);
        doc.text("Categorías", doc.internal.pageSize.getWidth() / 2, 15 - 8, { align: "center" });
  
        // Agregar los datos de las categorías al PDF
        const columns = Object.keys(categoriasSinIdV[0]);
        const rows = categoriasSinIdV.map(categoria => Object.values(categoria));
        doc.autoTable({ head: [columns], body: rows });
  
        // Descargar el archivo PDF
        doc.save("categorias.pdf");
  
        console.log('Archivo PDF de categorías generado y descargado exitosamente');
      })
      .catch(error => {
        console.error("Error al realizar la solicitud:", error);
      });
  };
  
  // Agregar el evento de clic al botón de generación de PDF de categorías
  if (document.querySelector("#btnGenerarPDF")) {
    document.querySelector("#btnGenerarPDF").addEventListener("click", descargarPDFCategorias);
  }
  