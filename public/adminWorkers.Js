// Lista de últimos trabajadores agregados
let lastAddedWorkers = [];

// Verificación de inputs
function validateInputs(name, position, cedula) {
    const nameRegex = /^[a-zA-Z\s]+$/; // Solo letras y espacios
    const positionRegex = /^[a-zA-Z\s]+$/; // Solo letras y espacios
    const cedulaRegex = /^\d+$/; // Solo números

    if (!nameRegex.test(name)) {
        alert('El nombre solo puede contener letras y espacios.');
        return false;
    }

    if (!positionRegex.test(position)) {
        alert('El cargo solo puede contener letras y espacios.');
        return false;
    }

    if (!cedulaRegex.test(cedula)) {
        alert('La cédula debe ser un número entero.');
        return false;
    }

    return true;
}

// Función para agregar trabajadores desde un array
function addWorkersFromArray(workersArray) {
    if (!Array.isArray(workersArray)) {
        console.error('workersArray no es un array:', workersArray);
        alert('Error al procesar la lista de trabajadores.');
        return;
    }

    const mainContainer = document.getElementById('main-container');

    workersArray.forEach(worker => {
        // Verificar si el trabajador ya existe en el UI para evitar duplicados
        if (mainContainer.querySelector(`[data-cedula="${worker.cedula}"]`)) {
            return; // Si ya existe, no lo agrega de nuevo
        }

        const workerCard = document.createElement('div');
        workerCard.classList.add('worker-card');
        workerCard.dataset.cedula = worker.cedula; // Asignar cédula como identificador

        // Contenedor de información
        const workerInfoContainer = document.createElement('div');
        workerInfoContainer.classList.add('worker-info-container');
        workerInfoContainer.innerHTML = `
            <p><strong>${worker.name}</strong></p>
            <p>${worker.position}</p>
            <p>C.C: ${worker.cedula}</p>
        `;
        workerCard.appendChild(workerInfoContainer);

        // Botón para eliminar trabajador
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-worker');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => {
            deleteWorker(worker.cedula); // Llamar a la función de eliminación
        });
        workerCard.appendChild(deleteButton);

        mainContainer.appendChild(workerCard);
        lastAddedWorkers.push(worker); // Agregar a la lista de últimos trabajadores
        updateLastAddedList();
    });
}

// Actualizar lista de últimos trabajadores (muestra hasta 10)
function updateLastAddedList() {
    const lastAddedList = document.getElementById('last-added-list');
    if (!lastAddedList) return; // Verificar si existe el elemento

    lastAddedList.innerHTML = ''; // Limpiar la lista

    lastAddedWorkers.slice(-10).forEach(worker => {
        const listItem = document.createElement('li');
        listItem.textContent = `${worker.name} - ${worker.position}`;
        listItem.dataset.cedula = worker.cedula;

        // Eliminar de la lista cuando se elimina del main
        listItem.addEventListener('click', () => {
            deleteWorker(worker.cedula);
        });

        lastAddedList.appendChild(listItem);
    });
}

// Función para cargar todos los trabajadores desde la API
async function loadWorkers() {
    try {
        const response = await fetch('http://localhost:8000/api/workers', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Respuesta de la API:', data); // Para verificar la estructura

            // Acceder al array de trabajadores dentro de la propiedad 'data'
            const workers = data.data;

            if (Array.isArray(workers)) {
                addWorkersFromArray(workers);
            } else {
                console.error('La propiedad data no es un array:', workers);
                alert('Error al procesar la lista de trabajadores.');
            }
        } else {
            console.error('Error al cargar trabajadores:', response.statusText);
            alert('Error al cargar trabajadores.');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un error al intentar cargar los trabajadores.');
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('main-container');
    mainContainer.style.display = 'grid';
    mainContainer.style.gridTemplateColumns = 'repeat(4, 1fr)'; // 4 columnas por fila
    mainContainer.style.gap = '20px';

    cargarInformacionUsuario();
    loadWorkers(); // Cargar trabajadores al iniciar

    // Agregar un trabajador individual
    document.getElementById('add-worker').addEventListener('click', async () => {
        const name = document.getElementById('name').value.trim();
        const password = document.getElementById('password').value.trim();
        const cargo = document.getElementById('cargo').value.trim();
        const cedula = document.getElementById('cedula').value.trim();

        // Mapear 'cargo' a 'position'
        const position = cargo;

        if (!validateInputs(name, position, cedula)) {
            return;
        }

        const payload = {
            name,
            password,
            position, // Usar 'position' en lugar de 'cargo'
            cedula: parseInt(cedula, 10),
        };

        try {
            const response = await fetch('http://localhost:8000/api/workers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Trabajador creado:', data); // Para verificar la respuesta

                // Acceder al trabajador creado dentro de la propiedad 'data'
                const newWorker = data.data;

                alert(`Trabajador creado: ${newWorker.name}`); // Mostrar mensaje de éxito
                addWorkersFromArray([newWorker]); // Añadir al UI como un array con un solo elemento

                // Limpiar los campos del formulario
                document.getElementById('name').value = '';
                document.getElementById('password').value = '';
                document.getElementById('cargo').value = '';
                document.getElementById('cedula').value = '';
            } else {
                const error = await response.json();
                console.error('Error:', error);
                alert('No se pudo agregar el trabajador.');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Hubo un error al intentar agregar el trabajador.');
        }
    });
});

// Cargar información del usuario en el aside al abrir la página
function cargarInformacionUsuario() {
    const infoContainer = document.querySelector('.info-container');
    if (infoContainer) {
        // Aquí podrías cargar la información real del usuario desde la sesión o API
        infoContainer.innerHTML = `
            <span>Nombre: Fermin</span>
            <span>Cargo: Backend Developer</span>
        `;
    }
}

// Función para eliminar un trabajador usando su cédula
async function deleteWorker(cedula) {
    if (!confirm('¿Estás seguro de que deseas eliminar este trabajador?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8000/api/workers/${cedula}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message || 'Trabajador eliminado exitosamente.'); // Mostrar mensaje de éxito
            // Eliminar del UI
            const mainContainer = document.getElementById('main-container');
            const workerCard = mainContainer.querySelector(`[data-cedula="${cedula}"]`);
            if (workerCard) {
                workerCard.remove();
                lastAddedWorkers = lastAddedWorkers.filter(w => w.cedula !== cedula);
                updateLastAddedList();
            }
        } else {
            alert(data.message || 'No se pudo eliminar el trabajador.'); // Mostrar mensaje de error
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un error al intentar eliminar el trabajador.');
    }
}

// Evento de envío del formulario para eliminar
document.getElementById('delete-worker-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

    const cedula = document.getElementById('cedula-borrar').value.trim(); // Obtener la cédula del formulario

    if (cedula && /^\d+$/.test(cedula)) {
        // Llamar a la función de eliminación con la cédula obtenida
        deleteWorker(cedula);
        document.getElementById('cedula-borrar').value = ''; // Limpiar el campo
    } else {
        alert('Por favor ingresa una cédula válida.');
    }
});

// Función para ir al login
function irAlLogin() {
    window.location.href = 'login.html';
}
