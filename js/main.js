document.addEventListener('DOMContentLoaded', () => {

    // 1. ANIMACIÓN HERO
    const heroElements = document.querySelectorAll('#hero .fade-in-item');
    heroElements.forEach((el, i) => {
        setTimeout(() => { el.classList.add('visible'); }, 500 + (i * 400));
    });

    // 2. SCROLL INDICATOR & HEADER
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;

        const indicator = document.getElementById('scrollIndicator');
        if (indicator) indicator.style.width = scrolled + '%';

        const header = document.getElementById('header');
        if (header) {
            scrollTop > 100 ? header.classList.add('scrolled') : header.classList.remove('scrolled');
        }
    });

    // 3. FADE IN OBSERVER (Para secciones)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // 3.1. HIGHLIGHT ACTIVE SECTION IN NAV
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header ul li a');

    const navObserverOptions = {
        threshold: 0.5 // Se marca cuando media sección está visible
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));

    // 4. SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // 5. SWIPER PRINCIPAL (PROYECTOS)
    const proyectosSwiper = new Swiper('.myProyectosSwiper', {
        loop: true,
        centeredSlides: true,
        slidesPerView: 'auto', // Permite que las tarjetas laterales asomen
        spaceBetween: 30,
        speed: 800,
        grabCursor: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.myProyectosSwiper > .swiper-pagination',
            clickable: true,
        },
    });

    // 5b. SWIPER PLANES
    new Swiper('.planesSwiper', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        grabCursor: true,
        slidesOffsetAfter: 56,
        navigation: {
            nextEl: '.planesSwiper .swiper-button-next',
            prevEl: '.planesSwiper .swiper-button-prev',
        },
        pagination: {
            el: '.planesSwiper .swiper-pagination',
            clickable: true,
        },
    });

    // 6. SWIPERS INTERNOS (FOTOS DENTRO DE CARDS)
    const innerSwipers = document.querySelectorAll('.myImagesSwiper');
    innerSwipers.forEach(container => {
        new Swiper(container, {
            loop: true,
            nested: true, // Evita que al deslizar la foto se mueva el carrusel grande
            resistanceRatio: 0,
            pagination: {
                el: container.querySelector('.swiper-pagination'),
                clickable: true,
            },
        });
    });

    // 7. DARK MODE TOGGLE
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Check saved preference
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const mode = body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', mode);
        });
    }

    // 8. ELEGANT NAVBAR ENTRANCE
    const navItems = document.querySelectorAll('header ul li, header .cotizarbt');
    navItems.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(-20px)';
        item.style.transition = 'all 0.8s cubic-bezier(0.2, 1, 0.3, 1)';

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100 + (i * 100));
    });

    // 9. CUSTOM SELECT DROPDOWN
    document.querySelectorAll('#miFormulario select').forEach(select => {
        // Ocultar el select original (pero queda en el DOM para el form)
        select.style.display = 'none';

        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);

        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        trigger.innerHTML = `<span class="cs-label">¿Qué necesitás?</span><svg class="cs-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>`;
        wrapper.appendChild(trigger);

        const optionsList = document.createElement('div');
        optionsList.className = 'custom-select-options';

        Array.from(select.options).forEach(opt => {
            if (opt.disabled) return;
            const div = document.createElement('div');
            div.className = 'custom-option';
            div.textContent = opt.text;
            div.dataset.value = opt.value;

            div.addEventListener('click', () => {
                select.value = opt.value;
                trigger.querySelector('.cs-label').textContent = opt.text;
                trigger.classList.add('has-value');
                optionsList.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
                div.classList.add('selected');
                trigger.classList.remove('open');
                optionsList.classList.remove('open');
            });

            optionsList.appendChild(div);
        });

        wrapper.appendChild(optionsList);

        trigger.addEventListener('click', e => {
            e.stopPropagation();
            const isOpen = trigger.classList.contains('open');
            // Cerrar todos los demás
            document.querySelectorAll('.custom-select-trigger.open').forEach(t => t.classList.remove('open'));
            document.querySelectorAll('.custom-select-options.open').forEach(o => o.classList.remove('open'));
            if (!isOpen) {
                trigger.classList.add('open');
                optionsList.classList.add('open');
            }
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-select-trigger.open').forEach(t => t.classList.remove('open'));
        document.querySelectorAll('.custom-select-options.open').forEach(o => o.classList.remove('open'));
    });
});
