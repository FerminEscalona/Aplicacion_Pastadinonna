// Lista de últimos trabajadores agregados
let lastAddedWorkers = [];

// Verificación de inputs
function validateInputs(name, cargo, cedula) {
    const nameRegex = /^[a-zA-Z\s]+$/; // Solo letras y espacios
    const cargoRegex = /^[a-zA-Z\s]+$/; // Solo letras y espacios
    const cedulaRegex = /^\d+$/; // Solo números

    if (!nameRegex.test(name)) {
        alert('El nombre solo puede contener letras y espacios.');
        return false;
    }

    if (!cargoRegex.test(cargo)) {
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
    const mainContainer = document.getElementById('main-container');

    workersArray.forEach(worker => {
        const workerCard = document.createElement('div');
        workerCard.classList.add('worker-card');
        workerCard.dataset.cedula = worker.cedula; // Asignar cedula como identificador

        // Contenedor de información
        const workerInfoContainer = document.createElement('div');
        workerInfoContainer.classList.add('worker-info-container');
        workerInfoContainer.innerHTML = `
            <p><strong>${worker.name}</strong></p>
            <p>${worker.cargo}</p>
            <p>C.C: ${worker.cedula}</p>
        `;
        workerCard.appendChild(workerInfoContainer);

        // Botón para eliminar trabajador
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-worker');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => {
            workerCard.remove();
            lastAddedWorkers = lastAddedWorkers.filter(w => w.cedula !== worker.cedula);
            updateLastAddedList();
        });
        workerCard.appendChild(deleteButton);

        mainContainer.appendChild(workerCard);
        lastAddedWorkers.push(worker); // Agregar a la lista de últimos trabajadores
        updateLastAddedList();
    });
}

// Actualizar lista de últimos trabajadores (ahora muestra hasta 10)
function updateLastAddedList() {
    const lastAddedList = document.getElementById('last-added-list');
    lastAddedList.innerHTML = ''; // Limpiar la lista

    lastAddedWorkers.slice(-10).forEach(worker => {
        const listItem = document.createElement('li');
        listItem.textContent = `${worker.name} - ${worker.cargo}`;
        listItem.dataset.cedula = worker.cedula;

        // Eliminar de la lista cuando se elimina del main
        listItem.addEventListener('click', () => {
            const mainContainer = document.getElementById('main-container');
            const workerCard = mainContainer.querySelector(`[data-cedula="${worker.cedula}"]`);
            if (workerCard) {
                workerCard.remove();
                lastAddedWorkers = lastAddedWorkers.filter(w => w.cedula !== worker.cedula);
                updateLastAddedList();
            }
        });

        lastAddedList.appendChild(listItem);
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('main-container');
    mainContainer.style.display = 'grid';
    mainContainer.style.gridTemplateColumns = 'repeat(4, 1fr)'; // 4 columnas por fila
    mainContainer.style.gap = '20px';

    cargarInformacionUsuario();

    // Agregar un trabajador individual
    document.getElementById('add-worker').addEventListener('click', () => {
        const name = document.getElementById('name').value.trim();
        const cargo = document.getElementById('cargo').value.trim();
        const cedula = document.getElementById('cedula').value.trim();

        if (validateInputs(name, cargo, cedula)) {
            addWorkersFromArray([{ name, cargo, cedula }]);
            document.getElementById('name').value = '';
            document.getElementById('cargo').value = '';
            document.getElementById('cedula').value = '';
        }
    });
});

// Cargar información del usuario en el aside al abrir la página
function cargarInformacionUsuario() {
    const infoContainer = document.querySelector('.info-container');
    if (infoContainer) {
        infoContainer.innerHTML = `
            <span>Nombre: Fermin</span>
            <span>Cargo: Backend Developer</span>
        `;
    }
}

function irAlLogin() {
    window.location.href = 'login.html';
}
