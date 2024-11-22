// Diferentes pedidos de ejemplo
const pedidosEjemplo = [
    {
        platos: [
            { nombre: "Pizza Margarita", cantidad: "1", precio: "35000.00" },
            { nombre: "Coca Cola", cantidad: "2", precio: "5000.00" },
            { nombre: "Helado de Vainilla", cantidad: "1", precio: "12000.00" },
            { nombre: "Helado de Vainilla", cantidad: "1", precio: "12000.00" },
            { nombre: "Helado de Vainilla", cantidad: "1", precio: "12000.00" },
            { nombre: "Helado de Vainilla", cantidad: "1", precio: "12000.00" },
            { nombre: "Helado de Vainilla", cantidad: "1", precio: "12000.00" },
            { nombre: "Helado de Vainilla", cantidad: "1", precio: "12000.00" },
            { nombre: "Helado de Vainilla", cantidad: "1", precio: "12000.00" },    
        ],
        total: "57000.00"
    },
    {
        platos: [
            { nombre: "Hamburguesa Clásica", cantidad: "1", precio: "28000.00" },
            { nombre: "Papas Fritas", cantidad: "1", precio: "8000.00" },
            { nombre: "Jugo de Naranja", cantidad: "1", precio: "6000.00" }
        ],
        total: "42000.00"
    },
    {
        platos: [
            { nombre: "Sushi Roll", cantidad: "2", precio: "45000.00" },
            { nombre: "Té Verde", cantidad: "1", precio: "7000.00" }
        ],
        total: "97000.00"
    },
    {
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
    const {platos, total } = pedido;

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
    const {platos,total} = pedido;

    const Atendido = document.createElement('div');
    Atendido.classList.add('deleted-notification');

    const orderDetails = document.createElement('div'); // Definir orderDetails aquí
    orderDetails.classList.add('order-details'); // Añadir clase si es necesario

    const listaPlatos = document.createElement('ul');
    platos.forEach(plato => {
        const item = document.createElement('li');
        item.innerText = `${plato.nombre} x${plato.cantidad} - $${plato.precio}`;
        listaPlatos.appendChild(item);
    });
    
    orderDetails.appendChild(listaPlatos);
    Atendido.appendChild(orderDetails);

    const containerAtendidos = document.querySelector('.Atendidos-container');
    containerAtendidos.appendChild(Atendido);
    containerAtendidos.scrollTop = containerAtendidos.scrollHeight;
}
function irAlLogin() {
    window.location.href = 'login.html';
}
