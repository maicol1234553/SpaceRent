//inicio sesion 
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("iniciosesionForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Evita que el formulario recargue la página

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        fetch("http://localhost:3000/iniciosesion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = "spacerent.html"; // Redirige si es exitoso
            } else {
                alert("Correo o contraseña incorrectos"); // Muestra error
            }
        })
        .catch(error => console.error("Error:", error));
    });
});
