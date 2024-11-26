// Diferentes pedidos de ejemplo
const pedidosEjemplo = [
    {
        cedula: "123456789", // Nueva cédula
        platos: [
            { nombre: "Pizza Margarita", cantidad: "1", precio: "35000.00" },
            { nombre: "Coca Cola", cantidad: "2", precio: "5000.00" }
        ],
        total: "45000.00"
    },
    {
        cedula: "987654321", // Nueva cédula
        platos: [
            { nombre: "Hamburguesa Clásica", cantidad: "1", precio: "28000.00" },
            { nombre: "Papas Fritas", cantidad: "1", precio: "8000.00" },
            { nombre: "Jugo de Naranja", cantidad: "1", precio: "6000.00" }
        ],
        total: "42000.00"
    },
    {
        cedula: "111223344", // Nueva cédula
        platos: [
            { nombre: "Sushi Roll", cantidad: "2", precio: "45000.00" },
            { nombre: "Té Verde", cantidad: "1", precio: "7000.00" }
        ],
        total: "97000.00"
    },
    {
        cedula: "223344556", // Nueva cédula
        platos: [
            { nombre: "Pasta Carbonara", cantidad: "1", precio: "38000.00" },
            { nombre: "Pan de Ajo", cantidad: "1", precio: "5000.00" },
            { nombre: "Limonada", cantidad: "1", precio: "6000.00" }
        ],
        total: "49000.00"
    }
];


// Función para crear un pedido aleatorio de los ejemplos
function crearPedidoTemporal() {
    const pedidoAleatorio = pedidosEjemplo[Math.floor(Math.random() * pedidosEjemplo.length)];
    createNotificationPedido(pedidoAleatorio);
}

function createNotificationPedido(pedido) {
    const { platos, total, cedula } = pedido;

    const notification = document.createElement('div');
    notification.classList.add('notification-container');

    const notificationBadge = document.createElement('div');
    notificationBadge.classList.add('notification-badge');
    notification.appendChild(notificationBadge);

    notification.addEventListener('mouseenter', () => {
        if (notificationBadge) {
            notificationBadge.remove();
        }
    });

    // Mostrar cédula desde el pedido
    const cedulaElement = document.createElement('div');
    cedulaElement.classList.add('cedula-info');
    cedulaElement.textContent = `Cédula: ${cedula}`;
    notification.appendChild(cedulaElement);

    const table = document.createElement('table');
    table.classList.add('pedido-table');
    const tableHeader = `<tr><th>Nombre del Plato</th><th>Cantidad</th><th>Precio</th></tr>`;
    table.innerHTML = tableHeader;
    platos.forEach(plato => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${plato.nombre}</td><td>${plato.cantidad}</td><td>${plato.precio}</td>`;
        table.appendChild(row);
    });
    notification.appendChild(table);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');

    const btnAtendido = document.createElement('button');
    btnAtendido.classList.add('attended');
    btnAtendido.innerText = 'Atendido';
    btnAtendido.onclick = () => AtenderPedido(notification, pedido);
    buttonsContainer.appendChild(btnAtendido);

    notification.appendChild(buttonsContainer);

    const mainContainer = document.getElementById('main-container');
    mainContainer.insertBefore(notification, mainContainer.firstChild);

    if (mainContainer.childNodes.length > 4) {
        mainContainer.style.overflowY = 'scroll';
        mainContainer.style.maxHeight = '80vh';
    }
}

function AtenderPedido(notification, pedido) {
    notification.remove();
    mostrarPedidoAtendido(pedido);
}

function mostrarPedidoAtendido(pedido) {
    const { platos, total, cedula } = pedido;

    const Atendido = document.createElement('div');
    Atendido.classList.add('deleted-notification');

    // Crear el encabezado con la cédula
    const header = document.createElement('div');
    header.classList.add('pedido-header');
    header.textContent = `Cédula: ${cedula}`;
    Atendido.appendChild(header);

    const table = document.createElement('table');
    table.classList.add('pedido-table');
    const tableHeader = `<tr><th>Nombre del Plato</th><th>Cantidad</th><th>Precio</th></tr>`;
    table.innerHTML = tableHeader;

    platos.forEach(plato => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${plato.nombre}</td><td>${plato.cantidad}</td><td>${plato.precio}</td>`;
        table.appendChild(row);
    });
    Atendido.appendChild(table);

    const totalElement = document.createElement('p');
    totalElement.textContent = `Total: $${total}`;
    Atendido.appendChild(totalElement);

    const containerAtendidos = document.querySelector('.Atendidos-container');
    containerAtendidos.appendChild(Atendido);
    containerAtendidos.scrollTop = containerAtendidos.scrollHeight;
}



function irAlLogin() {
    window.location.href = 'login.html';
}
function filtrarPedidos() {
    const cedulaInput = document.getElementById('cedula-input');
    const cedula = cedulaInput.value.trim();

    if (!cedula) {
        alert("Por favor, ingrese una cédula válida.");
        return;
    }

    const containerMain = document.getElementById('main-container');
    const pedidosMain = Array.from(containerMain.getElementsByClassName('notification-container'));
    const pedidosAtendidos = Array.from(document.querySelector('.Atendidos-container').getElementsByClassName('deleted-notification'));

    const containerFiltrados = document.querySelector('.PedidosCedula-container');
    containerFiltrados.innerHTML = ''; // Limpiar contenedor

    const allPedidos = [...pedidosMain, ...pedidosAtendidos];

    const pedidosFiltrados = allPedidos.filter(pedido => {
        const cedulaElement = pedido.querySelector('.cedula-info') || pedido.querySelector('.pedido-header');
        return cedulaElement && cedulaElement.textContent.includes(cedula);
    });

    if (pedidosFiltrados.length === 0) {
        containerFiltrados.innerHTML = '<p>No hay pedidos para esta cédula</p>';
        return;
    }

    pedidosFiltrados.forEach(pedido => {
        const clonedPedido = pedido.cloneNode(true);
        const btnAtendido = clonedPedido.querySelector('.attended'); // Eliminar el botón "Atendido"
        if (btnAtendido) btnAtendido.remove();

        const cedulaHeader = clonedPedido.querySelector('.cedula-info') || clonedPedido.querySelector('.pedido-header');
        if (cedulaHeader) {
            cedulaHeader.className = 'pedido-header'; // Unificar clase de cédula
        }
        containerFiltrados.appendChild(clonedPedido);
    });

    containerFiltrados.scrollTop = 0;
}





