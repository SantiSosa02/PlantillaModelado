const descargarPDF = () => {
  console.log("Función descargarPDF llamada");
  const url = "http://localhost:8080/api/usuario";

  fetch(url, {
    method: "GET",
    mode: "cors",
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error al obtener la lista de usuarios: " + response.status);
      }
    })
    .then(data => {
      const usuarios = data.usuarios;

      // Eliminar el campo de contraseña y __V
      const usuariosSinPassword = usuarios.map(usuario => {
        const { password, __v,_id, ...usuarioSinPassword } = usuario;
        return usuarioSinPassword;
      });

      // Crear un nuevo documento PDF
      const doc = new window.jspdf.jsPDF();

      // Establecer el encabezado del PDF
      doc.setFontSize(20);
      doc.text("Usuarios", doc.internal.pageSize.getWidth() / 2, 15 - 8, { align: "center" });

      // Agregar los datos de los usuarios al PDF
      const columns = Object.keys(usuariosSinPassword[0]);
      const rows = usuariosSinPassword.map(usuario => Object.values(usuario));
      doc.autoTable({ head: [columns], body: rows });

      // Descargar el archivo PDF
      doc.save("usuarios.pdf");

      console.log('Archivo PDF generado y descargado exitosamente');
    })
    .catch(error => {
      console.error("Error al realizar la solicitud:", error);
    });
};

// Agregar el evento de clic al botón de generación de PDF
if (document.querySelector("#btnGenerarPDF")) {
  document.querySelector("#btnGenerarPDF").addEventListener("click", descargarPDF);
}
