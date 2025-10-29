
// Mostrar notificación de bienvenida
window.addEventListener('load', function() {
    const notification = document.getElementById('notification');
    
    // Mostrar la notificación
    notification.style.display = 'block';
    notification.style.opacity = '1';
    
    // Ocultarla después de 5 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 500); // Espera a que termine la transición
    }, 5000); // 5000ms = 5 segundos
});

document.addEventListener('DOMContentLoaded', function() {
    const categoriaBtns = document.querySelectorAll('.categoria-btn');
    const productCards = document.querySelectorAll('.product-card');

    function filtrarCategoria(categoria) {
        productCards.forEach(card => {
            card.style.display = (card.dataset.categoria === categoria) ? 'block' : 'none';
        });
        categoriaBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.categoria === categoria);
        });
        asignarEventosVer(); // <- Importante: reasignar eventos
    }

    categoriaBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filtrarCategoria(btn.dataset.categoria);
        });
    });

    filtrarCategoria('collares');

    function asignarEventosVer() {
        document.querySelectorAll('.ver-producto-btn').forEach(btn => {
            btn.onclick = function(e) {
                e.stopPropagation();
                const card = btn.closest('.product-card');
                openModal(card);
            };
        });
        document.querySelectorAll('.product-image').forEach(img => {
            img.onclick = function(e) {
                e.stopPropagation();
                const card = img.closest('.product-card');
                openModal(card);
            };
        });
    }
    asignarEventosVer();

    // Cerrar modal al hacer click fuera
    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            closeModal();
        }
    };

    // Accesibilidad: cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});
 // Obtener elementos
        const btnPersonalizados = document.querySelector('[data-categoria="personalizados"]');
        const btnVVS = document.querySelector('[data-categoria="anillos"]');
        const textoPedido = document.querySelector('.texto-pedido:not(.texto-vvs)');
        const textoVVS = document.querySelector('.texto-vvs');
        const botonesCategorias = document.querySelectorAll('.categoria-btn');
        let spanPersonalizadosVisible = false;
        let spanVVSVisible = false;

        // Función para mostrar/ocultar el span de Personalizados
        function toggleSpanPersonalizados() {
            if (spanPersonalizadosVisible) {
                textoPedido.classList.remove('mostrar');
                spanPersonalizadosVisible = false;
            } else {
                textoPedido.classList.add('mostrar');
                spanPersonalizadosVisible = true;
            }
        }

        // Función para mostrar/ocultar el span de VVS
        function toggleSpanVVS() {
            if (spanVVSVisible) {
                textoVVS.classList.remove('mostrar');
                spanVVSVisible = false;
            } else {
                textoVVS.classList.add('mostrar');
                spanVVSVisible = true;
            }
        }

        // Event listener para todos los botones
        botonesCategorias.forEach(boton => {
            boton.addEventListener('click', function() {
                // Remover clase active de todos los botones
                botonesCategorias.forEach(b => b.classList.remove('active'));
                
                // Agregar clase active al botón clickeado
                this.classList.add('active');
                
                // Manejar spans según el botón clickeado
                if (this.dataset.categoria === 'personalizados') {
                    toggleSpanPersonalizados();
                    // Ocultar el span de VVS si está visible
                    textoVVS.classList.remove('mostrar');
                    spanVVSVisible = false;
                } else if (this.dataset.categoria === 'anillos') {
                    toggleSpanVVS();
                    // Ocultar el span de Personalizados si está visible
                    textoPedido.classList.remove('mostrar');
                    spanPersonalizadosVisible = false;
                } else {
                    // Si es cualquier otro botón, ocultar ambos spans
                    textoPedido.classList.remove('mostrar');
                    textoVVS.classList.remove('mostrar');
                    spanPersonalizadosVisible = false;
                    spanVVSVisible = false;
                }
            });
        });

// Modal slider de producto
function openModal(card) {
    const name = card.querySelector('.product-name').textContent;
    const price = card.querySelector('.product-price').textContent;
    const galleryImgs = Array.from(card.querySelectorAll('.product-gallery img')).map(img => img.src);
    const description = card.querySelector('.product-description').innerHTML;
    const specs = card.querySelector('.product-specs').innerHTML;
    const features = Array.from(card.querySelectorAll('.product-features li')).map(li => li.textContent);

    let sliderImgs = '';
    galleryImgs.forEach((src, idx) => {
        sliderImgs += `<div class="slider-img${idx === 0 ? ' active' : ''}"><img src="${src}" alt="${name}"></div>`;
    });

    let sliderDots = '';
    galleryImgs.forEach((_, idx) => {
        sliderDots += `<span class="slider-dot${idx === 0 ? ' active' : ''}" onclick="showSlide(${idx})"></span>`;
    });

    // Crear mensaje de WhatsApp
    const whatsappMessage = encodeURIComponent(
    `Hola Huayra MX 👋\n\nMe interesa: ${name}\n💎 ${price}\n\n¿Está disponible?`
);
    const whatsappLink = `https://wa.me/527227453989?text=${whatsappMessage}`;

    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="modal-slider">
            <button class="slider-arrow left" onclick="prevSlide()">&lt;</button>
            <div class="slider-container">
                ${sliderImgs}
            </div>
            <button class="slider-arrow right" onclick="nextSlide()">&gt;</button>
            <div class="slider-dots">${sliderDots}</div>
        </div>
        <h2 style="margin-bottom: 1rem;">${name}</h2>
        <p style="font-size: 1.2rem; margin-bottom: 1rem; font-weight: bold;">${price}</p>
        <div class="modal-description">${description}</div>
        <div class="modal-specs">${specs}</div>
        <div>
            <h3>Características</h3>
            <ul class="modal-features">
                ${features.map(f => `<li>${f}</li>`).join('')}
            </ul>
        </div>
        <a href="${whatsappLink}" target="_blank" class="whatsapp-btn">
            <i class="fab fa-whatsapp"></i>
            <span>Enviar mensaje</span>
        </a>
    `;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    window.currentSlide = 0;
    window.totalSlides = galleryImgs.length;

    setTimeout(() => {
        document.querySelectorAll('.slider-img img').forEach(img => {
            img.onclick = function(e) {
                e.stopPropagation();
                openZoom(img.src);
            };
        });
    }, 50);
}
```

**¿Qué hace este código?**

1. **Crea un mensaje personalizado** con el nombre del producto y su precio
2. **Genera un enlace de WhatsApp** que incluye tu número (527227453989) y el mensaje
3. **Agrega un botón verde estilo WhatsApp** con el icono oficial
4. Al hacer clic, abre WhatsApp (en móvil la app, en escritorio WhatsApp Web) con el mensaje ya escrito

**El mensaje que se enviará será algo así:**
```

// Slider funciones
function showSlide(idx) {
    const slides = document.querySelectorAll('.slider-img');
    const dots = document.querySelectorAll('.slider-dot');
    if (!slides.length) return;
    window.currentSlide = idx;
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === idx);
    });
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === idx);
    });
}
function prevSlide() {
    if (typeof window.currentSlide === 'undefined') return;
    let idx = window.currentSlide - 1;
    if (idx < 0) idx = window.totalSlides - 1;
    showSlide(idx);
}
function nextSlide() {
    if (typeof window.currentSlide === 'undefined') return;
    let idx = window.currentSlide + 1;
    if (idx >= window.totalSlides) idx = 0;
    showSlide(idx);
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Funciones de menú móvil y tema (igual que antes)
function toggleTheme() {
    const body = document.body;
    const themeIcons = document.querySelectorAll('#theme-icon, .mobile-social #theme-icon');
    const currentTheme = body.getAttribute('data-theme');
    const mobileMenu = document.getElementById('mobile-menu');

    if (currentTheme === 'light') {
        body.setAttribute('data-theme', 'dark');
        themeIcons.forEach(icon => {
            if (icon) icon.className = 'fas fa-sun';
        });
        localStorage.setItem('theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
        themeIcons.forEach(icon => {
            if (icon) icon.className = 'fas fa-moon';
        });
        localStorage.setItem('theme', 'light');
    }

    forceStyleUpdate();

    if (window.innerWidth <= 768 && mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
}
function forceStyleUpdate() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.style.display = 'none';
        requestAnimationFrame(() => {
            mobileMenu.style.display = 'flex';
        });
    }
    document.body.style.transform = 'translateZ(0)';
    requestAnimationFrame(() => {
        document.body.style.transform = '';
    });
}
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;
    if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        body.style.overflow = 'auto';
    } else {
        mobileMenu.classList.add('active');
        body.style.overflow = 'hidden';
        setTimeout(() => {
            forceStyleUpdate();
        }, 100);
    }
}
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
}

// Modal zoom imagen
function openZoom(src) {
    const zoomModal = document.getElementById('zoom-modal');
    const zoomImg = document.getElementById('zoom-img');
    zoomImg.src = src;
    zoomModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeZoom() {
    const zoomModal = document.getElementById('zoom-modal');
    zoomModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}
window.addEventListener('click', function(e) {
    const zoomModal = document.getElementById('zoom-modal');
    if (e.target === zoomModal) closeZoom();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeZoom();
});
// Slider de Reseñas
let currentReviewSlide = 0;
let totalReviewSlides = 0;

document.addEventListener('DOMContentLoaded', function() {
    initReviewSlider();
});

function initReviewSlider() {
    const slides = document.querySelectorAll('.review-slide');
    totalReviewSlides = slides.length;
    
    // Crear dots
    const dotsContainer = document.querySelector('.review-dots');
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'review-dot';
        if (index === 0) dot.classList.add('active');
        dot.onclick = () => goToReview(index);
        dotsContainer.appendChild(dot);
    });
    
    // Auto-play cada 5 segundos
    setInterval(() => {
        nextReview();
    }, 5000);
}

function showReview(index) {
    const slides = document.querySelectorAll('.review-slide');
    const dots = document.querySelectorAll('.review-dot');
    
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    currentReviewSlide = index;
}

function nextReview() {
    let index = currentReviewSlide + 1;
    if (index >= totalReviewSlides) index = 0;
    showReview(index);
}

function prevReview() {
    let index = currentReviewSlide - 1;
    if (index < 0) index = totalReviewSlides - 1;
    showReview(index);
}

function goToReview(index) {
    showReview(index);
}

// Click en imagen para ampliar
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.querySelectorAll('.review-slide img').forEach(img => {
            img.onclick = function() {
                openZoom(img.src);
            };
        });
    }, 500);
});