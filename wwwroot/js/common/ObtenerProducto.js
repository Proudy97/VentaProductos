function ObtenerProductos() {
    fetch('https://localhost:7245/Productos')
        .then(response => response.json())
        .then(async data => {
            localStorage.setItem("productos", JSON.stringify(data));
        })
        .catch(error => console.log("No se pudo acceder al servicio.", error));
}


function FiltrarProductos(producto, todosProductos) {
    todosProductos = JSON.parse(todosProductos);

    if (producto != null) {
        $('#ProductoId').empty();

        const productoFiltrados = todosProductos.filter(todosProductosItem =>
            !producto.find(productoItem => productoItem.productoId === todosProductosItem.id)
        );

        console.log("Porductos filtrados: ", productoFiltrados);

        $.each(productoFiltrados, function (index, item) {
            $('#ProductoId').append(
                "<option value='" + item.id + "'>" + item.nombreProducto + "</option>"
            )
        })
    }
}

