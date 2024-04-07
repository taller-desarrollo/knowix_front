import Swal from 'sweetalert2';

export function makeFieldsEditable(updateLinksCallback, initialSocialLinks) {
    const inputs = document.querySelectorAll('.formulario-perfil input, .social-input');
    const socialLinks = document.querySelectorAll('.social-link');
    const btnEditar = document.getElementById('editar');
    let isEditing = false;
    const socialLinksData = {};

    inputs.forEach(input => input.setAttribute('readonly', true));

    socialLinks.forEach(link => {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'social-input';
        input.style.display = 'none';
        link.appendChild(input);
    });

    const toggleInputs = (show) => {
        inputs.forEach(input => {
            if (show) {
                input.removeAttribute('readonly');
            } else {
                input.setAttribute('readonly', true);
            }
        });
        document.querySelectorAll('.social-input').forEach(input => {
            input.style.display = show ? 'block' : 'none';
        });
    };

    const updateSocialLinks = (show) => {
        socialLinks.forEach(link => {
            const input = link.querySelector('.social-input');
            const a = link.querySelector('a') || document.createElement('a');
            if (show) {
                a.href = input.value || initialSocialLinks[link.id] || '#';
                socialLinksData[link.id] = input.value;
                link.insertBefore(a, link.firstChild);
            } else {
                input.value = a.href;
            }
        });
    };

    btnEditar.addEventListener('click', () => {
        if (!isEditing) {
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
                    isEditing = true;
                    btnEditar.textContent = 'Guardar';
                    toggleInputs(true);
                    updateSocialLinks(false);
                }
            });
        } else {
            Swal.fire({
                icon: 'question',
                title: '¿Guardar los cambios?',
                text: '¿Estás seguro de que quieres guardar los cambios?',
                showDenyButton: true,
                confirmButtonText: 'Guardar',
                denyButtonText: `Cancelar`,
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire('Guardado!', '', 'success');
                    isEditing = false;
                    btnEditar.textContent = 'Editar';
                    toggleInputs(false);
                    updateSocialLinks(true);
                    localStorage.setItem('socialLinks', JSON.stringify(socialLinksData));
                    updateLinksCallback(socialLinksData);
                }
            });
        }
    });

    const storedLinks = JSON.parse(localStorage.getItem('socialLinks'));
    if (storedLinks) {
        Object.assign(initialSocialLinks, storedLinks);
    }
    updateSocialLinks(true);
}
