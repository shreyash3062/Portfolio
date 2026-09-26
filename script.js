// ============================================================
// Hero typing effect
// ============================================================
if (document.getElementById('element') && typeof Typed !== 'undefined') {
  new Typed('#element', {
    strings: [
      ' I create beautiful and functional websites.',
      ' I love coding and problem-solving.'
    ],
    typeSpeed: 50,
    backSpeed: 20,
    backDelay: 1500,
    loop: true
  });
}

// ============================================================
// Mobile navigation toggle
// ============================================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // close the menu after a link is tapped
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============================================================
// "Let's Connect" button focuses the first form field
// ============================================================
const letsConnect = document.getElementById('letsConnect');
if (letsConnect) {
  letsConnect.addEventListener('click', () => {
    setTimeout(() => {
      const nameField = document.getElementById('name');
      if (nameField) nameField.focus();
    }, 400);
  });
}

// ============================================================
// Contact form validation
//
// NOTE: There is no backend or email service connected yet.
// On a valid submission this opens the visitor's email client
// with the message pre-filled (a mailto: link), so nothing is
// silently "sent" without the visitor's knowledge.
//
// To connect a real backend or email API (e.g. Formspree,
// EmailJS, or your own server) later, replace the contents of
// the `sendMessage()` function below and keep the validation
// logic above it as-is.
// ============================================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const fields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('nameError'),
      validate: (value) => (value.trim() === '' ? 'Please enter your name.' : '')
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate: (value) => {
        if (value.trim() === '') return 'Please enter your email.';
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value.trim())) return 'Please enter a valid email address.';
        return '';
      }
    },
    subject: {
      input: document.getElementById('subject'),
      error: document.getElementById('subjectError'),
      validate: (value) => (value.trim() === '' ? 'Please enter a subject.' : '')
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('messageError'),
      validate: (value) => (value.trim() === '' ? 'Please enter your message.' : '')
    }
  };

  function showFieldError(field, message) {
    field.input.closest('.form-group').classList.toggle('has-error', Boolean(message));
    field.error.textContent = message;
  }

  function validateField(key) {
    const field = fields[key];
    const message = field.validate(field.input.value);
    showFieldError(field, message);
    return message === '';
  }

  // validate as the visitor types, once they've left a field at least once
  Object.keys(fields).forEach((key) => {
    const field = fields[key];
    let touched = false;
    field.input.addEventListener('blur', () => {
      touched = true;
      validateField(key);
    });
    field.input.addEventListener('input', () => {
      if (touched) validateField(key);
    });
  });

  function sendMessage(data) {
    const to = 'malishreyash2005@gmail.com';
    const subject = encodeURIComponent(data.subject);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  }

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const results = Object.keys(fields).map((key) => validateField(key));
    const isValid = results.every(Boolean);
    const statusEl = document.getElementById('formStatus');

    if (!isValid) {
      statusEl.textContent = 'Please fix the highlighted fields above.';
      statusEl.style.color = '#ff8585';
      return;
    }

    const data = {
      name: fields.name.input.value.trim(),
      email: fields.email.input.value.trim(),
      subject: fields.subject.input.value.trim(),
      message: fields.message.input.value.trim()
    };

    sendMessage(data);

    statusEl.textContent =
      "Your email app should now open with this message ready to send. Prefer a form that sends without leaving the page? Connect a service like Formspree or EmailJS in script.js.";
    statusEl.style.color = '#8fa3ff';
    contactForm.reset();
  });
}