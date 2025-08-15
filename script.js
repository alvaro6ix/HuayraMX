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