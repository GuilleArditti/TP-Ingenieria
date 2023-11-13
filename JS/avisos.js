$(document).ready(function () {

    $('#spinner').show();
    var avisos, productos, comercios, categorias;

    // Utilizar Promesas para cargar los datos de forma asíncrona
    Promise.all([
        $.getJSON('JSON/avisos.json').then(data => avisos = data),
        $.getJSON('JSON/productos.json').then(data => productos = data),
        $.getJSON('JSON/comercios.json').then(data => comercios = data),
        $.getJSON('JSON/categorias.json').then(data => categorias = data),
    ]).then(() => {
        // Simplificar la creación de opciones para los filtros
        agregarOpcionesFiltro('#filtroComercio', 'Seleccionar', comercios);
        agregarOpcionesFiltro('#filtroCategoria', 'Seleccionar', categorias);

        mostrarAvisos();

        // Utilizar un solo evento change para ambos filtros
        $('#filtroComercio, #filtroCategoria').on('change', mostrarAvisos);
    });

    // Utilizar delegación de eventos para mejorar la eficiencia
    $('#avisos-container').on('click', '.ver-comercio-btn', function () {
        const comercioId = $(this).data('comercio-id');
        const comercio = comercios.find(c => c.id === comercioId);
        comercio ? mostrarDetallesComercio(comercio) : console.log('Comercio no encontrado');
    });

    $('#avisos-container').on('click', '#volver-avisos-btn', mostrarAvisos);

    function getProductById(productId) {
        return productos.find(p => p.id === productId);
    }

    function getProductCategoria(productId) {
        const product = getProductById(productId);
        return product ? product.idCategoria.toString() : null;
    }

    function agregarOpcionesFiltro(selector, textoPredeterminado, elementos) {
        $(selector).append(`<option value="">${textoPredeterminado}</option>`)
            .append(elementos.map(el => `<option value="${el.id}">${el.nombre || el.descripcion}</option>`));
    }

    function mostrarAvisos() {
        const selectedComercio = $('#filtroComercio').val();
        const selectedCategoria = $('#filtroCategoria').val();

        const filteredAvisos = avisos.filter(aviso =>
            (!selectedComercio || aviso.idComercio == selectedComercio) &&
            (!selectedCategoria || getProductCategoria(aviso.idProducto) == selectedCategoria)
        );

        const avisosHTMLPromises = filteredAvisos.map(aviso => {
            const producto = getProductById(aviso.idProducto);
            const precioAvisoEnDolaresPromise = cotizarADolares(aviso.precio);

            return precioAvisoEnDolaresPromise.then(precioAvisoEnDolares => {
                console.log(precioAvisoEnDolares);

                return `<div class="item">
                        <p><strong>${producto.tipo.charAt(0).toUpperCase() + producto.tipo.slice(1)}</strong>: ${producto.nombre}</p>
                        <p><strong>Detalle</strong>: ${producto.detalle}</p>
                        ${producto.tipo === "servicio" ? `<p><strong>Restricciones</strong>: ${producto.restriccion || 'N/A'}</p>` :
                        `<p><strong>Características</strong>: ${producto.caracteristica || 'N/A'}</p>`}
                        <img src="${producto.foto}" alt="${producto.nombre}">
                        <p><strong>Fecha</strong>: ${aviso.fechaPublicacion}, <strong>Precio</strong>: $${aviso.precio.toFixed(2)}</p>
                            <p><strong>Precio en dólares: $${precioAvisoEnDolares.toFixed(2)}</strong></p>
                            <button class="ver-comercio-btn" data-comercio-id="${aviso.idComercio}">Ver Comercio</button>
                        </div>`;
            });
        });

        Promise.all(avisosHTMLPromises).then(avisosHTML => {
            $('#spinner').hide();
            $('#avisos-container').empty().append(avisosHTML);

            $('#detalles-comercio').hide();
        });
    }


    function mostrarDetallesComercio(comercio) {
        const detallesComercioDiv = $('<div id="detalles-comercio"></div>').append(`<p><strong>Nombre del Comercio:</strong> ${comercio.nombre}</p>
                                                                                    <p><strong>Dirección:</strong> ${comercio.direccion}</p>
                                                                                    <p><strong>Teléfono:</strong> ${comercio.telefono}</p>
                                                                                    <button id="volver-avisos-btn">Volver a Avisos</button>
                                                                                    <div id="map" style="height: 400px;"></div>`);

        $('#avisos-container').empty().append(detallesComercioDiv);

        const map = L.map('map').setView([comercio.coordenadaX, comercio.coordenadaY], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(map);
        L.marker([comercio.coordenadaX, comercio.coordenadaY]).addTo(map).bindPopup(comercio.nombre).openPopup();
    }

    async function cotizarADolares(precioProducto) {
        try {
            const response = await axios.get('https://www.dolarsi.com/api/api.php?type=dolar');
            const precioDolarOficial = parseFloat(response.data[0].casa.venta);
            console.log('Precio Dólar Oficial:', precioDolarOficial);

            const precioEnDolares = precioProducto / precioDolarOficial;
            console.log('Precio en Dólares:', precioEnDolares);

            return precioEnDolares;
        } catch (error) {
            console.error('Error al obtener el precio del dólar:', error);
            return null;
        }
    }
});
