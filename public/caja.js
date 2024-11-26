// caja.js

const apiUrl = 'http://localhost:8000/api/product';

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productosJSON = urlParams.get('productos');

    if (productosJSON) {
        const productos = JSON.parse(productosJSON);

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const productosTableBody = document.querySelector('.productos');
                let totalPedido = 0;

                productos.forEach(productoCarrito => {
                    const productoAPI = data.find(p => p.name === productoCarrito.nombre);

                    if (productoAPI) {
                        const precioUnitario = parseFloat(productoAPI.price);
                        const cantidad = parseInt(productoCarrito.cantidad, 10);
                        const precioTotal = precioUnitario * cantidad;
                        totalPedido += precioTotal;

                        const fila = document.createElement('tr');
                        fila.innerHTML = `
                            <td>${productoCarrito.nombre}</td>
                            <td>${cantidad}</td>
                            <td>$${precioTotal.toFixed(2)}</td>
                        `;
                        productosTableBody.appendChild(fila);
                    }
                });

                document.querySelector('#total').textContent = `$${totalPedido.toFixed(2)}`;
            })
            .catch(error => console.error('Error al cargar los productos desde la API:', error));
    }
});

// Obtener el formulario y el botón de confirmar pedido
const formulario = document.querySelector('#formulario-pedido');
const botonConfirmar = document.querySelector('.boton-caja');

function confirmarPedido() {
    // Verificar si hay productos en el carrito
    const productosTableBody = document.querySelector('.productos');
    const filas = productosTableBody.querySelectorAll('tr');

    if (filas.length === 0) {
        alert("El carrito está vacío. Por favor, añada productos antes de confirmar el pedido.");
        return;
    }

    // Obtener los datos del formulario
    const nombreCliente = document.querySelector('#nombre').value.trim();
    const telefonoCliente = document.querySelector('#telefono').value.trim();
    const direccionCliente = document.querySelector('#direccion').value.trim();
    const cedulaCliente = document.querySelector('#cedula').value.trim(); // Nuevo campo
    const productosPedido = [];

    filas.forEach((fila) => {
        const nombreProducto = fila.querySelector('td:first-child').textContent;
        const cantidadProducto = fila.querySelector('td:nth-child(2)').textContent;
        const precioProducto = fila.querySelector('td:nth-child(3)').textContent.replace('$', '');
        productosPedido.push({
            name: nombreProducto,
            quantity: parseInt(cantidadProducto, 10),
            price: parseFloat(precioProducto),
        });
    });

    const totalPedido = parseFloat(document.querySelector('#total').textContent.replace('$', ''));

    // Crear un objeto con los datos del formulario
    const datosFormulario = {
        name: nombreCliente,
        phone: telefonoCliente,
        address: direccionCliente,
        identification_number: cedulaCliente, // Cambio de clave y nombre
        products_json: JSON.stringify(productosPedido), // Cambio de clave y formato
    };

    // Validar los campos obligatorios
    let valid = true;

    if (!nombreCliente) {
        document.querySelector('#nombre').style.borderColor = 'red';
        valid = false;
    }
    if (!telefonoCliente) {
        document.querySelector('#telefono').style.borderColor = 'red';
        valid = false;
    }
    if (!direccionCliente) {
        document.querySelector('#direccion').style.borderColor = 'red';
        valid = false;
    }
    if (!cedulaCliente) { // Validar la cédula
        document.querySelector('#cedula').style.borderColor = 'red';
        valid = false;
    }

    // Mostrar alerta si hay campos vacíos
    if (!valid) {
        alert("Por favor, llene todos los campos obligatorios.");
        // Restablecer el borde al color original cuando el usuario hace clic en un campo
        ['nombre', 'telefono', 'direccion', 'cedula'].forEach((id) => {
            document.querySelector(`#${id}`).addEventListener('focus', function () {
                this.style.borderColor = '';
            });
        });
        return;
    }

    // Obtener el token de autenticación si estás usando uno (opcional)
    const token = localStorage.getItem('access_token');

    // Enviar los datos a la API del backend
    fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`, // Descomenta si usas autenticación
        },
        body: JSON.stringify(datosFormulario),
    })
        .then((response) => {
            if (response.ok) {
                return response.json().then((data) => {
                    alert("Su pedido ha sido creado con éxito.");
                    // Opcional: limpiar el formulario o redirigir al usuario
                    formulario.reset();
                    document.querySelector('.productos').innerHTML = '';
                    document.querySelector('#total').textContent = '$0.00';
                });
            } else {
                return response.json().then((data) => {
                    alert(`Error: ${data.message || 'Ocurrió un error inesperado.'}`);
                });
            }
        })
        .catch((error) => {
            console.error('Error al crear el pedido:', error);
            alert('Hubo un error al crear el pedido.');
        });
}
