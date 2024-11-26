let pedidosPendientes = []; // Array para almacenar los pedidos pendientes
let pedidosAtendidos = [];  // Array para almacenar los pedidos atendidos

// Función para hacer fetch y actualizar pedidos constantemente
async function cargarPedidos() {
    console.log("Realizando fetch a /api/orders/pending...");
    try {
        const response = await fetch('http://localhost:8000/api/orders/pending');
        if (response.ok) {
            const data = await response.json();
            console.log("Respuesta recibida del servidor:", data);
            const pedidosDesdeAPI = Array.isArray(data) ? data : [];

            let nuevosPedidos = 0;

            pedidosDesdeAPI.forEach(pedido => {
                // Verificar si el pedido ya está en pendientes o atendidos
                const existeEnPendientes = pedidosPendientes.find(p => p.id === pedido.id);
                const existeEnAtendidos = pedidosAtendidos.find(p => p.id === pedido.id);

                if (!existeEnPendientes && !existeEnAtendidos) {
                    // Transformar el pedido para adaptarlo a la estructura esperada
                    const pedidoTransformado = transformarPedido(pedido);
                    pedidosPendientes.push(pedidoTransformado);
                    createNotificationPedido(pedidoTransformado);
                    nuevosPedidos++;
                }
            });

            if (nuevosPedidos > 0) {
                console.log(`Se agregaron ${nuevosPedidos} nuevos pedidos.`);
                ajustarScrollMainContainer();
            } else {
                console.log("No hay nuevos pedidos para agregar.");
            }
        } else {
            console.error("Error al cargar pedidos:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

// Función para transformar el pedido de la API a la estructura esperada
function transformarPedido(pedido) {
    const { id, customer, order_items, status } = pedido;
    const cedula = customer?.identification_number || 'N/A';
    const platos = Array.isArray(order_items) && order_items.length > 0 
        ? order_items.map(item => ({
            nombre: item.product_name || 'Sin nombre',
            cantidad: item.quantity || 0,
            precio: item.price !== undefined ? parseFloat(item.price).toFixed(2) : '0.00'
        }))
        : [{ nombre: 'No hay items', cantidad: '-', precio: '-' }];
    const total = Array.isArray(order_items) && order_items.length > 0 
        ? order_items.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity, 10)), 0).toFixed(2)
        : '0.00';
    const estado = status === 'pending' ? 'Pendiente' : 'Atendido';

    return { id, cedula, platos, total, estado };
}

// Función para crear una notificación para cada pedido
function createNotificationPedido(pedido) {
    const { platos, total, cedula, estado } = pedido;

    const notification = document.createElement('div');
    notification.classList.add('notification-container');
    notification.setAttribute('data-id', pedido.id); // Agregar atributo para identificación
    notification.setAttribute('data-estado', estado);

    const notificationBadge = document.createElement('div');
    notificationBadge.classList.add('notification-badge');
    notification.appendChild(notificationBadge);

    notification.addEventListener('mouseenter', () => {
        if (notificationBadge) {
            notificationBadge.remove();
        }
    });

    // Mostrar cédula del cliente
    const cedulaElement = document.createElement('div');
    cedulaElement.classList.add('cedula-info');
    cedulaElement.textContent = `Cédula: ${cedula}`;
    notification.appendChild(cedulaElement);

    // Crear tabla para los items del pedido
    const table = document.createElement('table');
    table.classList.add('pedido-table');
    const tableHeader = `<tr><th>Nombre del Plato</th><th>Cantidad</th><th>Precio</th></tr>`;
    table.innerHTML = tableHeader;
    platos.forEach(plato => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${plato.nombre}</td><td>${plato.cantidad}</td><td>$${plato.precio}</td>`;
        table.appendChild(row);
    });
    notification.appendChild(table);

    // Botones de acción
    if (estado === 'Pendiente') { // Solo mostrar el botón si el pedido está pendiente
        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('buttons-container');

        const btnAtendido = document.createElement('button');
        btnAtendido.classList.add('attended');
        btnAtendido.innerText = 'Atendido';
        btnAtendido.onclick = () => AtenderPedido(pedido.id);
        buttonsContainer.appendChild(btnAtendido);

        notification.appendChild(buttonsContainer);
    }

    const mainContainer = document.getElementById('main-container');
    if (mainContainer) {
        mainContainer.insertBefore(notification, mainContainer.firstChild);
    } else {
        console.error("No se encontró el contenedor principal.");
    }

    console.log("Notificación creada para pedido con ID:", pedido.id);
}

// Función para marcar un pedido como atendido
async function AtenderPedido(pedidoId) {
    console.log("Marcando pedido como atendido. ID:", pedidoId);

    try {
        // Enviar solicitud para actualizar el estado del pedido en la base de datos
        const response = await fetch(`http://localhost:8000/api/orders/${pedidoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // Agrega aquí cualquier encabezado de autenticación si es necesario
            },
            body: JSON.stringify({ status: 'attended' })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Pedido actualizado correctamente en el servidor:", data);

            // Encontrar el pedido en pedidosPendientes
            const pedidoIndex = pedidosPendientes.findIndex(p => p.id === pedidoId);
            if (pedidoIndex === -1) {
                console.error("Pedido no encontrado en pendientes.");
                return;
            }

            const pedido = pedidosPendientes[pedidoIndex];
            pedido.estado = "Atendido";

            // Mover el pedido de pendientes a atendidos
            pedidosPendientes.splice(pedidoIndex, 1);
            pedidosAtendidos.push(pedido);

            // Remover la notificación del contenedor principal
            const mainContainer = document.getElementById('main-container');
            const notification = mainContainer.querySelector(`.notification-container[data-id='${pedidoId}']`);
            if (notification) {
                notification.remove();
            } else {
                console.error("No se encontró la notificación en el contenedor principal.");
            }

            // Mostrar el pedido atendido en el contenedor de atendidos
            mostrarPedidoAtendido(pedido);
        } else {
            console.error("Error al actualizar el pedido:", response.status, response.statusText);
            const errorData = await response.json();
            alert(`Error al actualizar el pedido: ${errorData.message || 'Ocurrió un error.'}`);
        }
    } catch (error) {
        console.error("Error en la solicitud de actualización:", error);
        alert("Ocurrió un error al intentar actualizar el pedido.");
    }
}

// Función para mostrar pedido atendido
function mostrarPedidoAtendido(pedido) {
    const { platos, total, cedula, estado } = pedido;

    const Atendido = document.createElement('div');
    Atendido.classList.add('deleted-notification');
    Atendido.setAttribute('data-id', pedido.id); // Agregar atributo para identificación
    Atendido.setAttribute('data-estado', estado);

    // Información del cliente
    const header = document.createElement('div');
    header.classList.add('pedido-header');
    header.textContent = `Cédula: ${cedula}`;
    Atendido.appendChild(header);

    // Crear tabla para los items del pedido
    const table = document.createElement('table');
    table.classList.add('pedido-table');
    const tableHeader = `<tr><th>Nombre del Plato</th><th>Cantidad</th><th>Precio</th></tr>`;
    table.innerHTML = tableHeader;
    platos.forEach(plato => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${plato.nombre}</td><td>${plato.cantidad}</td><td>$${plato.precio}</td>`;
        table.appendChild(row);
    });
    Atendido.appendChild(table);

    const totalElement = document.createElement('p');
    totalElement.textContent = `Total: $${total}`;
    Atendido.appendChild(totalElement);

    const containerAtendidos = document.querySelector('.Atendidos-container');
    if (containerAtendidos) {
        containerAtendidos.appendChild(Atendido);
        containerAtendidos.scrollTop = containerAtendidos.scrollHeight;
    } else {
        console.error("No se encontró el contenedor de atendidos.");
    }

    console.log("Pedido atendido mostrado en la interfaz:", pedido.id);
}

// Función para ajustar el scroll del contenedor principal si hay más de 4 notificaciones
function ajustarScrollMainContainer() {
    const mainContainer = document.getElementById('main-container');
    if (mainContainer && mainContainer.childNodes.length > 4) {
        mainContainer.style.overflowY = 'scroll';
        mainContainer.style.maxHeight = '80vh';
    }
}

// Función para filtrar pedidos por cédula utilizando la API
async function filtrarPedidos() {
    const cedulaInput = document.getElementById('cedula-input');
    const cedula = cedulaInput.value.trim();

    if (!cedula) {
        alert("Por favor, ingrese una cédula válida.");
        return;
    }

    try {
        // Enviar solicitud para buscar pedidos por cédula
        const response = await fetch(`http://localhost:8000/api/orders/customer/${cedula}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Agrega aquí cualquier encabezado de autenticación si es necesario
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Pedidos filtrados recibidos:", data);

            // Verificar la estructura de la respuesta
            const pedidosFiltrados = Array.isArray(data.orders) ? data.orders : [];

            const containerFiltrados = document.querySelector('.PedidosCedula-container');
            if (!containerFiltrados) {
                console.error("No se encontró el contenedor para pedidos filtrados.");
                return;
            }
            containerFiltrados.innerHTML = ''; // Limpiar contenedor

            if (pedidosFiltrados.length > 0) {
                pedidosFiltrados.forEach(pedido => {
                    // Transformar el pedido
                    const pedidoTransformado = transformarPedido(pedido);
                    const elementoFiltrado = crearElementoFiltrado(pedidoTransformado);
                    containerFiltrados.appendChild(elementoFiltrado);
                });
            } else {
                containerFiltrados.innerHTML = '<p>No hay pedidos para esta cédula</p>';
            }
        } else {
            console.error("Error al filtrar pedidos:", response.status, response.statusText);
            const errorData = await response.json();
            alert(`Error al filtrar pedidos: ${errorData.message || 'Ocurrió un error.'}`);
        }
    } catch (error) {
        console.error("Error en la solicitud de filtrado:", error);
        alert("Ocurrió un error al intentar filtrar los pedidos.");
    }
}

// Función para crear el elemento HTML de un pedido filtrado
function crearElementoFiltrado(pedido) {
    const { platos, total, cedula, estado } = pedido;

    const elemento = document.createElement('div');
    elemento.classList.add(estado === 'Atendido' ? 'deleted-notification' : 'notification-container');
    elemento.setAttribute('data-id', pedido.id);
    elemento.setAttribute('data-estado', estado);

    // Información del cliente
    const header = document.createElement('div');
    header.classList.add('pedido-header');
    header.textContent = `Cédula: ${cedula}`;
    elemento.appendChild(header);

    // Crear tabla para los items del pedido
    const table = document.createElement('table');
    table.classList.add('pedido-table');
    const tableHeader = `<tr><th>Nombre del Plato</th><th>Cantidad</th><th>Precio</th></tr>`;
    table.innerHTML = tableHeader;
    platos.forEach(plato => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${plato.nombre}</td><td>${plato.cantidad}</td><td>$${plato.precio}</td>`;
        table.appendChild(row);
    });
    elemento.appendChild(table);

    // Estado del pedido
    const estadoElement = document.createElement('div');
    estadoElement.classList.add('estado-info');
    estadoElement.textContent = estado === "Atendido" ? "Atendido" : "Pendiente";
    estadoElement.style.marginTop = "5px";
    estadoElement.style.fontWeight = "bold";
    estadoElement.style.color = estado === "Atendido" ? "green" : "red";
    elemento.appendChild(estadoElement);

    return elemento;
}

// Función para redirigir al login
function irAlLogin() {
    window.location.href = 'login.html';
}

// Iniciar el proceso de carga automática
setInterval(cargarPedidos, 5000); // Llamar a cargarPedidos cada 5 segundos

// Llamar a cargarPedidos al cargar la página para evitar esperar 5 segundos
document.addEventListener('DOMContentLoaded', cargarPedidos);
