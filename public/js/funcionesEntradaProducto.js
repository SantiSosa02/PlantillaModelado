const validarProductos=() =>{
    const expresionCantidad= /^\d{1,500}$/
 
    const cantidad=document.getElementById("cantidad").value;

    let mensajeCantidad="";


    if(!expresionCantidad.test(cantidad)){
        mensajeCantidad =" La cantidad solo puede incluir numeros <br>";
    }
    if(cantidad <=0){
        mensajeCantidad ="La cantidad tiene que ser mayor a cero";
    }

    const alertElementCantidad = document.getElementById("texto");

    alertElementCantidad.innerHTML=mensajeCantidad;

    alertElementCantidad.style.display = mensajeCantidad ? "block" : "none";
 
}
document.querySelector("#btnRegistrarProducto")
.addEventListener("click",()=>validarProductos());

