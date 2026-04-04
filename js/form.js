document.addEventListener("DOMContentLoaded", function() {

    emailjs.init("K931NaTsamCHhEbmH");

    const miFormulario = document.getElementById('miFormulario');

    if (miFormulario) {
        miFormulario.addEventListener('submit', function(e) {
            e.preventDefault();

            const params = {
                nombre:  miFormulario.querySelector('[name="nombre"]').value,
                email:   miFormulario.querySelector('[name="email"]').value,
                whatsapp: miFormulario.querySelector('[name="whatsapp"]').value,
                servicio: miFormulario.querySelector('[name="servicio"]').value,
                mensaje: miFormulario.querySelector('[name="mensaje"]').value,
            };

            emailjs.send("service_kqkjgpp", "template_h1h6vjr", params)
                .then(function() {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Mensaje enviado!',
                        text: 'Gracias por tu consulta. Te respondemos en menos de 24 horas.',
                        confirmButtonColor: '#276E90',
                        timer: 3500,
                        timerProgressBar: true
                    });
                    miFormulario.reset();
                }, function(error) {
                    console.error("EmailJS error:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al enviar',
                        text: 'Intentá de nuevo o escribinos por WhatsApp.',
                        confirmButtonColor: '#d33'
                    });
                });
        });
    }
});
