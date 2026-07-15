/* ══════════════════════════════════════════
   FORMS.JS — Contact Form Validation & Submit
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  var form = document.getElementById('contactForm');
  var successMsg = document.getElementById('formSuccess');
  var errorMsg = document.getElementById('formErrorMsg');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = form.querySelector('#name');
    var email = form.querySelector('#email');
    var role = form.querySelector('#role');
    var interest = form.querySelector('#interest');
    var message = form.querySelector('#message');
    var isValid = true;

    // Reset error state
    errorMsg.classList.remove('show');

    // Validate name
    if (!name.value.trim()) {
      name.style.borderColor = '#c64949';
      isValid = false;
    } else {
      name.style.borderColor = '';
    }

    // Validate email
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      email.style.borderColor = '#c64949';
      isValid = false;
    } else {
      email.style.borderColor = '';
    }

    // Validate interest dropdown
    if (!interest.value) {
      interest.style.borderColor = '#c64949';
      isValid = false;
    } else {
      interest.style.borderColor = '';
    }

    if (!isValid) {
      errorMsg.textContent = 'Please fill in all required fields correctly.';
      errorMsg.classList.add('show');
      return;
    }

    // Collect form data
    var formData = {
      name: name.value.trim(),
      email: email.value.trim(),
      role: role.value.trim(),
      interest: interest.value,
      message: message.value.trim()
    };

    // ── SUCCESS HANDLING ──
    // Hide form and show success message
    form.style.display = 'none';
    successMsg.classList.add('show');

    // Log for development/debugging
    console.log('Form submitted:', formData);

    // ── TODO: Integrate with your chosen form service ──
    
    /* OPTION 1: Using Fetch API (Backend Endpoint) */
    /*
    fetch('https://your-api-endpoint.com/submit', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (response.ok) {
        form.style.display = 'none';
        successMsg.classList.add('show');
        form.reset();
      } else {
        throw new Error('Server responded with error');
      }
    })
    .catch(error => {
      console.error('Form submission error:', error);
      successMsg.classList.remove('show');
      form.style.display = 'block';
      errorMsg.textContent = 'There was an error submitting the form. Please try again.';
      errorMsg.classList.add('show');
    });
    */

    /* OPTION 2: Using Formspree */
    /*
    fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (response.ok) {
        form.style.display = 'none';
        successMsg.classList.add('show');
        form.reset();
      } else {
        throw new Error('Formspree submission failed');
      }
    })
    .catch(error => {
      console.error('Formspree error:', error);
      errorMsg.textContent = 'There was an error submitting the form. Please try again.';
      errorMsg.classList.add('show');
    });
    */

    /* OPTION 3: Using Tally Forms (Redirect) */
    /*
    window.location.href = 'https://tally.so/r/YOUR_TALLY_FORM_ID';
    // Note: Tally redirects to their hosted form, so this replaces inline form handling
    */

  });

  // Optional: Clear field-specific errors on input
  var inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(function (input) {
    input.addEventListener('input', function () {
      input.style.borderColor = '';
    });
  });

});