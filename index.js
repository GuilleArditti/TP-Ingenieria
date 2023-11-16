// Cuando se hace clic en "Sugerir Precio", habilita el campo de sugerencia
document.getElementById("precio").addEventListener("input", function () {
    document.getElementById("sugerirPrecio").value = "Sugerido: $" + (parseInt(this.value) + 10); // Ejemplo de sugerencia
});

// Cuando se hace clic en "Publicar", muestra un mensaje de éxito o indicación de campo incompleto
document.getElementById("publicarBtn").addEventListener("click", function (event) {
    event.preventDefault(); // Evita que el formulario se envíe por defecto

    const validacion = validarCampos();
    if (validacion.valido) {
        alert("¡Aviso publicado!");
        document.getElementById("mensaje-alerta").classList.add("alert-success");
        // Cierra el modal
        $('#avisoModal').modal('hide');
    } else {
        alert(`Por favor, completa el campo: ${validacion.campo}`);
    }
});

document.getElementById("tipo-de-publicacion").addEventListener("change", function () {
    habilitarCamposSegunTipoDeAviso();
});

cargarComercios();
habilitarCamposSegunTipoDeAviso();
cargarCategorias();

const btnSugerirPrecio = document.getElementById("btn-sugerir-precio");
btnSugerirPrecio.addEventListener("mouseover", function () {
    const isNombreVacio = isInputVacio("nombre");
    if (isNombreVacio) {
        btnSugerirPrecio.disabled = true;
    } else {
        btnSugerirPrecio.disabled = false;
    }
});

function isInputVacio(idInput) {
    const inputValue = document.getElementById(idInput).value;
    return inputValue.trim() === "";
}

async function getProducto(nombre) {
    try {
        const response = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${nombre}`);
        return response.data.results;
    } catch (error) {
        // Maneja cualquier error
        console.error('Error en la solicitud GET:', error);
        throw error;
    }
}

async function sugerirPrecio() {
    const nombreProducto = document.getElementById("nombre").value;
    const precio = document.getElementById("txt-sugerir-precio");
    try {
        const productos = await getProducto(nombreProducto);
        productos.sort((p1, p2) => p1.price - p2.price);
        let precioSugerido = productos[1].price;
        precio.textContent = `Sugerido: $${precioSugerido}`;
    } catch (error) {
        console.error('Error en sugerirPrecio:', error);
        throw error;
    }
}

function habilitarCamposSegunTipoDeAviso() {
    var tipoPublicacion = document.getElementById("tipo-de-publicacion");
    var restriccion = document.getElementById("restriccion");
    var detalle = document.getElementById("detalle");

    if (tipoPublicacion.value === "servicio") {
        restriccion.disabled = false;
        detalle.disabled = true;
        detalle.value = "";
    } else if (tipoPublicacion.value === "articulo") {
        restriccion.disabled = true;
        detalle.disabled = false;
        restriccion.value = "";
    } else {
        restriccion.disabled = true;
        detalle.disabled = true;
    }
}

function cargarCategorias() {
    const jsonCategorias = './JSON/categorias.json';
    let categoriaSelect = document.getElementById('categorias');
    fetch(jsonCategorias)
        .then(response => response.json())
        .then(data => {
            data.forEach(categoria => {
                let optionAux = document.createElement('option');
                optionAux.value = categoria.id;
                optionAux.text = categoria.descripcion;
                categoriaSelect.appendChild(optionAux);
            });
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

function cargarComercios() {
    const jsonComercios = './JSON/comercios.json';
    let comercioSelect = document.getElementById('nro-local');

    fetch(jsonComercios)
        .then(response => response.json())
        .then(data => {
            data.forEach(comercio => {
                let optionAux = document.createElement('option');
                optionAux.value = comercio.id;
                optionAux.text = comercio.nombre;
                comercioSelect.appendChild(optionAux);
            });
        })
        .catch(error => console.error('Error al cargar el archivo JSON de comercios:', error));
}

function validarCampos() {
    const tipoPublicacion = document.getElementById("tipo-de-publicacion").value;
    const nombre = document.getElementById("nombre").value;

    if (tipoPublicacion === "servicio") {
        const restriccion = document.getElementById("restriccion").value;
        return { valido: !camposVacios(tipoPublicacion, [nombre, restriccion]), campo: camposVacios(tipoPublicacion, [nombre, restriccion]) };
    } else if (tipoPublicacion === "articulo") {
        const detalle = document.getElementById("detalle").value;
        return { valido: !camposVacios(tipoPublicacion, [nombre, detalle]), campo: camposVacios(tipoPublicacion, [nombre, detalle]) };
    } else {
        return { valido: false, campo: "" };
    }
}

function camposVacios(tipoPublicacion, campos) {
    for (let i = 0; i < campos.length; i++) {
        if (campos[i].trim() === "") {
            return i === 0 ? "Nombre" : i === 1 && tipoPublicacion === "servicio" ? "Restricción" : i === 1 && tipoPublicacion === "articulo" ? "Detalle" : "";
        }
    }
    return "";
}

