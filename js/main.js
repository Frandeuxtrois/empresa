document.addEventListener('DOMContentLoaded', () => {

    // 1. ANIMACIÓN HERO
    const heroElements = document.querySelectorAll('#hero .fade-in-item');
    heroElements.forEach((el, i) => {
        setTimeout(() => { el.classList.add('visible'); }, 500 + (i * 400));
    });

    // 2. SCROLL INDICATOR & HEADER
    const header = document.getElementById('header');

    function updateHeader() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;

        const indicator = document.getElementById('scrollIndicator');
        if (indicator) indicator.style.width = scrolled + '%';

        if (header) {
            scrollTop > 100 ? header.classList.add('scrolled') : header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Check on page load too

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

    // 4b. HAMBURGER MENU
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');

    function openMenu() {
        hamburger.classList.add('open');
        navMenu.classList.add('open');
        navOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (hamburger) hamburger.classList.remove('open');
        if (navMenu) navMenu.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.contains('open') ? closeMenu() : openMenu();
        });
    }
    if (navOverlay) navOverlay.addEventListener('click', closeMenu);

    // 4. SMOOTH SCROLL + cierre del menú
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            closeMenu();
            // Logo / enlaces vacíos: no intentar hacer scroll a "#"
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const headerHeight = header ? header.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // 5. ACCORDION SLIDER - PROYECTOS
    (() => {
        const track = document.getElementById('proyTrack');
        if (!track) return;
        const wrap = track.parentElement;
        const cards = Array.from(track.children);
        const prev = document.getElementById('proyPrev');
        const next = document.getElementById('proyNext');
        const dotsBox = document.getElementById('proyDots');

        const isMobile = () => matchMedia('(max-width:767px)').matches;

        cards.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'proy-dot';
            dot.onclick = () => activate(i, true);
            dotsBox.appendChild(dot);
        });
        const dots = Array.from(dotsBox.children);

        let current = 0;

        function center(i) {
            const card = cards[i];
            const axis = isMobile() ? 'top' : 'left';
            const size = isMobile() ? 'clientHeight' : 'clientWidth';
            const start = isMobile() ? card.offsetTop : card.offsetLeft;
            wrap.scrollTo({ [axis]: start - (wrap[size] / 2 - card[size] / 2), behavior: 'smooth' });
        }

        function toggleUI(i) {
            cards.forEach((c, k) => c.toggleAttribute('active', k === i));
            dots.forEach((d, k) => d.classList.toggle('active', k === i));
            prev.disabled = i === 0;
            next.disabled = i === cards.length - 1;
        }

        function activate(i, scroll) {
            if (i === current) return;
            current = i;
            toggleUI(i);
            if (scroll) center(i);
        }

        function go(step) {
            activate(Math.min(Math.max(current + step, 0), cards.length - 1), true);
        }

        prev.onclick = () => go(-1);
        next.onclick = () => go(1);

        addEventListener('keydown', (e) => {
            if (['ArrowRight', 'ArrowDown'].includes(e.key)) go(1);
            if (['ArrowLeft', 'ArrowUp'].includes(e.key)) go(-1);
        }, { passive: true });

        cards.forEach((card, i) => {
            card.addEventListener('mouseenter', () => matchMedia('(hover:hover)').matches && activate(i, true));
            card.addEventListener('click', () => activate(i, true));
        });

        let sx = 0, sy = 0;
        track.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
        track.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - sx;
            const dy = e.changedTouches[0].clientY - sy;
            if (isMobile() ? Math.abs(dy) > 60 : Math.abs(dx) > 60)
                go((isMobile() ? dy : dx) > 0 ? -1 : 1);
        }, { passive: true });

        if (isMobile()) dotsBox.hidden = true;
        addEventListener('resize', () => center(current));
        toggleUI(0);
        center(0);
    })();

    // 5b. SWIPER PLANES
    new Swiper('.planesSwiper', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        grabCursor: true,
        centeredSlides: false,
        slidesPerGroup: 2,
        navigation: {
            nextEl: '.planesSwiper .swiper-button-next',
            prevEl: '.planesSwiper .swiper-button-prev',
        },
        pagination: {
            el: '.planesSwiper .swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            0: {
                centeredSlides: true,
                slidesPerGroup: 1,
            },
            769: {
                centeredSlides: false,
                slidesPerGroup: 2,
            },
        },
    });

    // 6. FAQ SMOOTH OPEN/CLOSE
    document.querySelectorAll('.faq-item').forEach(details => {
        const summary = details.querySelector('summary');
        const p = details.querySelector('p');
        if (!summary || !p) return;

        summary.addEventListener('click', e => {
            e.preventDefault();

            if (!details.open) {
                // Abrir
                details.setAttribute('open', '');
                const height = p.scrollHeight;
                p.style.overflow = 'hidden';
                p.style.maxHeight = '0';
                p.style.opacity = '0';
                p.style.transition = 'max-height 0.35s ease, opacity 0.3s ease';
                requestAnimationFrame(() => {
                    p.style.maxHeight = height + 'px';
                    p.style.opacity = '1';
                });
                setTimeout(() => {
                    p.style.maxHeight = '';
                    p.style.overflow = '';
                    p.style.transition = '';
                }, 370);
            } else {
                // Cerrar
                const height = p.scrollHeight;
                p.style.overflow = 'hidden';
                p.style.maxHeight = height + 'px';
                p.style.opacity = '1';
                p.style.transition = 'max-height 0.35s ease, opacity 0.3s ease';
                requestAnimationFrame(() => {
                    p.style.maxHeight = '0';
                    p.style.opacity = '0';
                });
                setTimeout(() => {
                    details.removeAttribute('open');
                    p.style.maxHeight = '';
                    p.style.opacity = '';
                    p.style.overflow = '';
                    p.style.transition = '';
                }, 370);
            }
        });
    });

    // 7. DARK MODE TOGGLE
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Night-mode por defecto; solo "light" si el usuario lo eligió
    if (localStorage.getItem('theme') === 'light') {
        body.classList.remove('dark-mode');
    } else {
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

    // 10. AW PARTICLES — se dispersan con el mouse y se reagrupan (estilo Black & White)
    (() => {
        const canvas = document.getElementById('awParticles');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let dpr = 1;
        const mouse = { x: -9999, y: -9999, radius: 55 };
        const STEP = 1.5; // separación de muestreo (densidad) en px CSS — menor = más unidas
        const SIZE = 2;   // tamaño de cada partícula en px CSS (mayor que STEP = se solapan)

        const color = () => document.body.classList.contains('dark-mode') ? '#ffffff' : '#1a1a1a';

        function build() {
            const cssW = canvas.clientWidth, cssH = canvas.clientHeight;
            if (!cssW || !cssH) return;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(cssW * dpr);
            canvas.height = Math.round(cssH * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // dibujamos en px CSS, render a resolución retina
            ctx.clearRect(0, 0, cssW, cssH);
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const fontSize = Math.min(cssH * 0.78, cssW * 0.5);
            ctx.save();
            ctx.translate(cssW / 2, cssH / 2);
            ctx.scale(1, 1.3); // AW más alto que largo
            ctx.font = `800 ${fontSize}px Montserrat, sans-serif`;
            ctx.fillText('AW', 0, 0);
            ctx.restore();
            const dw = canvas.width, dh = canvas.height;
            const data = ctx.getImageData(0, 0, dw, dh).data;
            ctx.clearRect(0, 0, cssW, cssH);
            particles = [];
            const step = Math.max(1, Math.round(STEP * dpr)); // muestreo en px device
            for (let y = 0; y < dh; y += step) {
                for (let x = 0; x < dw; x += step) {
                    if (data[(y * dw + x) * 4 + 3] > 128) {
                        particles.push({ x: Math.random() * cssW, y: Math.random() * cssH, hx: x / dpr, hy: y / dpr, vx: 0, vy: 0 });
                    }
                }
            }
        }

        function tick() {
            const cssW = canvas.clientWidth, cssH = canvas.clientHeight;
            ctx.clearRect(0, 0, cssW, cssH);
            ctx.fillStyle = color();
            for (const p of particles) {
                const dx = p.x - mouse.x, dy = p.y - mouse.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < mouse.radius * mouse.radius) {
                    const d = Math.sqrt(d2) || 0.001;
                    const f = (mouse.radius - d) / mouse.radius;
                    p.vx += (dx / d) * f * 4;
                    p.vy += (dy / d) * f * 4;
                }
                p.vx += (p.hx - p.x) * 0.025;
                p.vy += (p.hy - p.y) * 0.025;
                p.vx *= 0.86;
                p.vy *= 0.86;
                p.x += p.vx;
                p.y += p.vy;
                ctx.fillRect(p.x, p.y, SIZE, SIZE);
            }
        }

        let rafId = null;
        function loop() { tick(); rafId = requestAnimationFrame(loop); }
        function play() { if (!rafId) loop(); }
        function pause() { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

        canvas.addEventListener('mousemove', e => {
            const r = canvas.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        });
        canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

        const start = () => {
            build();
            // Solo anima cuando el AW está visible (ahorra CPU en el resto de la página)
            if ('IntersectionObserver' in window) {
                new IntersectionObserver((entries) => {
                    entries[0].isIntersecting ? play() : pause();
                }, { threshold: 0 }).observe(canvas);
            } else {
                play();
            }
        };
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(start);
        } else {
            window.addEventListener('load', start);
        }
        let rt;
        window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); });
    })();
});
