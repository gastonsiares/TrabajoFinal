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
            <label for="confirmPassword" class="form-label">Confirmar Contraseña:</label>
            <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" required>
        </div>
        <div class="mb-3">
            <label for="fechaNacimiento" class="form-label">Fecha de nacimiento:</label>
            <input type="date" class="form-control" id="fechaNacimiento" name="fechaNacimiento" required>
        </div>
        <button type="submit" class="btn btn-primary">Registrarse</button>
    </form>
`;

document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    
    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
    }
    
    // Capturar los datos del formulario
    const formData = {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        email: document.getElementById("email").value,
        password: password, // En una aplicación real, esto debería estar hasheado
        fechaNacimiento: document.getElementById("fechaNacimiento").value,
        fechaRegistro: new Date().toISOString()
    };
    
    // Verificar si el email ya está registrado
    const existingUser = JSON.parse(localStorage.getItem('userData'));
    if (existingUser && existingUser.email === formData.email) {
        alert("Este correo electrónico ya está registrado");
        return;
    }
    
    // Guardar en localStorage
    localStorage.setItem("userData", JSON.stringify(formData));
    
    alert("Registro exitoso. Ahora puede iniciar sesión.");
    window.location.href = '/Pages/InicioRegistro/login.html';
});

// Utilidad para verificar si el usuario está logueado
function checkUserSession() {
    const usuarioActivo = sessionStorage.getItem('usuarioActivo');
    if (!usuarioActivo) {
        window.location.href = '/Pages/InicioRegistro/login.html';
        return false;
    }
    return JSON.parse(usuarioActivo);
}