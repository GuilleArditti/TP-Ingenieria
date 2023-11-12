// comercios.js

document.addEventListener('DOMContentLoaded', function () {
    var mapa = L.map('mapa').setView([-41.133472, -71.310278], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(mapa);

    var marcadoresLayer = L.layerGroup().addTo(mapa);

    function mostrarComercios(comerciosData, comerciantesData) {
        var comerciosContainer = $('#comercios-container');

        comerciosData.forEach(comercio => {
            var comerciante = encontrarComerciante(comercio.id, comerciantesData);
            var comercioHTML = '<div class="comercio">';
            comercioHTML += `<img src="${comercio.foto}" alt="${comercio.nombre}">`;
            comercioHTML += '<div class="info">';
            comercioHTML += `<h2>${comercio.nombre}</h2>`;
            comercioHTML += `<p>Dirección: ${comercio.direccion}</p>`;
            comercioHTML += `<p>Teléfono: ${comercio.telefono}</p>`;

            // Agregar horario si está definido
            if (comercio.horario) {
                comercioHTML += `<p>Horario: ${comercio.horario}</p>`;
            }

            if (comerciante) {
                comercioHTML += '<div class="comerciante">';
                comercioHTML += `<h3>Comerciante: ${comerciante.nombre}</h3>`;
                comercioHTML += `<p>DNI: ${comerciante.dni}</p>`;
                comercioHTML += `<p>Email: ${comerciante.email}</p>`;
                comercioHTML += `<p>Teléfono: ${comerciante.telefono}</p>`;
                comercioHTML += '</div>';
            }

            // Agregar botón "Ver en Mapa"
            comercioHTML += `<button class="boton-ver-mapa">Ver en Mapa</button>`;
            comercioHTML += '</div>';
            comercioHTML += '</div>';
            comerciosContainer.append(comercioHTML);

            // Agregar marcador al mapa
            var marcador = L.marker([comercio.coordenadaX, comercio.coordenadaY]).addTo(marcadoresLayer);
            var popupContent = `<b>${comercio.nombre}</b><br>Dirección: ${comercio.direccion}<br>Teléfono: ${comercio.telefono}`;
            if (comercio.horario) {
                popupContent += `<br>Horario: ${comercio.horario}`;
            }
            if (comerciante) {
                popupContent += `<br>Comerciante: ${comerciante.nombre}<br>DNI: ${comerciante.dni}<br>Email: ${comerciante.email}<br>Teléfono: ${comerciante.telefono}`;
            }
            marcador.bindPopup(popupContent);

            // Agregar evento al botón "Ver en Mapa"
            var botonVerMapa = comerciosContainer.find('.boton-ver-mapa').last();
            botonVerMapa.on('click', function () {
                marcadoresLayer.clearLayers();
                mapa.setView([comercio.coordenadaX, comercio.coordenadaY], 15);

                var marcador = L.marker([comercio.coordenadaX, comercio.coordenadaY]).addTo(marcadoresLayer);
                var popupContent = `<b>${comercio.nombre}</b><br>Dirección: ${comercio.direccion}<br>Teléfono: ${comercio.telefono}`;
                if (comercio.horario) {
                    popupContent += `<br>Horario: ${comercio.horario}`;
                }
                if (comerciante) {
                    popupContent += `<br>Comerciante: ${comerciante.nombre}<br>DNI: ${comerciante.dni}<br>Email: ${comerciante.email}<br>Teléfono: ${comerciante.telefono}`;
                }
                marcador.bindPopup(popupContent);

                // Desplazar hacia el contenedor del mapa
                document.getElementById('mapa').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    function encontrarComerciante(comercioId, comerciantesData) {
        return comerciantesData.find(comerciante => {
            if (Array.isArray(comerciante.comercio_id)) {
                return comerciante.comercio_id.includes(comercioId);
            } else {
                return comerciante.comercio_id == comercioId;
            }
        });
    }

    $.ajax({
        url: 'JSON/comercios.json',
        type: 'GET',
        dataType: 'json',
        success: function (comerciosData) {
            $.ajax({
                url: 'JSON/comerciantes.json',
                type: 'GET',
                dataType: 'json',
                success: function (comerciantesData) {
                    mostrarComercios(comerciosData, comerciantesData);
                },
                error: function (error) {
                    console.log('Error al cargar los datos de comerciantes:', error);
                }
            });
        },
        error: function (error) {
            console.log('Error al cargar los datos de comercios:', error);
        }
    });
});
