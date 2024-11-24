// Seleccionar los contenedores
const mainContainer = document.getElementById('main-container');
const userPassContainer = document.getElementById('user-pass-container');

// Seleccionar las opciones
const adminOption = document.getElementById('admin');
const empleadoOption = document.getElementById('empleado');
const positionField = document.getElementById('position'); // Cambiado de role a position
const submitButton = document.getElementById('submitbutton');

// Añadir eventos de click
adminOption.addEventListener('click', () => {
    positionField.value = 'manager'; // Cambiado de "Administrador" a "manager"
    toggleContainers();
});

empleadoOption.addEventListener('click', () => {
    positionField.value = 'worker'; // Cambiado de "Empleado" a "worker"
    toggleContainers();
});

// Función para alternar visibilidad
function toggleContainers() {
    mainContainer.classList.add('hidden'); // Oculta el contenedor principal
    userPassContainer.classList.remove('hidden'); // Muestra el contenedor de usuario y contraseña
}
function irAlLogin() {
    window.location.href = 'login.html';
}

// Manejo del envío del formulario
submitButton.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevenir recarga de la página
    const name = document.getElementById('username').value; // Cambiado de username a email
    const password = document.getElementById('password').value;
    const position = positionField.value; // Cambiado de role a position

    try {
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, password, position }), // Enviar position en lugar de role
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar el token y el position en sessionStorage
            sessionStorage.setItem('token', data.access_token); // Cambiado a access_token
            sessionStorage.setItem('position', position); // Cambiado de role a position
            alert(`Bienvenido, ${position}`);

            // Redirigir al dashboard correspondiente
            if (position === 'manager') {
                window.location.href = 'admin.html'; // Dashboard del administrador
            } else if (position === 'worker') {
                window.location.href = 'gestorPedidos.html'; // Dashboard del empleado
            }
        } else {
            alert(`Error: ${data.message || 'Credenciales incorrectas'}`);
        }
    } catch (error) {
        console.error('Error en la autenticación:', error);
    }
});
