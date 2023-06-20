const express = require('express');
const path = require('path');
const hbs = require('hbs');

const app = express();
const port =8081;

app.use ( express.static('public'));
app.set("views",path.join(__dirname+ "/public/views"));
app.set("view engine","hbs");
hbs.registerPartials(__dirname+ '/public/views/partials');

app.get('/login',(req,res)=>{
    res.render("login")
});
app.get("/perfil",(req,res)=>{
    res.render("perfil");
})

app.get("/",(req,res)=>{

    res.render("index",{
        titulo:'VISOR',
        user_name:'Sosa',
        consecutivo:'Home'
    });
})

app.get("/categorias",(req,res)=>{
    res.render("categorias/categorias")   
});

app.get('/agregarCategoria',(req,res)=>{
    res.render("categorias/agregarCategoria")
});
app.get('/editarCategoria',(req,res)=>{
    res.render("categorias/editarCategoria",{
        titulo:"Editar categoria",
    })
});

app.get("/usuarios",(req,res)=>{
    res.render("usuarios/usuarios", {
    titulo:"Lista usuarios",
    })
});

app.get('/agregarUsuario',(req,res)=>{
    res.render("usuarios/agregarUsuario",{
        titulo:"Agregar usuario",
    })
});

app.get('/editarUsuario',(req,res)=>{
    res.render("usuarios/editarUsuario",{
        titulo:"Editar usuario",
    })
});

app.get("/productos",(req,res)=>{
    res.render("productos/productos")
});

app.get('/agregarProducto',(req,res)=>{
    res.render("productos/agregarProducto",{
        titulo:"Agregar producto",
    })
});

app.get('/editarProducto',(req,res)=>{
    res.render("productos/editarProducto",{
        titulo:"Editar producto",
    })
});

app.get('/agregarEntrada',(req,res)=>{
    res.render("productos/agregarEntrada",{
        titulo:"Cantidad producto",
    })
});

app.get("/clientes",(req,res)=>{
    res.render("clientes/clientes")
});

app.get('/agregarCliente',(req,res)=>{
    res.render("clientes/agregarCliente",{
        titulo:"Cantidad producto",
    })
});

app.get('/editarCliente',(req,res)=>{
    res.render("clientes/editarCliente",{
        titulo:"Editar cliete",
    })
});

app.get("/servicios",(req,res)=>{
    res.render("servicios/servicios")
});

app.get('/agregarServicio',(req,res)=>{
    res.render("servicios/agregarServicios",{
        titulo:"Agregar servicio",
    });
});

app.get('/editarServicio',(req,res)=>{
    res.render("servicios/editarServicio",{
        titulo:"Editar servicio",
    });
});

app.get("/ventas",(req,res)=>{
    res.render("ventas/ventas")
});

app.get("/agregarVenta",(req,res)=>{
    res.render("ventas/agregarVenta");
});

app.get("/detalleVenta",(req,res)=>{
    res.render("ventas/detalleVenta")
});

app.get("/abonos",(req,res)=>{
    res.render("abonos/abonos");
});

app.get('/agregarAbono',(req,res)=>{
    res.render("abonos/agregarabono",{
        titulo:"Agregar abono",
    });
});

app.get('/detalleAbono',(req,res)=>{
    res.render("abonos/detalleAbono",{
        titulo:"Agregar abono",
        numeroFactura:"123",
        fechaAbono:"2023/4/6",
        valorAbono:"20.000",
        valorRestante:"60.000"
    });
});

app.get('*',(req,res)=>{
    res.render("404",{
        titulo:"Error",
    });
});

app.listen(port,()=>{
    console.log(`Escuchando el puerto ${port}`)
})