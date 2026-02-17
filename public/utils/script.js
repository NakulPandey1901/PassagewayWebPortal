// Animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Solutions tab switching (Only runs on solutions.html)
function showSolutions(industry) {
    // Hide all solutions
    const contents = document.getElementsByClassName('solutions-content');
    for (let i = 0; i < contents.length; i++) {
        contents[i].style.display = 'none';
    }

    // Remove active class from all buttons
    const buttons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }

    // Show selected solutions and activate button
    const target = document.getElementById(industry + '-solutions');
    if (target) {
        target.style.display = 'grid';
    }

    const clickedBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(industry));
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    }
}

// Hamburger Menu Logic
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});

// Contextual Chat Opener
function openChatWithContext(topic) {
    const chatButton = document.getElementById('chat-button');
    if (chatButton) {
        // Trigger click to open if not open (handled by toggler)
        chatButton.click();

        // Wait for it to open then send context
        setTimeout(() => {
            const chatWindow = document.getElementById('chat-window');
            if (chatWindow && chatWindow.classList.contains('open')) {
                // Find the chat input or handle via global event if possible, 
                // but simpler is to just manually inject a bot message prompt.
                // Since we don't have direct access to 'botReply' here (scoping),
                // we will dispatch a custom event that chat.js can listen to.
                const event = new CustomEvent('triggerChatContext', { detail: topic });
                document.dispatchEvent(event);
            }
        }, 100);
    }
}
