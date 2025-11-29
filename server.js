const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// **IMPORTANTE**: recordar probarlo karen
const usuarios = [
    { id: 1, nombre:"Karen", correo:"karen@gmail.com", telefono: 345791236 },
    { id: 2, nombre:"Yulieth", correo:"yuli@gmail.com", telefono: 418346543 }
];

const productos = [
    { id: 1, producto: 'Empanada de Carne', precio: 3.50 },
    { id: 2, producto: 'Arepa de Huevo', precio: 4.25 },
    { id: 3, producto: 'Salchipapa Clásica', precio: 9.80 },
    { id: 4, producto: 'Choriperro Especial', precio: 12.50 },
    { id: 5, producto: 'Aborrajado', precio: 6.00 }
];

let pedidos = [];
let nextPedidoId = 1; 

/**
 * @param {number[] | string[]} idsProductos 
 * @returns {string} 
 */
function calcularTotal(idsProductos) {
    let total = 0;
    idsProductos.forEach(idProd => {
        const idNumerico = parseInt(idProd);
        const producto = productos.find(p => p.id === idNumerico); 
        if (producto) {
            total += producto.precio;
        }
    });

    return total.toFixed(2); 
}

/**
 * @param {number[] | string[]} idsProductos 
 * @returns {object[]} 
 */
function obtenerProductosDetalle(idsProductos) {

    return idsProductos
        .map(idProd => productos.find(p => p.id === parseInt(idProd)))
        .filter(Boolean); 
}


app.get("/", (req, res) => {
    res.status(200).json({
        message: "API de Comidas Activa",
        status: "OK",
        endpoints: ["/productos", "/pedidos"]
    });
});


app.get("/productos", (req, res) => {
    res.status(200).json({
        message: "Listado de productos disponibles",
        data: productos
    });
});


app.get("/productos/:id", (req, res) => {
    const myId = parseInt(req.params.id);

    const producto = productos.find(p => p.id === myId);

    if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({
        message: "Producto encontrado",
        data: producto
    });
});



app.get("/pedidos", (req, res) => { 
    res.status(200).json({
        message: "Lista de pedidos",
        data: pedidos
    });
});


app.get("/pedidos/:id", (req, res) => {
    const myId = parseInt(req.params.id);

    const pedido = pedidos.find(p => p.id === myId);
    if (!pedido) {
        return res.status(404).json({ message: "Pedido o ID no encontrado" });
    }

    res.status(200).json({
        message: "Pedido encontrado",
        data: pedido
    });
});


app.post("/pedidos", (req, res) => {
    const { nombreUsuario, productosIds } = req.body;

    if (!nombreUsuario || typeof nombreUsuario !== 'string' || nombreUsuario.trim() === '') {
        return res.status(400).json({ message: "El nombre de usuario es obligatorio." });
    }
    if (!Array.isArray(productosIds) || productosIds.length === 0) {
        return res.status(400).json({ message: "Debe incluir IDs de productos válidos." });
    }

    const productosValidos = productosIds.every(idProd => productos.find(p => p.id === parseInt(idProd)));
    if (!productosValidos) {
        return res.status(400).json({
            message: "Uno o más IDs de productos no existen"
        });
    }

    const total = calcularTotal(productosIds);
    const detalleProductos = obtenerProductosDetalle(productosIds);


    const nuevoPedido = {
        id: nextPedidoId++, 
        nombreUsuario,
        productos: detalleProductos,
        total: parseFloat(total), 
        fechaCreacion: new Date().toISOString()
    };


    pedidos.push(nuevoPedido);
    res.status(201).json({
        message: "Nuevo pedido creado correctamente",
        data: nuevoPedido
    });
});


app.put("/pedidos/:id", (req, res) => {
    const myId = parseInt(req.params.id);
    const { nombreUsuario, productosIds } = req.body;

    const pedidoIndex = pedidos.findIndex(p => p.id === myId);
    

    if (pedidoIndex === -1) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }

    if (!nombreUsuario || typeof nombreUsuario !== 'string' || nombreUsuario.trim() === '') {
        return res.status(400).json({ message: "El nombre de usuario es obligatorio." });
    }
    if (!Array.isArray(productosIds) || productosIds.length === 0) {
        return res.status(400).json({ message: "Debe incluir IDs de productos válidos." });
    }
    
    const productosValidos = productosIds.every(idProd => productos.find(p => p.id === parseInt(idProd)));
    if (!productosValidos) {
        return res.status(400).json({ message: "Uno o más IDs de productos no existen" });
    }
    

    pedidos[pedidoIndex].nombreUsuario = nombreUsuario;
    pedidos[pedidoIndex].productos = obtenerProductosDetalle(productosIds);
    pedidos[pedidoIndex].total = parseFloat(calcularTotal(productosIds));
    pedidos[pedidoIndex].ultimaActualizacion = new Date().toISOString();

    res.status(200).json({
        message: "Pedido actualizado correctamente",
        data: pedidos[pedidoIndex]
    });
});

app.delete("/pedidos/:id", (req, res) => {
    const myId = parseInt(req.params.id);
    const initialLength = pedidos.length;
    

    pedidos = pedidos.filter(p => p.id !== myId);
    
    if (pedidos.length === initialLength) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }
    
    res.status(200).json({
        message: "Pedido eliminado correctamente",
        data: { id: myId } 
    });
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
