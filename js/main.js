/* ===================================
   VEE THE CAKE - Main JavaScript
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Side Navigation ----------
    const sideNav = document.getElementById('sideNav');
    const navToggle = document.getElementById('navToggle');
    const navClose = document.getElementById('navClose');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            sideNav.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            sideNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    // Close nav on outside click (mobile)
    document.addEventListener('click', (e) => {
        const clickedToggle = navToggle && navToggle.contains(e.target);
        if (sideNav && sideNav.classList.contains('open') &&
            !sideNav.contains(e.target) && !clickedToggle) {
            sideNav.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    // ---------- Dropdown Toggles ----------
    const dropdowns = document.querySelectorAll('.has-dropdown > a');
    dropdowns.forEach(link => {
        link.addEventListener('click', (e) => {
            // Allow navigation if the page link is clicked directly
            // Only toggle dropdown if chevron area clicked or on mobile
            const parentLi = link.parentElement;
            if (window.innerWidth <= 1024 || parentLi.classList.contains('open')) {
                // Toggle dropdown
                if (e.target.closest('i') || window.innerWidth <= 1024) {
                    e.preventDefault();
                    parentLi.classList.toggle('open');
                }
            }
        });
    });

    // ---------- Testimonial Slider ----------
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');

    if (track && prevBtn && nextBtn && dotsContainer) {
        const cards = track.querySelectorAll('.testimonial-card');
        let currentSlide = 0;
        const totalSlides = cards.length;

        // Create dots
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to review ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.slider-dot');

        function goToSlide(index) {
            currentSlide = index;
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
        }

        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1);
        });

        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
        });

        // Auto-advance
        let autoSlide = setInterval(() => {
            goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
        }, 6000);

        // Pause on hover
        track.addEventListener('mouseenter', () => clearInterval(autoSlide));
        track.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
            }, 6000);
        });

        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
                } else {
                    goToSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1);
                }
            }
        }, { passive: true });
    }

    // ---------- FAQ Accordions ----------
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.setAttribute('aria-expanded', 'false');
            question.addEventListener('click', () => {
                const wasOpen = item.classList.contains('open');
                // Close all
                faqItems.forEach(f => {
                    f.classList.remove('open');
                    const q = f.querySelector('.faq-question');
                    if (q) q.setAttribute('aria-expanded', 'false');
                });
                // Open clicked if it was closed
                if (!wasOpen) {
                    item.classList.add('open');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });

    // ---------- Form Modals ----------
    const formOverlays = document.querySelectorAll('.form-overlay');
    const formTriggers = document.querySelectorAll('[data-form]');
    const formCloseButtons = document.querySelectorAll('.form-close');

    formTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const formId = trigger.getAttribute('data-form');
            const overlay = document.getElementById(formId);
            if (overlay) {
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    formCloseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const overlay = btn.closest('.form-overlay');
            if (overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    formOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // ---------- Scroll Animations ----------
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        fadeElements.forEach(el => observer.observe(el));
    }

    // Add fade-in to service cards and why cards
    document.querySelectorAll('.service-card, .why-card, .content-block').forEach((el, i) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${i * 0.1}s`;
    });

    // Re-observe new fade-in elements
    const allFadeIns = document.querySelectorAll('.fade-in:not(.visible)');
    if (allFadeIns.length > 0) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        allFadeIns.forEach(el => obs.observe(el));
    }

    // ---------- Form Submission ----------
    function buildEmailBody(entries) {
        return entries
            .filter(([, value]) => value && value.trim() !== '')
            .map(([label, value]) => `${label}: ${value}`)
            .join('\n');
    }

    document.querySelectorAll('.enquiry-form form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const formData = new FormData(form);
            const isWeddingForm = form.id === 'weddingForm';
            const subject = isWeddingForm
                ? 'Wedding Cake Enquiry - Vee The Cake Website'
                : 'Celebration Cake Enquiry - Vee The Cake Website';

            const weddingEntries = [
                ['Name', formData.get('name')],
                ["Partner's Name", formData.get('partner')],
                ['Email', formData.get('email')],
                ['Phone', formData.get('phone')],
                ['Wedding Date', formData.get('date')],
                ['Number of Guests', formData.get('guests')],
                ['Venue', formData.get('venue')],
                ['Tiers', formData.get('tiers')],
                ['Preferred Flavour(s)', formData.get('flavour')],
                ['Cake Details', formData.get('details')],
                ['How They Heard About Us', formData.get('referral')]
            ];

            const celebrationEntries = [
                ['Name', formData.get('name')],
                ['Email', formData.get('email')],
                ['Phone', formData.get('phone')],
                ['Date Required', formData.get('date')],
                ['Occasion', formData.get('occasion')],
                ['Servings', formData.get('servings')],
                ['Preferred Flavour(s)', formData.get('flavour')],
                ['Cake Details', formData.get('details')],
                ['How They Heard About Us', formData.get('referral')]
            ];

            const body = buildEmailBody(isWeddingForm ? weddingEntries : celebrationEntries);
            const mailtoLink = `mailto:info@veethecake.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            window.location.href = mailtoLink;

            const overlay = form.closest('.form-overlay');
            if (overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // ---------- Conditional Form Fields ----------
    document.querySelectorAll('.conditional-field[data-show-when]').forEach(field => {
        const [radioName, radioValue] = field.getAttribute('data-show-when').split('=');
        const radios = document.querySelectorAll(`input[name="${radioName}"]`);
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                field.classList.toggle('visible', radio.value === radioValue && radio.checked);
                if (!field.classList.contains('visible')) {
                    if (field.tagName === 'TEXTAREA') field.value = '';
                    else if (field.tagName === 'INPUT') field.value = '';
                }
            });
        });
    });

    // ---------- File Upload Label ----------
    document.querySelectorAll('.file-upload-wrapper input[type="file"]').forEach(input => {
        input.addEventListener('change', () => {
            const label = input.nextElementSibling;
            const nameSpan = label.querySelector('span');
            if (input.files.length > 0) {
                nameSpan.textContent = input.files[0].name;
                label.classList.add('has-file');
            } else {
                nameSpan.textContent = 'Click to upload or drag and drop';
                label.classList.remove('has-file');
            }
        });
    });

    // ---------- Order Form Submission ----------
    function collectFormEntries(form) {
        const entries = [];
        const formData = new FormData(form);
        const labels = {};
        form.querySelectorAll('.form-group label[for]').forEach(lbl => {
            const input = form.querySelector('#' + lbl.getAttribute('for'));
            if (input) labels[input.name] = lbl.textContent.replace(' *', '').trim();
        });
        form.querySelectorAll('.form-group > label:not([for])').forEach(lbl => {
            const radioGroup = lbl.closest('.form-group').querySelector('input[type="radio"]');
            if (radioGroup) labels[radioGroup.name] = lbl.textContent.replace(' *', '').trim();
        });
        for (const [key, value] of formData.entries()) {
            if (key === 'consent' || key === 'inspiration_photo') continue;
            const label = labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            if (value && value.trim() !== '') entries.push([label, value]);
        }
        return entries;
    }

    // Form submission now handled by FormSubmit.co (action attribute on form tags)

    // ---------- Gallery Filter ----------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-grid-4 .gallery-item');

    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter items
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ---------- Lightbox ----------
    const allGalleryImages = document.querySelectorAll('.gallery-item img');
    if (allGalleryImages.length > 0) {
        // Create lightbox elements
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                <button class="lightbox-nav lightbox-prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
                <img src="" alt="">
                <button class="lightbox-nav lightbox-next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
            </div>
        `;
        document.body.appendChild(overlay);

        const lbImg = overlay.querySelector('.lightbox-content img');
        const lbClose = overlay.querySelector('.lightbox-close');
        const lbPrev = overlay.querySelector('.lightbox-prev');
        const lbNext = overlay.querySelector('.lightbox-next');
        let currentImages = [];
        let currentIndex = 0;

        function getVisibleImages() {
            return Array.from(allGalleryImages).filter(img => {
                const item = img.closest('.gallery-item');
                return !item || !item.classList.contains('hidden');
            });
        }

        function openLightbox(img) {
            currentImages = getVisibleImages();
            currentIndex = currentImages.indexOf(img);
            lbImg.src = img.src;
            lbImg.alt = img.alt;
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            lbImg.src = '';
        }

        function navigate(direction) {
            currentImages = getVisibleImages();
            currentIndex = (currentIndex + direction + currentImages.length) % currentImages.length;
            lbImg.src = currentImages[currentIndex].src;
            lbImg.alt = currentImages[currentIndex].alt;
        }

        allGalleryImages.forEach(img => {
            img.closest('.gallery-item').addEventListener('click', () => openLightbox(img));
        });

        lbClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
        lbPrev.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
        lbNext.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });

        document.addEventListener('keydown', (e) => {
            if (!overlay.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        });

        // Touch swipe support
        let lbTouchStartX = 0;
        overlay.addEventListener('touchstart', (e) => {
            lbTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        overlay.addEventListener('touchend', (e) => {
            const diff = lbTouchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                navigate(diff > 0 ? 1 : -1);
            }
        }, { passive: true });
    }

    // ---------- Active Nav Link ----------
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            // Open parent dropdown if this is a dropdown link
            const parentDropdown = link.closest('.has-dropdown');
            if (parentDropdown) {
                parentDropdown.classList.add('open');
            }
        }
    });
});
