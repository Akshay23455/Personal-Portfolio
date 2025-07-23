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
    });
});