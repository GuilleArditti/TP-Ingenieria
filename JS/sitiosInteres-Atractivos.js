// Función para realizar una solicitud Ajax y devolver los datos en formato JSON
function fetchData(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al realizar la solicitud: ${response.statusText}`);
            }
            return response.json();
        });
}

// Función para mostrar sitios en el contenedor
function mostrarSitios(sitiosData) {
    const sitiosContainer = $('#sitios-container');

    sitiosData.forEach(sitio => {
        const sitioHTML = `
            <div class="sitio">
                <h3>${sitio.descripcion}</h3>
                <img src="${sitio.foto}" alt="${sitio.descripcion}" width="300">
                <div class="atractivos-container" id="atractivos-container-${sitio.id}"></div>
            </div>`;

        sitiosContainer.append(sitioHTML);
    });
}

// Función para mostrar atractivos en el contenedor
function mostrarAtractivos(atractivosData) {
    atractivosData.forEach(atractivo => {
        const atractivosContainer = $(`#atractivos-container-${atractivo.sitio_id}`);

        const atractivoHTML = `
            <div class="atractivo">
                <h4>${atractivo.nombre}</h4>
                <p>${atractivo.resumen}</p>
                <img src="${atractivo.foto}" alt="${atractivo.nombre}" width="200">
            </div>`;

        atractivosContainer.append(atractivoHTML);
    });
}

// Utilizar las funciones y manejar los errores
$(document).ready(function () {
    fetchData('JSON/sitiosInteres.json')
        .then(sitiosData => {
            mostrarSitios(sitiosData);
            return fetchData('JSON/atractivos.json');
        })
        .then(atractivosData => {
            mostrarAtractivos(atractivosData);
        })
        .catch(error => {
            console.log('Error:', error);
        });
});
