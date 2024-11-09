// Seleccionar el contenedor donde se insertará el formulario
const loginFormContainer = document.getElementById("loginFormContainer");

// Crear el formulario HTML 
loginFormContainer.innerHTML = `
    <form id="loginForm" class="mt-4 p-4 bg-light rounded shadow-sm">
        <div class="mb-3">
            <label for="username" class="form-label">Correo electrónico:</label>
            <input type="email" class="form-control" id="username" name="email" required>
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Contraseña:</label>
            <input type="password" class="form-control" id="password" name="password" required>
        </div>
        <button type="submit" class="btn btn-primary" id="btnSubmit">Ingresar</button>
    </form>
`;

// Agregar el evento de envío al formulario de inicio de sesión
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Obtener el nombre de usuario y la contraseña guardados en localStorage
    const storedUserData = JSON.parse(localStorage.getItem('userData'));

    // Validación de usuario
    if (storedUserData && username === storedUserData.email && password === storedUserData.password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('nombreUsuario', storedUserData.nombre);
        alert(`Bienvenido, ${storedUserData.nombre}`);
        window.location.href = '/html/home.html';  // Redirige al home
    } else {
        alert('Usuario o contraseña incorrectos');
    }
});
