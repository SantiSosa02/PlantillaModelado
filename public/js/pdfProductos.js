const descargarPDFProductos = () => {
    console.log("Función descargarPDFProductos llamada");
    const urlProductos = "https://plantillaapi.onrender.com/api/producto";
    const urlCategorias = "https://plantillaapi.onrender.com/api/categoria";
  
    // Obtener los productos
    fetch(urlProductos, {
      method: "GET",
      mode: "cors",
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(responseProductos => {
        if (responseProductos.ok) {
          return responseProductos.json();
        } else {
          throw new Error("Error al obtener la lista de productos: " + responseProductos.status);
        }
      })
      .then(dataProductos => {
        const productos = dataProductos.productos;
  
        // Obtener las categorías
        fetch(urlCategorias, {
          method: "GET",
          mode: "cors",
          headers: { "Content-type": "application/json; charset=UTF-8" },
        })
          .then(responseCategorias => {
            if (responseCategorias.ok) {
              return responseCategorias.json();
            } else {
              throw new Error("Error al obtener la lista de categorías: " + responseCategorias.status);
            }
          })
          .then(dataCategorias => {
            const categorias = dataCategorias.categorias;
  
            // Mapear los productos y excluir los campos _id y __v
            const productosConNombreCategoria = productos.map(producto => {
              const { _id, __v, ...productoSinIdV } = producto;
              const categoria = categorias.find(categoria => categoria._id === producto.categoria);
              return { ...productoSinIdV, categoria: categoria ? categoria.nombre : "" };
            });
  
            // Crear un nuevo documento PDF
            const doc = new window.jspdf.jsPDF();
  
            // Establecer el encabezado del PDF
            doc.setFontSize(20);
            doc.text("Productos", doc.internal.pageSize.getWidth() / 2, 15 - 8, { align: "center" });
  
            // Agregar los datos de los productos al PDF
            const columns = Object.keys(productosConNombreCategoria[0]);
            const rows = productosConNombreCategoria.map(producto => Object.values(producto));
            doc.autoTable({ head: [columns], body: rows });
  
            // Descargar el archivo PDF
            doc.save("productos.pdf");
  
            console.log('Archivo PDF de productos generado y descargado exitosamente');
          })
          .catch(error => {
            console.error("Error al obtener las categorías:", error);
          });
      })
      .catch(error => {
        console.error("Error al obtener los productos:", error);
      });
  };
  
  // Agregar el evento de clic al botón de generación de PDF de productos
  if (document.querySelector("#btnGenerarPDF")) {
    document.querySelector("#btnGenerarPDF").addEventListener("click", descargarPDFProductos);
  }
  