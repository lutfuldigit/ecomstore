/* ============================================
   PREMIUM ECOM STORE — SALES PAGE CORE
   Lutful Digit / Premium Ecom Store
   GSAP + ScrollTrigger + Core Interactions
   ============================================ */

(function () {
  'use strict';

  /* ---------- Utility ---------- */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const isMobile = () => window.innerWidth < 1024;

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ---------- Footer year ---------- */
  const yearEl = $('#footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navigation scroll state ---------- */
  const nav = $('#main-nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('nav-scrolled');
    else nav.classList.remove('nav-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const mobileMenuBtn = $('#mobile-menu-btn');
  const mobileMenu = $('#mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    let mobileMenuOpen = false;

    const MENU_ICON_OPEN =
      '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6L18 18M6 18L18 6"/></svg>';
    const MENU_ICON_CLOSED =
      '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';

    const setMenuIcon = (open) => {
      mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      mobileMenuBtn.innerHTML = open ? MENU_ICON_OPEN : MENU_ICON_CLOSED;
    };

    const openMobileMenu = () => {
      if (mobileMenuOpen) return;
      mobileMenuOpen = true;
      mobileMenu.classList.add('mobile-menu-open');
      setMenuIcon(true);
      if (window.gsap && !prefersReducedMotion) {
        mobileMenu.style.display = 'block';
        mobileMenu.style.height = '0px';
        mobileMenu.style.opacity = '0';
        gsap.to(mobileMenu, {
          height: 'auto',
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          clearProps: 'height,opacity',
        });
      } else {
        mobileMenu.style.display = 'block';
      }
    };

    const closeMobileMenu = () => {
      if (!mobileMenuOpen) return;
      mobileMenuOpen = false;
      mobileMenu.classList.remove('mobile-menu-open');
      setMenuIcon(false);
      if (window.gsap && !prefersReducedMotion) {
        gsap.to(mobileMenu, {
          height: 0,
          opacity: 0,
          duration: 0.35,
          ease: 'power2.in',
          onComplete: () => {
            mobileMenu.style.display = 'none';
          },
        });
      } else {
        mobileMenu.style.display = 'none';
      }
    };

    mobileMenuBtn.addEventListener('click', () => {
      if (mobileMenuOpen) closeMobileMenu();
      else openMobileMenu();
    });

    $$('.mobile-nav-link, .mobile-menu .btn-primary').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* ---------- Back to top ---------- */
  const backToTop = $('#back-to-top');
  if (backToTop) {
    const toggleBackToTop = () => {
      if (window.scrollY > 400) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    };
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Accordions (FAQ + Feature Discovery) ---------- */
  const initAccordion = (config) => {
    const triggers = $$(config.trigger);
    if (!triggers.length) return;
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest(config.item);
        const answer = item.querySelector(config.answer);
        const isOpen = item.classList.contains(config.openClass);

        /* Close all others first (single-open accordion) */
        $$(config.item).forEach((other) => {
          if (other !== item && other.classList.contains(config.openClass)) {
            other.classList.remove(config.openClass);
            other.querySelector(config.trigger).setAttribute('aria-expanded', 'false');
            const otherAnswer = other.querySelector(config.answer);
            otherAnswer.style.maxHeight = null;
            otherAnswer.setAttribute('aria-hidden', 'true');
          }
        });

        item.classList.toggle(config.openClass, !isOpen);
        trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        if (isOpen) {
          answer.style.maxHeight = null;
          answer.setAttribute('aria-hidden', 'true');
        } else {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.setAttribute('aria-hidden', 'false');
        }
      });
    });
  };

  initAccordion({
    trigger: '.faq-trigger',
    item: '.faq-item',
    answer: '.faq-answer',
    openClass: 'faq-item-open',
  });

  initAccordion({
    trigger: '.feature-trigger',
    item: '.feature-item',
    answer: '.feature-answer',
    openClass: 'feature-item-open',
  });

  /* ---------- CEO welcome modal ---------- */
  const modal = $('#ceo-modal');
  const modalClose = $('.modal-close');
  const modalExplore = $('#modal-explore');

  let lastFocusedElement = null;

  const openModal = () => {
    if (!modal) return;
    lastFocusedElement = document.activeElement;
    modal.classList.add('modal-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('#modal-badge') && (() => {
      const badge = $('#modal-badge');
      badge.classList.remove('modal-badge-animate');
      void badge.offsetWidth;
      badge.classList.add('modal-badge-animate');
    })();
    modalClose && modalClose.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('modal-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocusedElement && lastFocusedElement.focus();
  };

  if (modal) {
    modalClose && modalClose.addEventListener('click', closeModal);
    modalExplore && modalExplore.addEventListener('click', closeModal);
    $('#modal-cta') && $('#modal-cta').addEventListener('click', closeModal);
    $('.modal-backdrop') &&
      $('.modal-backdrop').addEventListener('click', closeModal);

    /* Escape to close */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('modal-open')) {
        closeModal();
      }
    });

    /* Popup: 20s on the site, OR on reaching the "Everything You Need" section — whichever first. Cooldown 60s. */
    const MODAL_COOLDOWN = 60000;
    let lastModalShownAt = 0;

    const maybeShowModal = () => {
      if (prefersReducedMotion) return;
      const now = Date.now();
      if (now - lastModalShownAt >= MODAL_COOLDOWN) {
        lastModalShownAt = now;
        openModal();
      }
    };

    setTimeout(maybeShowModal, 20000);

    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        trigger: '#features',
        start: 'top 80%',
        onEnter: maybeShowModal,
        onEnterBack: maybeShowModal,
      });
    }
  }

  /* ---------- Smooth anchor scrolling with offset ---------- */
  const navOffset = 80;
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ============================================
     GSAP ANIMATIONS
     ============================================ */
  if (typeof gsap === 'undefined') {
    /* Fallback: reveal everything if GSAP fails to load */
    $$('.reveal-up').forEach((el) => el.classList.add('reveal-visible'));
    $$('.opacity-0').forEach((el) => (el.style.opacity = '1'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* Respect reduced motion — reveal all instantly */
  if (prefersReducedMotion) {
    $$('.reveal-up').forEach((el) => el.classList.add('reveal-visible'));
    $$('.opacity-0').forEach((el) => (el.style.opacity = '1'));
    /* Still register ensures cleanup works */
    gsap.utils.toArray('.reveal-up').forEach((el) => {
      el.classList.remove('reveal-up');
    });
  } else {
    initFullAnimations();
  }

  function initFullAnimations() {
    /* ---------- Hero entrance ---------- */
    const heroTimeline = gsap.timeline({ delay: 0.3 });

    heroTimeline
      .to('#hero-badge', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0)
      .fromTo(
        '#hero-title',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
        0.15
      )
      .fromTo(
        '#hero-subtitle',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        0.3
      )
      .fromTo(
        '#hero-cta',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        0.45
      );

    heroTimeline
      .fromTo(
        '#hero-visual .phone-mockup',
        isMobile() ? { y: 40, opacity: 0 } : { y: 60, opacity: 0, rotateY: -12 },
        isMobile()
          ? { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
          : { y: 0, opacity: 1, rotateY: 0, duration: 1.2, ease: 'power3.out' },
        0.5
      )
      .to('#float-card-1', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1.0)
      .to('#float-card-2', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1.2)
      .to('#float-card-3', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1.4);

    heroTimeline.to('#scroll-indicator', { opacity: 1, duration: 0.8, ease: 'power2.out' }, 1.6);

    /* ---------- Scroll reveal for sections ---------- */
    const revealItems = gsap.utils.toArray('.reveal-up');

    revealItems.forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: parseFloat(el.style.getPropertyValue('--delay')) || 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    /* Reveal 'opacity-0' hero-only elements */
    gsap.to('.pt-20 #hero-badge, .hero-visual', { autoAlpha: 1, duration: 0.001 });

    /* ---------- Visual Product Search sequence ---------- */
    const vsFlow = $('.vs-flow');
    if (vsFlow) {
      const vsNodes = vsFlow.querySelectorAll('.vs-node');
      if (vsNodes.length) {
        ScrollTrigger.create({
          trigger: vsFlow,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            vsNodes.forEach((node, i) => {
              gsap.delayedCall(0.3 + i * 0.45, () => node.classList.add('vs-node-active'));
            });
          },
        });
      }
    }

    const vsPhone = $('.vs-phone');
    if (vsPhone) {
      const scanline = vsPhone.querySelector('.vs-scanline');
      if (scanline) {
        ScrollTrigger.create({
          trigger: vsPhone,
          start: 'top 85%',
          once: true,
          onEnter: () => scanline.classList.add('vs-scan-active'),
        });
      }
    }
  }

  /* ---------- Cleanup on resize for pinned sections ---------- */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 200);
  });

  /* ---------- WhatsApp floating button ---------- */
  (function initWhatsAppFloat() {
    const floatEl = document.getElementById('whatsapp-float');
    const bubbleEl = document.getElementById('whatsapp-bubble');
    const typingEl = document.getElementById('whatsapp-typing');
    if (!floatEl || !bubbleEl || !typingEl) return;

    const text = 'Get in touch with us?';
    const chars = text.split('');

    /* Show the button after 1.5 s */
    setTimeout(() => floatEl.classList.add('visible'), 1500);

    if (prefersReducedMotion) {
      typingEl.textContent = text;
      bubbleEl.classList.add('show');
      return;
    }

    /* Blinking cursor */
    const cursor = bubbleEl.querySelector('.typing-cursor');

    function typeChar(i) {
      if (i < chars.length) {
        typingEl.textContent += chars[i];
        setTimeout(() => typeChar(i + 1), 55 + Math.random() * 30);
      } else {
        /* Hold then delete */
        setTimeout(() => deleteChar(chars.length - 1), 2500);
      }
    }

    function deleteChar(i) {
      if (i >= 0) {
        typingEl.textContent = text.substring(0, i);
        setTimeout(() => deleteChar(i - 1), 28);
      } else {
        /* Hide bubble then restart */
        bubbleEl.classList.remove('show');
        setTimeout(() => {
          typeChar(0);
          bubbleEl.classList.add('show');
        }, 1200);
      }
    }

    /* Start the loop after the button appears */
    setTimeout(() => {
      bubbleEl.classList.add('show');
      typeChar(0);
    }, 2200);
  })();

  /* ---------- Device image lightbox (Every Device section) ---------- */
  (function initDeviceLightbox() {
    const lightbox = $('#device-lightbox');
    const lightboxImage = lightbox ? lightbox.querySelector('.device-lightbox-image') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.device-lightbox-close') : null;
    const lightboxBackdrop = lightbox ? lightbox.querySelector('.device-lightbox-backdrop') : null;

    if (!lightbox || !lightboxImage) return;

    $$('.device-item').forEach((item) => {
      item.addEventListener('click', () => {
        const src = item.getAttribute('data-img');
        if (!src) return;
        lightboxImage.src = src;
        lightbox.classList.add('lightbox-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('lightbox-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    lightboxClose && lightboxClose.addEventListener('click', closeLightbox);
    lightboxBackdrop && lightboxBackdrop.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('lightbox-open')) {
        closeLightbox();
      }
    });
  })();

  /* ---------- Video lightbox (mobile demo) ---------- */
  (function initVideoLightbox() {
    const lightbox = $('#video-lightbox');
    const lightboxVideo = lightbox ? lightbox.querySelector('.video-lightbox-video') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.video-lightbox-close') : null;
    const lightboxBackdrop = lightbox ? lightbox.querySelector('.video-lightbox-backdrop') : null;
    const trigger = $('#video-expand-trigger');

    /* Block download attempts: context menu and keyboard shortcuts */
    const blockDownload = (e) => e.preventDefault();
    lightbox && lightbox.addEventListener('contextmenu', blockDownload);
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && ['s', 'u'].includes(e.key.toLowerCase())) {
        if (lightbox && lightbox.classList.contains('lightbox-open')) {
          e.preventDefault();
        }
      }
    });

    const openVideo = (currentTime) => {
      if (!lightbox || !lightboxVideo) return;
      lightboxVideo.currentTime = currentTime || 0;
      const playPromise = lightboxVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
      lightbox.classList.add('lightbox-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeVideo = () => {
      if (!lightbox) return;
      lightboxVideo && lightboxVideo.pause();
      lightbox.classList.remove('lightbox-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    const inlineVideo = document.querySelector('#video-expand-trigger video');

    if (trigger && lightbox) {
      trigger.addEventListener('click', () => {
        openVideo(inlineVideo ? inlineVideo.currentTime : 0);
      });
    }

    lightboxClose && lightboxClose.addEventListener('click', closeVideo);
    lightboxBackdrop && lightboxBackdrop.addEventListener('click', closeVideo);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox && lightbox.classList.contains('lightbox-open')) {
        closeVideo();
      }
    });
  })();
})();