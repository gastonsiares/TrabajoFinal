
const formContainer = document.getElementById("registerFormContainer");


formContainer.innerHTML = `
    <form id="registerForm" class="mt-4 p-4 bg-light rounded shadow-sm">
        <div class="mb-3">
            <label for="nombre" class="form-label">Nombre:</label>
            <input type="text" class="form-control" id="nombre" name="nombre" required>
        </div>
        <div class="mb-3">
            <label for="apellido" class="form-label">Apellido:</label>
            <input type="text" class="form-control" id="apellido" name="apellido" required>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Correo electrónico:</label>
            <input type="email" class="form-control" id="email" name="email" required>
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Contraseña:</label>
            <input type="password" class="form-control" id="password" name="password" required>
        </div>
        <div class="mb-3">
            <label for="fechaNacimiento" class="form-label">Fecha de nacimiento:</label>
            <input type="date" class="form-control" id="fechaNacimiento" name="fechaNacimiento" required>
        </div>
        <button type="submit" class="btn btn-primary">Registrarse</button>
    </form>
`;

// Agregar evento de submit al formulario
document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault(); 

    // Capturar los datos del formulario
    const formData = {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        fechaNacimiento: document.getElementById("fechaNacimiento").value,
    };

    
    localStorage.setItem("userData", JSON.stringify(formData));

    alert("Registro exitoso. Ahora puede iniciar sesión.");
    window.location.href = '/html/login.html'; // Redirigir a la página de inicio de sesión
});

