function ObtenerClientes() {
    fetch('https://localhost:7245/Clientes')
    .then(response => response.json())
    .then(data => CompletarDropdown(data))
    .catch(error => console.log("No se pudo acceder al servicio.", error));
}

// function CompletarDropdown(data) {
//     let bodySelect = document.getElementById('CarreraId');
//     bodySelect.innerHTML = '';
//     let bodySelect2 = document.getElementById('CarreraEditarId');
//     bodySelect2.innerHTML = '';

//     data.forEach(element => {
//         opt = document.createElement("option");
//         opt.value = element.id;
//         opt.text = element.nombre

//         bodySelect.add(opt);


//         opt2 = document.createElement("option");
//         opt2.value = element.id;
//         opt2.text = element.nombre
        
//         bodySelect2.add(opt2);
//     });
// }


function CompletarDropdown(data) {
    $("#ClienteId").empty();
    $.each(data, function(index, item) {
        $('#ClienteId').append(
            "<option value='"+ item.id + "'>" + item.nombreCliente + "</option>"            
        )
    })

    $("#ClienteIdEditar").empty();
    $.each(data, function(index, item) {
        $('#ClienteIdEditar').append(
            "<option value='"+ item.id + "'>" + item.nombreCliente + "</option>"            
        )
    })
}