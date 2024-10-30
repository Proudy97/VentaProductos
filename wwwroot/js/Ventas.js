function ObtenerVentas() {
    fetch('https://localhost:7245/Ventas')
        .then(response => response.json())
        .then(data => MostrarVentas(data))
        .catch(error => console.log('No se pudo acceder al servicio', error));
}

function MostrarVentas(data) {
    const tbody = document.getElementById('todasLasVentas')
    tbody.innerHTML = '';

    data.forEach(element => {
        let tr = tbody.insertRow();

        let td0 = tr.insertCell(0);
        let tdId = document.createTextNode(element.id)
        td0.appendChild(tdId)

        let td1 = tr.insertCell(1);
        let tdFechaExamenes = document.createTextNode(element.fechaVenta)
        td1.appendChild(tdFechaExamenes)

        let td2 = tr.insertCell(2)
        let tdFinalizada = document.createTextNode(element.finalizada)
        td2.appendChild(tdFinalizada)

        let td3 = tr.insertCell(3)
        let tdCliente = document.createTextNode(element.cliente.nombreCliente)
        td3.appendChild(tdCliente)


        let btnEditar = document.createElement('button');
        btnEditar.innerText = 'Editar';
        btnEditar.setAttribute('class', 'btn btn-warning');
        btnEditar.setAttribute('onclick', `BuscarVentasId(${element.id})`);
        let td4 = tr.insertCell(4);
        td4.appendChild(btnEditar)

        let btnEliminar = document.createElement('button');
        btnEliminar.innerText = 'Eliminar';
        btnEliminar.setAttribute('class', 'btn btn-danger');
        btnEliminar.setAttribute('onclick', `EliminarVenta(${element.id})`);
        let td5 = tr.insertCell(5);
        td5.appendChild(btnEliminar)

        let btnDetalleVenta = document.createElement('button');
        btnDetalleVenta.innerText = 'Detalle';
        btnDetalleVenta.setAttribute('class', 'btn btn-success');
        btnDetalleVenta.setAttribute('onclick', `BuscarProductos(${element.id})`);
        let td6 = tr.insertCell(6);
        td6.appendChild(btnDetalleVenta)
    });
}

function CrearVentas() {
    const clienteId = document.getElementById('ClienteId').value;
    const ventaFinalizada = document.querySelector(`#ClienteId option[value='${clienteId}']`);

    if (ventaFinalizada && ventaFinalizada.dataset.tieneVentaActiva === "true") {
        alert("El cliente ya tiene una venta activa. Debe finalizar la venta existente.");
        return;
    }

    const fechaVentaInput = document.getElementById("FechaVenta").value;
    if (!fechaVentaInput) { 
        alert("La fecha de venta es obligatoria.");
        return;
    }

    const fechaVenta = new Date(fechaVentaInput);
    const hoy = new Date();
    if (fechaVenta < hoy) {
        alert("La fecha de venta no puede ser en el pasado.");
        return;
    }

    let venta = {
        fechaVenta: fechaVentaInput,
        finalizada: document.getElementById("Finalizada").checked,
        clienteId: clienteId,
        cliente: null,
        detalleVenta: null,
    };

    fetch('https://localhost:7245/Ventas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(venta)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text);
            });
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("FechaVenta").value = "";
        document.getElementById("Finalizada").checked = false;
        document.getElementById("ClienteId").value = 0;

        $('#error').empty();
        $('#error').attr("hidden", true);
        $('#modalAgregarVentas').modal('hide');
        ObtenerVentas();
    })
    .catch(error => {
        alert(error.message);
    });
}

function EliminarVenta(id) {
    var siElimina = confirm("¿Esta seguro de borrar esta Venta?")
    if (siElimina == true) {
        EliminarSi(id);
    }
}

function EliminarSi(id) {
    fetch(`https://localhost:7245/Ventas/${id}`,
        {
            method: "DELETE"
        })
        .then(() => {
            ObtenerVentas();
        })
        .catch(error => console.error("No se puede acceder a la api, verifique el mensaje de error:", error))
}

function BuscarVentasId(id) {
    fetch(`https://localhost:7245/Ventas/${id}`, {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("IdVenta").value = data.id;
            document.getElementById("FechaVentaEditar").value = data.fechaVenta;
            document.getElementById("FinalizadaEditar").checked = data.finalizada;
            $("#error").empty();
            $("#error").attr("hidden", true);
            $('#modalEditarVentas').modal('show');


        })
        .catch(error => console.error("No se pudo acceder a la api, verifique el mensaje de error: ", error));
}


function EditarVenta() {
    let idVenta = document.getElementById("IdVenta").value;

    let editarVenta = {
        id: idVenta,
        fechaVenta: document.getElementById("FechaVentaEditar").value,
        finalizada: document.getElementById("FinalizadaEditar").checked,
        clienteId: document.getElementById('ClienteIdEditar').value,

    }

    fetch(`https://localhost:7245/Ventas/${idVenta}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editarVenta)
    })
        .then(data => {
        /*if*/data.status = undefined || data.status == 204;
            document.getElementById("IdVenta").value = 0;
            document.getElementById("FechaVentaEditar").value = "";
            document.getElementById("FinalizadaEditar").value = "";
            document.getElementById("ClienteIdEditar").value = 0;

            $('#modalEditarVentas').modal('hide');
            ObtenerVentas();
        }
            /*else{
                mensajeerror('#errorEditar', data);
            }*/
        )
        .catch(error => console.error("No se pudo acceder a la api, verifique el mensaje de error: ", error))
}

function mensajeerror(id, data, mensaje) {
    $(id).empty();
    if (data != null) {
        $.each(data.errors, function (Index, item) {
            $(id).append(
                "<ol>",
                "<li>" + item + "</li>",
                "</ol>"
            )
        })
    }
    else {
        $(id).append(
            "<ol>",
            "<li>" + mensaje + "</li>",
            "</ol>"
        )
    }

    $(id).attr("hidden", false);
}

function BuscarProductos(id) {
    fetch(`https://localhost:7245/VentasDetalle/${id}`, {
        method: "GET"
    })
        .then(response => response.json())
        .then(async data => {
            console.log(data)
            if (data != null || data != []) {
                MostrarProductosDetalle(data);
                await ObtenerProductos();
                let todosProductos = localStorage.getItem('productos');
                await FiltrarProductos(data, todosProductos);
            }

            document.getElementById("IdVentaDetalle").value = id;
            $('#modalVentaDetalle').modal('show');
        })
        .catch(error => console.error("No se pudo acceder a la api, verifique el mensaje de error: ", error));
}


function MostrarProductosDetalle(data) {
    $("#productoDetalles").empty();
    $.each(data, function (index, item) {
        if (item.producto) {
            $('#productoDetalles').append(
                "<tr>",
                "<td>" + item.producto.nombreProducto + "</td>",
                "<td><button class='btn btn-info' onclick=''>Modificar</button></td>",
                "<td><button class='btn btn-danger' onclick='EliminarVentaDetalle(" + item.id + ")'>Eliminar</button></td>",
                "</tr>"
            );
        }
    })
}

function GuardarDetalle() {
    let idVentaDetalle = document.getElementById("IdVentaDetalle").value;
    let productoId = document.getElementById("ProductoId").value;

    console.log("idVentaDetalle:", idVentaDetalle);
    console.log("productoId:", productoId);

    let guardarDetalle = {
        productoId: productoId,
        producto: null,
        ventaId: idVentaDetalle,
        cliente: null,
    };

    console.log(guardarDetalle);

    fetch('https://localhost:7245/VentasDetalle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(guardarDetalle)
    })
        .then(response => response.json())
        .then(() => {
            document.getElementById("ProductoId").value = 0;

            $("#errorDetalle").empty();
            $("#errorDetalle").attr("hidden", true);

            BuscarProductos(idVentaDetalle);
        })
        .catch(error => console.log("Hubo un error al guardar la Inscripcion, verifique el mensaje de error: ", error));
}




function EliminarVentaDetalle(id) {
    var siElimina = confirm("¿Esta seguro de borrar esta Venta?")
    if (siElimina == true) {
        EliminarDetalleSi(id);
    }
}

function EliminarDetalleSi(id) {
    fetch(`https://localhost:7245/VentasDetalle/${id}`,
        {
            method: "DELETE"
        })
        .then(() => {
            BuscarProductos();

        })
        .catch(error => console.error("No se puede acceder a la api, verifique el mensaje de error:", error))
}   