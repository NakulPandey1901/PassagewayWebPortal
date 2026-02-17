// Contact Form Handler with Web3Forms API
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const messageDiv = document.getElementById('form-message');
            const originalButtonText = submitButton.textContent;

            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {
                name: formData.get('name'),
                email: formData.get('email'),
                company: formData.get('company') || 'Not provided',
                message: formData.get('message'),
                timestamp: new Date().toISOString()
            };

            // Log to console (frontend logging)
            console.log('=== CONTACT FORM SUBMISSION ===');
            console.log('Timestamp:', formObject.timestamp);
            console.log('Name:', formObject.name);
            console.log('Email:', formObject.email);
            console.log('Company:', formObject.company);
            console.log('Message:', formObject.message);
            console.log('================================');

            // Store in localStorage for persistence
            const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
            submissions.push(formObject);
            localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

            try {
                // Submit to Web3Forms API
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    // Show success message
                    messageDiv.style.display = 'block';
                    messageDiv.style.background = '#d4edda';
                    messageDiv.style.color = '#155724';
                    messageDiv.style.border = '1px solid #c3e6cb';
                    messageDiv.innerHTML = '✓ Message sent successfully! We\'ll get back to you soon.';

                    console.log('✓ Email sent successfully via Web3Forms');

                    // Reset form
                    contactForm.reset();

                    // Hide message after 5 seconds
                    setTimeout(() => {
                        messageDiv.style.display = 'none';
                    }, 5000);
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            } catch (error) {
                // Show error message
                messageDiv.style.display = 'block';
                messageDiv.style.background = '#f8d7da';
                messageDiv.style.color = '#721c24';
                messageDiv.style.border = '1px solid #f5c6cb';
                messageDiv.innerHTML = '✗ Failed to send message. Please try again or email us directly at info@pssgway.com';

                console.error('✗ Form submission error:', error);

                // Hide error message after 7 seconds
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 7000);
            } finally {
                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
});

// Function to view all submissions (call in console: viewSubmissions())
function viewSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    console.log('=== ALL CONTACT FORM SUBMISSIONS ===');
    console.table(submissions);
    console.log(`Total submissions: ${submissions.length}`);
    return submissions;
}

// Function to clear submissions (call in console: clearSubmissions())
function clearSubmissions() {
    localStorage.removeItem('contactSubmissions');
    console.log('All submissions cleared.');
}
