/* script.js */

/* ---------- Dynamic footer year ---------- */
(function updateFooterYear() {
    const y = new Date().getFullYear();
    const el = document.getElementById("current-year");
    if (el) el.textContent = y;
})();

/* ---------- Burger menu (mobile) ---------- */
const burger = document.getElementById("burgerMenu");
const navLinks = document.getElementById("navLinks");

if (burger && navLinks) {
    const navItems = navLinks.querySelectorAll("li");
    burger.addEventListener("click", () => {
        navLinks.classList.toggle("nav-active");
        burger.classList.toggle("toggle");

        // animate links staggered
        navItems.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = "";
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.2}s`;
            }
        });
    });
}

/* Close mobile nav when a link is clicked (good UX) */
if (navLinks) {
    navLinks.addEventListener("click", (e) => {
        if (e.target.tagName === 'A' && navLinks.classList.contains('nav-active')) {
            navLinks.classList.remove('nav-active');
            burger.classList.remove('toggle');
            // remove inline animations
            navLinks.querySelectorAll('li').forEach(li => li.style.animation = '');
        }
    });
}

/* ---------- Scroll reveal (simple) ---------- */
const revealOnScroll = () => {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const revealPoint = 120;

    reveals.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < windowHeight - revealPoint) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

/* ---------- Back to top button ---------- */
const backToTopBtn = document.getElementById('backToTopBtn');
window.addEventListener('scroll', () => {
    if (!backToTopBtn) return;
    if (window.scrollY > 400) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ---------- Contact form submission (demo) ---------- */
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simple client-side validation (fields are required in markup)
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            formMessage.textContent = 'Please fill in all fields.';
            formMessage.classList.add('error');
            return;
        }

        // Simulate sending (you can replace this with real POST to backend later)
        formMessage.classList.remove('error');
        formMessage.textContent = 'Sending...';

        setTimeout(() => {
            formMessage.textContent = 'Thanks! Your message has been sent.';
            contactForm.reset();
            setTimeout(() => {
                formMessage.textContent = '';
            }, 4000);
        }, 800);
    });
}

/* ---------- Highlight current nav link while scrolling ---------- */
const sections = document.querySelectorAll('main section, header');
const navAnchors = document.querySelectorAll('.nav-links a');

const setActiveLinkOnScroll = () => {
    let index = sections.length;

    while(--index && window.scrollY + 100 < sections[index].offsetTop) {}
    navAnchors.forEach((a) => a.classList.remove('active'));
    if (navAnchors[index]) navAnchors[index].classList.add('active');
};

window.addEventListener('scroll', setActiveLinkOnScroll);
window.addEventListener('load', setActiveLinkOnScroll);
