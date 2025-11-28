document.addEventListener("DOMContentLoaded", () => {

    /* ------------------ 1. Dynamic Year ------------------ */
    const yearEl = document.getElementById("current-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    /* ------------------ 2. Smooth Scrolling ------------------ */
    const nav = document.querySelector(".main-nav");
    const headerHeight = nav ? nav.offsetHeight : 0;

    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener("click", e => {
            const id = link.getAttribute("href");
            const target = document.querySelector(id);

            if (target) {
                e.preventDefault();
                const offset = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: offset,
                    behavior: "smooth"
                });

                // Close mobile menu
                if (navLinks.classList.contains("nav-active")) {
                    toggleMenu();
                }
            }
        });
    });


    /* ------------------ 3. Hamburger Menu ------------------ */
    const burgerMenu = document.getElementById("burgerMenu");
    const navLinks = document.getElementById("navLinks");

    function toggleMenu() {
        navLinks.classList.toggle("nav-active");
        burgerMenu.classList.toggle("toggle");

        // fade animation
        navLinks.querySelectorAll("li").forEach((li, i) => {
            if (li.style.animation) {
                li.style.animation = "";
            } else {
                li.style.animation = `navLinkFade 0.5s ease forwards ${i / 7 + 0.3}s`;
            }
        });
    }

    if (burgerMenu) burgerMenu.addEventListener("click", toggleMenu);


    /* ------------------ 4. Back to Top Button ------------------ */
    const backBtn = document.getElementById("backToTopBtn");

    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
            backBtn.style.display = "block";
            backBtn.style.opacity = "1";
        } else {
            backBtn.style.opacity = "0";
            setTimeout(() => {
                if (window.pageYOffset <= 300) backBtn.style.display = "none";
            }, 300);
        }
    });

    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    /* ------------------ 5. Sticky Nav + Active Link ------------------ */
    const sections = document.querySelectorAll("section");

    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 50) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }

        let current = "";
        sections.forEach(sec => {
            const top = sec.offsetTop - headerHeight - 50;
            const height = sec.clientHeight;

            if (pageYOffset >= top && pageYOffset < top + height) {
                current = sec.id;
            }
        });

        navLinks.querySelectorAll("a").forEach(a => {
            a.classList.remove("active");
            if (a.getAttribute("href").includes(current)) {
                a.classList.add("active");
            }
        });
    });


    /* ------------------ 6. Scroll Reveal ------------------ */
    const revealElements = document.querySelectorAll(".reveal");

    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const top = el.getBoundingClientRect().top;
            const winH = window.innerHeight;

            if (top < winH - 150) {
                el.classList.add("active");
            } else {
                el.classList.remove("active"); // optional
            }
        });
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();


    /* ------------------ 7. Contact Form Validation ------------------ */
    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("form-message");

    if (contactForm) {
        contactForm.addEventListener("submit", e => {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !email || !message) {
                formMessage.textContent = "Please fill out all fields.";
                formMessage.classList.add("error");
                setTimeout(() => {
                    formMessage.textContent = "";
                    formMessage.classList.remove("error");
                }, 3000);
                return;
            }

            // success message
            formMessage.textContent = "Thank you! Your message has been sent.";
            formMessage.classList.remove("error");
            contactForm.reset();
            setTimeout(() => {
                formMessage.textContent = "";
            }, 4000);
        });
    }


    /* ------------------ 8. Typing Effect (Optional) ------------------ */
    const typingEl = document.getElementById("hero-typing");
    if (typingEl) {
        const lines = ["Hi, I'm Akshay.", "I build websites.", "I love coding."];
        let i = 0, j = 0, forward = true;

        function type() {
            typingEl.textContent = lines[i].slice(0, j);

            if (forward) {
                if (j++ === lines[i].length) {
                    forward = false;
                    setTimeout(type, 800);
                    return;
                }
            } else {
                if (j-- === 0) {
                    forward = true;
                    i = (i + 1) % lines.length;
                    setTimeout(type, 200);
                    return;
                }
            }

            setTimeout(type, forward ? 70 : 35);
        }

        type();
    }

});
