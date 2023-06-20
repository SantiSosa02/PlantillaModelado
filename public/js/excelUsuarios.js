// Función para descargar el archivo Excel
const descargarExcel = async () => {
    const url = "https://plantillaapi.onrender.com/api/usuario";
  
    try {
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
  
      if (response.ok) {
        const data = await response.json();
        const usuarios = data.usuarios;
  
        // Eliminar el campo de contraseña y __V
        const usuariosSinPassword = usuarios.map(usuario => {
          const { password, __v, ...usuarioSinPassword } = usuario;
          return usuarioSinPassword;
        });
  
        // Crear un nuevo libro de Excel
        const workbook = XLSX.utils.book_new();
  
        // Crear una nueva hoja de Excel
        const worksheet = XLSX.utils.json_to_sheet(usuariosSinPassword);
  
        // Agregar el encabezado "Usuarios"
        const encabezado = [["Usuarios"]];
        XLSX.utils.sheet_add_aoa(worksheet, encabezado, { origin: "A1" });
  
        // Agregar la hoja al libro de Excel
        XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
  
        // Generar el archivo Excel
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  
        // Descargar el archivo Excel
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "usuarios.xlsx";
        link.click();
        URL.revokeObjectURL(url);
  
        console.log('Archivo Excel generado y descargado exitosamente');
      } else {
        console.error("Error al obtener la lista de usuarios:", response.status);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };
  
  // Agregar el evento de clic al botón de generación de Excel
  if (document.querySelector("#btnGenerarEXCEL")) {
    document.querySelector("#btnGenerarEXCEL").addEventListener("click", descargarExcel);
  }
  