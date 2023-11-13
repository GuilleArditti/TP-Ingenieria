document.addEventListener('DOMContentLoaded', function () {
    var mapa = L.map('mapa').setView([-41.133472, -71.310278], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(mapa);

    var marcadoresLayer = L.layerGroup().addTo(mapa);
    var comerciosContainer = $('#comercios-container');

    function mostrarComercios(comercio, comerciante) {
        var comercioHTML = `<div class="comercio">
                              <img src="${comercio.foto}" alt="${comercio.nombre}">
                              <div class="info">
                                <h2>${comercio.nombre}</h2>
                                <p>Dirección: ${comercio.direccion}</p>
                                <p>Teléfono: ${comercio.telefono}${comercio.horario ? '<br>Horario: ' + comercio.horario : ''}</p>`;

        comercioHTML += comerciante ? `<div class="comerciante">
                                <h3>Comerciante: ${comerciante.nombre}</h3>
                                <p>DNI: ${comerciante.dni}<br>Email: ${comerciante.email}<br>Teléfono: ${comerciante.telefono}</p>
                              </div>` : '';

        comercioHTML += `<button class="boton-ver-mapa">Ver en Mapa</button>
                        </div>
                      </div>`;

        comerciosContainer.append(comercioHTML);

        var marcador = L.marker([comercio.coordenadaX, comercio.coordenadaY]).addTo(marcadoresLayer);
        var popupContent = `<b>${comercio.nombre}</b><br>Dirección: ${comercio.direccion}<br>Teléfono: ${comercio.telefono}${comercio.horario ? '<br>Horario: ' + comercio.horario : ''}`;

        popupContent += comerciante ? `<br>Comerciante: ${comerciante.nombre}<br>DNI: ${comerciante.dni}<br>Email: ${comerciante.email}<br>Teléfono: ${comerciante.telefono}` : '';

        marcador.bindPopup(popupContent);

        comerciosContainer.find('.boton-ver-mapa').last().on('click', function () {
            marcadoresLayer.clearLayers();
            mapa.setView([comercio.coordenadaX, comercio.coordenadaY], 15);
            L.marker([comercio.coordenadaX, comercio.coordenadaY]).addTo(marcadoresLayer).bindPopup(popupContent);
            document.getElementById('mapa').scrollIntoView({ behavior: 'smooth' });
        });
    }

    function encontrarComerciante(comercioId, comerciantesData) {
        return comerciantesData.find(comerciante => Array.isArray(comerciante.comercio_id) ? comerciante.comercio_id.includes(comercioId) : comerciante.comercio_id == comercioId);
    }

    $.getJSON('JSON/comercios.json', function (comerciosData) {
        $.getJSON('JSON/comerciantes.json', function (comerciantesData) {
            comerciosData.forEach(comercio => mostrarComercios(comercio, encontrarComerciante(comercio.id, comerciantesData)));
        });
    });
});
