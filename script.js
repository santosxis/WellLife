// Toggle Menu Mobile
const menuToggle = document.querySelector('.menu-toggle');
const navUl = document.querySelector('nav ul');
menuToggle.addEventListener('click', () => {
    navUl.classList.toggle('active');
    anime({
        targets: navUl,
        translateY: navUl.classList.contains('active') ? 0 : -100,
        duration: 500,
        easing: 'easeInOutQuad'
    });
});

// Carrossel Automático e Manual com Anime.js
let currentIndex = 0;
const carouselInner = document.querySelector('.carousel-inner');
const carouselItems = document.querySelectorAll('.carousel-item');
const prevButton = document.querySelector('.carousel-prev');
const nextButton = document.querySelector('.carousel-next');

function updateCarousel() {
    anime({
        targets: carouselInner,
        translateX: -currentIndex * 100 + '%',
        duration: 800,
        easing: 'easeInOutQuad'
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % carouselItems.length;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
    updateCarousel();
}

setInterval(nextSlide, 6000);
prevButton.addEventListener('click', prevSlide);
nextButton.addEventListener('click', nextSlide);

// Smooth Scroll com Animação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        anime({
            targets: 'html, body',
            scrollTop: target.offsetTop,
            duration: 1000,
            easing: 'easeInOutQuad'
        });
        if (window.innerWidth <= 768) navUl.classList.remove('active');
    });
});

// Personalização dos Planos
const sessionSelects = document.querySelectorAll('.session-select');
const customPrices = document.querySelectorAll('.custom-price');

sessionSelects.forEach((select, index) => {
    select.addEventListener('change', () => {
        const basePrice = parseInt(select.getAttribute('data-base-price'));
        const sessions = parseInt(select.value);
        let totalPrice = basePrice;
        let planName = select.options[select.selectedIndex].text;

        if (sessions === 8) totalPrice = basePrice * 1.8;
        else if (sessions === 12) totalPrice = basePrice * 2.5;

        customPrices[index].textContent = `${planName} - $${totalPrice.toFixed(2)}/mês`;
        customPrices[index].style.color = '#00A3E0';
        customPrices[index].style.fontWeight = '600';
    });
    select.dispatchEvent(new Event('change'));
});

// Modal Formulário com Envio de E-mail via Formspree
const modal = document.createElement('div');
modal.classList.add('modal');
modal.innerHTML = `
    <div class="modal-content">
        <span class="close-modal">×</span>
        <h3>Agendamento</h3>
        <form id="contactForm" action="https://formspree.io/f/xkgbbgqn" method="POST">
            <input type="text" name="name" id="name" placeholder="Seu Nome" required>
            <input type="email" name="email" id="email" placeholder="Seu E-mail" required>
            <input type="tel" name="phone" id="phone" placeholder="Seu Telefone" required>
            <textarea name="message" id="message" placeholder="Sua Mensagem" required></textarea>
            <input type="hidden" name="plan" id="plan" value="">
            <input type="hidden" name="sessions" id="sessions" value="">
            <button type="submit">Enviar</button>
        </form>
    </div>
`;
document.body.appendChild(modal);

// Notificação Personalizada
const notification = document.createElement('div');
notification.classList.add('custom-notification');
notification.innerHTML = `
    <p>Formulário enviado com sucesso!</p>
    <span class="close-notification">×</span>
`;
document.body.appendChild(notification);

const openModalButtons = document.querySelectorAll('.plan-btn, #cta .cta-btn');
const closeModal = document.querySelector('.close-modal');
const modalTitle = modal.querySelector('.modal-content h3');
const form = modal.querySelector('#contactForm');
const inputs = form.querySelectorAll('input, textarea');

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        let title = 'Agendamento';
        const planSelect = button.closest('.plano-card')?.querySelector('.session-select');
        const planType = button.getAttribute('data-plan');
        let planName = '';
        let sessions = '';

        if (button.classList.contains('plan-btn') && planSelect) {
            title = `Agendamento ${planType.charAt(0).toUpperCase() + planType.slice(1)}`;
            planName = planSelect.options[planSelect.selectedIndex].text;
            sessions = planSelect.value;
            form.querySelector('#plan').value = planName;
            form.querySelector('#sessions').value = sessions;
        }

        modal.style.display = 'block';
        modal.style.opacity = '0';
        modal.style.transform = '';
        modalTitle.textContent = title;
        anime({
            targets: modal,
            opacity: [0, 1],
            duration: 600,
            easing: 'easeOutExpo'
        });
        inputs.forEach(input => {
            if (input.id !== 'plan' && input.id !== 'sessions') input.value = '';
        });
    });
});

closeModal.addEventListener('click', () => {
    anime({
        targets: modal,
        opacity: [1, 0],
        duration: 600,
        easing: 'easeInExpo',
        complete: () => modal.style.display = 'none'
    });
});

inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.value && input.id !== 'plan' && input.id !== 'sessions') {
            input.style.border = '2px solid #00A3E0';
        } else {
            input.style.border = 'none';
        }
    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        console.log('Response status:', response.status);
        if (response.ok) {
            // Exibe a notificação
            notification.style.display = 'block';
            anime({
                targets: notification,
                translateY: ['-100%', 0],
                opacity: [0, 1],
                duration: 800,
                easing: 'easeOutExpo'
            });

            // Fecha o modal
            anime({
                targets: modal,
                opacity: [1, 0],
                duration: 600,
                easing: 'easeInExpo',
                complete: () => {
                    modal.style.display = 'none';
                }
            });

            // Fecha a notificação após 3 segundos
            setTimeout(() => {
                anime({
                    targets: notification,
                    translateY: [0, '-100%'],
                    opacity: [1, 0],
                    duration: 600,
                    easing: 'easeInExpo',
                    complete: () => {
                        notification.style.display = 'none';
                    }
                });
            }, 3000);
        } else {
            alert('Erro ao enviar o formulário. Verifique o console para detalhes.');
        }
    }).catch(error => {
        alert('Erro ao enviar o formulário. Verifique o console para detalhes.');
        console.error('Error:', error);
    });
});

// Fechar notificação manualmente
notification.querySelector('.close-notification').addEventListener('click', () => {
    anime({
        targets: notification,
        translateY: [0, '-100%'],
        opacity: [1, 0],
        duration: 600,
        easing: 'easeInExpo',
        complete: () => {
            notification.style.display = 'none';
        }
    });
});

// Botão WhatsApp Flutuante
const whatsappBtn = document.getElementById('whatsapp-btn');

function updateWhatsappBtn() {
    const sobreSection = document.getElementById('sobre');
    const rect = sobreSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight && whatsappBtn.style.display !== 'block') {
        whatsappBtn.style.display = 'block';
        anime({
            targets: whatsappBtn,
            scale: [0, 1],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutElastic',
            complete: () => {
                anime({
                    targets: whatsappBtn,
                    scale: [1, 1.1],
                    opacity: 1,
                    duration: 1000,
                    easing: 'easeInOutQuad',
                    loop: true,
                    direction: 'alternate'
                });
            }
        });
    }
}

window.addEventListener('scroll', updateWhatsappBtn);
window.addEventListener('load', updateWhatsappBtn);