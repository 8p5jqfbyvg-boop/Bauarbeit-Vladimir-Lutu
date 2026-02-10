document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // --- Loader ---
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            // Start Hero Animations after loader is gone
            initHeroAnimations();
        }, 500);
    }, 2000); // Fake load time

    // --- Typewriter Effect ---
    const words = ["DETAILING", "PROTECTION", "RESTORATION", "COATING"];
    const typewriterElement = document.getElementById('typewriter');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 50;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeDelay = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeDelay = 500;
        }

        setTimeout(type, typeDelay);
    }
    // Start typewriter
    type();

    // --- Navigation ---
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    // Sticky Navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active'); // Add animation to hamburger if simple css
        // Animate hamburger bars
        const bars = document.querySelectorAll('.bar');
        if (mobileMenu.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const bars = document.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });

    // --- GSAP Animations ---
    function initHeroAnimations() {
        const tl = gsap.timeline();

        tl.to('.animate-up', {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        })
            .to('.animate-up-delay', {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out'
            }, '-=0.5')
            .to('.animate-up-delay-2', {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out'
            }, '-=0.5')
            .to('.animate-up-delay-3', {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                stagger: 0.2
            }, '-=0.5');
    }

    // Scroll Animations
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1
        });
    });

    // Service cards animation removed to prevent conflict with VanillaTilt
    // which also controls transform. Cards will be visible by default.

    gsap.from('.comparison-container', {
        scrollTrigger: {
            trigger: '.comparison-container',
            start: 'top 80%'
        },
        scale: 0.9,
        opacity: 0,
        duration: 1
    });

    // --- Counter Animation ---
    gsap.utils.toArray('.counter').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        gsap.to(counter, {
            scrollTrigger: {
                trigger: counter,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            innerHTML: target,
            duration: 2,
            snap: { innerHTML: 1 },
            ease: 'power1.out'
        });
    });

    // --- Service Selection Logic ---
    window.selectService = function (serviceValues) {
        // Uncheck all first if we want single select from cards, 
        // OR just check the box. Let's just check the box in the form.
        const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
        const targetCheckbox = document.querySelector(`.checkbox-group input[value="${serviceValues}"]`);

        if (targetCheckbox) {
            targetCheckbox.checked = !targetCheckbox.checked;
            updatePrice();
            // Scroll to booking
            document.querySelector('#booking').scrollIntoView({ behavior: 'smooth' });
        }
    };

    const priceCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    const totalPriceElement = document.getElementById('total-price');

    function updatePrice() {
        let total = 0;
        priceCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                total += parseInt(checkbox.getAttribute('data-price'));
            }
        });
        totalPriceElement.textContent = '$' + total;

        // Animate price change
        gsap.from(totalPriceElement, {
            scale: 1.5,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
    }

    priceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updatePrice);
    });

    // --- Before/After Slider ---
    const sliderContainer = document.querySelector('.comparison-container');
    const afterImage = document.querySelector('.after-image');
    const scroller = document.querySelector('.scroller');

    if (sliderContainer) {
        let active = false;

        // Fix: Ensure the image inside the clipped container is the full width of the main container
        function updateSliderImage() {
            const containerWidth = sliderContainer.offsetWidth;
            const afterImg = afterImage.querySelector('img');
            if (afterImg) {
                afterImg.style.width = `${containerWidth}px`;
                afterImg.style.maxWidth = 'none'; // Override generic rules
            }
        }

        // Initial set and resize listener
        updateSliderImage();
        window.addEventListener('resize', updateSliderImage);

        // Mouse events
        sliderContainer.addEventListener('mousedown', () => { active = true; });
        document.body.addEventListener('mouseup', () => { active = false; });
        document.body.addEventListener('mouseleave', () => { active = false; });

        // Touch events
        sliderContainer.addEventListener('touchstart', () => { active = true; });
        document.body.addEventListener('touchend', () => { active = false; });
        document.body.addEventListener('touchcancel', () => { active = false; });

        // Movement
        sliderContainer.addEventListener('mousemove', (e) => {
            if (!active) return;
            let x = e.pageX;
            x -= sliderContainer.getBoundingClientRect().left;
            slideIt(x);
        });

        sliderContainer.addEventListener('touchmove', (e) => {
            if (!active) return;
            let x;
            for (let i = 0; i < e.changedTouches.length; i++) {
                x = e.changedTouches[i].pageX;
            }
            x -= sliderContainer.getBoundingClientRect().left;
            slideIt(x);
        });

        function slideIt(x) {
            let transform = Math.max(0, (Math.min(x, sliderContainer.offsetWidth)));
            afterImage.style.width = transform + "px";
            scroller.style.left = transform + "px";
        }
    }

    // --- Vanilla Tilt ---
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".service-card"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2
        });
    }

    // --- Service Card Flip (Click) ---
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            // Toggle flip class
            card.classList.toggle('is-flipped');
        });
    });
});


});

