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
// Contact form: validation + sending via Web3Forms
//
// Messages are POSTed to Web3Forms, which emails them to you.
// The visitor stays on your site and never needs an email app.
//
// SETUP: get a free access key at https://web3forms.com
// (enter your email, the key is sent to your inbox), then paste
// it below. This key is public by design, so it is safe here.
// ============================================================
const WEB3FORMS_ACCESS_KEY = '94ff8b20-3cea-406d-a08f-f0c805261ea7';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const statusEl = document.getElementById('formStatus');
  const submitBtn = contactForm.querySelector('button[type="submit"]');

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

  function setStatus(text, color) {
    statusEl.textContent = text;
    statusEl.style.color = color;
  }

  function setSending(isSending) {
    submitBtn.disabled = isSending;
    submitBtn.style.opacity = isSending ? '0.7' : '';
    submitBtn.style.cursor = isSending ? 'not-allowed' : '';
    submitBtn.firstChild.textContent = isSending ? 'Sending... ' : 'Send Message ';
  }

  async function sendMessage(data) {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        from_name: 'Portfolio Contact Form',
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        botcheck: data.botcheck
      })
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Request failed');
    }
    return result;
  }

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const results = Object.keys(fields).map((key) => validateField(key));
    if (!results.every(Boolean)) {
      setStatus('Please fix the highlighted fields above.', '#ff8585');
      return;
    }

    if (WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
      console.error('Contact form: add your Web3Forms access key in script.js');
      setStatus('The contact form is not configured yet. Please email me directly instead.', '#ff8585');
      return;
    }

    const honeypot = contactForm.querySelector('input[name="botcheck"]');

    const data = {
      name: fields.name.input.value.trim(),
      email: fields.email.input.value.trim(),
      subject: fields.subject.input.value.trim(),
      message: fields.message.input.value.trim(),
      botcheck: honeypot ? honeypot.checked : false
    };

    setSending(true);
    setStatus('Sending your message...', '#8fa3ff');

    try {
      await sendMessage(data);
      setStatus("Thank you! Your message has been sent. I'll get back to you soon.", '#6ee7a8');
      contactForm.reset();
      Object.keys(fields).forEach((key) => showFieldError(fields[key], ''));
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus(
        'Sorry, something went wrong and your message was not sent. Please try again, or email me at malishreyash2005@gmail.com.',
        '#ff8585'
      );
    } finally {
      setSending(false);
    }
  });
}