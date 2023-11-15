// Cuando se hace clic en "Sugerir Precio", habilita el campo de sugerencia
document.getElementById("precio").addEventListener("input", function () {
    document.getElementById("sugerirPrecio").value = "Sugerido: $" + (parseInt(this.value) + 10); // Ejemplo de sugerencia
})

// Cuando se hace clic en "Publicar", muestra un mensaje de éxito
/* document.getElementById("publicarBtn").addEventListener("click", function () {
    alert("¡Aviso publicado!");
    // Cierra el modal
    $('#avisoModal').modal('hide');
}) */

document.addEventListener('DOMContentLoaded', function () {
    var formulario = document.getElementById('miFormulario');
    formulario.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita el envío del formulario

        // Lógica para guardar el formulario en un archivo JSON
        guardarAviso();
    });

    // Otras funciones y lógica de tu aplicación...
});

document.getElementById("tipo-de-publicacion").addEventListener("change", function () {
    habilitarCamposSegunTipoDeAviso()
})

habilitarCamposSegunTipoDeAviso();
cargarCategorias();

const btnSugerirPrecio = document.getElementById("btn-sugerir-precio")
btnSugerirPrecio.addEventListener("mouseover", function () {
    const isNombreVacio = isInputVacio("nombre");
    if (isNombreVacio) {
        btnSugerirPrecio.disabled = true
    } else {
        btnSugerirPrecio.disabled = false
    }
})

function isInputVacio(idInput) {
    const inputValue = document.getElementById(idInput).value;
    if (inputValue == '') {
        return true
    } else {
        return false
    }
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
    console.log("nombre producto", nombreProducto)
    const precio = document.getElementById("txt-sugerir-precio")
    try {
        const productos = await getProducto(nombreProducto)
        productos.sort((p1, p2) => p1.price - p2.price)
        let precioSugerido = productos[1].price
        precio.textContent = precioSugerido
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
        detalle.value = ""
    } else if (tipoPublicacion.value === "articulo") {
        restriccion.disabled = true;
        detalle.disabled = false;
        restriccion.value = ""
    } else {
        restriccion.disabled = true;
        detalle.disabled = true;
    }
}

function cargarCategorias() {
    const jsonCategorias = './JSON/categorias.json';
    let categoriaSelect = document.getElementById('categorias')
    fetch(jsonCategorias)
        .then(response => response.json())  // Parsear la respuesta como JSON
        .then(data => {
            data.forEach(categoria => {
                let optionAux = document.createElement('option')
                optionAux.value = categoria.id
                optionAux.text = categoria.descripcion
                categoriaSelect.appendChild(optionAux)
            });
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

async function guardarAviso() {

    var fechaHoy = new Date()
    var fechaFormateada = fechaHoy.toISOString().split('T')[0]

    const productosJSON = await obtenerJsonActual("productos.json")
    const avisosJSON = await obtenerJsonActual("avisos.json")

    let producto = {
        id: productosJSON.length + 1,
        nombre: document.getElementById('nombre').value,
        detalle: document.getElementById('detalle').value,
        foto: "Images/default-image.jpg",
        caracteristica: document.getElementById('categorias').value,
        idCategoria: document.getElementById('categorias').value,
        tipo: document.getElementById('tipo-de-publicacion').value
    }

    let aviso = {
        id: avisosJSON.length + 1,
        fechaPublicacion: fechaFormateada(),
        precio: document.getElementById('precio').value,
        idProducto: productosJSON.length + 1,
        idComercio: document.getElementById('nro-local').value
    }

    // Convierte el objeto a JSON
    var jsonDatosFormulario = JSON.stringify(datosFormulario)

    productosJSON.push(producto)
    avisosJSON.push(aviso)
    
}

async function obtenerJson(nombre) {
    try {
        const response = await fetch(nombre)
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error al obtener el JSON actual:', error)
        return null
    }
}