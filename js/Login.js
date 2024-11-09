
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Obtener el nombre de usuario y la contraseña guardados en localStorage
    const storedUserData = JSON.parse(localStorage.getItem('userData'));

    // aca se valida el usuario
    if (storedUserData && username === storedUserData.email && password === storedUserData.password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('nombreUsuario', storedUserData.nombre);
        alert(`Bienvenido, ${storedUserData.nombre}`);
        window.location.href = '/html/home.html';  // Redirige al home
    } else {
        alert('Usuario o contraseña incorrectos');
    }
});




