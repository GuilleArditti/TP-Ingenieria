$(document).ready(function () {
    // Realizar una solicitud Ajax para obtener sitios de interés
    $.ajax({
        url: 'JSON/sitiosInteres.json',
        type: 'GET',
        dataType: 'json',
        success: function (sitiosData) {
            mostrarSitios(sitiosData);
            cargarAtractivos();
        },
        error: function (error) {
            console.log('Error al cargar los datos de sitios de interés:', error);
        }
    });
});

function mostrarSitios(sitiosData) {
    var sitiosContainer = $('#sitios-container');

    $.each(sitiosData, function (index, sitio) {
        var sitioHTML = '<div class="sitio">';
        sitioHTML += '<h3>' + sitio.descripcion + '</h3>';
        sitioHTML += '<img src="' + sitio.foto + '" alt="' + sitio.descripcion + '" width="300">';
        sitioHTML += '<div class="atractivos-container" id="atractivos-container-' + sitio.id + '"></div>';
        sitioHTML += '</div>';

        sitiosContainer.append(sitioHTML);
    });
}

function cargarAtractivos() {
    // Realizar una solicitud Ajax para obtener los atractivos
    $.ajax({
        url: 'JSON/atractivos.json',
        type: 'GET',
        dataType: 'json',
        success: function (atractivosData) {
            mostrarAtractivos(atractivosData);
        },
        error: function (error) {
            console.log('Error al cargar los datos de atractivos:', error);
        }
    });
}

function mostrarAtractivos(atractivosData) {
    $.each(atractivosData, function (index, atractivo) {
        var atractivosContainer = $('#atractivos-container-' + atractivo.sitio_id);

        var atractivoHTML = '<div class="atractivo">';
        atractivoHTML += '<h4>' + atractivo.nombre + '</h4>';
        atractivoHTML += '<p>' + atractivo.resumen + '</p>';
        atractivoHTML += '<img src="' + atractivo.foto + '" alt="' + atractivo.nombre + '" width="200">';
        atractivoHTML += '</div>';

        atractivosContainer.append(atractivoHTML);
    });
}
