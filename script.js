// ==========================================
// NOTIFICACIÓN DE BIENVENIDA
// ==========================================
window.addEventListener('load', function() {
    const notification = document.getElementById('notification');
    
    if (notification) {
        notification.style.display = 'block';
        notification.style.opacity = '1';
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 500);
        }, 5000);
    }
    
    // Iniciar slider después de cargar la página
    console.log('✅ Página cargada completamente');
    setTimeout(iniciarSliderReviews, 1500);
});

// ==========================================
// PRODUCTOS - FILTROS Y MODAL
// ==========================================
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
        asignarEventosVer();
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

    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            closeModal();
        }
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// ==========================================
// BOTONES PERSONALIZADOS Y VVS
// ==========================================
const btnPersonalizados = document.querySelector('[data-categoria="personalizados"]');
const btnVVS = document.querySelector('[data-categoria="anillos"]');
const textoPedido = document.querySelector('.texto-pedido:not(.texto-vvs)');
const textoVVS = document.querySelector('.texto-vvs');
const botonesCategorias = document.querySelectorAll('.categoria-btn');
let spanPersonalizadosVisible = false;
let spanVVSVisible = false;

function toggleSpanPersonalizados() {
    if (spanPersonalizadosVisible) {
        textoPedido.classList.remove('mostrar');
        spanPersonalizadosVisible = false;
    } else {
        textoPedido.classList.add('mostrar');
        spanPersonalizadosVisible = true;
    }
}

function toggleSpanVVS() {
    if (spanVVSVisible) {
        textoVVS.classList.remove('mostrar');
        spanVVSVisible = false;
    } else {
        textoVVS.classList.add('mostrar');
        spanVVSVisible = true;
    }
}

botonesCategorias.forEach(boton => {
    boton.addEventListener('click', function() {
        botonesCategorias.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        if (this.dataset.categoria === 'personalizados') {
            toggleSpanPersonalizados();
            textoVVS.classList.remove('mostrar');
            spanVVSVisible = false;
        } else if (this.dataset.categoria === 'anillos') {
            toggleSpanVVS();
            textoPedido.classList.remove('mostrar');
            spanPersonalizadosVisible = false;
        } else {
            textoPedido.classList.remove('mostrar');
            textoVVS.classList.remove('mostrar');
            spanPersonalizadosVisible = false;
            spanVVSVisible = false;
        }
    });
});

// ==========================================
// MODAL DE PRODUCTOS
// ==========================================
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

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ==========================================
// TEMA Y MENÚ MÓVIL
// ==========================================
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

// ==========================================
// MODAL ZOOM
// ==========================================
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

// ==========================================
// SLIDER DE RESEÑAS DE CLIENTES
// ==========================================
var currentReviewSlide = 0;
var totalReviewSlides = 0;
var sliderInterval = null;

function iniciarSliderReviews() {
    console.log('🚀 Iniciando slider de reseñas...');
    
    var container = document.querySelector('.reviews-container');
    var dotsContainer = document.querySelector('.review-dots');
    
    if (!container) {
        console.error('❌ NO EXISTE .reviews-container');
        return;
    }
    
    if (!dotsContainer) {
        console.error('❌ NO EXISTE .review-dots');
        return;
    }
    
    var imagenes = [
        'imgclientes/cliente1.jpg',
        'imgclientes/cliente2.jpg',
        'imgclientes/cliente3.jpg',
        'imgclientes/cliente4.jpg',
        'imgclientes/cliente5.jpg',
        'imgclientes/cliente6.jpg',
        'imgclientes/cliente7.jpg',
        'imgclientes/cliente8.jpg',
        'imgclientes/cliente9.jpg',
        'imgclientes/cliente10.jpg',
        'imgclientes/cliente11.jpg',
        'imgclientes/cliente12.jpg',
        'imgclientes/cliente13.jpg',
        'imgclientes/cliente14.jpg',
        'imgclientes/cliente15.jpg',
        'imgclientes/cliente16.jpg',
        'imgclientes/cliente17.jpg',
        'imgclientes/cliente18.jpg',
        'imgclientes/cliente19.jpg',
        'imgclientes/cliente20.jpg',
        'imgclientes/cliente21.jpg',
        'imgclientes/cliente22.jpg',
        'imgclientes/cliente23.jpg',
        'imgclientes/cliente24.jpg',
        'imgclientes/cliente25.jpg',
        'imgclientes/cliente26.jpg',
        'imgclientes/cliente27.jpg',
        'imgclientes/cliente28.jpg',
        'imgclientes/cliente29.jpg',
        'imgclientes/cliente30.jpg',
        'imgclientes/cliente32.jpg',
        'imgclientes/cliente33.jpg'
    ];
    
    totalReviewSlides = imagenes.length;
    
    var slidesHTML = '';
    imagenes.forEach(function(src, i) {
        var displayStyle = (i === 0) ? 'flex' : 'none';
        var opacityStyle = (i === 0) ? '1' : '0';
        
        slidesHTML += '<div class="review-slide" style="display: ' + displayStyle + '; opacity: ' + opacityStyle + ';">';
        slidesHTML += '<img src="' + src + '" alt="Cliente ' + (i + 1) + '" onclick="openZoom(this.src)">';
        slidesHTML += '</div>';
    });
    
    container.innerHTML = slidesHTML;
    console.log('✅ Slides creados:', totalReviewSlides);
    
    var dotsHTML = '';
    for (var i = 0; i < totalReviewSlides; i++) {
        var activeClass = (i === 0) ? 'active' : '';
        dotsHTML += '<span class="review-dot ' + activeClass + '" onclick="irASlideReview(' + i + ')"></span>';
    }
    dotsContainer.innerHTML = dotsHTML;
    console.log('✅ Dots creados');
    
    sliderInterval = setInterval(siguienteSlideReview, 5000);
    console.log('✅ SLIDER INICIADO CON ÉXITO');
}

function mostrarSlideReview(index) {
    if (index < 0 || index >= totalReviewSlides) return;
    
    var slides = document.querySelectorAll('.review-slide');
    var dots = document.querySelectorAll('.review-dot');
    
    for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
        slides[i].style.opacity = '0';
    }
    
    for (var i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }
    
    slides[index].style.display = 'flex';
    setTimeout(function() {
        slides[index].style.opacity = '1';
    }, 50);
    
    dots[index].classList.add('active');
    
    currentReviewSlide = index;
    console.log('Mostrando slide:', index + 1, 'de', totalReviewSlides);
}

function siguienteSlideReview() {
    var next = currentReviewSlide + 1;
    if (next >= totalReviewSlides) next = 0;
    mostrarSlideReview(next);
}

function prevReview() {
    var prev = currentReviewSlide - 1;
    if (prev < 0) prev = totalReviewSlides - 1;
    mostrarSlideReview(prev);
}

function nextReview() {
    siguienteSlideReview();
}

function irASlideReview(index) {
    mostrarSlideReview(index);
    if (sliderInterval) {
        clearInterval(sliderInterval);
    }
    sliderInterval = setInterval(siguienteSlideReview, 5000);
}
