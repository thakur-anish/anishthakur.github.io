/* 0. THEME TOGGLE — dark / light only */
(function initTheme() {
    const root   = document.documentElement;
    const btn    = document.getElementById('themeToggle');
    const stored = localStorage.getItem('theme') || 'light';

    function applyTheme(t) {
        root.setAttribute('data-theme', t);
        localStorage.setItem('theme', t);
    }

    if (btn) {
        btn.addEventListener('click', () => {
            const current = root.getAttribute('data-theme') || 'dark';
            applyTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    applyTheme(stored);
})();

'use strict';

/* 1. LOADER */
document.body.style.overflow = 'hidden';
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initAll();
    }, 1200);
});

/* 2. CUSTOM CURSOR */
function initCursor() {
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring || window.innerWidth < 768) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
    });

    (function animRing() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(animRing);
    })();

    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = ''; ring.style.opacity = ''; });
}

/* 3. NAVBAR */
function initNavbar() {
    const navbar      = document.getElementById('navbar');
    const scrollBtn   = document.getElementById('scrollTop');
    const navLinks    = document.querySelectorAll('.nav-link');
    const sections    = document.querySelectorAll('section[id]');
    const hamburger   = document.getElementById('hamburger');
    const navMenu     = document.getElementById('navLinks');
    const overlay     = document.getElementById('navOverlay');

    // Toggle menu open/close
    function openMenu() {
        navMenu.classList.add('open');
        hamburger.classList.add('open');
        overlay.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        overlay.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.contains('open') ? closeMenu() : openMenu();
        });
    }

    // Close on overlay (outside) click
    if (overlay) overlay.addEventListener('click', closeMenu);

    // Close on nav link click
    document.querySelectorAll('.nav-link, .nav-resume').forEach(a => {
        a.addEventListener('click', closeMenu);
    });

    // Escape key closes menu
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenu();
    });

    function onScroll() {
        const y = window.scrollY;
        const wasScrolled = navbar.classList.contains('scrolled');
        navbar.classList.toggle('scrolled', y > 50);

        // Keep mobile nav-links top in sync with navbar height
        if (window.innerWidth <= 768) {
            navMenu.style.top = (y > 50) ? '58px' : '68px';
        }

        scrollBtn.classList.toggle('visible', y > 300);

        // Active link highlight
        let current = '';
        sections.forEach(sec => {
            if (y >= sec.offsetTop - 80) current = sec.id;
        });
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* 4. SMOOTH SCROLL─ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 68;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
}

/* 5. PARTICLES── */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const isMobile = window.innerWidth < 600;
    const count    = isMobile ? 35 : 70;
    const sizes    = ['sm', 'sm', 'sm', 'md', 'md', 'lg', 'xl'];
    const drifts   = ['', 'drift-l', 'drift-r', 'drift-w', '', 'drift-l', 'drift-r'];

    for (let i = 0; i < count; i++) {
        const p    = document.createElement('div');
        const size  = sizes[Math.floor(Math.random() * sizes.length)];
        const drift = drifts[Math.floor(Math.random() * drifts.length)];
        p.className = `particle ${size} ${drift}`;
        p.style.cssText = `
            left: ${Math.random() * 100}%;
            top:  ${20 + Math.random() * 80}%;
            --dur: ${3 + Math.random() * 6}s;
            --del: ${Math.random() * 8}s;
            opacity: 0;
        `;
        container.appendChild(p);
    }
}

/* 6. TYPING EFFECT─ */
function createTyper({ id, phrases, typeSpeed = 88, deleteSpeed = 52, pauseAfter = 1900, pauseBefore = 350 }) {
    const el = document.getElementById(id);
    if (!el) return;
    let pi = 0, ci = 0, deleting = false;

    function tick() {
        const phrase = phrases[pi];
        el.textContent = phrase.substring(0, ci);

        if (!deleting) {
            if (ci < phrase.length) { ci++; setTimeout(tick, typeSpeed + Math.random() * 40); }
            else setTimeout(() => { deleting = true; tick(); }, pauseAfter);
        } else {
            if (ci > 0) { ci--; setTimeout(tick, deleteSpeed); }
            else { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, pauseBefore); }
        }
    }
    tick();
}

/* 7. SCROLL REVEAL─ */
function initReveal() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* 8. TIMELINE REVEAL── */
function initTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 150);
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.2 });
    items.forEach(el => observer.observe(el));
}

/* 9. SKILL BARS─ */
function initSkillBars() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                setTimeout(() => { e.target.style.width = e.target.dataset.width + '%'; }, 200);
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skill-fill').forEach(el => observer.observe(el));
}

/* 10. SOFT SKILL RINGS */
function initSoftRings() {
    const circumference = 2 * Math.PI * 34; // r = 34
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const pct  = parseFloat(e.target.dataset.pct) / 100;
                const offset = circumference * (1 - pct);
                setTimeout(() => { e.target.style.strokeDashoffset = offset; }, 300);
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.soft-ring .fg').forEach(el => observer.observe(el));
}

/* 11. CARD TILT─ */
function initCardTilt() {
    if (window.innerWidth < 768) return;
    document.querySelectorAll('.project-card, .about-card, .hobby-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top  - r.height / 2;
            card.style.transform = `translateY(-6px) rotateX(${(y / r.height) * 5}deg) rotateY(${-(x / r.width) * 5}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease';
        });
        card.addEventListener('mouseenter', () => { card.style.transition = 'transform 0.1s ease'; });
    });
}

/* 12. CONTACT FORM─ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const btn  = document.getElementById('submitBtn');
    if (!form || !btn) return;

    const btnText    = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        btnText.hidden = true; btnLoading.hidden = false; btn.disabled = true;

        // Initialize EmailJS (only once)
        if (!window.emailjsInitialized) {
            emailjs.init('-I-0ac9xARauIARuZ');
            window.emailjsInitialized = true;
        }

        // Prepare form data
        const formData = {
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value
        };

        emailjs.send('service_aafqd18', 'template_2ijurgi', formData)
            .then(function() {
                btnText.hidden = false; btnLoading.hidden = true; btn.disabled = false;
                showToast('Message sent! I\'ll get back within 24 hours 🚀');
                form.reset();
            }, function(error) {
                btnText.hidden = false; btnLoading.hidden = true; btn.disabled = false;
                showToast('Failed to send message. Please try again.');
                console.error('EmailJS error:', error);
            });
    });
}

/* 13. TOAST */
function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        Object.assign(toast.style, {
            position: 'fixed', bottom: '30px', left: '50%',
            transform: 'translateX(-50%) translateY(80px)',
            background: 'var(--bg-card)', border: '1px solid var(--accent)',
            color: 'var(--white)', padding: '6px 14px', borderRadius: '4px',
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', zIndex: '9999',
            boxShadow: '0 0 18px rgba(255,140,0,0.15)',
            transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
            whiteSpace: 'nowrap',
        });
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
        setTimeout(() => { toast.style.transform = 'translateX(-50%) translateY(80px)'; }, 3500);
    });
}

/* 14. GLITCH NAV LINKS */
function initNavGlitch() {
    document.querySelectorAll('.nav-link').forEach(a => {
        a.addEventListener('mouseenter', () => {
            // a.style.letterSpacing = '2px';
            setTimeout(() => { a.style.letterSpacing = '1px'; }, 120);
        });
    });
}

/* 15. INIT ALL── */
function initAll() {
    initCursor();
    initNavbar();
    initSmoothScroll();
    initParticles();
    initReveal();
    initTimeline();
    initSkillBars();
    initSoftRings();
    initCardTilt();
    initContactForm();
    initNavGlitch();

    createTyper({
        id: 'heroType',
        phrases: [
            'Cybersecurity Enthusiast',
            'Network Security',
            'Web Developer',
            'Network & Systems Learner',
            'PUBG Strategist 🎮',
        ],
        typeSpeed: 85,
        deleteSpeed: 50,
        pauseAfter: 2000,
    });
}
