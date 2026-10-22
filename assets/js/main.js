/**
 * Level Up Residential Plumbing LLC - Main JavaScript
 * High-performance, vanilla JS for interactive components, accessibility, and conversion tracking
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initAccordions();
  initFaqSearch();
  initZipChecker();
  initEstimator();
  initServiceRequestForm();
  initCallTracking();
});

/* --------------------------------------------------------------------------
   1. Sticky Header Scroll Effect
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Toggle, Structured Panel & Accessibility
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggleBtn || !navMenu) return;

  // Build backdrop if not present
  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  // Populate structured mobile drawer elements once if not already present
  if (!navMenu.querySelector('.mobile-nav-header')) {
    // 1. Mobile Header with Title and Close Button
    const mobileHeader = document.createElement('div');
    mobileHeader.className = 'mobile-nav-header';
    mobileHeader.innerHTML = `
      <span class="mobile-nav-heading">Navigation Menu</span>
      <button type="button" class="mobile-nav-close" aria-label="Close Navigation Menu">&times;</button>
    `;
    navMenu.prepend(mobileHeader);

    const closeBtn = mobileHeader.querySelector('.mobile-nav-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => setNavState(false));
    }

    // 2. Services quick chips section
    const isSubfolder = window.location.pathname.includes('/services/');
    const basePath = isSubfolder ? '' : 'services/';
    const servicesSection = document.createElement('div');
    servicesSection.className = 'mobile-nav-services';
    servicesSection.innerHTML = `
      <div class="mobile-nav-services-label">Quick Service Links</div>
      <div class="mobile-services-grid">
        <a href="${basePath}faucet-sink-installation.html" class="mobile-service-chip">Faucets & Sinks</a>
        <a href="${basePath}water-heater-services.html" class="mobile-service-chip">Water Heaters</a>
        <a href="${basePath}water-pressure-prv.html" class="mobile-service-chip">Pressure PRVs</a>
        <a href="${basePath}drain-overflow-replacement.html" class="mobile-service-chip">Drain & Overflow</a>
        <a href="${basePath}pipe-repair-inspection.html" class="mobile-service-chip">Pipe Diagnostics</a>
      </div>
    `;
    navMenu.appendChild(servicesSection);

    // 3. Contact information & quick dispatch card
    const contactPath = isSubfolder ? '../contact.html' : 'contact.html';
    const contactSection = document.createElement('div');
    contactSection.className = 'mobile-nav-contact';
    contactSection.innerHTML = `
      <div style="font-size:0.75rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-text-muted);margin-bottom:0.4rem;">Direct Dallas Dispatch</div>
      <a href="tel:+19713127910" class="mobile-nav-contact-phone">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        (971) 312-7910
      </a>
      <a href="${contactPath}" class="btn btn-primary btn-sm mobile-nav-contact-cta">Request Appointment</a>
    `;
    navMenu.appendChild(contactSection);
  }

  const setNavState = (isOpen) => {
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggleBtn.classList.toggle('active', isOpen);
    navMenu.classList.toggle('open', isOpen);
    backdrop.classList.toggle('active', isOpen);
    document.body.classList.toggle('nav-locked', isOpen);
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isCurrentlyOpen = navMenu.classList.contains('open');
    setNavState(!isCurrentlyOpen);
  });

  backdrop.addEventListener('click', () => {
    setNavState(false);
  });

  // Close when pressing ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      setNavState(false);
      toggleBtn.focus();
    }
  });

  // Close when clicking any nav link inside the drawer
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setNavState(false);
    });
  });

  // Reset if resized to desktop breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
      setNavState(false);
    }
  }, { passive: true });

  // Intelligent Mobile Sticky Bar: hide when typing in forms so keyboard is unobstructed
  initStickyBarKeyboardHandler();
}

/**
 * Automatically hides sticky bottom bar when virtual keyboard is active on mobile
 */
function initStickyBarKeyboardHandler() {
  const stickyBar = document.querySelector('.mobile-sticky-bar');
  if (!stickyBar) return;

  const formInputs = document.querySelectorAll('input, textarea, select');
  formInputs.forEach(input => {
    input.addEventListener('focus', () => {
      if (window.innerWidth <= 768) {
        stickyBar.classList.add('hidden-by-keyboard');
      }
    });
    input.addEventListener('blur', () => {
      stickyBar.classList.remove('hidden-by-keyboard');
    });
  });
}

/* --------------------------------------------------------------------------
   3. Accessible FAQ Accordions
   -------------------------------------------------------------------------- */
function initAccordions() {
  const faqButtons = document.querySelectorAll('.faq-button');

  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const parentItem = button.closest('.faq-item');
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      // Toggle current
      button.setAttribute('aria-expanded', !isExpanded);
      if (parentItem) {
        parentItem.classList.toggle('open', !isExpanded);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. FAQ Search Filter
   -------------------------------------------------------------------------- */
function initFaqSearch() {
  const searchInput = document.querySelector('.faq-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const qText = item.querySelector('.faq-button')?.textContent.toLowerCase() || '';
      const aText = item.querySelector('.faq-panel')?.textContent.toLowerCase() || '';

      if (qText.includes(query) || aText.includes(query)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Dallas, OR Service Area ZIP Code Checker
   -------------------------------------------------------------------------- */
function initZipChecker() {
  const checkerForm = document.querySelector('.zip-checker-form');
  const zipInput = document.querySelector('.zip-input');
  const statusMsg = document.querySelector('.zip-status-msg');
  if (!checkerForm || !zipInput || !statusMsg) return;

  // Verified Primary & Neighboring service areas in Polk County / Mid-Willamette
  const primaryZips = ['97338']; // Dallas, OR
  const nearbyZips = ['97361', '97351', '97304', '97344', '97371']; // Monmouth, Independence, West Salem, Falls City, Rickreall

  checkerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = zipInput.value.trim();

    statusMsg.className = 'zip-status-msg active';

    if (primaryZips.includes(val)) {
      statusMsg.classList.add('success');
      statusMsg.innerHTML = `✓ <strong>${val} (Dallas, OR)</strong> is within our direct primary service zone! Call <a href="tel:+19713127910" style="text-decoration:underline;">(971) 312-7910</a> or submit a request below.`;
    } else if (nearbyZips.includes(val)) {
      statusMsg.classList.add('success');
      statusMsg.innerHTML = `✓ <strong>${val}</strong> is in our nearby service area in Polk County/Willamette Valley. We're happy to discuss your residential service needs!`;
    } else if (val.length === 5 && /^\d+$/.test(val)) {
      statusMsg.classList.add('neutral');
      statusMsg.innerHTML = `ℹ <strong>ZIP ${val}</strong>: We primarily serve Dallas, OR and neighboring communities. Please call us at <a href="tel:+19713127910">(971) 312-7910</a> to confirm availability for your specific address.`;
    } else {
      statusMsg.classList.add('neutral');
      statusMsg.textContent = 'Please enter a valid 5-digit US ZIP code.';
    }
  });
}

/* --------------------------------------------------------------------------
   6. Interactive Plumbing Cost / Service Estimator
   -------------------------------------------------------------------------- */
function initEstimator() {
  const estimator = document.querySelector('.estimator-card');
  if (!estimator) return;

  const issueSelect = document.getElementById('calc-issue');
  const urgencyRadios = document.querySelectorAll('input[name="calc-urgency"]');
  const homeRadios = document.querySelectorAll('input[name="calc-type"]');
  const priceDisplay = document.querySelector('.estimate-range');
  const descDisplay = document.querySelector('.estimate-service-desc');

  const baseEstimates = {
    'faucet': { range: '$175 - $320', desc: 'Standard residential kitchen or bathroom faucet replacement/installation.' },
    'toilet': { range: '$190 - $375', desc: 'Toilet repair, flange replacement, or new high-efficiency toilet installation.' },
    'prv': { range: '$350 - $650', desc: 'Pressure Reducing Valve (PRV) testing, replacement, or calibration to prevent high-pressure damage.' },
    'water-heater-repair': { range: '$220 - $550', desc: 'Water heater diagnostic, heating element replacement, thermocouple, or thermostat repair.' },
    'water-heater-install': { range: '$1,400 - $2,800+', desc: 'Tank or high-efficiency tankless water heater installation (equipment + certified plumbing).' },
    'drain-overflow': { range: '$220 - $480', desc: 'Bathtub overflow repair, waste & overflow replacement, or drain re-piping.' },
    'inspection': { range: '$150 - $250', desc: 'Comprehensive residential plumbing inspection, valve checks, and pressure audit.' }
  };

  const updatePrice = () => {
    const selected = issueSelect ? issueSelect.value : 'faucet';
    const data = baseEstimates[selected] || baseEstimates['faucet'];

    if (priceDisplay) {
      priceDisplay.textContent = data.range;
    }
    if (descDisplay) {
      descDisplay.textContent = data.desc;
    }
  };

  if (issueSelect) {
    issueSelect.addEventListener('change', updatePrice);
  }

  // Visual active radio styling
  document.querySelectorAll('.calc-radio-label').forEach(label => {
    const radio = label.querySelector('input[type="radio"]');
    if (radio) {
      radio.addEventListener('change', () => {
        const name = radio.name;
        document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
          r.closest('.calc-radio-label')?.classList.remove('checked');
        });
        label.classList.add('checked');
      });
      if (radio.checked) {
        label.classList.add('checked');
      }
    }
  });

  // Connect "Request Service with This Estimate" CTA button to pre-select form option
  const applyBtn = document.getElementById('btn-apply-estimate');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const formServiceSelect = document.getElementById('form-serviceType');
      if (formServiceSelect && issueSelect) {
        const mapping = {
          'faucet': 'Faucet Installation or Repair',
          'toilet': 'Toilet Repair or Installation',
          'prv': 'Water Pressure / PRV Valve',
          'drain-overflow': 'Bathtub Drain & Overflow',
          'water-heater-repair': 'Water Heater Service (Tank/Tankless)',
          'water-heater-install': 'Water Heater Service (Tank/Tankless)',
          'inspection': 'Comprehensive Plumbing Inspection'
        };
        const targetVal = mapping[issueSelect.value];
        if (targetVal) {
          formServiceSelect.value = targetVal;
        }
      }
    });
  }

  updatePrice();
}

/* --------------------------------------------------------------------------
   7. Contact & Service Request Form Validation & Interactive Submission
   -------------------------------------------------------------------------- */
function initServiceRequestForm() {
  const form = document.getElementById('plumbing-request-form');
  const feedback = document.getElementById('form-feedback-message');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Field references
    const nameInput = form.querySelector('[name="fullName"]');
    const phoneInput = form.querySelector('[name="phone"]');
    const serviceType = form.querySelector('[name="serviceType"]');
    const zipInput = form.querySelector('[name="zipCode"]');
    const detailsInput = form.querySelector('[name="details"]');

    let isValid = true;

    // Reset error states
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    form.querySelectorAll('.form-field-error').forEach(el => el.classList.remove('active'));

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showFieldError(nameInput, 'Please provide your full name.');
      isValid = false;
    }

    // Validate Phone (US phone format minimum 10 digits)
    const cleanPhone = phoneInput.value.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showFieldError(phoneInput, 'Please provide a valid 10-digit phone number so we can reach you.');
      isValid = false;
    }

    // Validate Service Type
    if (!serviceType.value) {
      showFieldError(serviceType, 'Please select the type of plumbing service needed.');
      isValid = false;
    }

    if (!isValid) return;

    // Build submission reference
    const refNumber = 'LVL-' + Math.floor(100000 + Math.random() * 900000);
    const submissionData = {
      reference: refNumber,
      fullName: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: form.querySelector('[name="email"]')?.value.trim() || 'Not provided',
      serviceType: serviceType.value,
      serviceAddress: form.querySelector('[name="address"]')?.value.trim() || 'Not provided',
      zipCode: zipInput?.value.trim() || '',
      preferredTime: form.querySelector('[name="preferredTime"]')?.value || 'First Available',
      details: detailsInput?.value.trim() || '',
      submittedAt: new Date().toISOString()
    };

    // Save to localStorage for customer reference
    try {
      const recent = JSON.parse(localStorage.getItem('lvlUpServiceRequests') || '[]');
      recent.unshift(submissionData);
      localStorage.setItem('lvlUpServiceRequests', JSON.stringify(recent.slice(0, 10)));
    } catch (err) {
      console.warn('Storage unavailable', err);
    }

    // Interactive button loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit Request';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending Request...</span>`;
    }

    setTimeout(() => {
      form.style.display = 'none';
      if (feedback) {
        feedback.classList.add('active');
        const refSpan = feedback.querySelector('.ref-number');
        if (refSpan) refSpan.textContent = refNumber;
        const nameSpan = feedback.querySelector('.customer-name');
        if (nameSpan) nameSpan.textContent = submissionData.fullName;
      }
    }, 600);
  });

  function showFieldError(field, msg) {
    field.classList.add('is-invalid');
    const errEl = field.closest('.form-group')?.querySelector('.form-field-error');
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.add('active');
    }
  }
}

/* --------------------------------------------------------------------------
   8. Click-to-Call Analytics / Tracking Hook
   -------------------------------------------------------------------------- */
function initCallTracking() {
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      // Clean hook for Google Analytics 4 if present
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'click_to_call', {
          event_category: 'Contact',
          event_label: link.getAttribute('href'),
          transport_type: 'beacon'
        });
      }
      console.log('Phone CTA engaged:', link.getAttribute('href'));
    });
  });
}
