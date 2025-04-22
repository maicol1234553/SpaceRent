// inicio sesion 
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("iniciosesionForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Evita recargar la página

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        fetch("http://localhost:3000/iniciosesion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // Guardar datos en localStorage
                localStorage.setItem("id", result.id); // 👈 nuevo
                localStorage.setItem("rol", result.rol);
                localStorage.setItem("nombre", result.nombre);
                localStorage.setItem("email", email); // puedes conservarlo si lo necesitas

                window.location.href = "spacerent.html"; // Redirige a Space Rent
            } else {
                alert("Correo o contraseña incorrectos");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Hubo un error al intentar iniciar sesión.");
        });
    });
});

