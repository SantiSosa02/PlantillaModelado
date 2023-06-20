// Función para descargar el archivo Excel
const descargarExcel = async () => {
    const url = "https://plantillaapi.onrender.com/api/producto";
  
    try {
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
  
      if (response.ok) {
        const data = await response.json();
        const productos = data.productos;
  
        // Eliminar los campos no necesarios
        const productosSinInformacion = productos.map(producto => {
          const { _id, __v, ...productoSinInformacion } = producto;
          return productoSinInformacion;
        });
  
        // Crear un nuevo libro de Excel
        const workbook = XLSX.utils.book_new();
  
        // Crear una nueva hoja de Excel
        const worksheet = XLSX.utils.json_to_sheet(productosSinInformacion);
  
        // Agregar el encabezado "Productos"
        const encabezado = [["Productos"]];
        XLSX.utils.sheet_add_aoa(worksheet, encabezado, { origin: "A1" });
  
        // Agregar la hoja al libro de Excel
        XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
  
        // Generar el archivo Excel
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  
        // Descargar el archivo Excel
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "productos.xlsx";
        link.click();
        URL.revokeObjectURL(url);
  
        console.log('Archivo Excel generado y descargado exitosamente');
      } else {
        console.error("Error al obtener la lista de productos:", response.status);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };
  
  // Agregar el evento de clic al botón de generación de Excel
  if (document.querySelector("#btnGenerarEXCEL")) {
    document.querySelector("#btnGenerarEXCEL").addEventListener("click", descargarExcel);
  }
  