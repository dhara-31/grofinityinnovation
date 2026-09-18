// GrofInityInnovation - Core Dynamic UI & Theming System

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initActiveNavLink();
  initCardSpotlightEffect();
  initProductFilter();
  initContactForm();
});

// 1. Dual Light & Dark Theme Controller
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  
  // Determine current active theme
  const currentTheme = document.documentElement.getAttribute('data-theme') || 
    localStorage.getItem('grofinity-theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  document.documentElement.setAttribute('data-theme', currentTheme);

  toggleBtns.forEach(btn => {
    btn.setAttribute('aria-label', `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`);

    btn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme');
      const nextTheme = active === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('grofinity-theme', nextTheme);
      
      toggleBtns.forEach(b => {
        b.setAttribute('aria-label', `Switch to ${nextTheme === 'dark' ? 'light' : 'dark'} mode`);
      });
    });
  });

  // Listen to OS system color scheme changes if user hasn't explicitly set one
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('grofinity-theme')) {
      const osTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', osTheme);
    }
  });
}

// 2. Responsive Navigation Menu Control
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('open');
      navLinks.classList.toggle('active');
    });

    // Dismiss menu upon selecting any nav item
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('open');
        navLinks.classList.remove('active');
      });
    });
  }
}

// 3. Highlight Nav Link Corresponding to Active Page
function initActiveNavLink() {
  const path = window.location.pathname;
  const page = path.split("/").pop() || 'index.html';
  
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === 'index.html' && (href === './' || href === 'index.html')) || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// 4. Dynamic Card Spotlight Mouse Overlay Glow
function initCardSpotlightEffect() {
  const cards = document.querySelectorAll('.bento-card, .product-bento-card, .contact-card, .timeline-item');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// 5. Products Filter on Products Catalog Page
function initProductFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-bento-card');

  if (filterButtons.length > 0 && productCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        productCards.forEach(card => {
          const category = card.getAttribute('data-category');
          
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }
}

// 6. Contact Form Client-side Validation and Mock Dispatcher
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successOverlay = document.querySelector('.form-success-overlay');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = form.querySelectorAll('.form-control');
      
      inputs.forEach(input => {
        const value = input.value.trim();
        const feedback = input.nextElementSibling;

        input.style.borderColor = '';
        if (feedback && feedback.classList.contains('form-feedback')) {
          feedback.style.display = 'none';
        }

        if (!value) {
          isValid = false;
          markInvalid(input, 'This field is required.');
        } else if (input.type === 'email' && !validateEmail(value)) {
          isValid = false;
          markInvalid(input, 'Please enter a valid email address.');
        }
      });

      if (isValid) {
        if (successOverlay) {
          successOverlay.classList.add('active');
          form.reset();
        }
      }
    });

    form.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        input.style.borderColor = '';
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('form-feedback')) {
          feedback.style.display = 'none';
        }
      });
    });

    const resetBtn = document.getElementById('success-reset-btn');
    if (resetBtn && successOverlay) {
      resetBtn.addEventListener('click', () => {
        successOverlay.classList.remove('active');
      });
    }
  }
}

function markInvalid(input, message) {
  input.style.borderColor = '#ef4444';
  const feedback = input.nextElementSibling;
  if (feedback && feedback.classList.contains('form-feedback')) {
    feedback.innerText = message;
    feedback.style.display = 'block';
  }
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
