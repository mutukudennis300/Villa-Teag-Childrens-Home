/* Fountain of Life Children’s Home — shared page interactions. No analytics or local debug reporting. */
(() => {
  'use strict';

  const SITE_WHATSAPP = 'https://wa.me/254716863607';
  const SITE_EMAIL = 'fountainboys300@gmail.com';

  function showCopyFeedback(value, copied) {
    if (copied) window.alert(`Copied: ${value}`);
    else window.prompt('Copy this value:', value);
  }

  window.copyText = async function copyText(text) {
    const value = String(text || '').trim();
    if (!value) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        showCopyFeedback(value, true);
      } else {
        showCopyFeedback(value, false);
      }
    } catch (_) {
      showCopyFeedback(value, false);
    }
  };

  window.openDonationLink = function openDonationLink(amount = '') {
    const numeric = Number(String(amount).trim());
    const message = amount && Number.isFinite(numeric) && numeric > 0
      ? `Hello Fountain of Life, I would like to donate Ksh ${numeric.toLocaleString('en-KE')}. Please confirm the correct recipient and reference.`
      : 'Hello Fountain of Life, I would like to ask how to support the home.';
    window.open(`${SITE_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  function initDropdowns() {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('.dropbtn');
      if (button) {
        event.preventDefault();
        event.stopPropagation();
        const dropdown = button.closest('.dropdown');
        const panel = dropdown && dropdown.querySelector('.dropdown-content');
        if (!panel) return;
        const shouldOpen = !panel.classList.contains('show');
        document.querySelectorAll('.dropdown-content.show').forEach((content) => {
          if (content !== panel) content.classList.remove('show');
        });
        panel.classList.toggle('show', shouldOpen);
        button.setAttribute('aria-expanded', String(shouldOpen));
        return;
      }
      if (!event.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-content.show').forEach((content) => content.classList.remove('show'));
        document.querySelectorAll('.dropbtn[aria-expanded="true"]').forEach((el) => el.setAttribute('aria-expanded', 'false'));
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        document.querySelectorAll('.dropdown-content.show').forEach((content) => content.classList.remove('show'));
        document.querySelectorAll('.dropbtn[aria-expanded="true"]').forEach((el) => el.setAttribute('aria-expanded', 'false'));
      }
    });
  }

  function initDonationForm() {
    const button = document.querySelector('[data-donate-button]');
    const input = document.getElementById('customAmount');
    if (!button || !input) return;
    button.addEventListener('click', () => {
      const amount = input.value.trim();
      if (amount && (!Number.isFinite(Number(amount)) || Number(amount) <= 0)) {
        input.setCustomValidity('Enter a donation amount greater than zero.');
        input.reportValidity();
        return;
      }
      input.setCustomValidity('');
      window.openDonationLink(amount);
    });
    input.addEventListener('input', () => input.setCustomValidity(''));
  }

  function initBackToTop() {
    let button = document.getElementById('backToTop');
    if (!button) {
      button = document.createElement('button');
      button.id = 'backToTop';
      button.type = 'button';
      button.setAttribute('aria-label', 'Back to top');
      button.innerHTML = '<i class="bi bi-arrow-up" aria-hidden="true"></i>';
      document.body.appendChild(button);
    }
    const update = () => button.classList.toggle('show', window.scrollY > 260);
    update();
    window.addEventListener('scroll', update, { passive: true });
    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function initFaqs() {
    const questions = Array.from(document.querySelectorAll('.faq-question'));
    const filterButtons = Array.from(document.querySelectorAll('.category-btn'));
    const sections = Array.from(document.querySelectorAll('.faq-section'));
    const search = document.getElementById('faqSearch');
    if (questions.length) {
      questions.forEach((button) => {
        if (button.dataset.folFaqReady === 'true') return;
        button.dataset.folFaqReady = 'true';
        button.setAttribute('aria-expanded', 'false');
        button.addEventListener('click', () => {
          const item = button.closest('.faq-item') || button.parentElement;
          const willOpen = !item.classList.contains('active');
          const section = button.closest('.faq-section');
          (section || document).querySelectorAll('.faq-item.active').forEach((other) => {
            if (other !== item) {
              other.classList.remove('active');
              const otherButton = other.querySelector('.faq-question');
              if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
            }
          });
          item.classList.toggle('active', willOpen);
          button.setAttribute('aria-expanded', String(willOpen));
        });
      });
    }
    if (!filterButtons.length || !sections.length) return;

    function applyFilters(selectedCategory) {
      const current = selectedCategory || (filterButtons.find((b) => b.classList.contains('active')) || {}).textContent?.trim() || 'About';
      const term = search ? search.value.trim().toLowerCase() : '';
      sections.forEach((section) => {
        const category = section.getAttribute('data-category') || '';
        const text = (section.innerText || section.textContent || '').toLowerCase();
        const categoryMatches = category.toLowerCase() === current.toLowerCase();
        const matchesSearch = !term || text.includes(term);
        section.style.display = categoryMatches && matchesSearch ? 'block' : 'none';
      });
    }
    filterButtons.forEach((button) => button.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.toggle('active', b === button));
      applyFilters(button.textContent.trim());
    }));
    if (search) search.addEventListener('input', () => applyFilters());
    const start = filterButtons.find((b) => b.classList.contains('active')) || filterButtons[0];
    filterButtons.forEach((b) => b.classList.toggle('active', b === start));
    if (start) applyFilters(start.textContent.trim());
  }

  function initStoryFilters() {
    const buttons = document.querySelectorAll('.filter-item[data-filter]');
    const cards = document.querySelectorAll('.story-card');
    if (!buttons.length || !cards.length) return;
    buttons.forEach((button) => button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter') || 'all';
      buttons.forEach((item) => item.classList.toggle('active', item === button));
      cards.forEach((card) => {
        card.style.display = filter === 'all' || card.classList.contains(filter) ? '' : 'none';
      });
    }));
  }

  function initReviewForm() {
    const form = document.getElementById('review-form');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = form.querySelector('input[name="name"]')?.value.trim() || 'Anonymous';
      const review = form.querySelector('textarea[name="review"]')?.value.trim() || '';
      if (!review) return;
      const subject = encodeURIComponent('New website review');
      const body = encodeURIComponent(`Name: ${name}\n\nReview:\n${review}`);
      const feedback = form.querySelector('.form-feedback');
      window.location.href = `mailto:${SITE_EMAIL}?subject=${subject}&body=${body}`;
      if (feedback) feedback.textContent = 'Your email app should open with the message prepared. Please send it to complete submission.';
    });
  }

  function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    if (!galleryItems.length || document.getElementById('custom-lightbox')) return;
    const lightbox = document.createElement('div');
    lightbox.id = 'custom-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Expanded gallery image');
    lightbox.style.cssText = 'position:fixed;inset:0;background:rgba(10,25,18,.92);z-index:9999;display:none;justify-content:center;align-items:center;padding:24px;cursor:zoom-out;';
    const image = document.createElement('img');
    image.alt = '';
    image.style.cssText = 'max-width:min(94vw,1200px);max-height:84vh;width:auto;height:auto;object-fit:contain;border-radius:5px;box-shadow:0 18px 70px #0006;';
    const close = document.createElement('button');
    close.type = 'button'; close.textContent = '×'; close.setAttribute('aria-label', 'Close image');
    close.style.cssText = 'position:absolute;top:14px;right:22px;border:0;background:transparent;color:white;font-size:44px;cursor:pointer;line-height:1;';
    lightbox.append(close, image); document.body.append(lightbox);
    const closeModal = () => { lightbox.style.display = 'none'; image.src = ''; document.body.style.overflow = ''; };
    galleryItems.forEach((img) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        if (img.alt.toLowerCase() === 'logo') return;
        image.src = img.currentSrc || img.src; image.alt = img.alt || 'Gallery image';
        lightbox.style.display = 'flex'; document.body.style.overflow = 'hidden'; close.focus();
      });
    });
    close.addEventListener('click', closeModal);
    lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeModal(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && lightbox.style.display === 'flex') closeModal(); });
  }

  function initStatusMessages() {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const messages = {
      success: 'Thank you. Your message has been submitted.',
      volunteer_success: 'Thank you. Your volunteer application has been submitted.',
      error: 'We could not confirm your submission. Please try again or contact the home directly.',
      fail: 'We could not confirm your submission. Please try again or contact the home directly.'
    };
    if (status && messages[status]) {
      window.alert(messages[status]);
      params.delete('status');
      const cleaned = `${window.location.pathname}${params.toString() ? `?${params}` : ''}${window.location.hash}`;
      window.history.replaceState({}, document.title, cleaned);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initDropdowns();
    initDonationForm();
    initBackToTop();
    initFaqs();
    initStoryFilters();
    initReviewForm();
    initGalleryLightbox();
    initStatusMessages();
  });
})();
