const loginFormContainer = document.getElementById("loginFormContainer");


loginFormContainer.innerHTML = `
    <form id="loginForm" class="mt-4 p-4 bg-light rounded shadow-sm">
        <div class="mb-3">
            <label for="email" class="form-label">Correo electrónico:</label>
            <input type="email" class="form-control" id="email" name="email" required>
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Contraseña:</label>
            <input type="password" class="form-control" id="password" name="password" required>
        </div>
        <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
    </form>
`;


document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

          
            const storedUserData = JSON.parse(localStorage.getItem('userData'));

            if (storedUserData && email === storedUserData.email && password === storedUserData.password) {

                const sessionUser = {
                    nombre: storedUserData.nombre,
                    apellido: storedUserData.apellido,
                    email: storedUserData.email,
                    fechaNacimiento: storedUserData.fechaNacimiento,
                    lastLogin: new Date().toISOString()
                };

        
                sessionStorage.setItem('usuarioActivo', JSON.stringify(sessionUser));
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('nombreUsuario', sessionUser.nombre);

                alert(`Bienvenido, ${storedUserData.nombre} ${storedUserData.apellido}`);
                window.location.href = '/Pages/home.html';
            } else {
                alert('Correo electrónico o contraseña incorrectos');
            }
        });
    }
});

function checkUserSession() {
    const usuarioActivo = sessionStorage.getItem('usuarioActivo');
    if (!usuarioActivo) {
        window.location.href = '/Pages/InicioRegistro/login.html';
        return false;
    }
    return JSON.parse(usuarioActivo);
}


function logout() {
    sessionStorage.removeItem('usuarioActivo');
    window.location.href = '/Pages/InicioRegistro/login.html';
}






