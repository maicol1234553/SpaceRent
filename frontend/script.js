document.getElementById("registroForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rol = document.getElementById("rol").value;

    const response = await fetch("http://localhost:3000/registro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, email, password, rol }),
    });

    const data = await response.json();
    alert(data.message);
});

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




var swiper = new Swiper(".mySwiper-1", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

var swiper = new Swiper(".mySwiper-2", {
    slidesPerView: 3,
    spaceBetween: 20,
    loop: true,
    loopFillGroupWithBlank:true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints : {
        0: {
            slidesPerView:1,  
        },
        520: {
            slidesPerView:2,  
        },
        950: {
            slidesPerView:3,  
        },
        
    }
});

let tabInputs = document.querySelectorAll(".tabInput");
tabInputs.forEach(function(input){
    input.addEventListener('change', function(){
        let id = input.ariaValueMax;
        let thisSwiper = document.getElementById('swiper'+id);
        thisSwiper.swiper.update();
    })
});



