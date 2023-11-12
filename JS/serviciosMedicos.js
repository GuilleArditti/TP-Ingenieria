document.addEventListener('DOMContentLoaded', function () {
    var mapa = L.map('mapa').setView([-41.133472, -71.310278], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(mapa);

    var marcadoresLayer = L.layerGroup().addTo(mapa);

    function cargarCentros(datos, contenedorId, tipoCentro) {
        var contenedor = document.getElementById(contenedorId);

        datos.forEach(centro => {
            var centroContainer = contenedor.appendChild(document.createElement('div'));
            centroContainer.className = 'centro-container';
            centroContainer.innerHTML = `
                <h3>${tipoCentro === 'asistencia' ? centro.nombre || 'Centro de Asistencia' : 'Centro Móvil'}</h3>
                <p>${tipoCentro === 'asistencia'
                    ? `Nombre: ${centro.nombre || 'Centro de Asistencia'} | Teléfono: ${centro.telefono || 'Teléfono no disponible'}`
                    : `Horario: ${centro.horario || 'Horario no disponible'} | Fecha: ${centro.fecha || 'Fecha no disponible'}`}</p>
                ${tipoCentro === 'asistencia' ? `<p>Dirección: ${centro.direccion || 'Dirección no disponible'}</p>` : ''}
                <button class="boton-ver-mapa">Ver en Mapa</button>
            `;

            var botonVerMapa = centroContainer.querySelector('.boton-ver-mapa');
            botonVerMapa.addEventListener('click', function () {
                marcadoresLayer.clearLayers();
                mapa.setView([centro.coordenadaX, centro.coordenadaY], 15);

                var marcador = L.marker([centro.coordenadaX, centro.coordenadaY]).addTo(marcadoresLayer);
                var popupContent = `<b>${tipoCentro === 'asistencia' ? centro.nombre || 'Centro de Asistencia' : 'Centro Móvil'}</b>`;
                if (tipoCentro === 'asistencia') popupContent += `<br>Dirección: ${centro.direccion || 'Dirección no disponible'}`;
                if (tipoCentro === 'asistencia') popupContent += `<br>Teléfono: ${centro.telefono || 'Teléfono no disponible'}`;
                if (tipoCentro === 'movil') popupContent += `<br>Horario: ${centro.horario || 'Horario no disponible'} | Fecha: ${centro.fecha || 'Fecha no disponible'}`;
                marcador.bindPopup(popupContent);
            });
        });
    }

    function cargarDatos(url, contenedorId, tipoCentro) {
        fetch(url)
            .then(response => response.json())
            .then(data => cargarCentros(data, contenedorId, tipoCentro))
            .catch(error => console.error(`Error al cargar el archivo JSON de ${tipoCentro}:`, error));
    }

    cargarDatos('JSON/centrosAsistencia.json', 'centros-asistencia', 'asistencia');
    cargarDatos('JSON/movilAsistencia.json', 'moviles-asistencia', 'movil');
});
