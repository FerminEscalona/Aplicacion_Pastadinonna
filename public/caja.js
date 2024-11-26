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
                        const precioUnitario = productoAPI.price;
                        const precioTotal = precioUnitario * productoCarrito.cantidad;
                        totalPedido += precioTotal;

                        const fila = document.createElement('tr');
                        fila.innerHTML = `
                            <td>${productoCarrito.nombre}</td>
                            <td>${productoCarrito.cantidad}</td>
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
let datosFormulario;
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
    const productosPedido = [];

    filas.forEach((fila) => {
        const nombreProducto = fila.querySelector('td:first-child').textContent;
        const cantidadProducto = fila.querySelector('td:nth-child(2)').textContent;
        const precioProducto = fila.querySelector('td:nth-child(3)').textContent.replace('$', '');
        productosPedido.push({
            nombre: nombreProducto,
            cantidad: cantidadProducto,
            precio: precioProducto,
        });
    });

    const totalPedido = document.querySelector('#total').textContent.replace('$', '');

    // Crear un objeto con los datos del formulario
    const datosFormulario = {
        name: nombreCliente,
        phone_number: telefonoCliente,
        address: direccionCliente,
        products: productosPedido,
        total: totalPedido,
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

    // Mostrar alerta si hay campos vacíos
    if (!valid) {
        alert("Por favor, llene todos los campos obligatorios.");
        // Restablecer el borde al color original cuando el usuario hace clic en un campo
        ['nombre', 'telefono', 'direccion'].forEach((id) => {
            document.querySelector(`#${id}`).addEventListener('focus', function () {
                this.style.borderColor = '';
            });
        });
        return;
    }

    // Enviar los datos a la API del backend
    fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosFormulario),
    })
        .then((response) => {
            if (response.ok) {
                alert("Su pedido ha sido creado con éxito.");
            } else {
                return response.json().then((data) => {
                    alert(`Error: ${data.message}`);
                });
            }
        })
        .catch((error) => {
            console.error('Error al crear el pedido:', error);
            alert('Hubo un error al crear el pedido.');
        });
}

