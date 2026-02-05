document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const quoteForm = document.getElementById('quote-form');
  const formConfirmation = document.getElementById('form-confirmation');
  const yearSpan = document.getElementById('year');

  // Current year in footer
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Mobile nav toggle
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });

    // Close menu on link click (mobile)
    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
      });
    });
  }

  // Smooth scroll for anchor links (for older browsers)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      event.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Simple front-end validation & friendly confirmation
  if (quoteForm && formConfirmation) {
    quoteForm.addEventListener('submit', (event) => {
      event.preventDefault();

      formConfirmation.textContent = '';
      formConfirmation.classList.remove('form-confirmation--success', 'form-confirmation--error');

      const requiredFields = ['name', 'phone', 'email', 'postcode', 'message'];
      let hasError = false;

      requiredFields.forEach((fieldName) => {
        const field = quoteForm.querySelector(`[name="${fieldName}"]`);

        if (!field) return;

        const fieldWrapper = field.closest('.form-field');
        if (fieldWrapper) {
          fieldWrapper.classList.remove('form-field--error');
        }

        if (
          (field instanceof HTMLTextAreaElement && !field.value.trim()) ||
          (field instanceof HTMLInputElement && !field.value.trim())
        ) {
          hasError = true;
          if (fieldWrapper) {
            fieldWrapper.classList.add('form-field--error');
          }
        }
      });

      if (hasError) {
        formConfirmation.textContent = 'Please fill in all required fields so we can respond to your enquiry.';
        formConfirmation.classList.add('form-confirmation--error');
        return;
      }

      // Get form values
      const name = quoteForm.querySelector('[name="name"]').value.trim();
      const phone = quoteForm.querySelector('[name="phone"]').value.trim();
      const email = quoteForm.querySelector('[name="email"]').value.trim();
      const postcode = quoteForm.querySelector('[name="postcode"]').value.trim();
      const message = quoteForm.querySelector('[name="message"]').value.trim();

      // Build email body
      const emailBody = `Hello SNL Plumbing,

I would like to request a free quote for plumbing services.

Contact Details:
Name: ${name}
Phone: ${phone}
Email: ${email}
Postcode: ${postcode}

Message:
${message || 'No additional message provided.'}`;

      // Create mailto link
      const subject = encodeURIComponent('Free Quote Request - ' + name);
      const body = encodeURIComponent(emailBody);
      const mailtoLink = `mailto:info@snlplumbing.co.uk?subject=${subject}&body=${body}`;

      // Open email client
      window.location.href = mailtoLink;

      // Show confirmation message
      formConfirmation.textContent = 'Opening your email client... If it doesn\'t open, please email us at info@snlplumbing.co.uk';
      formConfirmation.classList.add('form-confirmation--success');

      // Reset form after a short delay
      setTimeout(() => {
        quoteForm.reset();
      }, 1000);
    });
  }
});

