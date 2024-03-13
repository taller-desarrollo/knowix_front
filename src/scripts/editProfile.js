import Swal from 'sweetalert2';

export function makeFieldsEditable() {
    const inputs = document.querySelectorAll('.formulario-perfil input');
    inputs.forEach(input => {
        input.setAttribute('readonly', true);
    });

    const makeInputsEditable = () => {
        inputs.forEach(input => {
            input.removeAttribute('readonly');
        });
    };

    const btnEditar = document.getElementById('editar');
    if (btnEditar) {
        btnEditar.addEventListener('click', () => {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Quieres editar los campos",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Sí'
            }).then((result) => {
                if (result.isConfirmed) {
                    makeInputsEditable();
                }
            });
        });
    }
}
