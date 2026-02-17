document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (form) {
        // Prevent duplicate listeners
        if (form.dataset.listenerAttached === 'true') return;
        form.dataset.listenerAttached = 'true';

        let isSubmitting = false;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopImmediatePropagation(); // Stop other listeners if any

            if (isSubmitting) {
                console.warn('Submission already in progress. Ignoring duplicate click.');
                return;
            }

            isSubmitting = true;
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            formMessage.style.display = 'none';

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data.timestamp = new Date().toLocaleString();

            try {
                // Send to Backend (Google Sheets + Email) - Relative Path
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    formMessage.textContent = "Thanks! We've received your message and will be in touch shortly.";
                    formMessage.style.color = 'green';
                    formMessage.style.display = 'block';
                    form.reset();
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            } catch (error) {
                console.error('Submission error:', error);
                // DEBUG: Show actual error
                alert(`Debug Error: ${error.message}`);
                formMessage.textContent = `Error: ${error.message}. Please email info@pssgway.com`;
                formMessage.style.color = 'red';
                formMessage.style.display = 'block';
            } finally {
                isSubmitting = false;
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }
});
