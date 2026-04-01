document.addEventListener("DOMContentLoaded", function() {

    const miFormulario = document.getElementById('miFormulario');

    if (miFormulario) {
        miFormulario.addEventListener('submit', function(e) {
            // 1. Prevenir que la página se recargue
            e.preventDefault();

            // 2. Preparar los datos del formulario para el envío
            const formData = new FormData(this);

            // 3. Enviar los datos al endpoint de Netlify
            // Netlify detecta los envíos hechos a la misma URL con el método POST.
            fetch('/', {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            })
            .then(response => {
                // Si la respuesta es exitosa, muestra tu alerta de SweetAlert
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Mensaje enviado!',
                        text: 'Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.',
                        confirmButtonColor: '#3085d6',
                        timer: 3000,
                        timerProgressBar: true
                    });
                    this.reset(); // Limpia los campos del formulario
                } else {
                    // Si Netlify devuelve un error, muestra la alerta de error
                    throw new Error('No se pudo enviar el mensaje.');
                }
            })
            .catch(error => {
                // Si hay un error de red o en el proceso, muestra la alerta de error
                console.error("Error:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops... Error',
                    text: 'No se pudo enviar el mensaje. Por favor, intenta de nuevo más tarde.',
                    confirmButtonColor: '#d33'
                });
            });
        });
    }
});