// EmailJS and Telegram integration for contact form
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  const TELEGRAM_TOKEN = '7688136191:AAHOCJG3PhuAa20KP4ylOhn-91IaPLUPNSI';
  const TELEGRAM_CHAT_ID = '1153681509';

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent form submission
      
      // Disable form while sending
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = '&#9993; Sending...';
      
      status.textContent = 'Sending your message...';
      status.className = ''; // Reset status class

      const name = form.name.value;
      const email = form.email.value;
      const message = form.message.value;

      // Send to Telegram
      const telegramMsg = `New Portfolio Message:%0AName: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${telegramMsg}`;

      try {
        const response = await fetch(telegramUrl);
        if (response.ok) {
          status.textContent = 'Message sent successfully!';
          status.className = 'success';
          form.reset();
        } else {
          throw new Error('Failed to send message');
        }
      } catch (err) {
        console.error('Error sending message:', err);
        status.textContent = 'Failed to send message. Please try again later.';
        status.className = 'error';
      } finally {
        // Re-enable form
        submitButton.disabled = false;
        submitButton.innerHTML = '&#9993; Send Message';
      }
    });
  }
}); 