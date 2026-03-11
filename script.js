// script.js – Aether Luxury Remodeling

document.addEventListener('DOMContentLoaded', function() {

    // ========== STICKY NAVIGATION ==========
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ========== MOBILE HAMBURGER MENU ==========
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('show');
            // Toggle icon between bars and times
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
                navLinks.classList.remove('show');
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // ========== DROPDOWN MENUS (MOBILE FRIENDLY) ==========
    const dropdownParents = document.querySelectorAll('.nav-links > li:has(.dropdown)');
    if (dropdownParents.length) {
        // For mobile: click on parent link toggles dropdown
        dropdownParents.forEach(parent => {
            const link = parent.querySelector('a');
            const dropdown = parent.querySelector('.dropdown');
            if (link && dropdown) {
                link.addEventListener('click', function(e) {
                    // Only prevent default on mobile (touch)
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                    }
                });
            }
        });

        // Reset on resize (hide dropdowns on desktop, keep hover behavior)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                document.querySelectorAll('.dropdown').forEach(d => d.style.display = '');
            } else {
                // On mobile, ensure they are hidden initially
                document.querySelectorAll('.dropdown').forEach(d => d.style.display = 'none');
            }
        });

        // Initial hide on mobile
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.dropdown').forEach(d => d.style.display = 'none');
        }
    }

    // ========== BEFORE/AFTER SLIDERS ==========
    const sliders = document.querySelectorAll('.img-comp');
    sliders.forEach(container => {
        const slider = container.querySelector('.img-comp-slider');
        const afterImg = container.querySelector('.img-comp-img:last-child');
        if (!slider || !afterImg) return;

        // Input range slider (if exists)
        const rangeInput = container.querySelector('input[type="range"]');
        if (rangeInput) {
            rangeInput.addEventListener('input', function(e) {
                const val = e.target.value + '%';
                afterImg.style.width = val;
            });
        } else if (slider) {
            // If we have a div slider, we need to make it draggable (optional)
            // For simplicity, we'll use mouse events
            let isDragging = false;
            slider.addEventListener('mousedown', startDrag);
            slider.addEventListener('touchstart', startDrag, {passive: false});
            window.addEventListener('mouseup', stopDrag);
            window.addEventListener('touchend', stopDrag);
            window.addEventListener('mousemove', drag);
            window.addEventListener('touchmove', drag, {passive: false});

            function startDrag(e) {
                e.preventDefault();
                isDragging = true;
            }

            function stopDrag() {
                isDragging = false;
            }

            function drag(e) {
                if (!isDragging) return;
                e.preventDefault();
                const rect = container.getBoundingClientRect();
                let clientX = e.clientX || (e.touches && e.touches[0].clientX);
                if (!clientX) return;
                let x = clientX - rect.left;
                x = Math.max(0, Math.min(x, rect.width));
                let percent = (x / rect.width) * 100;
                afterImg.style.width = percent + '%';
                // Move slider handle
                slider.style.left = percent + '%';
            }
        }
    });

    // ========== LIGHTBOX GALLERY ==========
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxLocation = document.getElementById('lightboxLocation');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const closeLightbox = document.getElementById('closeLightbox');

    if (lightbox) {
        // Open lightbox when clicking a gallery item
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const imgSrc = this.dataset.img || this.querySelector('img').src;
                const title = this.dataset.title || 'Project';
                const location = this.dataset.location || 'Houston, TX';
                const desc = this.dataset.desc || 'Luxury remodel by Aether.';

                if (lightboxImg) lightboxImg.src = imgSrc;
                if (lightboxTitle) lightboxTitle.textContent = title;
                if (lightboxLocation) lightboxLocation.textContent = location;
                if (lightboxDesc) lightboxDesc.textContent = desc;

                lightbox.classList.add('active');
            });
        });

        // Close lightbox
        if (closeLightbox) {
            closeLightbox.addEventListener('click', () => {
                lightbox.classList.remove('active');
            });
        }

        // Click outside content to close
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });

        // Close with ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
            }
        });
    }

    // ========== FILTERABLE GALLERY / BLOG ==========
    const filterButtons = document.querySelectorAll('.filter-btn, .cat-btn');
    const filterableItems = document.querySelectorAll('.gallery-item, .post-item');

    if (filterButtons.length && filterableItems.length) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons in same group
                const parent = this.parentNode;
                parent.querySelectorAll('.filter-btn, .cat-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filterValue = this.dataset.cat || this.dataset.filter || 'all';

                filterableItems.forEach(item => {
                    const itemCat = item.dataset.category || '';
                    if (filterValue === 'all' || itemCat === filterValue) {
                        item.style.display = ''; // restore default display (block/grid)
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // ========== STICKY CTA (OPTIONAL) – not needed, but if you want to add smooth scroll ==========
    // Example: Smooth scroll to contact form when clicking estimate buttons
    const estimateBtns = document.querySelectorAll('.estimate-cta, .btn-primary[href*="estimate"], .btn-primary[href*="contact"]');
    estimateBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Only if href starts with #
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                const contactForm = document.querySelector('.contact-form, .quote-form');
                if (contactForm) {
                    contactForm.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ========== ACTIVE PAGE HIGHLIGHT IN NAV ==========
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

}); // end DOMContentLoaded
