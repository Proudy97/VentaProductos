function ObtenerVentas() {
    fetch('https://localhost:7245/Ventas')
        .then(response => response.json())
        .then(data => MostrarVentas(data))
        .catch(error => console.log('No se pudo acceder al servicio', error));
}

function MostrarVentas(data){
    const tbody = document.getElementById('todasLasVentas')
    tbody.innerHTML = '';

    data.forEach(element => {
        let tr = tbody.insertRow();

        let td0 = tr.insertCell(0);
        let tdId = document.createTextNode(element.id)
        td0.appendChild(tdId)

        let td1= tr.insertCell(1);
        let tdFechaExamenes = document.createTextNode(element.fechaVenta)
        td1.appendChild(tdFechaExamenes)

        let td2 = tr.insertCell(2)
        let tdFinalizada = document.createTextNode(element.finalizada)
        td2.appendChild(tdFinalizada)

        let btnEditar = document.createElement('button');
        btnEditar.innerText = 'Editar';
        btnEditar.setAttribute('class', 'btn btn-warning');
        btnEditar.setAttribute('onclick', `BuscarVentaId(${element.id})`);
        let td3 = tr.insertCell(3);
        td3.appendChild(btnEditar)

        let btnEliminar = document.createElement('button');
        btnEliminar.innerText = 'Eliminar';
        btnEliminar.setAttribute('class', 'btn btn-danger');
        btnEliminar.setAttribute('onclick', `EliminarVenta(${element.id})`);
        let td4 = tr.insertCell(4);
        td4.appendChild(btnEliminar)
        });
}

function CrearVentas() {

    let venta = {
        fechaVenta: document.getElementById("FechaVenta").value,
        finalizada: document.getElementById("Finalizada").value,
    }

    fetch('https://localhost:7245/Ventas',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(venta)
        }
    )
    .then(response => response.json())
    .then(data =>{
        if (data.status == undefined) {
            document.getElementById("FechaVenta").value = '';
            document.getElementById("Finalizada").value = '';
            $("#error").empty();
            $("#error").attr("hidden", true);

            $('#modalAgregarVentas').modal('hide');
            ObtenerVentas();
        }
        else {
           mensajeerror ('#error', data);
        }
    })
    .catch(error => console.log("Hubo un error al guardar la nueva Venta, verifique el mensaje de error: ", error))
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
    .then (() => {
        ObtenerVentas();
    })
    .catch(error => console.error ("No se puede acceder a la api, verifique el mensaje de error:", error))
}

function BuscarVentasId(id) {
    fetch(`https://localhost:7245/Ventas/${id}`,{
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("IdVenta").value = data.id;
        document.getElementById("FechaVenta").value = data.fechaVenta;
        document.getElementById("Finalizada").value = data.finalizada;
            $("#error").empty();
            $("#error").attr("hidden", true);
            $('#modalEditarVentas').modal('show');

        
     })
    .catch(error => console.error("No se pudo acceder a la api, verifique el mensaje de error: ", error));
}


function EditarVenta(){
    let idVenta = document.getElementById("idVenta").value;

    let editarVenta = {
        id: idVenta,
        fechaVenta: document.getElementById("FechaVentaEditar").value,
        finalizada: document.getElementById("FinalizadaEditar").value
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

            $('#modalEditarVentas').modal('hide');
            ObtenerVentas();
        }
        /*else{
            mensajeerror('#errorEditar', data);
        }*/
    )
    .catch(error => console.error("No se pudo acceder a la api, verifique el mensaje de error: ", error))
}

function mensajeerror (id, data, mensaje) {
    $(id).empty();
    if (data != null) {
        $.each(data.errors, function(Index, item) {
            $(id).append(
                "<ol>",
                "<li>" + item + "</li>",
                "</ol>"
            )
        })
    }
    else{
        $(id).append(
            "<ol>",
            "<li>" + mensaje + "</li>",
            "</ol>"
        )
    }
    
    $(id).attr("hidden", false);
}
