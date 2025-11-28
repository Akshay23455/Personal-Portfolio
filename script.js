document.addEventListener("DOMContentLoaded", function() {
    // 1. Dynamic Copyright Year
    document.getElementById("current-year").textContent = new Date().getFullYear();

    // Removed: Theme Toggling (Dark/Light Mode) logic

    // 2. Smooth Scrolling for Navigation Links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust scroll position to account for fixed header
                const headerOffset = document.querySelector('.main-nav').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Close mobile menu if open
                if (navLinks.classList.contains('nav-active')) {
                    navToggle();
                }
            }
        });
    });

    // 3. Mobile Navigation Toggle (Hamburger Menu)
    const burgerMenu = document.getElementById("burgerMenu");
    const navLinks = document.getElementById("navLinks");

    const navToggle = () => {
        navLinks.classList.toggle("nav-active");
        burgerMenu.classList.toggle("toggle"); // Burger animation

        // Animate links
        navLinks.querySelectorAll('li').forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    }

    burgerMenu.addEventListener("click", navToggle);

    // 4. Back to Top Button
    const backToTopBtn = document.getElementById("backToTopBtn");

    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) { // Show button after scrolling 300px
            backToTopBtn.style.display = "block";
            backToTopBtn.style.opacity = "1";
        } else {
            backToTopBtn.style.opacity = "0";
            setTimeout(() => {
                if (window.pageYOffset <= 300) { // Ensure it's still hidden if scroll up fast
                    backToTopBtn.style.display = "none";
                }
            }, 300); // Wait for fade out
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // 5. Sticky Navigation Bar & Active Link Highlighting
    const mainNav = document.querySelector('.main-nav');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky nav (already fixed, but could add shadow on scroll if desired)
        if (window.pageYOffset > 50) {
            mainNav.classList.add('scrolled'); // Optional: Add a class for different styles on scroll
        } else {
            mainNav.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - mainNav.offsetHeight - 50; // Adjust for header height and some padding
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 6. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            // If the element is within 150px of the bottom of the viewport
            if (elTop < windowHeight - 150) {
                el.classList.add('active');
            } else {
                el.classList.remove('active'); // Optional: remove 'active' if scrolled back up
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check on load


    // 7. Improved Contact Form Handling
    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("form-message");

    contactForm.addEventListener("submit", function(e) {
        e.preventDefault(); // Prevent actual form submission

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message) {
            formMessage.textContent = "Please fill out all fields.";
            formMessage.classList.add("error");
            setTimeout(() => { formMessage.textContent = ""; formMessage.classList.remove("error"); }, 3000);
            return false;
        }

        // In a real application, you would send this data to a server here (e.g., via fetch API)
        // For demonstration, we'll just show a success message
        formMessage.textContent = "Thank you! Your message has been sent.";
        formMessage.classList.remove("error"); // Ensure no error class
        contactForm.reset(); // Clear the form fields
        setTimeout(() => { formMessage.textContent = ""; }, 4000); // Clear message after 4 seconds

        return false; // Still return false as we handled submission
/* MAIN UI ENHANCEMENTS FOR HERO / NAV / UX */
/* Drop this script before </body> */

/* ---------- Helper ---------- */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1) Burger menu toggle (mobile) ---------- */
  const burger = $('.burger-menu');
  const navLinks = $('.nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('toggle');
      navLinks.classList.toggle('nav-active');

      // stagger animation for links (if present)
      $$('.nav-links li').forEach((li, i) => {
        li.style.animation = navLinks.classList.contains('nav-active')
          ? `navLinkFade 0.5s ease forwards ${i/7 + 0.15}s`
          : '';
      });
    });

    // close menu on link click (mobile)
    $$('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        if (navLinks.classList.contains('nav-active')) {
          navLinks.classList.remove('nav-active');
          burger.classList.remove('toggle');
          $$('.nav-links li').forEach(li => li.style.animation = '');
        }
      });
    });
  }

  /* ---------- 2) Smooth scroll + active link on scroll ---------- */
  const headerHeight = $('.main-nav') ? $('.main-nav').offsetHeight : 0;
  const navAnchors = $$('a[href^="#"]').filter(a => !a.hasAttribute('data-no-scroll'));

  navAnchors.forEach(a => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - headerHeight - 10,
          behavior: 'smooth'
        });
      }
    });
  });

  // IntersectionObserver to set active nav link
  const sections = $$('section[id]');
  if (sections.length && $('.nav-links')) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = $(`.nav-links a[href="#${id}"]`);
        if (link) {
          if (entry.isIntersecting) {
            $$('.nav-links a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    }, { root: null, rootMargin: `-${(headerHeight+20)}px 0px -40% 0px`, threshold: 0.2 });

    sections.forEach(s => observer.observe(s));
  }

  /* ---------- 3) Back to top button ---------- */
  const backBtn = document.getElementById('backToTopBtn');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.style.display = (window.scrollY > window.innerHeight/2) ? 'block' : 'none';
    });
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 4) Profile photo lightbox modal ---------- */
  const profile = $('.profile-photo');
  if (profile) {
    // create modal elements
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.style.cssText = `
      position:fixed;inset:0;display:none;align-items:center;justify-content:center;
      background:rgba(0,0,0,0.85);z-index:2000;padding:2rem;
    `;
    const imgWrap = document.createElement('div');
    imgWrap.style.cssText = 'max-width:90%;max-height:90%;';
    const fullImg = document.createElement('img');
    fullImg.src = profile.currentSrc || profile.src;
    fullImg.alt = document.title || 'Profile photo';
    fullImg.style.cssText = 'width:auto;height:auto;max-width:100%;max-height:100%;border-radius:8px;';
    imgWrap.appendChild(fullImg);
    modal.appendChild(imgWrap);
    document.body.appendChild(modal);

    profile.style.cursor = 'zoom-in';
    profile.addEventListener('click', () => {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });

    // close on escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- 5) Scroll reveal (uses .reveal elements) ---------- */
  const revealEls = $$('.reveal');
  if (revealEls.length) {
    const rvObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          rvObserver.unobserve(entry.target); // reveal once
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => rvObserver.observe(el));
  }

  /* ---------- 6) Theme toggle (light/dark) ---------- */
  const savedTheme = localStorage.getItem('site-theme') || null;
  const root = document.documentElement;

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      root.style.setProperty('--background-color-light', '#0f1724');
      root.style.setProperty('--background-color-dark', '#0b1220');
      root.style.setProperty('--text-color', '#e6eef8');
      localStorage.setItem('site-theme', 'dark');
    } else {
      root.style.setProperty('--background-color-light', '#f4f7f6');
      root.style.setProperty('--background-color-dark', '#ecf0f1');
      root.style.setProperty('--text-color', '#333');
      localStorage.setItem('site-theme', 'light');
    }
  };

  if (savedTheme) applyTheme(savedTheme);

  // add small toggle button if not present
  if (!$('#themeToggle')) {
    const tBtn = document.createElement('button');
    tBtn.id = 'themeToggle';
    tBtn.className = 'btn';
    tBtn.style.cssText = 'margin-left:1rem;padding:.5rem .8rem;font-weight:600;';
    tBtn.title = 'Toggle theme';
    tBtn.textContent = (localStorage.getItem('site-theme') === 'dark') ? 'Light' : 'Dark';
    // append to nav (if available) else to body top-right
    if ($('.main-nav')) {
      $('.main-nav').appendChild(tBtn);
    } else {
      tBtn.style.position = 'fixed';
      tBtn.style.right = '1rem';
      tBtn.style.top = '1rem';
      document.body.appendChild(tBtn);
    }

    tBtn.addEventListener('click', () => {
      const next = (localStorage.getItem('site-theme') === 'dark') ? 'light' : 'dark';
      applyTheme(next);
      tBtn.textContent = (next === 'dark') ? 'Light' : 'Dark';
    });
  }

  /* ---------- 7) Contact form validation (basic) ---------- */
  const contactForm = $('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const name = contactForm.querySelector('input[name="name"]');
      const email = contactForm.querySelector('input[name="email"]');
      const message = contactForm.querySelector('textarea[name="message"]');
      let ok = true;
      // simple checks
      if (name && name.value.trim().length < 2) { ok = false; name.style.borderColor = 'var(--accent-color)'; }
      if (email && !/^\S+@\S+\.\S+$/.test(email.value)) { ok = false; email.style.borderColor = 'var(--accent-color)'; }
      if (message && message.value.trim().length < 10) { ok = false; message.style.borderColor = 'var(--accent-color)'; }

      if (!ok) {
        e.preventDefault();
        const msgEl = contactForm.querySelector('.form-message') || document.createElement('div');
        msgEl.className = 'form-message error';
        msgEl.textContent = 'Please complete the form correctly before sending.';
        if (!contactForm.querySelector('.form-message')) contactForm.appendChild(msgEl);
      }
    });

    // reset border color on input
    contactForm.addEventListener('input', (e) => {
      if (e.target) e.target.style.borderColor = '';
    });
  }

}); // DOMContentLoaded
    });
});
