/**
 * MARIE-ANTOINETTE — LIVRE BLANC LP
 * JavaScript avec animations
 */

(function() {
    'use strict';

    /* --------------------------------------------------------
       PRELOADER
       -------------------------------------------------------- */
    var Preloader = {
        init: function() {
            var preloader = document.getElementById('preloader');
            if (!preloader) return;

            window.addEventListener('load', function() {
                setTimeout(function() {
                    preloader.classList.add('is-hidden');
                    document.body.style.overflow = '';
                }, 600);
            });

            // Prevent scroll during preload
            document.body.style.overflow = 'hidden';
        }
    };

    Preloader.init();

    /* --------------------------------------------------------
       SCROLL REVEAL ANIMATIONS
       -------------------------------------------------------- */
    var ScrollReveal = {
        init: function() {
            // Add reveal classes to elements
            this.setupElements();

            // Check on scroll
            var self = this;
            this.checkElements();

            window.addEventListener('scroll', function() {
                requestAnimationFrame(function() {
                    self.checkElements();
                });
            }, { passive: true });
        },

        setupElements: function() {
            // Intro section
            var introQuote = document.querySelector('.intro__quote');
            var introText = document.querySelector('.intro__text');
            var introQuestion = document.querySelector('.intro__question');
            if (introQuote) introQuote.classList.add('reveal');
            if (introText) introText.classList.add('reveal');
            if (introQuestion) introQuestion.classList.add('reveal');

            // Projet section
            var projetImage = document.querySelector('.projet__image');
            var projetContent = document.querySelector('.projet__content');
            if (projetImage) projetImage.classList.add('reveal-left');
            if (projetContent) projetContent.classList.add('reveal-right');

            // Expertise
            var expertiseLeft = document.querySelector('.expertise__left');
            var expertiseRight = document.querySelector('.expertise__right');
            if (expertiseLeft) expertiseLeft.classList.add('reveal-left');
            if (expertiseRight) expertiseRight.classList.add('reveal-right');

            // Sommaire
            var sommaireTitle = document.querySelector('.sommaire__title');
            var sommaireList = document.querySelector('.sommaire__list');
            if (sommaireTitle) sommaireTitle.classList.add('reveal');
            if (sommaireList) sommaireList.classList.add('reveal-stagger');

            // Methode
            var methodeTitle = document.querySelector('.methode__title');
            var methodeSteps = document.querySelector('.methode__steps');
            if (methodeTitle) methodeTitle.classList.add('reveal');
            if (methodeSteps) methodeSteps.classList.add('reveal-stagger');

            // Formulaire
            var formulaireLeft = document.querySelector('.formulaire__left');
            var formulaireRight = document.querySelector('.formulaire__right');
            if (formulaireLeft) formulaireLeft.classList.add('reveal-left');
            if (formulaireRight) formulaireRight.classList.add('reveal-right');

            // Agence
            var agenceContent = document.querySelector('.agence__content');
            if (agenceContent) agenceContent.classList.add('reveal');
        },

        checkElements: function() {
            var elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');
            var windowHeight = window.innerHeight;

            elements.forEach(function(el) {
                var rect = el.getBoundingClientRect();
                var threshold = windowHeight * 0.85;

                if (rect.top < threshold) {
                    el.classList.add('is-visible');
                }
            });
        }
    };

    /* --------------------------------------------------------
       HEADER
       -------------------------------------------------------- */
    var Header = {
        header: null,

        init: function() {
            this.header = document.querySelector('.header');
            if (!this.header) return;

            var self = this;
            window.addEventListener('scroll', function() {
                self.update();
            }, { passive: true });
        },

        update: function() {
            if (window.scrollY > 100) {
                this.header.classList.add('is-scrolled');
            } else {
                this.header.classList.remove('is-scrolled');
            }
        }
    };

    /* --------------------------------------------------------
       SMOOTH SCROLL
       -------------------------------------------------------- */
    var SmoothScroll = {
        init: function() {
            var anchors = document.querySelectorAll('a[href^="#"]');

            anchors.forEach(function(anchor) {
                anchor.addEventListener('click', function(e) {
                    var href = anchor.getAttribute('href');
                    if (href === '#') return;

                    var target = document.querySelector(href);
                    if (!target) return;

                    e.preventDefault();

                    var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 100;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                });
            });
        }
    };

    /* --------------------------------------------------------
       FORM avec EmailJS
       -------------------------------------------------------- */
    var Form = {
        form: null,
        success: null,
        SERVICE_ID: 'service_lfqtref',
        TEMPLATE_1: 'template_dj9jpxa',  // Livre blanc (envoyé immédiatement)
        TEMPLATE_2: 'template_9rvrli5',  // Email de suivi (envoyé après 20s)

        init: function() {
            this.form = document.getElementById('lead-form');
            this.success = document.getElementById('form-success');

            // Initialiser EmailJS
            if (typeof emailjs !== 'undefined') {
                emailjs.init('gmOmNx8m8JVZEJUFu');
            }

            if (!this.form) return;

            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        },

        handleSubmit: function(e) {
            e.preventDefault();

            var formData = new FormData(this.form);
            var data = {};
            formData.forEach(function(value, key) {
                data[key] = value;
            });

            var submitBtn = this.form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';

            var self = this;

            // Préparer les paramètres pour EmailJS
            var templateParams = {
                to_name: data.firstname,
                lastname: data.lastname,
                email: data.email,
                company: data.company
            };

            // Envoyer le premier email (Livre blanc)
            emailjs.send(this.SERVICE_ID, this.TEMPLATE_1, templateParams)
                .then(function() {
                    console.log('Email 1 envoyé avec succès');

                    // Afficher le message de succès
                    self.form.classList.add('hidden');
                    if (self.success) {
                        self.success.classList.remove('hidden');
                    }

                    // Envoyer le deuxième email après 20 secondes
                    setTimeout(function() {
                        emailjs.send(self.SERVICE_ID, self.TEMPLATE_2, templateParams)
                            .then(function() {
                                console.log('Email 2 envoyé avec succès (après 20s)');
                            })
                            .catch(function(error) {
                                console.error('Erreur email 2:', error);
                            });
                    }, 20000);

                })
                .catch(function(error) {
                    console.error('Erreur email 1:', error);
                    alert('Une erreur est survenue. Veuillez réessayer.');
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                });
        }
    };

    /* --------------------------------------------------------
       MAGNETIC BUTTONS (subtle effect)
       -------------------------------------------------------- */
    var MagneticButtons = {
        init: function() {
            var buttons = document.querySelectorAll('.hero__cta, .form__submit, .agence__link');

            buttons.forEach(function(btn) {
                btn.addEventListener('mousemove', function(e) {
                    var rect = btn.getBoundingClientRect();
                    var x = e.clientX - rect.left - rect.width / 2;
                    var y = e.clientY - rect.top - rect.height / 2;

                    btn.style.transform = 'translate(' + (x * 0.1) + 'px, ' + (y * 0.1) + 'px)';
                });

                btn.addEventListener('mouseleave', function() {
                    btn.style.transform = '';
                });
            });
        }
    };

    /* --------------------------------------------------------
       PARALLAX (subtle)
       -------------------------------------------------------- */
    var Parallax = {
        init: function() {
            var hero = document.querySelector('.hero');
            if (!hero) return;

            window.addEventListener('scroll', function() {
                var scrolled = window.scrollY;
                var heroContent = hero.querySelector('.hero__content');

                if (heroContent && scrolled < window.innerHeight) {
                    heroContent.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
                    heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
                }
            }, { passive: true });
        }
    };

    /* --------------------------------------------------------
       INIT
       -------------------------------------------------------- */
    function init() {
        ScrollReveal.init();
        Header.init();
        SmoothScroll.init();
        Form.init();
        MagneticButtons.init();
        Parallax.init();

        console.log('Marie-Antoinette LP initialisée');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
