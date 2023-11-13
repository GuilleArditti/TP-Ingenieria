// Cuando se hace clic en "Sugerir Precio", habilita el campo de sugerencia
document.getElementById("precio").addEventListener("input", function () {
    document.getElementById("sugerirPrecio").value = "Sugerido: $" + (parseInt(this.value) + 10); // Ejemplo de sugerencia
});

// Cuando se hace clic en "Publicar", muestra un mensaje de éxito
document.getElementById("publicarBtn").addEventListener("click", function () {
    alert("¡Aviso publicado!");
    // Cierra el modal
    $('#avisoModal').modal('hide');
});

function isInputVacio(idInput){
    const inputValue = document.getElementById(idInput).value;
    if(inputValue == ''){
        return true
    }else{
        return false
    }
}

const btnSugerirPrecio = document.getElementById("btn-sugerir-precio")
btnSugerirPrecio.addEventListener("mouseover", function(){
    const isNombreVacio = isInputVacio("nombre");
    if(isNombreVacio){
        btnSugerirPrecio.disabled = true
    }else{
        btnSugerirPrecio.disabled = false
    }
})

async function getProducto(nombre) {
    try {
        const response = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${nombre}`);
        console.log(response)
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