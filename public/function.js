const carrito = document.querySelector('.Carrito-compras');
const apiUrl = 'http://localhost:8000/api/product';
// Función para abrir y cerrar el carrito
function abrirCarrito() {
    const carritoVisible = carrito.classList.contains('visible');
    const body = document.body;

    if (carritoVisible) {
        carrito.classList.remove('visible');
        body.classList.remove('no-scroll');
    } else {
        carrito.classList.add('visible');
        body.classList.add('no-scroll');
    }
}

// Función para agregar productos al carrito
function agregarProducto(nombre, precio) {
  const contenedorCarrito = document.querySelector('.productos-carrito');

  // Buscar si el producto ya existe en el carrito
  let productoExistente = null;
  const productos = contenedorCarrito.querySelectorAll('.producto');
  productos.forEach(producto => {
      if (producto.querySelector('.nombre-producto').textContent === nombre) {
          productoExistente = producto;
      }
  });

  if (productoExistente) {
      // Producto ya existe, actualizar la cantidad y el precio
      const cantidadSpan = productoExistente.querySelector('.cantidad-producto');
      const cantidadActual = parseInt(cantidadSpan.textContent) || 0;
      const nuevoCantidad = cantidadActual + 1;
      cantidadSpan.textContent = nuevoCantidad;

      // Muestra el precio del producto 
      const precioSpan = productoExistente.querySelector('.precio');
      precioSpan.textContent = `Precio: $${precio}`;

      // Actualizar el valor en el formulario oculto
      const inputCantidad = productoExistente.querySelector('input[name="cantidad"]');
      inputCantidad.value = nuevoCantidad;
  } else {
      // Producto no existe, crear un nuevo div para el producto
      const nuevoProductoDiv = document.createElement('div');
      nuevoProductoDiv.classList.add('producto');

      nuevoProductoDiv.innerHTML = `
          <h4 class="nombre-producto">${nombre}</h4>
          <span class="cantidad">
              <button onclick="actualizarCantidad('${nombre}', 1)">+</button>
              <span class="cantidad-producto">1</span>
              <button onclick="actualizarCantidad('${nombre}', -1)">-</button>
          </span>
          <span class="precio">Precio: $${precio}</span>
          <button class="eliminar" onclick="eliminarProducto(this.parentElement)">
              <span class="material-symbols-outlined">delete</span>
          </button>
          <!-- Formulario oculto para capturar los datos -->
          <form class="formulario-producto" style="display: none;">
              <input type="text" name="nombre" value="${nombre}">
              <input type="number" name="cantidad" value="1">
          </form>
      `;

      contenedorCarrito.appendChild(nuevoProductoDiv);
  }

  // Mostrar el carrito si está vacío
  if (contenedorCarrito.children.length > 0) {
      const asideCarrito = document.querySelector('aside');
      asideCarrito.style.display = 'block';
  }

  // Actualizar contador de botones agregar
  actualizarContador(nombre);
  actualizarSubtotalYTotal();
}


// Función para actualizar la cantidad de productos en el carrito
function actualizarCantidad(nombre, incremento) {
    const contenedorCarrito = document.querySelector('.productos-carrito');
    const producto = Array.from(contenedorCarrito.querySelectorAll('.producto')).find(p => p.querySelector('.nombre-producto').textContent === nombre);

    if (producto) {
        const cantidadSpan = producto.querySelector('.cantidad-producto');
        const cantidadActual = parseInt(cantidadSpan.textContent) || 0;
        const nuevaCantidad = cantidadActual + incremento;

        if (nuevaCantidad > 0) {
            cantidadSpan.textContent = nuevaCantidad;
            
            // Actualizar el valor en el formulario oculto
            const inputCantidad = producto.querySelector('input[name="cantidad"]');
            inputCantidad.value = nuevaCantidad;
        } else {
            eliminarProducto(producto);
        }
    }

    // Actualizar contador de botones agregar
    actualizarContador(nombre);
    actualizarSubtotalYTotal();
}

// Función para eliminar productos del carrito
function eliminarProducto(productoDiv) {
    productoDiv.remove();

    const contenedorCarrito = document.querySelector('.productos-carrito');
    if (contenedorCarrito.children.length === 0) {
        const asideCarrito = document.querySelector('aside');
        asideCarrito.style.display = 'none';
    }
    const contadorPrincipal = document.querySelector('.contador-principal');
    contadorPrincipal.textContent = '';

    // Actualizar subtotales
    actualizarSubtotalYTotal();
}

// Función para actualizar el contador de los productos
function actualizarContador(nombre) {
    const botonAgregar = document.querySelector(`#${nombre.replace(/\s+/g, '-')}`);
    if (!botonAgregar) return;

    const contadorAgregar = botonAgregar.querySelector('.contador');
    const cantidadActual = parseInt(contadorAgregar.textContent) || 0;

    contadorAgregar.textContent = cantidadActual + 1;

    // Actualizar el contador del botón de agregar principal
    const botonAgregarPrincipal = document.querySelector('.agregar-principal');
    const contadorPrincipal = botonAgregarPrincipal.querySelector('.contador-principal');
    const cantidadTotal = Array.from(document.querySelectorAll('.cantidad-producto'))
        .reduce((sum, el) => sum + (parseInt(el.textContent) || 0), 0);
    contadorPrincipal.textContent = cantidadTotal;
}

// Funciones para el cálculo del subtotal y el total
function calcularSubtotal() {
    const productos = document.querySelectorAll('.producto');
    let subtotal = 0;

    productos.forEach(producto => {
        const precioText = producto.querySelector('.precio').textContent.replace('Precio: $', '');
        const cantidadText = producto.querySelector('.cantidad-producto').textContent;

        if (!isNaN(precioText) && !isNaN(cantidadText)) {
            const precio = parseFloat(precioText);
            const cantidad = parseInt(cantidadText);
            subtotal += precio * cantidad;
        }
    });

    return subtotal;
}

function calcularTotal() {
    const subtotal = calcularSubtotal();
    const impuesto = 0.16; // 16% de impuesto
    const total = subtotal + (subtotal * impuesto);

    return total;
}

function actualizarSubtotalYTotal() {
    const subtotal = calcularSubtotal();
    const total = calcularTotal();

    document.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.total').textContent = `$${total.toFixed(2)}`;
}

// Función para vaciar el carrito
function vaciar_carrito() {
    const contadorPrincipal = document.querySelector('.contador-principal');
    contadorPrincipal.textContent = '';
    const contenedorCarrito = document.querySelector('.productos-carrito');
    contenedorCarrito.innerHTML = ''; // Vaciar el carrito
    actualizarSubtotalYTotal();
}

// Función para cerrar el carrito
function cerrarCarrito() {
    carrito.classList.remove('visible');
    document.body.classList.remove('no-scroll');
}

// Función para cargar productos desde la API
/* async function cargarProductos() {
  try {
    // Espera a que la API responda y convierte la respuesta a JSON
    const response = await fetch(apiUrl);
    const data = await response.json(); // Accede a los datos

    // Una vez que se tengan los datos, muestra los productos por categoría
    console.log("Respuesta obtenida");
    const productos = data.data;
    mostrarProductos(productos);

  } catch (error) {
    console.error('Error al cargar los productos:', error); // Captura y muestra errores si los hay
  }
} */
  async function cargarProductos() {
    try {
      // Espera a que el backend responda y convierte la respuesta a JSON
      const response = await fetch(apiUrl);
      const productos = await response.json(); // Accede a los datos
  
      // Una vez que se tengan los datos, muestra los productos por categoría
      console.log("Respuesta obtenida");
      mostrarProductos(productos);
  
    } catch (error) {
      console.error('Error al cargar los productos:', error); // Captura y muestra errores si los hay
    }
  }

// Función para mostrar productos desde la API con imágenes

function mostrarProductos(productos) {
  const entradasElement = document.querySelector('.informacion_Entradas');
  const entradasImagenes = document.querySelector('.img-entradas'); // Contenedor de imágenes para Entradas
  
  const platosFuertesElement = document.querySelector('.informacion_fuerte');
  const platosFuertesImagenes = document.querySelector('.img-fuerte'); // Contenedor de imágenes para Platos Fuertes

  const postresElement = document.querySelector('.informacion_postres');
  const postresImagenes = document.querySelector('.img-postres'); // Contenedor de imágenes para Postres

  const bebidasElement = document.querySelector('.informacion_bebidas');
  const bebidasImagenes = document.querySelector('.img-bebidas'); // Contenedor de imágenes para Bebidas

  const coctelesElement = document.querySelector('.informacion_cocteles');
  const coctelesImagenes = document.querySelector('.img-cocteles'); // Contenedor de imágenes para Cócteles

  productos.forEach(producto => {
      // Estructura HTML del producto con botón correctamente posicionado
      const productoHTML = `
        <div class="producto-container">
          <h2>${producto.name}
            <button class="agregar" id="${producto.name.replace(/\s+/g, '-')}" onclick="agregarProducto('${producto.name}', ${producto.price}, '${producto.image}')">
                <span class="material-symbols-outlined">add_shopping_cart</span>
                <span class="contador"></span>
            </button>
            </h2>
          <div class="carrito">
            <h4>${producto.description}</h4>
            <p class="precio">$${producto.price}</p>
          </div>
        </div>
      `;

      // Imágenes de los productos solo se añaden a la galería de la derecha
      const imagenHTML = `
      <img class="imagen" src="${producto.image}" alt="${producto.name}">
      <span class="overlay">${producto.name}</span>
      `;

      // Asignar productos e imágenes según la categoría
      switch (producto.category) {
          case 'Entrada':
              entradasElement.innerHTML += productoHTML;
              entradasImagenes.innerHTML += imagenHTML;
              break;
          case 'Fuerte':
              platosFuertesElement.innerHTML += productoHTML;
              platosFuertesImagenes.innerHTML += imagenHTML;
              break;
          case 'Postre':
              postresElement.innerHTML += productoHTML;
              postresImagenes.innerHTML += imagenHTML;
              break;
          case 'Bebidas frías':
              bebidasElement.innerHTML += productoHTML;
              bebidasImagenes.innerHTML += imagenHTML;
              break;
          case 'Coctel':
              coctelesElement.innerHTML += productoHTML;
              coctelesImagenes.innerHTML += imagenHTML;
              break;
          default:
              console.error('Categoría no reconocida:', producto.category);
      }
  });
}


function irCaja() {
  const productos = [];
  const formulariosProductos = document.querySelectorAll('.formulario-producto');

  // Recorrer todos los formularios ocultos para capturar los datos
  formulariosProductos.forEach(form => {
      const nombreProducto = form.querySelector('input[name="nombre"]').value;
      const cantidadProducto = form.querySelector('input[name="cantidad"]').value;
      productos.push({ nombre: nombreProducto, cantidad: cantidadProducto });
  });

  // Convertir los productos a formato JSON
  const productosJSON = JSON.stringify(productos);
  console.log('Productos JSON:', productosJSON);
  // Crear un formulario para enviar a la página caja.html
  const formularioPago = document.createElement('form');
  formularioPago.method = 'GET';
  formularioPago.action = 'caja.html';

  const inputProductos = document.createElement('input');
  inputProductos.type = 'hidden';
  inputProductos.name = 'productos';
  inputProductos.value = productosJSON;

  formularioPago.appendChild(inputProductos);
  document.body.appendChild(formularioPago);

  // Enviar el formulario
  formularioPago.submit();
}

// Ejecutar la función al cargar la página para obtener los productos de la API
document.addEventListener('DOMContentLoaded', cargarProductos);

document.addEventListener('DOMContentLoaded', function() {
  // Obtener los productos de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const productosJSON = urlParams.get('productos');

  // Variable para almacenar el total del pedido
  let totalPedido = 0;

  if (productosJSON) {
      // Parsear la cadena JSON a un objeto
      const productos = JSON.parse(productosJSON);
      console.log('Productos:', productos);

      // Hacer una solicitud a la API para obtener los detalles de los productos (incluido el precio)
      fetch(apiUrl)
          .then(response => response.json())  // Convierte la respuesta a JSON
          .then(data => {
              const productosAPI = data.data;  // Aquí están los productos traídos desde la API
              console.log('Productos desde la API:', productosAPI);

              // Insertar los productos en la tabla de productos con el precio calculado
              const productosTableBody = document.querySelector('.productos'); // Acceder al tbody de la tabla

              productos.forEach(producto => {
                  // Buscar el producto en los datos de la API
                  const productoAPI = productosAPI.find(p => p.Nombre === producto.nombre);

                  if (productoAPI) {
                      // Definir el porcentaje de impuesto
                      const impuesto = 0.16; // 16% de impuesto

                      // Calcular el precio unitario y luego el total con la cantidad
                      const precioUnitario = productoAPI.Precio;
                      const precioTotal = precioUnitario * producto.cantidad;

                      // Aplicar el impuesto al precio total
                      const precioConImpuesto = precioTotal + (precioTotal * impuesto);

                      // Sumar el precio con impuesto al total del pedido
                      totalPedido += precioConImpuesto;

                      // Crear una nueva fila para el producto
                      const fila = document.createElement('tr');

                      // Crear las celdas para el nombre, cantidad y precio
                      const nombreCelda = document.createElement('td');
                      nombreCelda.textContent = producto.nombre;

                      const cantidadCelda = document.createElement('td');
                      cantidadCelda.textContent = producto.cantidad;

                      const precioCelda = document.createElement('td');
                      precioCelda.textContent = `$${precioTotal.toFixed(2)}`; // Mostrar el precio total

                      // Añadir las celdas a la fila
                      fila.appendChild(nombreCelda);
                      fila.appendChild(cantidadCelda);
                      fila.appendChild(precioCelda);

                      // Añadir la fila al cuerpo de la tabla
                      productosTableBody.appendChild(fila);
                  } else {
                      console.error(`No se encontró el producto ${producto.nombre} en la API`);
                  }
              });

              // Actualizar el span del total con la suma de los precios de los productos
              const totalSpan = document.querySelector('#total');
              totalSpan.textContent = `$${totalPedido.toFixed(2)}`; // Asignar el valor total formateado
          })
          .catch(error => console.error('Error al cargar los productos desde la API:', error));
  } else {
      console.log("No se encontraron productos en la URL.");
  }
});

// Obtener el formulario y el botón de confirmar pedido
let datosFormulario;
const formulario = document.querySelector('#formulario-pedido');
const botonConfirmar = document.querySelector('.boton-caja');


// Agregar evento de submit al formulario
formulario.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Datos del cliente
  const nombreCliente = document.querySelector('#nombre').value;
  const telefonoCliente = document.querySelector('#telefono').value;
  const direccionCliente = document.querySelector('#direccion').value;

  // Productos del pedido
  const productosPedido = [];
  const filas = document.querySelectorAll('.productos tr');

  filas.forEach((fila) => {
      const idProducto = fila.getAttribute('data-id'); // ID del producto (agrega esto en el HTML)
      const cantidadProducto = fila.querySelector('td:nth-child(2)').textContent;

      productosPedido.push({
          id: idProducto,
          quantity: cantidadProducto,
      });
  });

  const totalPedido = parseFloat(document.querySelector('#total').textContent.replace('$', ''));

  // Construir el objeto a enviar
  const datosFormulario = {
      name: nombreCliente,
      phone_number: telefonoCliente,
      address: direccionCliente,
      products: productosPedido,
      total: totalPedido,
  };

  try {
      const response = await fetch('http://localhost:8000/api/order', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(datosFormulario),
      });

      if (response.ok) {
          alert('Pedido creado con éxito');
      } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
      }
  } catch (error) {
      console.error('Error al crear el pedido:', error);
      alert('Hubo un error al crear el pedido.');
  }
});